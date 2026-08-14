import { checkoutService } from './checkout.service.js';
import { webhookService } from './webhook.service.js';

export function billing(dependencies) {
  return {
    ...checkoutService(dependencies),
    ...webhookService(dependencies),
  };
}
