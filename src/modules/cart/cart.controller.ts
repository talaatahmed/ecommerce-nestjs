import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { CartService } from './cart.service';
import { Auth, AuthUser, SystemRoles } from 'src/common';
import type { UserType } from 'src/db/models';
import type { CartDocument } from 'src/db/models';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post('add-to-cart')
  @Auth([SystemRoles.USER])
  async addToCart(@Body() body: CartDocument, @AuthUser() authUser: UserType) {
    return await this.cartService.addToCart({ body, authUser });
  }

  @Patch('remove-from-cart/:productId')
  @Auth([SystemRoles.USER])
  async removeFromCart(
    @Param('productId') productId: string,
    @AuthUser() authUser: UserType,
  ) {
    return await this.cartService.removeFromCart({ productId, authUser });
  }

  @Get('get-cart')
  @Auth([SystemRoles.USER])
  async getCart(@AuthUser() authUser: UserType) {
    const cart = await this.cartService.getCart(authUser);
    if (!cart) throw new NotFoundException('cart not found');
    return cart;
  }

  @Patch('update-quantity/:productId')
  @Auth([SystemRoles.USER])
  async updateCart(
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
    @AuthUser() authUser: UserType,
  ) {
    if (quantity < 1)
      throw new BadRequestException('Quantity must be greater than 0');

    return await this.cartService.updateProductQuantity({
      productId,
      quantity,
      authUser,
    });
  }
}
