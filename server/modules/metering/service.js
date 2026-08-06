import { meteringRepository } from './repository.js';
import { monthWindow } from '../../shared/time.js';
import { PRICING } from './pricing.js';
import { transaction } from '../../infrastructure/database/transaction.js';
import { assertActiveTenant } from '../tenants/policy.js';
import { PLANS } from '../plans/catalog.js';

export function metering({ db, client, clock = () => new Date() }) {
  const repository = meteringRepository({ db });

  async function usage(tenantId) {
    return transaction(client, async (session) => {
      const { month, start, end } = monthWindow(clock());
      const tenant = await repository.findTenant({ tenantId, session });

      assertActiveTenant(tenant, clock());
      const sub = await repository.findSubscription({ tenantId, session });
      const plan = PLANS[sub?.planId];
      if (!plan) throw new AppError(503, 'invalid_plan', 'The workspace plan is unavailable.');
      const totals = (await repository.findMonth({ tenantId, month, session })) || {
        apiCalls: 0,
        tokens: 0,
        costMicroUsd: 0,
      };

      return {
        tenant: {
          id: tenantId,
          name: tenant.name,
          isSandbox: Boolean(tenant.isSandbox),
          expiresAt: tenant.expiresAt || null,
        },
        month,
        periodStart: start.toISOString(),
        resetsAt: end.toISOString(),
        plan: { id: plan._id, name: plan.name },
        subscriptionStatus: sub.status,
        paymentRequired: Boolean(sub.blocked),
        used: { apiCalls: totals.apiCalls, tokens: totals.tokens },
        limits: { apiCalls: plan.apiCalls, tokens: plan.tokens },
        costMicroUsd: totals.costMicroUsd,
        currency: 'USD',
        pricing: PRICING,
      };
    });
  }

  return { usage };
}
