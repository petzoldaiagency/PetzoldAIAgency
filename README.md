# Petzold AI Agency — Sellable Website

This is a Next.js sales site built from the supplied Petzold AI Agency pricing sheet and sales presentation.

## Included

- High-conversion landing page
- Petzold AI Agency wordmark / visual branding
- Exact source pricing:
  - Starter — $499/month
  - Growth — $699/month (recommended)
  - Premium — $999/month
- Stripe Checkout subscription routes
- Stripe Customer Portal route scaffold
- Customer access page
- Protected-download endpoint scaffold
- Responsive design
- Production environment variable template

## Stripe setup

1. Create a Stripe account and enable recurring subscriptions.
2. Create three recurring monthly Prices:
   - $499/month
   - $699/month
   - $999/month
3. Put the three Price IDs in `.env.local` using the variables in `.env.example`.
4. Set `NEXT_PUBLIC_SITE_URL` to your production URL.
5. Run `npm install && npm run dev`.
6. Deploy to Vercel, Netlify, or another Next.js host.
7. The post-checkout success URL carries the Stripe Checkout Session ID into the customer access area. The portal route resolves the Stripe Customer from that session.
8. The download route verifies that the checkout is paid and the subscription is active/trialing before serving the included onboarding PDF.
9. For a larger client portal, add your preferred database/auth layer for reports, team members, and long-lived customer accounts.

## Important

The supplied materials explicitly say not to promise guaranteed rankings, recommendations, leads, or placement in any AI platform. The site preserves that limitation.

The site is intentionally ready for real Stripe Checkout, but it cannot contain your live Stripe secret key or real Price IDs until you supply/configure them in the deployment environment.
