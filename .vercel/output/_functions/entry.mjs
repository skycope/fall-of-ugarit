import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_BKM0Fx4E.mjs';
import { manifest } from './manifest_Cf0SaazA.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/api/create-checkout.astro.mjs');
const _page2 = () => import('./pages/api/webhook.astro.mjs');
const _page3 = () => import('./pages/order.astro.mjs');
const _page4 = () => import('./pages/order-success.astro.mjs');
const _page5 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/api/create-checkout.ts", _page1],
    ["src/pages/api/webhook.ts", _page2],
    ["src/pages/order.astro", _page3],
    ["src/pages/order-success.astro", _page4],
    ["src/pages/index.astro", _page5]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "e5c1aa53-9fe9-419f-a7ad-6af8a53bb629",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
