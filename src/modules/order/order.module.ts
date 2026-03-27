import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartRepository, OrderRepository, ProductRepository } from 'src/db/repository';
import { OrderModel } from 'src/db/models/order.model';
import { CartService } from '../cart/cart.service';
import { CartModel, ProductModel } from 'src/db/models';
import { PaymentModule } from '../payment/payment.module';
import { StripeService } from '../payment/services/stripe.service';

@Module({
  imports: [OrderModel, ProductModel, CartModel, PaymentModule],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository, CartService, ProductRepository, CartRepository, StripeService],
  exports: [OrderService, OrderRepository, CartService, ProductRepository, CartRepository, StripeService],
})
export class OrderModule {}
