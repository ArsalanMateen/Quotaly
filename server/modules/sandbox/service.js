import { randomBytes, randomUUID } from 'node:crypto';
import { AppError } from '../../shared/errors.js';
import { hash } from '../../shared/hash.js';
import { transaction } from '../../infrastructure/database/transaction.js';
import { assertActiveTenant } from '../tenants/policy.js';
import { sandboxRepository } from './repository.js';
import { rateLimiter } from './rate.limiter.js';
import { SANDBOX_DURATION_MS } from './policy.js';

export function sandboxService({ db, client, clock = () => new Date() }) {
  const repository = sandboxRepository({ db, clock });
  const { limitCreation } = rateLimiter({ db, clock });

  async function find(token) {
    if (!token) return null;

    return repository.findActive({ apiKeyHash: hash(token) });
  }

  async function start(ip, token) {
    const existing = await find(token);

    if (existing) return { tenant: existing, token, resumed: true };
    await limitCreation(ip);
    const secret = randomBytes(32).toString('hex');
    const now = clock();
    const tenant = {
      _id: `evaluator-${randomUUID()}`,
      name: 'Evaluator workspace',
      apiKeyHash: hash(secret),
      isSandbox: true,
      serial: 0,
      createdAt: now,
      expiresAt: new Date(+now + SANDBOX_DURATION_MS),
    };

    await transaction(client, async (session) => {
      await repository.insertTenant({ tenant, session });
      await repository.insertSubscription({ tenant, session });
    });

    return { tenant, token: secret, resumed: false };
  }

  async function resetUsage(tenantId) {
    return transaction(client, async (session) => {
      const tenant = await repository.lock({ tenantId, session });

      if (!tenant)
        throw new AppError(
          403,
          'sandbox_only',
          'Usage reset is available only in evaluator workspaces.',
        );
      assertActiveTenant(tenant, clock());
      await repository.deleteUsage({ tenantId, session });

      return { reset: true };
    });
  }

  return {
    start,
    find,
    resetUsage,
    end: (tenantId) => repository.revoke({ tenantId }),
  };
}
