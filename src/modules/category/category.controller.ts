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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Auth, AuthUser, mutlerConfig, SystemRoles } from 'src/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { UserType } from 'src/db/models';
import { Types } from 'mongoose';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post('add')
  @Auth([SystemRoles.ADMIN])
  @UseInterceptors(FileInterceptor('logo', mutlerConfig))
  async addCategory(
    @Body('name') name: string, //
    @Body('brands') brands: Types.ObjectId[], //
    @AuthUser() user: UserType, //
    @UploadedFile() file: Express.Multer.File, //
  ) {
    return this.categoryService.addCategory(name, brands, user, file);
  }

  @Get('list')
  async listAllCategories() {
    return this.categoryService.listAllCategories();
  }
}
