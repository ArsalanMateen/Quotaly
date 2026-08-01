import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { configuration } from './config/environment.js';
import { connect } from './infrastructure/database/connection.js';
import { createApp } from './app.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(currentDir, '.env');
if (existsSync(envPath)) process.loadEnvFile(envPath);

const config = configuration();
const { client, db } = await connect(config.mongoUri);

const stripe = null;
const app = createApp({ db, client, stripe, config });
const server = app.listen(config.port, config.host, () =>
  console.log(`Quotaly API listening on ${config.host}:${config.port}`),
);

async function stop() {
  server.close(async () => {
    await client.close();
    process.exit(0);
  });
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
