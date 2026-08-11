import { json, jsonError, uid } from '@/lib/api';

/**
 * CloudForge — Checkout (Stripe-ready)
 * When STRIPE_SECRET_KEY is configured, creates a real Stripe Checkout
 * Session for recurring SaaS subscriptions. Otherwise returns a sandbox
 * transaction id so the CheckoutModal completes successfully.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, plan = 'pro', billing_cycle = 'monthly', payment_method = 'card' } =
      body as {
        email?: string;
        plan?: string;
        billing_cycle?: string;
        payment_method?: string;
      };

    const stripeKey = process.env.STRIPE_SECRET_KEY;

    if (stripeKey) {
      const { default: Stripe } = await import('stripe');
      const stripe = new Stripe(stripeKey);
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer_email: email || undefined,
        line_items: [
          {
            price: `${plan === 'enterprise' ? 'price_enterprise' : 'price_pro'}_${billing_cycle}`,
            quantity: 1,
          },
        ],
        success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cloudforge.app'}/?checkout=success`,
        cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://cloudforge.app'}/?checkout=cancelled`,
        metadata: { plan, billing_cycle },
      });
      return json({ success: true, url: session.url, transaction_id: session.id });
    }

    // Sandbox fallback.
    return json({
      success: true,
      transaction_id: uid(`txn_${payment_method === 'crypto' ? 'crypto' : 'card'}`),
      plan,
      billing_cycle,
      payment_method,
      message: 'Sandbox checkout completed (no Stripe env configured).',
    });
  } catch (err) {
    return jsonError('Checkout failed', 500, String(err));
  }
}
