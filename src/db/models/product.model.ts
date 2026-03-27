import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Mongoose, Types } from 'mongoose';
import slugify from 'slugify';

@Schema({ timestamps: true })
export class Product {
  /////////////////////////String//////////////////////////
  @Prop({
    type: String,
    index: {
      name: 'idx_title',
    },
    trim: true,
    required: true,
  })
  title: string;

  @Prop({
    type: String,
    index: {
      name: 'idx_slug',
    },
    trim: true,
  })
  slug: string;

  @Prop({
    type: String,
  })
  overview: string;

  /////////////////////////Number//////////////////////////
  @Prop({
    type: Number,
  })
  price: number;

  @Prop({
    type: Number,
    default: 0,
  })
  discount: number;

  @Prop({
    type: Number,
  })
  finalPrice: number;

  @Prop({
    type: Number,
    min: 40,
  })
  stock: number;

  @Prop({
    type: Number,
    default: 0,
  })
  rating: number;

  /////////////////////ObjectId//////////////////////////
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
  })
  createdBy: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Category',
  })
  category: Types.ObjectId;

  @Prop({
    type: Types.ObjectId,
    ref: 'Brand',
  })
  brand: Types.ObjectId;

  //////////////////////////files///////////////////////
  @Prop({
    type: [String],
  })
  images: string[];
}

const productSchema = SchemaFactory.createForClass(Product);

export const ProductModel = MongooseModule.forFeatureAsync([
  {
    name: Product.name,
    useFactory: () => {
      const schema = productSchema;

      schema.pre('save', function () {
        this.slug = slugify(this.title, {
          replacement: '_',
          lower: true,
          trim: true,
        });

        this.finalPrice = this.price - this.price * (this.discount / 100);
      });

      return schema;
    },
  },
]);

export type ProductDocument = HydratedDocument<Product>;
