import express from 'express';
import { healthRoutes } from './http/health.routes.js';
import { errorHandler, notFound } from './http/middleware/errors.js';

export function createApp(dependencies) {
  const { config } = dependencies;
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', config.production ? 1 : false);

  app.use(healthRoutes(async () => {}));

  app.use(notFound, errorHandler);

  return app;
}
