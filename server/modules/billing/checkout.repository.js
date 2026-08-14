export function checkoutRepository({ db, clock = () => new Date() }) {
  return {
    claimLease({ tenantId, now, lockId }) {
      return db.collection('tenants').findOneAndUpdate(
        {
          _id: tenantId,
          $or: [{ checkoutLease: { $exists: false } }, { checkoutLease: { $lte: now } }],
        },
        { $set: { checkoutLease: new Date(+now + 180000), checkoutLockId: lockId } },
        { returnDocument: 'after' },
      );
    },
    findSubscription({ tenantId }) {
      return db.collection('subscriptions').findOne({ _id: tenantId });
    },
    saveCustomer({ tenantId, lockId, customerId }) {
      return db
        .collection('tenants')
        .updateOne(
          { _id: tenantId, checkoutLockId: lockId },
          { $set: { stripeCustomerId: customerId } },
        );
    },
    reserveAttempt({ tenantId, lockId, attempt }) {
      return db
        .collection('tenants')
        .updateOne(
          { _id: tenantId, checkoutLockId: lockId, checkoutLease: { $gt: clock() } },
          { $set: { checkoutAttempt: attempt } },
        );
    },
    saveSession({ tenantId, lockId, sessionId }) {
      return db
        .collection('tenants')
        .updateOne(
          { _id: tenantId, checkoutLockId: lockId, checkoutLease: { $gt: clock() } },
          { $set: { checkoutSessionId: sessionId }, $unset: { checkoutAttempt: '' } },
        );
    },
    releaseLease({ tenantId, lockId }) {
      return db
        .collection('tenants')
        .updateOne(
          { _id: tenantId, checkoutLockId: lockId },
          { $unset: { checkoutLease: '', checkoutLockId: '' } },
        );
    },
  };
}
