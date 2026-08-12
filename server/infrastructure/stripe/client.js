import Stripe from 'stripe';

export function createStripeClient(config) {
  if (!config.stripeKey) return null;

  return new Stripe(config.stripeKey, { timeout: 15000, maxNetworkRetries: 1 });
}
