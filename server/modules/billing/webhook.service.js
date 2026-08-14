import { AppError } from '../../shared/errors.js';
import { assertBillingReady } from './stripe.policy.js';

export function webhookService({ stripe, config }) {
  async function accept(rawBody, signature) {
    assertBillingReady(stripe, config);
    let event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, signature, config.webhookSecret);
    } catch {
      throw new AppError(400, 'invalid_signature', 'Stripe webhook signature is invalid.');
    }
    if (event.livemode !== false)
      throw new AppError(400, 'live_event_refused', 'Only Stripe test events are accepted.');
    return { received: true };
  }
  return { accept };
}
