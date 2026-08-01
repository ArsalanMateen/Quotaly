import { Router } from 'express';

export function healthRoutes(check) {
  const router = Router();

  router.get('/health', async (_req, res) => {
    await check();
    res.json({ status: 'ok', service: 'quotaly' });
  });

  return router;
}
