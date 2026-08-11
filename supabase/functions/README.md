# CloudForge — Supabase Edge Functions

| Function | Purpose | Secrets required |
| --- | --- | --- |
| `ai-completion` | Multi-provider LLM gateway (OpenAI → Anthropic → Gemini) | `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY` |
| `stripe-webhook` | Mirrors Stripe subscription/invoice events into the DB | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| `crypto-webhook` | Activates subscriptions after verified on-chain payment | `CRYPTO_WEBHOOK_SECRET` |
| `webhook-dispatcher` | Delivers signed platform webhooks to external endpoints (Zapier-style) | none (reads `webhook_endpoints.secret`) |

## Deploy

```bash
# 1. Log in and link the project
supabase login
supabase link --project-ref <your-project-ref>

# 2. Set secrets in the dashboard or CLI:
supabase secrets set OPENAI_API_KEY=sk-... ANTHROPIC_API_KEY=sk-ant-...

# 3. Deploy functions
supabase functions deploy ai-completion
supabase functions deploy stripe-webhook
supabase functions deploy crypto-webhook
supabase functions deploy webhook-dispatcher

# 4. Push the database schema
supabase db push
```

## Invoke from the Next.js app

```ts
const res = await fetch(
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/ai-completion`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ action: 'generate', prompt: 'Build me a SaaS' }),
  }
);
```
