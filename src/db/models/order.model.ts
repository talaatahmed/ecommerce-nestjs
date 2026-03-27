import { MongooseModule, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Cart, User } from '.';
import { orderStatusEnum, paymentMethodEnum } from 'src/common';

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: string;

  @Prop({ type: Types.ObjectId, ref: Cart.name, required: true })
  cartId: string;

  @Prop({ type: Date, default: Date.now() + 3 * 24 * 60 * 60 * 1000 })
  arriveAt: Date;

  @Prop({
    type: Number,
  })
  total: number;

  @Prop({ type: String, required: true })
  address: string;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, enum: orderStatusEnum })
  orderStatus: string;

  @Prop({ type: String, enum: paymentMethodEnum })
  paymentMethod: string;

  @Prop({ type: String })
  paymentIntentId: string;

  // This field can be used to track the order changes and can be separated on a model
  @Prop({
    type: {
      paidAt: Date,
      deliveredAt: Date,
      deliveredBy: { type: Types.ObjectId, ref: User.name }, // delivery person
      cancelledAt: Date,
      cancelledBy: { type: Types.ObjectId, ref: User.name }, // user should cancel his order
      refundedAt: Date,
      refundedBy: { type: Types.ObjectId, ref: User.name }, // admins do manual refund
    },
  })
  orderChanges: object;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

export const OrderModel = MongooseModule.forFeature([
  { name: Order.name, schema: OrderSchema },
]);

export type OrderDocument = HydratedDocument<Order>;
