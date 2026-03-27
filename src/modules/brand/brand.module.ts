import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandRepository, UserRepository } from 'src/db/repository';
import { BrandModel, UserModel } from 'src/db/models';

@Module({
  imports: [BrandModel],
  controllers: [BrandController],
  providers: [BrandService, BrandRepository],
  exports: [],
})
export class BrandModule {}
