# Petzold AI Agency — Sellable Website

## Products
- AI Search Visibility Starter — $499/month
- AI Search Visibility Growth — $699/month (recommended)
- AI Search Visibility Premium — $999/month
- The AI College Advantage — $24.99 one-time (change the Stripe Price if you want a different guide price)

The service pricing and package features are based on the supplied pricing sheet and sales presentation.

## Stripe setup
1. Create the four Products/Prices in Stripe.
2. Use recurring monthly Prices for Starter/Growth/Premium.
3. Use a one-time Price for the College Advantage.
4. Copy the Price IDs into `.env`.
5. Add your Stripe secret key to `STRIPE_SECRET_KEY`.
6. Put the PDF at `private/AI_College_Advantage_Playbook.pdf`.
7. Set `PUBLIC_URL` to the live HTTPS domain.
8. Run `npm install && npm start`.

The secret key is server-side only. Do not put it in HTML or client-side JavaScript.

## Important
The website's service copy does not promise AI rankings, recommendations, leads, or placement. The free audit endpoint currently logs requests; connect it to your preferred email/CRM before launch.
