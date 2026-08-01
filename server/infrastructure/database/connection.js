import { MongoClient } from 'mongodb';

export async function connect(uri) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  await client.connect();

  return { client, db: client.db() };
}

