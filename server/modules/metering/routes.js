import { Router } from 'express';
import { generateSchema, keySchema } from './schema.js';

export function meteringRoutes({ meter, authenticated, billingConfigured }) {
  const router = Router();

  router.get('/usage', authenticated, async (req, res) => {
    res.json({
      ...(await meter.usage(req.tenantId)),
      billingConfigured,
    });
  });
  router.post('/generate', authenticated, async (req, res) => {
    const key = keySchema.parse(req.headers['idempotency-key']);
    const input = generateSchema.parse(req.body);

    res.status(200).json(await meter.generate(req.tenantId, key, input));
  });

  return router;
}
