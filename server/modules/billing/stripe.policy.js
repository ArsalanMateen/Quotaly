import { AppError } from '../../shared/errors.js';

export const idOf = (value) => (typeof value === 'string' ? value : value?.id);
export function assertBillingReady(stripe, config) {
  if (!stripe || !config.proPriceId || !config.webhookSecret)
    throw new AppError(
      503,
      'billing_unavailable',
      'Stripe test billing is not configured. Metering is still available.',
    );
}
