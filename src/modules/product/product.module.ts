import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import {
  BrandRepository,
  CategoryRepository,
  ProductRepository,
} from 'src/db/repository';
import { BrandModel, CategoryModel, ProductModel } from 'src/db/models';

@Module({
  imports: [CategoryModel, BrandModel, ProductModel],
  controllers: [ProductController],
  providers: [
    ProductService,
    CategoryRepository,
    BrandRepository,
    ProductRepository,
  ],
})
export class ProductModule {}
