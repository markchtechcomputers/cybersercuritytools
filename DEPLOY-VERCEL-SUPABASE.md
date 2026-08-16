# Deploy

1. Supabase: run `supabase/migrations/001_storefront.sql`. Enable Email auth. Create a **private** Storage bucket named `paid-products`. Upload `TOOL-001.zip` etc.
2. Vercel: import this GitHub repo. No PHP runtime is needed.
3. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SITE_URL`. Keep service-role and Stripe secrets server-only.
4. Stripe webhook: `https://YOUR-DOMAIN.vercel.app/api/stripe-webhook`, event `checkout.session.completed`.
5. Test: register → buy → Stripe test payment → webhook → My Purchases → Open course/Download.
