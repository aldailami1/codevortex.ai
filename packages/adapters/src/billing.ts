import type { BillingCheckoutRequest, BillingCheckoutSession } from '@cloudforge/contracts';

export interface BillingPort {
  createCheckout(request: BillingCheckoutRequest): Promise<BillingCheckoutSession>;
  handleWebhook(payload: string, signature: string): Promise<{ eventId: string; type: string }>;
}

/**
 * Provider boundary for SkipCash. Network calls are intentionally not made in
 * the scaffold until credentials, merchant configuration, and webhook signing
 * rules are supplied for the target environment.
 */
export class SkipCashBillingAdapter implements BillingPort {
  async createCheckout(_request: BillingCheckoutRequest): Promise<BillingCheckoutSession> {
    throw new Error('SkipCash credentials are not configured for this environment');
  }

  async handleWebhook(_payload: string, _signature: string): Promise<{ eventId: string; type: string }> {
    throw new Error('SkipCash webhook verification is not configured for this environment');
  }
}
