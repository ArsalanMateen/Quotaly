export function subscriptionState(status, supported = true) {
  if (supported && ['active', 'trialing'].includes(status))
    return { planId: 'pro', blocked: false };

  if (['past_due', 'unpaid', 'incomplete', 'paused'].includes(status))
    return { planId: 'free', blocked: true };

  return { planId: 'free', blocked: false };
}
