export type DeploymentStatus = 'queued' | 'building' | 'provisioning' | 'ready' | 'failed';

export interface CreateDeploymentCommand {
  projectId: string;
  environmentId: string;
  sourceRevision: string;
  buildContext: string;
  idempotencyKey: string;
}

export interface BillingCheckoutRequest {
  organizationId: string;
  plan: 'free' | 'pro' | 'enterprise' | 'ad-engine';
  interval: 'monthly' | 'annual';
  successUrl: string;
  cancelUrl: string;
}

export interface BillingCheckoutSession {
  provider: 'skipcash';
  sessionId: string;
  checkoutUrl: string;
  expiresAt: string;
}
