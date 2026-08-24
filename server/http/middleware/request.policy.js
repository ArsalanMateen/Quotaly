export function requestPolicy(req, res, next) {
  if (req.url.startsWith('/api/')) req.url = req.url.slice(4);
  res.set({
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type, Idempotency-Key',
    'Access-Control-Expose-Headers': 'Retry-After',
  });

  if (req.method === 'OPTIONS') return res.status(204).end();
  next();
}
