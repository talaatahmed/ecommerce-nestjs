import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserType } from 'src/db/models';
import { BrandRepository, CategoryRepository } from 'src/db/repository';
import { uploadFileOnCloudinary } from 'src/common';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
  ) {}

  async addCategory(
    name: string,
    brands: Types.ObjectId[],
    user: UserType,
    file: Express.Multer.File,
  ) {
    const isNameExist = await this.categoryRepository.findOneDocument({
      name: name.toLowerCase(),
    });
    if (isNameExist)
      throw new BadRequestException('category is already exists');

    let uploadResult;
    if (file) {
      uploadResult = await uploadFileOnCloudinary(file.path, {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        folder: `ECOMMERCE_App/${user._id}/Category`,
        resource_type: 'image',
        use_filename: true,
        unique_filename: true,
      });
    }

    if (brands?.length) {
      const isBrandExists = await this.brandRepository.findDocuments({
        _id: { $in: brands },
      });
      if (isBrandExists.length !== brands.length)
        throw new BadRequestException('some brands not exist');
    }

    const category = await this.categoryRepository.createDocument({
      name: name.toLowerCase(),
      createdBy: user._id,
      logo: uploadResult.public_id,
      brands,
    });
    return { category, uploadResult };
  }

  async listAllCategories() {
    return this.categoryRepository.findDocuments(
      {},
      {},
      {
        populate: [
          {
            path: 'brands',
            select: 'name slug logo createdBy',
            populate: [{ path: 'createdBy', select: 'email' }],
          },
        ],
      },
    );
  }
}
