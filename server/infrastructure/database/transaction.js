export async function transaction(client, callback) {
  const session = client.startSession();

  try {
    return await session.withTransaction(() => callback(session), {
      readConcern: { level: 'snapshot' },
      writeConcern: { w: 'majority' },
    });
  } finally {
    await session.endSession();
  }
}
