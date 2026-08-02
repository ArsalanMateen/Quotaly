import { AppError } from '../../shared/errors.js';

export function assertActiveTenant(tenant, now = new Date()) {
  if (!tenant || (tenant.expiresAt && tenant.expiresAt <= now))
    throw new AppError(
      401,
      'session_expired',
      'This workspace session has expired. Open a new workspace to continue.',
    );
}
