export function meteringRepository({ db }) {
  return {
    findSubscription({ tenantId, session }) {
      return db.collection('subscriptions').findOne({ _id: tenantId }, { session });
    },
    findMonth({ tenantId, month, session }) {
      return db.collection('usage_months').findOne({ tenantId, month }, { session });
    },
    findTenant({ tenantId, session }) {
      return db.collection('tenants').findOne({ _id: tenantId }, { session });
    },
  };
}
