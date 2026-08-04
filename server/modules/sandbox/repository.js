export function sandboxRepository({ db, clock = () => new Date() }) {
  return {
    revoke({ tenantId }) {
      return db
        .collection('tenants')
        .updateOne({ _id: tenantId, isSandbox: true }, { $set: { expiresAt: clock() } });
    },
    findActive({ apiKeyHash }) {
      return db
        .collection('tenants')
        .findOne({ apiKeyHash, isSandbox: true, expiresAt: { $gt: clock() } });
    },
    insertTenant({ tenant, session }) {
      return db.collection('tenants').insertOne(tenant, { session });
    },
    insertSubscription({ tenant, session }) {
      return db
        .collection('subscriptions')
        .insertOne(
          { _id: tenant._id, planId: 'free', status: 'free', expiresAt: tenant.expiresAt },
          { session },
        );
    },
  };
}
