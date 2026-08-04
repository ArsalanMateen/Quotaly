import { MongoClient } from 'mongodb';

export async function connect(uri) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  await client.connect();
  const db = client.db();
  await db.collection('rate_limits').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  return { client, db };
}
