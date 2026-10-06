const express=require("express");
const Stripe=require("stripe");
const path=require("path");
const fs=require("fs");
const app=express();
const PORT=process.env.PORT||3000;
const stripe=process.env.STRIPE_SECRET_KEY?Stripe(process.env.STRIPE_SECRET_KEY):null;
const PRICE_IDS={starter:process.env.STRIPE_STARTER_PRICE_ID,growth:process.env.STRIPE_GROWTH_PRICE_ID,premium:process.env.STRIPE_PREMIUM_PRICE_ID,college:process.env.STRIPE_COLLEGE_PRICE_ID};
app.use(express.json()); app.use(express.static(path.join(__dirname,"public")));
app.post("/api/create-checkout-session",async(req,res)=>{
 try{
  if(!stripe)return res.status(503).json({error:"Stripe is not configured. Add STRIPE_SECRET_KEY and the four Stripe Price IDs."});
  const product=req.body.product, price=PRICE_IDS[product];
  if(!price)return res.status(400).json({error:"That product is not configured yet."});
  const recurring=product!=="college";
  const session=await stripe.checkout.sessions.create({
   mode:recurring?"subscription":"payment",
   line_items:[{price,quantity:1}],
   success_url:`${process.env.PUBLIC_URL||"http://localhost:"+PORT}/success.html?session_id={CHECKOUT_SESSION_ID}`,
   cancel_url:`${process.env.PUBLIC_URL||"http://localhost:"+PORT}/#packages`,
   billing_address_collection:"auto",
   allow_promotion_codes:true,
   metadata:{product}
  });
  res.json({url:session.url});
 }catch(e){res.status(500).json({error:e.message})}
});
app.post("/api/audit",async(req,res)=>{
 const {name,email,business,website}=req.body||{};
 if(!name||!email||!business||!website)return res.status(400).json({error:"Please complete every field."});
 console.log("AUDIT REQUEST",new Date().toISOString(),{name,email,business,website});
 // Production option: connect this endpoint to an email/CRM provider.
 res.json({ok:true,message:"Thanks — your free AI visibility audit request has been received. We'll follow up with next steps."});
});
app.get("/api/download",async(req,res)=>{
 try{
  if(!stripe)return res.status(503).send("Stripe is not configured.");
  const session=await stripe.checkout.sessions.retrieve(req.query.session_id);
  if(session.payment_status!=="paid"||session.metadata?.product!=="college")return res.status(403).send("This purchase does not include the requested download.");
  const file=process.env.COLLEGE_GUIDE_PATH||path.join(__dirname,"private","AI_College_Advantage_Playbook.pdf");
  if(!fs.existsSync(file))return res.status(404).send("The guide file has not been installed on the server yet.");
  res.download(file,"AI_College_Advantage_Playbook.pdf");
 }catch(e){res.status(400).send("Invalid or expired purchase session.")}
});
app.listen(PORT,()=>console.log(`Petzold AI Agency running on ${PORT}`));