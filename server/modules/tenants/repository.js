import { hash } from '../../shared/hash.js';

export function tenantRepository(db) {
  return {
    findByApiKey(token) {
      return db.collection('tenants').findOne({ apiKeyHash: hash(token) });
    },
  };
}
