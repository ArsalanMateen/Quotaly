import { meteringRepository } from './repository.js';
import { randomUUID } from 'node:crypto';
import { AppError } from '../../shared/errors.js';
import { fingerprint } from '../../shared/hash.js';
import { monthWindow } from '../../shared/time.js';
import { price, PRICING } from './pricing.js';
import { transaction } from '../../infrastructure/database/transaction.js';
import { assertActiveTenant } from '../tenants/policy.js';
import { PLANS } from '../plans/catalog.js';

export function metering({ db, client, clock = () => new Date() }) {
  const repository = meteringRepository({ db });

  async function generate(tenantId, key, input) {
    const requestHash = fingerprint(input);

    return transaction(client, async (session) => {
      const tenant = await repository.lockTenant({ tenantId, session });

      assertActiveTenant(tenant, clock());
      const existing = await repository.findEvent({ tenantId, key, session });

      if (existing) {
        if (existing.fingerprint !== requestHash)
          throw new AppError(
            409,
            'idempotency_conflict',
            'This key was already used with different token counts.',
          );

        return existing.response;
      }
      const now = clock();
      const { month, end } = monthWindow(now);
      const sub = await repository.findSubscription({ tenantId, session });

      if (!sub)
        throw new AppError(
          503,
          'tenant_not_ready',
          'Your workspace is still getting ready. Please try again in a moment.',
        );

      const plan = PLANS[sub?.planId];
      if (!plan) throw new AppError(503, 'invalid_plan', 'The workspace plan is unavailable.');
      const usage = (await repository.findMonth({ tenantId, month, session })) || {
        apiCalls: 0,
        tokens: 0,
        costMicroUsd: 0,
      };
      const tokens = input.inputTokens + input.outputTokens;
      const dimension =
        usage.apiCalls + 1 > plan.apiCalls
          ? 'apiCalls'
          : usage.tokens + tokens > plan.tokens
            ? 'tokens'
            : null;

      if (dimension)
        throw new AppError(
          429,
          'quota_exceeded',
          `Monthly ${dimension === 'apiCalls' ? 'API call' : 'token'} quota exceeded.`,
          {
            dimension,
            used: usage[dimension],
            limit: plan[dimension],
            requested: dimension === 'apiCalls' ? 1 : tokens,
            resetsAt: end.toISOString(),
            retryAfter: Math.max(1, Math.ceil((end - now) / 1000)),
          },
        );
      const costMicroUsd = price(input);
      const id = randomUUID();
      const response = {
        id,
        result: 'Simulated generation complete.',
        usage: { apiCalls: 1, tokens, ...input },
        costMicroUsd,
        currency: 'USD',
        priceVersion: PRICING.version,
        createdAt: now.toISOString(),
      };

      await repository.insertEvent({
        id,
        tenantId,
        key,
        requestHash,
        month,
        input,
        tokens,
        costMicroUsd,
        priceVersion: PRICING.version,
        now,
        response,
        tenant,
        session,
      });
      await repository.incrementMonth({ tenantId, month, tokens, costMicroUsd, tenant, session });

      return response;
    });
  }

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

  return { generate, usage };
}
