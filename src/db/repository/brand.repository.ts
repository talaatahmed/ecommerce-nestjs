import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from './base.repository';
import { Brand, BrandDocument } from '../models';

@Injectable()
export class BrandRepository extends BaseRepository<BrandDocument> {
  constructor(@InjectModel(Brand.name) private readonly brandModel: Model<BrandDocument>) {
    super(brandModel);
  }
}
