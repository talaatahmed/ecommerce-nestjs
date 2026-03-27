import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { BaseRepository } from './base.repository';
import { Order, OrderDocument } from '../models/order.model';
import { ProductRepository } from './product.repository';

@Injectable()
export class OrderRepository extends BaseRepository<OrderDocument> {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly productRepository: ProductRepository,
  ) {
    super(orderModel);
  }

  async createOrder(data: any) {
    const total = data.cart.subTotal;

    const order = new this.orderModel({
      userId: Types.ObjectId.createFromHexString(data.userId),
      cartId: data.cart._id,
      total,
      address: data.address,
      phone: data.phone,
      paymentMethod: data.paymentMethod,
      orderStatus: 'pending',
    });

    if (data.arriveAt) order.arriveAt = data.arriveAt;
    if (data.paymentMethod == 'cash') order.orderStatus = 'placed';

    const newOrder = await order.save();

    // update the products in the cart and decrement their stock by each product quantity
    await this.productRepository.decrementStock(data.cart);

    // socket for connected clients

    return newOrder;
  }

  // remove all items from the cart
  // this.cartRepository.updateOne({ filters: { _id: data.cart._id }, update: { products: [] } });
}
