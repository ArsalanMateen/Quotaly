import { AppError } from '../../shared/errors.js';
import { assertActiveTenant } from '../../modules/tenants/policy.js';

export function authenticate({ tenants, clock }) {
  return async function authenticated(req, res, next) {
    const value = req.headers.authorization;

    if (!value?.startsWith('Bearer ') || value.length > 512)
      throw new AppError(401, 'unauthorized', 'A valid workspace token or API key is required.');
    const tenant = await tenants.findByApiKey(value.slice(7));

    if (!tenant)
      throw new AppError(401, 'unauthorized', 'A valid workspace token or API key is required.');
    assertActiveTenant(tenant, clock());

    req.tenantId = tenant._id;
    next();
  };
}
