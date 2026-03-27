import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe = new Stripe(process.env.STRIPE_CLIENT_SECRET_KEY as string);

  async createCheckoutSession({
    line_items = [],
    customer_email = '',
    metadata = {},
    discounts = [],
  }: Stripe.Checkout.SessionCreateParams) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      line_items,
      customer_email,
      metadata,
      discounts,
    });
  }

  async createCopon({
    name,
    percent_off,
    amount_off,
    currency,
    duration,
    duration_in_months,
  }: Stripe.CouponCreateParams) {
    return await this.stripe.coupons.create({
      name,
      percent_off,
      amount_off,
      currency,
      duration,
      duration_in_months,
    });
  }

  async refundPayment(
    paymentIntentId: string,
    reason: Stripe.RefundCreateParams.Reason,
  ) {
    return await this.stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason,
    });
  }
}
