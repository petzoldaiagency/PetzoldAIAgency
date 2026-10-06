require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 3000;
const SITE_URL = (process.env.SITE_URL || `http://localhost:${PORT}`).replace(/\/$/, '');
const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

const prices = {
  starter: process.env.STRIPE_PRICE_STARTER,
  growth: process.env.STRIPE_PRICE_GROWTH,
  premium: process.env.STRIPE_PRICE_PREMIUM
};

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const plan = String(req.body.plan || '').toLowerCase();
    if (!['starter', 'growth', 'premium'].includes(plan)) {
      return res.status(400).json({ error: 'Invalid plan selected.' });
    }
    if (!stripe) {
      return res.status(503).json({ error: 'Stripe is not configured yet. Add STRIPE_SECRET_KEY to your .env file.' });
    }
    if (!prices[plan]) {
      return res.status(503).json({ error: `Stripe price for ${plan} is not configured yet.` });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: prices[plan], quantity: 1 }],
      success_url: `${SITE_URL}/success.html?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/#packages`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
      customer_creation: 'always',
      metadata: { plan, company: 'Petzold AI Agency' },
      subscription_data: { metadata: { plan, company: 'Petzold AI Agency' } }
    });

    return res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return res.status(500).json({ error: 'Unable to create checkout session. Please try again.' });
  }
});

app.post('/api/audit-request', async (req, res) => {
  try {
    const required = ['name', 'business', 'email', 'website', 'industry', 'location'];
    const missing = required.filter((field) => !String(req.body[field] || '').trim());
    if (missing.length) return res.status(400).json({ error: `Please complete: ${missing.join(', ')}.` });

    const lead = {
      ...Object.fromEntries(required.map((key) => [key, String(req.body[key]).trim()])),
      submittedAt: new Date().toISOString()
    };

    if (process.env.AUDIT_WEBHOOK_URL) {
      const webhookResponse = await fetch(process.env.AUDIT_WEBHOOK_URL, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead)
      });
      if (!webhookResponse.ok) throw new Error(`Audit webhook returned ${webhookResponse.status}`);
    } else {
      const dataDir = path.join(__dirname, 'data');
      const file = path.join(dataDir, 'leads.json');
      fs.mkdirSync(dataDir, { recursive: true });
      let leads = [];
      if (fs.existsSync(file)) {
        try { leads = JSON.parse(fs.readFileSync(file, 'utf8')); } catch { leads = []; }
      }
      leads.push(lead);
      fs.writeFileSync(file, JSON.stringify(leads, null, 2));
    }

    res.json({ success: true, message: 'Your audit request has been received.' });
  } catch (error) {
    console.error('Audit request error:', error);
    res.status(500).json({ error: 'We could not submit your request. Please try again.' });
  }
});

app.get('/api/health', (req, res) => res.json({ ok: true, stripeConfigured: Boolean(stripe) }));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => console.log(`Petzold AI Agency running at ${SITE_URL}`));
