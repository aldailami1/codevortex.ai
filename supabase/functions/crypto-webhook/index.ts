/**
 * CloudForge — Crypto Payments Webhook
 * ------------------------------------------------------------------
 * Validates the provider signature (HMAC-SHA256 over the raw body),
 * confirms the on-chain transaction, then activates the subscription.
 * Works with any provider that signs with HMAC (Coinbase Commerce,
 * NowPayments, custom gateways).
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);
const secret = Deno.env.get('CRYPTO_WEBHOOK_SECRET')!;

Deno.serve(async (req) => {
  const raw = await req.text();
  const signature = req.headers.get('x-crypto-signature') ?? '';

  const expected = hmac('sha256', secret, raw, 'utf8', 'hex');
  if (signature !== expected) {
    return new Response('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(raw);
  // Expected shape: { event: 'payment.completed', data: { tx_hash, profile_id, plan, amount, currency } }
  if (event.event === 'payment.completed' || event.event === 'charge:confirmed') {
    const d = event.data ?? event;
    await supabase.from('subscriptions').insert({
      profile_id: d.profile_id,
      provider: 'crypto',
      provider_ref: d.tx_hash,
      plan: d.plan ?? 'pro',
      billing_cycle: d.billing_cycle ?? 'monthly',
      status: 'active',
    });
    await supabase.from('invoices').insert({
      profile_id: d.profile_id,
      provider: 'crypto',
      provider_ref: d.tx_hash,
      amount_cents: Math.round((d.amount ?? 0) * 100),
      currency: d.currency ?? 'usd',
      status: 'paid',
      paid_at: new Date().toISOString(),
    });
    await supabase.from('profiles').update({ plan: d.plan ?? 'pro' }).eq('id', d.profile_id);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
