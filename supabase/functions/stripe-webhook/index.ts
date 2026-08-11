/**
 * CloudForge — Stripe Webhook
 * ------------------------------------------------------------------
 * Receives Stripe signature-verified events (checkout.session.completed,
 * customer.subscription.updated/deleted, invoice.paid) and mirrors them
 * into `subscriptions` / `invoices` / `profiles.plan`.
 */
import Stripe from 'https://esm.sh/stripe@16?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2024-06-20',
});
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')!;

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

Deno.serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  if (!signature) return new Response('Missing signature', { status: 400 });

  let event: Stripe.Event;
  try {
    const payload = await req.text();
    event = await stripe.webhooks.constructEventAsync(payload, signature, webhookSecret);
  } catch (err) {
    return new Response(`Webhook signature verification failed: ${err.message}`, { status: 400 });
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const profileId = session.metadata?.profile_id;
      if (profileId) {
        await supabase.from('subscriptions').insert({
          profile_id: profileId,
          provider: 'stripe',
          provider_ref: session.subscription ?? session.id,
          plan: session.metadata?.plan ?? 'pro',
          billing_cycle: session.metadata?.billing_cycle ?? 'monthly',
          status: 'active',
        });
        await supabase.from('profiles').update({ plan: session.metadata?.plan ?? 'pro' }).eq('id', profileId);
      }
      break;
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription;
      await supabase.from('subscriptions').update({ status: 'canceled' }).eq('provider_ref', sub.id);
      break;
    }
    case 'invoice.paid': {
      const invoice = event.data.object as Stripe.Invoice;
      await supabase.from('invoices').insert({
        profile_id: invoice.customer as string,
        provider: 'stripe',
        provider_ref: invoice.id,
        amount_cents: invoice.amount_paid,
        currency: invoice.currency,
        status: 'paid',
        paid_at: new Date().toISOString(),
      });
      break;
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
