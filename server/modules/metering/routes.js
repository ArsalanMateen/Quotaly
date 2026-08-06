import { Router } from 'express';

export function meteringRoutes({ meter, authenticated, billingConfigured }) {
  const router = Router();

  router.get('/usage', authenticated, async (req, res) => {
    res.json({
      ...(await meter.usage(req.tenantId)),
      billingConfigured,
    });
  });
  return router;
}
