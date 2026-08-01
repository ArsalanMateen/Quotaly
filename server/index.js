import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { configuration } from './config/environment.js';
import { createApp } from './app.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(currentDir, '.env');
if (existsSync(envPath)) process.loadEnvFile(envPath);

const config = configuration();

const app = createApp({ config });
const server = app.listen(config.port, config.host, () =>
  console.log(`Quotaly API listening on ${config.host}:${config.port}`),
);
