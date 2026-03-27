import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { CartRepository, ProductRepository } from 'src/db/repository';
import { CartModel, ProductModel } from 'src/db/models';

@Module({
  imports: [CartModel, ProductModel],
  controllers: [CartController],
  providers: [CartService, CartRepository, ProductRepository],
})
export class CartModule {}
