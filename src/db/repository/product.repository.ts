import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { BaseRepository } from './base.repository';
import { Product, ProductDocument } from '../models';

@Injectable()
export class ProductRepository extends BaseRepository<ProductDocument> {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {
    super(productModel);
  }

  /**
   * Decrement stock for each product in the provided cart.
   * Assumes cart object has a `products` array with `{ id, quantity }`.
   */
  async decrementStock(cart: { products: { id: string; quantity: number }[] }) {
    // perform updates in parallel for simplicity
    const ops = cart.products.map((item) =>
      this.productModel.findByIdAndUpdate(item.id, {
        $inc: { stock: -item.quantity },
      }),
    );
    await Promise.all(ops);
  }
}
