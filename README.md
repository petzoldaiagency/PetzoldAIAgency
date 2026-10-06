# Petzold AI Agency — Sellable Website

## Pages
- index.html — sales website
- checkout.html — plan-aware checkout
- success.html — post-purchase client access/onboarding
- client-welcome.txt — downloadable onboarding checklist
- stripe-config.js — paste your Stripe Payment Links here
- styles.css — branding/design

## Connect Stripe
1. In Stripe, create 3 recurring monthly products/prices:
   - Starter — $499/month
   - Growth — $699/month
   - Premium — $999/month
2. Create a Payment Link for each recurring price.
3. Set the Stripe Payment Link post-payment redirect to your hosted `success.html` URL.
4. Open `stripe-config.js`.
5. Paste each Payment Link between the quotation marks.
6. Publish all files together.

IMPORTANT
Never put a Stripe secret API key in HTML or JavaScript. Payment Links are safe to use client-side.
For a production membership portal with authenticated access, use Stripe + a backend/member platform rather than relying on the public success URL alone.

## Logo
The website is already configured to use `petzold-ai-agency-logo.png` in the navbar on index.html, checkout.html, and success.html.

## Stripe status
The three live Stripe Payment Links are connected:
- Starter: $499/month
- Growth: $699/month
- Premium: $999/month

The checkout page reads these links from `stripe-config.js`.
Do not add a Stripe secret API key to this static website.
