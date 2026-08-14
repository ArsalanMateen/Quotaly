import { checkoutService } from './checkout.service.js';

export function billing(dependencies) {
  return {
    ...checkoutService(dependencies),
  };
}
