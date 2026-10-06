const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

// Reveal-on-scroll for a restrained premium motion system.
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('in'); observer.unobserve(entry.target); }}), {threshold:.12});
$$('.reveal').forEach(el => observer.observe(el));

// Mobile navigation.
const menu = $('.menu');
if(menu){
  menu.addEventListener('click', () => {
    const navLinks = $('.nav-links');
    const open = navLinks.dataset.open === 'true';
    navLinks.dataset.open = String(!open);
    navLinks.style.display = open ? '' : 'flex';
    if(!open){ navLinks.style.position='absolute'; navLinks.style.top='68px'; navLinks.style.left='15px'; navLinks.style.right='15px'; navLinks.style.padding='18px'; navLinks.style.background='#0b0f14'; navLinks.style.border='1px solid #202834'; navLinks.style.borderRadius='12px'; navLinks.style.flexDirection='column'; navLinks.style.gap='18px'; }
  });
}

// Stripe Checkout. Secret keys remain entirely on the server.
$$('.checkout').forEach(button => button.addEventListener('click', async () => {
  const original = button.innerHTML;
  button.disabled = true; button.innerHTML = 'Opening secure checkout…';
  try {
    const response = await fetch('/api/create-checkout-session', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({plan:button.dataset.plan}) });
    const data = await response.json();
    if(!response.ok) throw new Error(data.error || 'Checkout could not be started.');
    window.location.href = data.url;
  } catch(error){
    alert(error.message);
    button.disabled = false; button.innerHTML = original;
  }
}));

// Free audit form. Server logs locally or forwards to AUDIT_WEBHOOK_URL when configured.
const auditForm = $('#auditForm');
if(auditForm){ auditForm.addEventListener('submit', async e => {
  e.preventDefault(); const status = $('#formStatus'); const submit = $('.form-submit');
  submit.disabled = true; submit.textContent = 'Submitting…'; status.textContent='';
  try{
    const response = await fetch('/api/audit-request',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(auditForm)))});
    const data = await response.json(); if(!response.ok) throw new Error(data.error || 'Please try again.');
    status.className='form-status success'; status.textContent='Request received. We’ll review the details and follow up.'; auditForm.reset();
  }catch(error){ status.className='form-status'; status.textContent=error.message; }
  submit.disabled=false; submit.innerHTML='Request Free Audit <span>↗</span>';
}); }
