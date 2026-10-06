import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) return new Response("Missing checkout session.", { status: 400 });

  try {
    const checkout = await stripe.checkout.sessions.retrieve(sessionId);
    if (!checkout.customer) return new Response("No Stripe customer found.", { status: 400 });

    const portal = await stripe.billingPortal.sessions.create({
      customer: checkout.customer,
      return_url: `${origin}/access?session_id=${encodeURIComponent(sessionId)}`,
    });

    return Response.redirect(portal.url, 303);
  } catch {
    return new Response("Unable to open the customer portal.", { status: 400 });
  }
}
