import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BrandService } from './brand.service';
import { Auth, AuthUser, mutlerConfig, SystemRoles } from 'src/common';
import type { BrandDocument, UserType } from 'src/db/models';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Post('add')
  @Auth([SystemRoles.ADMIN])
  @UseInterceptors(FileInterceptor('logo', mutlerConfig))
  async addBrand(
    @Body() body: BrandDocument,
    @AuthUser() user: UserType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.brandService.addBrand(body, user, file);
  }
}
