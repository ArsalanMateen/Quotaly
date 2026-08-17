import { AppError } from '../../shared/errors.js';
import { assertBillingReady, idOf } from './stripe.policy.js';
import { subscriptionState } from './subscription.state.js';
import { transaction } from '../../infrastructure/database/transaction.js';

const supportedEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
]);

export function webhookService({ db, client, stripe, config, clock = () => new Date() }) {
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

    if (!supportedEvents.has(event.type)) return { received: true, ignored: true };
    const object = event.data.object;
    const subscriptionId =
      event.type === 'checkout.session.completed' ? idOf(object.subscription) : object.id;
    const customerId = idOf(object.customer);

    if (!subscriptionId || !customerId)
      throw new AppError(400, 'invalid_event', 'Event is missing its subscription or customer.');

    const tenant = await db.collection('tenants').findOne({ stripeCustomerId: customerId });
    if (!tenant)
      throw new AppError(503, 'workspace_not_ready', 'The workspace is not ready for this event.');

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (subscription.livemode !== false || idOf(subscription.customer) !== customerId)
      throw new AppError(400, 'invalid_subscription', 'Stripe subscription does not match.');

    const items = subscription.items.data;
    const supported =
      items.length === 1 && items[0].price.id === config.proPriceId && items[0].quantity === 1;
    const state = subscriptionState(subscription.status, supported);

    await transaction(client, async (session) => {
      await db.collection('stripe_events').insertOne(
        { _id: event.id, receivedAt: clock() },
        { session },
      );
      await db.collection('subscriptions').updateOne(
        { _id: tenant._id },
        {
          $set: {
            ...state,
            status: subscription.status,
            stripeSubscriptionId: subscription.id,
            syncedAt: clock(),
          },
        },
        { session },
      );
    });

    return { received: true, duplicate: false };
  }

  return { accept };
}
