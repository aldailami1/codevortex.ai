import { json, jsonError } from '@/lib/api';

const VALID_PLANS = new Set(['pro', 'enterprise', 'ad-engine', 'ad-starter', 'ad-growth', 'ad-scale']);
const ONE_TIME_PLANS = new Set(['ad-engine', 'ad-starter', 'ad-growth', 'ad-scale']);
const VALID_CYCLES = new Set(['monthly', 'yearly']);
const VALID_METHODS = new Set(['card', 'apple_pay', 'paypal', 'crypto']);

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getPriceEnvKey = (plan: string, cycle: string) => {
  if (plan === 'pro') return `STRIPE_PRICE_PRO_${cycle.toUpperCase()}`;
  return `STRIPE_PRICE_${plan.replace('-', '_').toUpperCase()}`;
};

/**
 * CloudForge — provider-safe checkout contract.
 * Stripe is the server-side source of truth. PayPal/Crypto are exposed as
 * explicit provider states until their server credentials and webhooks exist.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      email = '',
      plan = 'pro',
      billing_cycle = 'monthly',
      payment_method = 'card',
    } = body as {
      email?: string;
      plan?: string;
      billing_cycle?: string;
      payment_method?: string;
    };

    if (!VALID_PLANS.has(plan)) return jsonError('Unsupported billing product', 400);
    if (!VALID_METHODS.has(payment_method)) return jsonError('Unsupported payment method', 400);
    if (!ONE_TIME_PLANS.has(plan) && !VALID_CYCLES.has(billing_cycle)) {
      return jsonError('Unsupported billing cycle', 400);
    }
    if (plan === 'enterprise') return jsonError('Enterprise checkout uses the sales inquiry flow', 400);
    if (email && !isValidEmail(email)) return jsonError('A valid email is required', 400);

    if (payment_method === 'paypal' || payment_method === 'crypto') {
      return jsonError(
        payment_method === 'paypal'
          ? 'PayPal provider is not configured for this workspace yet'
          : 'Crypto provider is not configured for this workspace yet',
        501,
      );
    }

    const stripeKey = process.env.STRIPE_SECRET_KEY;
    if (!stripeKey) {
      const sandboxAllowed = process.env.ALLOW_SANDBOX_CHECKOUT === 'true' && process.env.NODE_ENV !== 'production';
      if (sandboxAllowed) {
        return json({
          success: true,
          sandbox: true,
          transaction_id: `sandbox_${Date.now()}`,
          plan,
          billing_cycle,
          payment_method,
        });
      }
      return jsonError('Payment provider is not configured', 503);
    }

    const priceId = process.env[getPriceEnvKey(plan, billing_cycle)];
    if (!priceId) return jsonError('Stripe price is not configured for this product', 503);

    const { default: Stripe } = await import('stripe');
    const stripe = new Stripe(stripeKey);
    const mode = ONE_TIME_PLANS.has(plan) ? 'payment' : 'subscription';
    const session = await stripe.checkout.sessions.create({
      mode,
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      payment_method_types: ['card'],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cloudforge.app'}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cloudforge.app'}/?checkout=cancelled`,
      metadata: { plan, billing_cycle, payment_method },
    });

    return json({ success: true, url: session.url, transaction_id: session.id, plan, billing_cycle });
  } catch {
    return jsonError('Checkout could not be started', 500);
  }
}
