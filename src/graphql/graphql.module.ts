import { Module } from '@nestjs/common';
import { OrderResolver } from './resolver/order.resolver';
import { OrderService } from 'src/modules/order/order.service';
import { OrderModel } from 'src/db/models/order.model';
import { OrderModule } from 'src/modules/feature.module';

@Module({
  imports: [OrderModule],
  controllers: [],
  providers: [OrderResolver, OrderService],
  exports: [],
})
export class GraphqlModule {}
