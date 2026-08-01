import { AppError } from '../../shared/errors.js';

export function notFound(_req, _res, next) {
  next(new AppError(404, 'not_found', 'This endpoint does not exist.'));
}

export function errorHandler(error, _req, res, _next) {
  if (error instanceof AppError) {
    if (error.details.retryAfter) res.set('Retry-After', String(error.details.retryAfter));

    return res
      .status(error.status)
      .json({ error: { code: error.code, message: error.message, details: error.details } });
  }

  if (error.type === 'entity.parse.failed')
    return res
      .status(400)
      .json({ error: { code: 'invalid_json', message: 'The request body must be valid JSON.' } });

  if (error.type === 'entity.too.large')
    return res
      .status(413)
      .json({ error: { code: 'request_too_large', message: 'The request body is too large.' } });

  console.error(JSON.stringify({ level: 'error', code: 'request_failed', type: error.name }));
  res.status(503).json({
    error: {
      code: 'service_unavailable',
      message: 'The service could not complete this request. Retry with the same idempotency key.',
    },
  });
}
