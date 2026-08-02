import { randomBytes, randomUUID } from 'node:crypto';
import { hash } from '../../shared/hash.js';
import { transaction } from '../../infrastructure/database/transaction.js';
import { sandboxRepository } from './repository.js';
import { SANDBOX_DURATION_MS } from './policy.js';

export function sandboxService({ db, client, clock = () => new Date() }) {
  const repository = sandboxRepository({ db, clock });

  async function find(token) {
    if (!token) return null;

    return repository.findActive({ apiKeyHash: hash(token) });
  }

  async function start(ip, token) {
    const existing = await find(token);

    if (existing) return { tenant: existing, token, resumed: true };
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

  return {
    start,
    find,
  };
}
