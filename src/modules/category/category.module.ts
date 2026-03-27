import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { BrandModel, CategoryModel } from 'src/db/models';
import { BrandRepository, CategoryRepository } from 'src/db/repository';

@Module({
  imports: [CategoryModel, BrandModel],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepository, BrandRepository],
})
export class CategoryModule {}
