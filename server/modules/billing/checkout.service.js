import { checkoutRepository } from './checkout.repository.js';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../shared/errors.js';
import { assertBillingReady } from './stripe.policy.js';

export function checkoutService({ db, stripe, config, clock = () => new Date() }) {
  const repository = checkoutRepository({ db, clock });

  async function checkout(tenantId, origin) {
    assertBillingReady(stripe, config);
    const now = clock();
    const lockId = randomUUID();
    const tenant = await repository.claimLease({ tenantId, now, lockId });

    if (!tenant)
      throw new AppError(
        409,
        'checkout_busy',
        'Checkout is already being prepared. Retry shortly.',
      );

    try {
      const sub = await repository.findSubscription({ tenantId });

      if (sub.planId === 'pro' || sub.blocked)
        throw new AppError(
          409,
          'subscription_exists',
          'This tenant already has a subscription. Manage it in the Stripe test dashboard.',
        );
      let customerId = tenant.stripeCustomerId;

      if (!customerId) {
        const customer = await stripe.customers.create(
          { name: tenant.name, email: 'workspace@quotaly.com', metadata: { tenantId } },
          { idempotencyKey: `quotaly-customer-${tenantId}` },
        );

        if (customer.livemode) throw new Error('Live Stripe customer refused');
        customerId = customer.id;
        await repository.saveCustomer({ tenantId, lockId, customerId });
      }

      const price = await stripe.prices.retrieve(config.proPriceId);

      if (price.livemode || !price.recurring || !price.active)
        throw new AppError(
          503,
          'invalid_test_price',
          'Configure an active recurring Stripe test price for Pro.',
        );

      const attempt = tenant.checkoutAttempt || randomUUID();
      const reserved = await repository.reserveAttempt({ tenantId, lockId, attempt });

      if (!reserved.matchedCount)
        throw new AppError(409, 'checkout_busy', 'Checkout preparation expired. Retry shortly.');
      const session = await stripe.checkout.sessions.create(
        {
          mode: 'subscription',
          customer: customerId,
          client_reference_id: tenantId,
          line_items: [{ price: config.proPriceId, quantity: 1 }],
          subscription_data: { metadata: { tenantId } },
          metadata: { tenantId },
          success_url: `${origin}/?checkout=success`,
          cancel_url: `${origin}/?checkout=canceled`,
        },
        { idempotencyKey: `quotaly-checkout-${tenantId}-${attempt}` },
      );

      if (session.livemode) throw new Error('Live Stripe session refused');
      const saved = await repository.saveSession({ tenantId, lockId, sessionId: session.id });

      if (!saved.matchedCount)
        throw new AppError(
          409,
          'checkout_busy',
          'Checkout is still being synchronized. Retry shortly.',
        );

      return { url: session.url, sessionId: session.id };
    } finally {
      await repository.releaseLease({ tenantId, lockId });
    }
  }

  return { checkout };
}
