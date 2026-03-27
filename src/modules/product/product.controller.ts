import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { UpdateProductDto } from './dto/update-product.dto';
import { Auth, AuthUser, mutlerConfig, SystemRoles } from 'src/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import type { ProductDocument, UserType } from 'src/db/models';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post('create')
  @Auth([SystemRoles.ADMIN])
  @UseInterceptors(FilesInterceptor('images', 4, mutlerConfig))
  create(
    @Body() body: ProductDocument,
    @AuthUser() user: UserType,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productService.create(body, user, files);
  }

  @Get('list')
  findAll() {
    return this.productService.listAllProducts();
  }
}
