import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ProductRepository, CartRepository } from 'src/db/repository';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async addToCart({ body, authUser }) {
    const { productId, quantity } = body;
    const userId = authUser._id;

    const product = await this.productRepository.findOneDocument({
      _id: productId,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const cart = await this.cartRepository.findOneDocument({ userId });
    if (!cart) {
      return await this.cartRepository.createDocument({
        userId,
        products: [
          {
            id: productId,
            finalPrice: product.finalPrice,
            quantity,
          },
        ],
      });
    }

    const productInCart = cart.products.find((product) =>
      product.id.equals(productId),
    );

    if (productInCart) {
      throw new BadRequestException('Product already in cart');
    }

    cart.products.push({
      id: productId,
      finalPrice: product.finalPrice,
      quantity,
    });

    return await cart.save();
  }

  async removeFromCart({ productId, authUser }) {
    const userId = authUser._id;

    const cart = await this.cartRepository.findOneDocument({ userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const productIndex = cart.products.findIndex((product) =>
      product.id.equals(productId),
    );

    if (productIndex === -1) {
      throw new NotFoundException('Product not found in cart');
    }

    cart.products.splice(productIndex, 1);

    return await cart.save();
  }

  async getCart(authUser) {
    const userId = authUser._id;

    const cart = await this.cartRepository.findOneDocument({ userId });

    return cart;
  }

  async updateProductQuantity({ productId, quantity, authUser }) {
    const userId = authUser._id;

    const cart = await this.cartRepository.findOneDocument({ userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const product = cart.products.find((product) =>
      product.id.equals(productId),
    );

    if (!product) {
      throw new NotFoundException('Product not found in cart');
    }

    product.quantity = quantity;

    return await cart.save();
  }
}
