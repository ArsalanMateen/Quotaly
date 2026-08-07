export function meteringRepository({ db }) {
  return {
    lockTenant({ tenantId, session }) {
      return db
        .collection('tenants')
        .findOneAndUpdate(
          { _id: tenantId },
          { $inc: { serial: 1 } },
          { session, returnDocument: 'after' },
        );
    },
    findEvent({ tenantId, key, session }) {
      return db.collection('usage_events').findOne({ tenantId, key }, { session });
    },
    findSubscription({ tenantId, session }) {
      return db.collection('subscriptions').findOne({ _id: tenantId }, { session });
    },
    findMonth({ tenantId, month, session }) {
      return db.collection('usage_months').findOne({ tenantId, month }, { session });
    },
    insertEvent({
      id,
      tenantId,
      key,
      requestHash,
      month,
      input,
      tokens,
      costMicroUsd,
      priceVersion,
      now,
      response,
      tenant,
      session,
    }) {
      return db.collection('usage_events').insertOne(
        {
          _id: id,
          tenantId,
          key,
          fingerprint: requestHash,
          month,
          input,
          tokens,
          costMicroUsd,
          priceVersion,
          createdAt: now,
          response,
          ...(tenant.isSandbox ? { expiresAt: tenant.expiresAt } : {}),
        },
        { session },
      );
    },
    incrementMonth({ tenantId, month, tokens, costMicroUsd, tenant, session }) {
      return db.collection('usage_months').updateOne(
        { tenantId, month },
        {
          $inc: { apiCalls: 1, tokens, costMicroUsd },
          $setOnInsert: {
            tenantId,
            month,
            ...(tenant.isSandbox ? { expiresAt: tenant.expiresAt } : {}),
          },
        },
        { session, upsert: true },
      );
    },
    findTenant({ tenantId, session }) {
      return db.collection('tenants').findOne({ _id: tenantId }, { session });
    },
  };
}
