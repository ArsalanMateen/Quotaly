import { Router } from 'express';
import { AppError } from '../../shared/errors.js';
export function billingRoutes({ payments, authenticated }) {
  const router = Router();

  router.post('/billing/checkout', authenticated, async (req, res) => {
    if (req.body && Object.keys(req.body).length)
      throw new AppError(422, 'invalid_input', 'Checkout accepts no body fields.');
    let origin;
    try {
      origin = new URL(req.headers.origin);
      if (!['http:', 'https:'].includes(origin.protocol)) throw new Error('Invalid origin');
    } catch {
      throw new AppError(400, 'invalid_origin', 'Open Checkout from the web app.');
    }
    res.json(await payments.checkout(req.tenantId, origin.origin));
  });

  return router;
}
