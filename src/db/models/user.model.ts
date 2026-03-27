import { DynamicModule } from '@nestjs/common';
import { MongooseModule, Prop, Schema, SchemaFactory, Virtual } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

enum roles {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

enum gender {
  MALE = 'male',
  FEMALE = 'female',
}

//class
@Schema({
  timestamps: true,
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
})
export class User {
  @Prop({ trim: true, lowercase: true })
  firstName: string;

  @Prop({ trim: true, lowercase: true })
  lastName: string;

  @Prop({ unique: [true, 'Email is already exists'] })
  email: string;

  @Prop()
  password: string;

  @Prop({ default: roles.USER, enum: roles })
  role: string;

  @Prop({ min: 18, max: 60 })
  age: number;

  @Prop({ default: gender.MALE, enum: gender })
  gender: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ required: true, trim: true })
  phone: string;

  @Virtual({
    get: function () {
      return `${this.firstName} ${this.lastName}`;
    },
  })
  fullName: string;
}

//Schema
const UserSchema = SchemaFactory.createForClass(User);

//Model
// export const UserModel: DynamicModule = MongooseModule.forFeature([
export const UserModel = MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]);

//Type
export type UserType = HydratedDocument<User>;
