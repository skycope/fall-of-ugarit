/* empty css                                 */
import { e as createComponent, k as renderHead, r as renderTemplate } from '../chunks/astro/server_DKOE9GFU.mjs';
import 'piccolore';
import 'clsx';
/* empty css                                         */
export { renderers } from '../renderers.mjs';

const $$OrderSuccess = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`<html lang="en" data-astro-cid-fyie5mv7> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Order Complete | The Fall of Ugarit</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap" rel="stylesheet">${renderHead()}</head> <body data-astro-cid-fyie5mv7> <div class="container" data-astro-cid-fyie5mv7> <div class="checkmark" data-astro-cid-fyie5mv7> <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" data-astro-cid-fyie5mv7> <polyline points="20 6 9 17 4 12" data-astro-cid-fyie5mv7></polyline> </svg> </div> <h1 data-astro-cid-fyie5mv7>Thank You!</h1> <p data-astro-cid-fyie5mv7>Your order for <em data-astro-cid-fyie5mv7>The Fall of Ugarit</em> has been received.</p> <div class="note" data-astro-cid-fyie5mv7> <p data-astro-cid-fyie5mv7>A confirmation email is on its way to your inbox.</p> <p data-astro-cid-fyie5mv7>If you chose delivery, expect your book within 5-7 working days. For collection, we'll be in touch shortly.</p> </div> <a href="/" class="back-link" data-astro-cid-fyie5mv7>Back to Home</a> </div> </body></html>`;
}, "/Users/skycope/Documents/ugarit/src/pages/order-success.astro", void 0);

const $$file = "/Users/skycope/Documents/ugarit/src/pages/order-success.astro";
const $$url = "/order-success";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$OrderSuccess,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
