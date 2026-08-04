import { AppError } from '../../shared/errors.js';
import { hash } from '../../shared/hash.js';
import { SANDBOX_CREATIONS_PER_HOUR } from './policy.js';

export function rateLimiter({ db, clock = () => new Date() }) {
  async function limitCreation(ip) {
    const now = clock();
    const hour = 60 * 60 * 1000;
    const bucket = Math.floor(+now / hour);
    const expiresAt = new Date((bucket + 1) * hour);
    const key = hash(`${ip}:${bucket}`);

    try {
      await db.collection('rate_limits').updateOne(
        { _id: key, count: { $lt: SANDBOX_CREATIONS_PER_HOUR } },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt } },
        { upsert: true },
      );
    } catch (error) {
      if (error.code !== 11000) throw error;

      throw new AppError(
        429,
        'sandbox_creation_limited',
        'Too many evaluator workspaces were opened. Please try again later.',
        { retryAfter: Math.max(1, Math.ceil((expiresAt - now) / 1000)) },
      );
    }
  }

  return { limitCreation };
}
