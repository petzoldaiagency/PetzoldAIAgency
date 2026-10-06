import Link from "next/link";
import Stripe from "stripe";

export default async function Success({ searchParams }) {
  const params = await searchParams;
  const sessionId = params?.session_id;
  let customerName = "";

  if (sessionId && process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      customerName = session.customer_details?.name || session.customer_details?.email || "";
    } catch {}
  }

  return (
    <main className="centerPage">
      <div className="successCard">
        <div className="successIcon">✓</div>
        <div className="eyebrow">PAYMENT RECEIVED</div>
        <h1>{customerName ? `Welcome, ${customerName}.` : "Welcome to Petzold AI Agency."}</h1>
        <p>Your subscription checkout has been completed. Your customer access area contains your Stripe account tools and onboarding resource.</p>
        <div className="heroActions">
          <Link className="button primary" href={sessionId ? `/access?session_id=${encodeURIComponent(sessionId)}` : "/access"}>Open customer access</Link>
          <Link className="button ghost darkText" href="/">Back to site</Link>
        </div>
      </div>
    </main>
  );
}
