# Petzold AI Agency — Sellable Website

A production-ready marketing site for **Petzold AI Agency** with a premium dark SaaS design, responsive UI, free-audit lead form, Stripe Checkout subscription flow, success/onboarding pages, sample client dashboard, and starter legal pages.

## Project structure

```text
petzold-ai-agency/
├── public/
│   ├── index.html
│   ├── success.html
│   ├── onboarding.html
│   ├── dashboard.html
│   ├── privacy.html
│   ├── terms.html
│   ├── styles.css
│   └── script.js
├── server.js
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 1. Install Node.js

Install a current Node.js LTS release (Node 18+). Then open Terminal in this project folder.

## 2. Install dependencies

```bash
cd petzold-ai-agency
npm install
```

## 3. Create your environment file

Copy `.env.example` to a new file named `.env`:

```bash
cp .env.example .env
```

On Windows, create the `.env` file manually if `cp` is unavailable.

## 4. Add your Stripe credentials

Open `.env` and replace the placeholders.

### Secret key

Put your Stripe secret key here:

```env
STRIPE_SECRET_KEY=sk_test_...
```

For live payments, use your Stripe **live** secret key (`sk_live_...`). Never put this value in `public/`, browser JavaScript, HTML, or GitHub.

### Price IDs

In Stripe Dashboard, open **Product catalog → Products**, open each subscription product, and locate its recurring Price. Copy the Price ID (it starts with `price_`).

Put them here:

```env
STRIPE_PRICE_STARTER=price_...
STRIPE_PRICE_GROWTH=price_...
STRIPE_PRICE_PREMIUM=price_...
```

Make sure each Price is a **recurring monthly price** matching your website offer:

- Starter: $499/month
- Growth: $699/month
- Premium: $999/month

### Site URL

Local development:

```env
SITE_URL=http://localhost:3000
```

After deployment, change it to your real HTTPS domain, for example:

```env
SITE_URL=https://yourdomain.com
```

Do not include a trailing slash.

## 5. Run locally

```bash
npm start
```

Open:

```text
http://localhost:3000
```

## 6. Test Stripe Checkout

For a safe first test, use Stripe **test mode** and a test secret key beginning with `sk_test_` plus test-mode Price IDs.

Click **Get Started** on any package. The browser calls:

```text
POST /api/create-checkout-session
```

The server maps:

```text
starter → STRIPE_PRICE_STARTER
growth  → STRIPE_PRICE_GROWTH
premium → STRIPE_PRICE_PREMIUM
```

The server creates a Stripe Checkout Session using `mode: subscription`. The secret key never reaches the browser.

After a successful test checkout, Stripe redirects to:

```text
/success.html
```

If checkout is cancelled, the customer returns to the Packages section.

## 7. Free audit form

The audit form is fully wired to:

```text
POST /api/audit-request
```

Without additional configuration, submissions are written to `data/leads.json` locally. That file is ignored by Git.

For production, set `AUDIT_WEBHOOK_URL` to a secure automation/CRM webhook if you want submissions forwarded to another system. The site is intentionally not tied to a specific CRM so you can choose your preferred system.

## 8. Deployment — easiest option: Render

This project uses a normal Node/Express server, so a Node web service is the simplest deployment model.

### Render setup

1. Push this project to a **private GitHub repository**.
2. Create a new Web Service on Render.
3. Connect the repository.
4. Build command:

```bash
npm install
```

5. Start command:

```bash
npm start
```

6. Add these environment variables in Render:

```text
STRIPE_SECRET_KEY
STRIPE_PRICE_STARTER
STRIPE_PRICE_GROWTH
STRIPE_PRICE_PREMIUM
SITE_URL
```

Optionally add:

```text
AUDIT_WEBHOOK_URL
```

7. Deploy.
8. Open the generated Render URL and test the site.
9. Once you connect your custom domain, change `SITE_URL` to the HTTPS custom domain and redeploy.

### Railway

Railway can run the same project with:

```bash
npm install
npm start
```

Set the same environment variables in Railway's Variables section.

### Vercel

Vercel is excellent for static frontends, but this project intentionally uses a conventional Express server. Render or Railway is simpler for this exact folder structure. If you later want Vercel, the checkout endpoint should be moved into a Vercel serverless function.

## 9. Custom domain

Point your domain's DNS records to the host's instructions. Once HTTPS is active, set:

```env
SITE_URL=https://yourdomain.com
```

Stripe Checkout itself remains hosted securely by Stripe.

## What is functional now

- Premium responsive marketing website
- Sticky navigation and smooth section navigation
- Mobile-responsive layout
- Animated dashboard-style hero visual
- Monitoring / audit / process sections
- Exact requested $499 / $699 / $999 package pricing
- Working package buttons
- Secure server-side Stripe Checkout endpoint
- Subscription-mode Stripe Checkout
- Success page
- Onboarding page UI
- Sample customer dashboard clearly labeled as sample data
- Free audit form with server-side validation
- Local audit lead capture fallback
- Optional webhook forwarding for audit leads
- FAQ
- Privacy and Terms starter pages
- Production-oriented `.gitignore` and environment variable setup

## What still needs your connection

The site cannot create live subscriptions until you connect **your Stripe secret key and the three recurring Stripe Price IDs** in the deployment environment. Those credentials are intentionally not included in this ZIP.

For production lead management, you should also connect the optional audit webhook to your CRM/email automation. The website already accepts and processes the form without it, but a deployed app should not rely on a local filesystem for permanent lead storage.

## Security notes

- Never commit `.env`.
- Never put `STRIPE_SECRET_KEY` in frontend JavaScript.
- Use Stripe test mode before switching to live mode.
- Use HTTPS in production.
- Review the starter Privacy Policy and Terms with qualified counsel for your actual business and jurisdiction.
- Do not advertise guaranteed AI rankings, recommendations, leads, or placement.
