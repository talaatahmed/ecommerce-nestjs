import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { OrderRepository } from 'src/db/repository';
import { CartService } from '../cart/cart.service';
import { UserType } from 'src/db/models';
import { orderStatusEnum, paymentMethodEnum } from 'src/common';
import { StripeService } from '../payment/services/stripe.service';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService,
    private readonly stripeService: StripeService,
  ) {}

  async createOrder({ order, user }) {
    const cart = await this.cartService.getCart(user);
    if (!cart) throw new NotFoundException('Cart not found');

    return await this.orderRepository.createOrder({
      cart,
      userId: user._id.toString(),
      ...order,
    });
  }

  async cancelOrder({ orderId, user }) {
    // user can cancel order after 1 day of order creation
    const order = await this.orderRepository.findOneDocument(
      { _id: orderId, userId: user._id },
      {},
      {
        populate: [
          {
            path: 'cartId',
            select: 'products',
            populate: {
              path: 'products.id',
              select: 'title finalPrice images',
            },
          },
        ],
      },
    );

    if (!order) throw new NotFoundException('Order not found');

    if (!['pending', 'paid', 'placed'].includes(order.orderStatus))
      throw new BadRequestException('Order is not placed to be cancelled');

    const timeDiff = new Date().getTime() - order['createdAt'].getTime();
    console.log(timeDiff);

    const diffInDays = timeDiff / (1000 * 60 * 60 * 24);
    console.log(diffInDays);

    if (diffInDays > 1) throw new BadRequestException('Order can only be cancelled within 1 day of creation');

    const cancelledOrder = await this.orderRepository.updateDocument(
      { _id: orderId.toString(), userId: user._id.toString() },
      {
        orderStatus: 'cancelled',
        orderChanges: {
          cancelledAt: new Date(),
          cancelledBy: user._id,
        },
      },
    );

    // apply automatic refund
    // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
    if (order?.paymentMethod == paymentMethodEnum.CARD) {
      //refund
      const refund = await this.stripeService.refundPayment(order.paymentIntentId, 'requested_by_customer');
      console.log('refund =>', refund);

      return await this.orderRepository.updateDocument(
        { _id: orderId.toString(), userId: user._id.toString() },
        {
          orderStatus: 'refunded',
          orderChanges: {
            refundedAt: new Date(),
            refundedBy: user._id,
          },
        },
      );
    }

    return cancelledOrder;
  }

  async webhook(body) {
    const orderId = body.data.object.metadata.orderId;
    const paymentIntentId = body.data.object.payment_intent;

    await this.orderRepository.updateDocument(
      { _id: orderId },
      {
        orderStatus: orderStatusEnum.PLACED,
        orderChanges: {
          placedAt: new Date(),
        },
        paymentIntentId,
      },
    );
  }

  async listOrders() {
    return await this.orderRepository.findDocuments({});
  }

  async getOrders() {
    return await this.orderRepository.findDocuments({});
  }

  async payOrder({ orderId, user }) {
    const order = await this.orderRepository.findOneDocument(
      { _id: orderId, userId: user._id },
      {},
      {
        populate: [
          {
            path: 'cartId',
            select: 'products',
            populate: {
              path: 'products.id',
              select: 'title finalPrice images',
            },
          },
        ],
      },
    );

    if (!order) throw new NotFoundException('Order not found');

    if (order.orderStatus !== 'pending') throw new BadRequestException('Order is not in pending state');

    const testCoupon = await this.stripeService.createCopon({
      name: 'balck-friday',
      percent_off: 10,
      // amount_off: 5000 * 100,
      // currency: 'EGP',
      // duration: 'once',
    });

    // create payment session and return session id
    return await this.stripeService.createCheckoutSession({
      line_items: order.cartId['products'].map((product) => ({
        price_data: {
          currency: 'EGP',
          product_data: {
            name: product.id.title,
            images: product.id.images,
          },
          unit_amount: product.id.finalPrice * 100, // convert to cents
        },
        quantity: product.quantity,
      })),
      customer_email: user.email,
      discounts: [
        {
          coupon: testCoupon.id,
        },
      ],
      metadata: {
        orderId: order._id.toString(),
      },
    });
  }
}
/*
 "data": {
        "_id": "69a99c2823d5470e6b3eabcc",
        "userId": "6963738f3a363cf7ed34f9fa",
        "cartId": {
            "_id": "69a97ca7b60f4245ebfa4a44",
            "products": [
                {
                    "id": {
                        "_id": "69a452d0de6a5c673252f5f5",
                        "title": "iphone 16 plus",
                        "images": [
                            "ECOMMERCE_App/696688c8166bd10def703160/Product/47c5b3eee02a383df5069a5f612f049b_yyxjfp",
                            "ECOMMERCE_App/696688c8166bd10def703160/Product/994686374d7d2958b3c8327699ed3ff0_knflhx"
                        ],
                        "finalPrice": 28000
                    },
                    "finalPrice": 28000,
                    "quantity": 20,
                    "_id": "69a97ca7b60f4245ebfa4a45"
                }
            ]
        },
        "arriveAt": "2026-03-08T15:05:00.015Z",
        "total": 560000,
        "address": "Cairo",
        "phone": "01112025888",
        "orderStatus": "pending",
        "paymentMethod": "card",
        "createdAt": "2026-03-05T15:07:20.734Z",
        "updatedAt": "2026-03-05T15:07:20.734Z",
        "__v": 0
    }
        */
