import { Query, Resolver } from '@nestjs/graphql';
import { OrderService } from 'src/modules/order/order.service';
import { OrderObject } from '../types/order.types';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @Query(() => [OrderObject], { name: 'ListOrders', description: 'get all orders' })
  async ListOrders() {
    return await this.orderService.getOrders();
  }
}
