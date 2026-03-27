/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiOptions } from 'cloudinary';
import { uploadFileOnCloudinary } from 'src/common';
import { BrandDocument, UserType } from 'src/db/models';
import { BrandRepository } from 'src/db/repository';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepo: BrandRepository) {}

  async addBrand(
    body: BrandDocument,
    user: UserType,
    file: Express.Multer.File,
  ) {
    const { name }: BrandDocument = body;

    const isNameExist = await this.brandRepo.findOneDocument({
      name: name.toLowerCase(),
    });
    if (isNameExist) throw new BadRequestException('Brand is already exists');

    let uploadResult;
    if (file) {
      uploadResult = await uploadFileOnCloudinary(file.path, {
        folder: `ECOMMERCE_App/${user._id}/Brands`,
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
      });
    }

    const brand = await this.brandRepo.createDocument({
      name: name.toLowerCase(),
      createdBy: user._id,
      logo: uploadResult.public_id,
    });
    return { brand, uploadResult };
  }
}
