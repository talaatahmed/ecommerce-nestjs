import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GlobalModule } from './modules/global.module';
import {
  AuthModule,
  BrandModule,
  CategoryModule,
  ProductModule,
  CartModule,
  OrderModule,
} from './modules/feature.module';
import { PaymentModule } from './modules/payment/payment.module';
import KeyvRedis from '@keyv/redis';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphqlModule } from './graphql/graphql.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_URL as string),
    //CacheModule.register({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({ stores: [new KeyvRedis('redis://localhost:6379')] }),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: './src/schema.gql',
    }),
    GlobalModule,
    AuthModule,
    CategoryModule,
    BrandModule,
    ProductModule,
    CartModule,
    OrderModule,
    PaymentModule,
    GraphqlModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
