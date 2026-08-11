/**
 * CloudForge — Webhook Dispatcher (Zapier/Make-like engine)
 * ------------------------------------------------------------------
 * Triggered by platform events (deployment finished, workflow run,
 * invoice paid…). Looks up subscribed endpoints, signs the payload
 * with each endpoint's HMAC secret and delivers with retries.
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { hmac } from 'https://deno.land/x/hmac@v2.0.1/mod.ts';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

const MAX_ATTEMPTS = 3;

Deno.serve(async (req) => {
  const { event, workspace_id, payload } = await req.json();

  const { data: endpoints } = await supabase
    .from('webhook_endpoints')
    .select('*')
    .eq('workspace_id', workspace_id)
    .eq('is_active', true)
    .contains('events', [event]);

  if (!endpoints || endpoints.length === 0) {
    return new Response(JSON.stringify({ dispatched: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let dispatched = 0;
  for (const endpoint of endpoints) {
    const eventRow = (
      await supabase
        .from('webhook_events')
        .insert({ endpoint_id: endpoint.id, event, payload })
        .select()
        .single()
    ).data;

    let ok = false;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS && !ok; attempt++) {
      const body = JSON.stringify({
        id: eventRow?.id,
        event,
        created_at: new Date().toISOString(),
        payload,
      });
      const sig = endpoint.secret ? hmac('sha256', endpoint.secret, body, 'utf8', 'hex') : '';
      try {
        const res = await fetch(endpoint.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CloudForge-Signature': `sha256=${sig}`,
            'X-CloudForge-Event': event,
            'User-Agent': 'CloudForge-Webhook/v1',
          },
          body,
        });
        ok = res.ok;
        await supabase
          .from('webhook_events')
          .update({
            status: ok ? 'delivered' : 'retrying',
            attempts: attempt,
            response_code: res.status,
            delivered_at: ok ? new Date().toISOString() : null,
          })
          .eq('id', eventRow?.id);
      } catch {
        await supabase
          .from('webhook_events')
          .update({ status: 'retrying', attempts: attempt })
          .eq('id', eventRow?.id);
      }
    }
    if (ok) dispatched += 1;
  }

  return new Response(JSON.stringify({ dispatched }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
