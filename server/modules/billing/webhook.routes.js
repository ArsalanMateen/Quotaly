import { Router, raw } from 'express';

export function webhookRoutes(payments) {
  const router = Router();

  router.post(
    '/webhooks/stripe',
    raw({ type: 'application/json', limit: '256kb' }),
    async (req, res) => {
      res.json(await payments.accept(req.body, req.headers['stripe-signature']));
    },
  );

  return router;
}
