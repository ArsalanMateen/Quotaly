import { Router } from 'express';
import { z } from 'zod';

function readWorkspaceToken(req) {
  const value = req.headers.authorization;
  const token = value?.startsWith('Bearer ') ? value.slice(7) : null;
  return token && /^[a-f0-9]{64}$/.test(token) ? token : null;
}

export function sandboxRoutes({ sandbox, authenticated }) {
  const router = Router();

  router.get('/sandbox/session', async (req, res) => {
    const tenant = await sandbox.find(readWorkspaceToken(req));

    res.json({
      active: Boolean(tenant),
      expiresAt: tenant?.expiresAt || null,
    });
  });
  router.post('/sandbox/session', async (req, res) => {
    z.object({})
      .strict()
      .parse(req.body || {});
    const result = await sandbox.start(req.ip, readWorkspaceToken(req));
    res
      .status(result.resumed ? 200 : 201)
      .json({ active: true, expiresAt: result.tenant.expiresAt, token: result.token });
  });
  router.delete('/sandbox/session', async (req, res) => {
    const tenant = await sandbox.find(readWorkspaceToken(req));

    if (tenant) await sandbox.end(tenant._id);
    res.status(204).end();
  });
  router.post('/sandbox/reset', authenticated, async (req, res) => {
    z.object({})
      .strict()
      .parse(req.body || {});
    res.json(await sandbox.resetUsage(req.tenantId));
  });

  return router;
}
