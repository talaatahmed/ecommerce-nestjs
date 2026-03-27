import { Body, Controller, Post, Get } from '@nestjs/common';
import { Types } from 'mongoose';
import { OrderService } from './order.service';
import { Auth, AuthUser, SystemRoles } from 'src/common';
import type { UserType } from 'src/db/models';
import type { OrderDocument } from 'src/db/models/order.model';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('create')
  @Auth([SystemRoles.USER])
  async createOrder(@AuthUser() user: UserType, @Body() order: OrderDocument) {
    return await this.orderService.createOrder({ order, user });
  }

  @Get('list')
  @Auth([SystemRoles.USER])
  async listOrders(@AuthUser() user: UserType) {
    return await this.orderService.listOrders();
  }

  @Post('pay')
  @Auth([SystemRoles.USER])
  async payOrder(@AuthUser() user: UserType, @Body('orderId') orderId: Types.ObjectId) {
    return await this.orderService.payOrder({
      orderId,
      user,
    });
  }

  @Post('webhook')
  async webhook(@Body() body) {
    return await this.orderService.webhook(body);
  }

  @Post('cancel')
  @Auth([SystemRoles.USER])
  async cancelOrder(@AuthUser() user: UserType, @Body('orderId') orderId: Types.ObjectId) {
    return await this.orderService.cancelOrder({
      orderId,
      user,
    });
  }
}
