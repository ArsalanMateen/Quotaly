import express from 'express';
import { sandboxService } from './modules/sandbox/service.js';
import { tenantRepository } from './modules/tenants/repository.js';
import { sandboxRoutes } from './modules/sandbox/routes.js';
import { healthRoutes } from './http/health.routes.js';
import { authenticate } from './http/middleware/authenticate.js';
import { errorHandler, notFound } from './http/middleware/errors.js';

export function createApp(dependencies) {
  const { db, config } = dependencies;
  const clock = dependencies.clock || (() => new Date());
  const sandbox = sandboxService(dependencies);
  const authenticated = authenticate({ tenants: tenantRepository(db), clock });
  const app = express();

  app.disable('x-powered-by');
  app.set('trust proxy', config.production ? 1 : false);

  app.use(express.json({ limit: '16kb' }));
  app.use(healthRoutes(() => db.command({ ping: 1 })));
  app.use(sandboxRoutes({ sandbox, authenticated }));

  app.use(notFound, errorHandler);

  return app;
}
