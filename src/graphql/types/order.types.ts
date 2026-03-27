import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Types } from 'mongoose';
import { orderStatusEnum, paymentMethodEnum } from 'src/common';
import { OrderDocument } from 'src/db/models/order.model';

registerEnumType(orderStatusEnum, {
  name: 'OrderStatusEnum',
});

registerEnumType(paymentMethodEnum, {
  name: 'PaymentMethodsEnum',
});

@ObjectType()
export class OrderObject implements Partial<OrderDocument> {
  @Field(() => ID, { nullable: false })
  _id: Types.ObjectId;

  @Field(() => String, { nullable: false })
  userId: string;

  @Field(() => String, { nullable: false })
  cartId: string;

  @Field(() => String, { nullable: false })
  address: string;

  @Field(() => String, { nullable: false })
  phone: string;

  @Field(() => paymentMethodEnum, { nullable: false })
  paymentMethod: string;

  @Field(() => Number, { nullable: false })
  total: number;

  @Field(() => orderStatusEnum, { nullable: false })
  orderStatus?: string;

  @Field(() => String, { nullable: true })
  paymentIntent?: string;

  // orderChanges?: any;
}
