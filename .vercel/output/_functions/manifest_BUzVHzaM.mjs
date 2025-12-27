import 'piccolore';
import { n as decodeKey } from './chunks/astro/server_DKOE9GFU.mjs';
import 'clsx';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_D_dBA6dc.mjs';
import 'es-module-lexer';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/skycope/Documents/ugarit/","cacheDir":"file:///Users/skycope/Documents/ugarit/node_modules/.astro/","outDir":"file:///Users/skycope/Documents/ugarit/dist/","srcDir":"file:///Users/skycope/Documents/ugarit/src/","publicDir":"file:///Users/skycope/Documents/ugarit/public/","buildClientDir":"file:///Users/skycope/Documents/ugarit/dist/client/","buildServerDir":"file:///Users/skycope/Documents/ugarit/dist/server/","adapterName":"@astrojs/vercel","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/create-checkout","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/create-checkout\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"create-checkout","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/create-checkout.ts","pathname":"/api/create-checkout","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/webhook","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/webhook\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"webhook","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/webhook.ts","pathname":"/api/webhook","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BvZ3I9bo.css"},{"type":"inline","content":"@font-face{font-family:Joanna;src:url(/fonts/joanna-regular.otf) format(\"opentype\");font-weight:400;font-style:normal;font-display:swap}[data-astro-cid-7qwnnfzy]{margin:0;padding:0;box-sizing:border-box}body{font-family:Joanna,Joanna MT,EB Garamond,Georgia,serif;background:#10265f;color:#fff;min-height:100vh;line-height:1.6}.container[data-astro-cid-7qwnnfzy]{max-width:480px;margin:0 auto;padding:3rem 1.5rem}.back-link[data-astro-cid-7qwnnfzy]{color:#fff9;text-decoration:none;font-size:.9rem;display:inline-block;margin-bottom:2rem}.back-link[data-astro-cid-7qwnnfzy]:hover{color:#ffb102}h1[data-astro-cid-7qwnnfzy]{font-family:Joanna,Joanna MT,Crimson Text,Georgia,serif;font-size:2rem;color:#ffb102;margin-bottom:.5rem}.subtitle[data-astro-cid-7qwnnfzy]{color:#ffffffb3;margin-bottom:2rem}.form-group[data-astro-cid-7qwnnfzy]{margin-bottom:1.25rem}label[data-astro-cid-7qwnnfzy]{display:block;font-size:.9rem;color:#fffc;margin-bottom:.4rem}input[data-astro-cid-7qwnnfzy],select[data-astro-cid-7qwnnfzy]{width:100%;padding:.7rem .9rem;font-family:inherit;font-size:1rem;background:#ffffff1a;border:1px solid rgba(255,255,255,.2);border-radius:4px;color:#fff;transition:border-color .2s}input[data-astro-cid-7qwnnfzy]:focus,select[data-astro-cid-7qwnnfzy]:focus{outline:none;border-color:#ffb102}input[data-astro-cid-7qwnnfzy]::-moz-placeholder{color:#fff6}input[data-astro-cid-7qwnnfzy]::placeholder{color:#fff6}select[data-astro-cid-7qwnnfzy] option[data-astro-cid-7qwnnfzy]{background:#10265f;color:#fff}.checkbox-group[data-astro-cid-7qwnnfzy]{display:flex;align-items:center;gap:.6rem;margin:1.5rem 0}.checkbox-group[data-astro-cid-7qwnnfzy] input[data-astro-cid-7qwnnfzy][type=checkbox]{width:auto;accent-color:#ffb102}.checkbox-group[data-astro-cid-7qwnnfzy] label[data-astro-cid-7qwnnfzy]{margin:0;cursor:pointer}.collection-info[data-astro-cid-7qwnnfzy]{background:#ffb1021a;border:1px solid rgba(255,177,2,.3);border-radius:6px;padding:1rem;margin-bottom:1rem}.collection-info[data-astro-cid-7qwnnfzy] h3[data-astro-cid-7qwnnfzy]{font-size:.9rem;color:#ffb102;margin-bottom:.3rem}.collection-info[data-astro-cid-7qwnnfzy] p[data-astro-cid-7qwnnfzy]{font-size:.95rem;color:#fffc;margin:0}.address-fields[data-astro-cid-7qwnnfzy]{display:none;padding:1rem;background:#ffffff0d;border-radius:6px;margin-bottom:1.25rem}.address-fields[data-astro-cid-7qwnnfzy].visible{display:block}.address-fields[data-astro-cid-7qwnnfzy] h3[data-astro-cid-7qwnnfzy]{font-size:1rem;color:#ffb102;margin-bottom:1rem}.summary[data-astro-cid-7qwnnfzy]{background:#ffb1021a;border:1px solid rgba(255,177,2,.3);border-radius:6px;padding:1.25rem;margin:1.5rem 0}.summary-row[data-astro-cid-7qwnnfzy]{display:flex;justify-content:space-between;padding:.3rem 0;color:#fffc}.summary-row[data-astro-cid-7qwnnfzy].total{border-top:1px solid rgba(255,255,255,.2);margin-top:.5rem;padding-top:.75rem;font-size:1.2rem;color:#ffb102}button[data-astro-cid-7qwnnfzy][type=submit]{width:100%;padding:1rem;background:#ffb102;color:#10265f;font-family:Joanna,Joanna MT,Crimson Text,Georgia,serif;font-size:1.1rem;font-weight:600;border:none;border-radius:4px;cursor:pointer;transition:background .2s}button[data-astro-cid-7qwnnfzy][type=submit]:hover{background:#ffc942}button[data-astro-cid-7qwnnfzy][type=submit]:disabled{opacity:.6;cursor:not-allowed}.error[data-astro-cid-7qwnnfzy]{background:#dc262633;border:1px solid rgba(220,38,38,.4);color:#fca5a5;padding:1rem;border-radius:6px;margin-bottom:1rem;display:none}.error[data-astro-cid-7qwnnfzy].visible{display:block}.note[data-astro-cid-7qwnnfzy]{font-size:.85rem;color:#ffffff80;margin-top:1rem;text-align:center}\n"}],"routeData":{"route":"/order","isIndex":false,"type":"page","pattern":"^\\/order\\/?$","segments":[[{"content":"order","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/order.astro","pathname":"/order","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BvZ3I9bo.css"},{"type":"inline","content":"@font-face{font-family:Joanna;src:url(/fonts/joanna-regular.otf) format(\"opentype\");font-weight:400;font-style:normal;font-display:swap}[data-astro-cid-fyie5mv7]{margin:0;padding:0;box-sizing:border-box}body{font-family:Joanna,Joanna MT,EB Garamond,Georgia,serif;background:#10265f;color:#fff;min-height:100vh;display:flex;align-items:center;justify-content:center;line-height:1.6}.container[data-astro-cid-fyie5mv7]{max-width:480px;padding:3rem 1.5rem;text-align:center}.checkmark[data-astro-cid-fyie5mv7]{width:80px;height:80px;border:3px solid #ffb102;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 2rem}.checkmark[data-astro-cid-fyie5mv7] svg[data-astro-cid-fyie5mv7]{width:40px;height:40px;stroke:#ffb102}h1[data-astro-cid-fyie5mv7]{font-family:Joanna,Joanna MT,Crimson Text,Georgia,serif;font-size:2rem;color:#ffb102;margin-bottom:1rem}p[data-astro-cid-fyie5mv7]{color:#fffc;margin-bottom:1rem}.note[data-astro-cid-fyie5mv7]{background:#ffffff1a;border-radius:6px;padding:1.25rem;margin:2rem 0;font-size:.95rem}.back-link[data-astro-cid-fyie5mv7]{display:inline-block;color:#ffb102;text-decoration:none;padding:.75rem 1.5rem;border:1px solid #ffb102;border-radius:4px;transition:all .2s}.back-link[data-astro-cid-fyie5mv7]:hover{background:#ffb102;color:#10265f}\n"}],"routeData":{"route":"/order-success","isIndex":false,"type":"page","pattern":"^\\/order-success\\/?$","segments":[[{"content":"order-success","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/order-success.astro","pathname":"/order-success","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/index.BvZ3I9bo.css"},{"type":"external","src":"/_astro/index.Col7XwvN.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/skycope/Documents/ugarit/src/pages/order.astro",{"propagation":"none","containsHead":true}],["/Users/skycope/Documents/ugarit/src/pages/order-success.astro",{"propagation":"none","containsHead":true}],["/Users/skycope/Documents/ugarit/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000noop-middleware":"_noop-middleware.mjs","\u0000virtual:astro:actions/noop-entrypoint":"noop-entrypoint.mjs","\u0000@astro-page:src/pages/api/create-checkout@_@ts":"pages/api/create-checkout.astro.mjs","\u0000@astro-page:src/pages/api/webhook@_@ts":"pages/api/webhook.astro.mjs","\u0000@astro-page:src/pages/order@_@astro":"pages/order.astro.mjs","\u0000@astro-page:src/pages/order-success@_@astro":"pages/order-success.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_BUzVHzaM.mjs","/Users/skycope/Documents/ugarit/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_oylPf92R.mjs","/Users/skycope/Documents/ugarit/src/pages/index.astro?astro&type=script&index=1&lang.ts":"_astro/index.astro_astro_type_script_index_1_lang.C99tDnSG.js","/Users/skycope/Documents/ugarit/src/pages/order.astro?astro&type=script&index=0&lang.ts":"_astro/order.astro_astro_type_script_index_0_lang.BiDHORa3.js","/Users/skycope/Documents/ugarit/src/pages/index.astro?astro&type=script&index=0&lang.ts":"_astro/index.astro_astro_type_script_index_0_lang.Oxy6hP8f.js","@astrojs/react/client.js":"_astro/client.EAUERNtn.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[["/Users/skycope/Documents/ugarit/src/pages/order.astro?astro&type=script&index=0&lang.ts","const m=document.getElementById(\"orderForm\"),c=document.getElementById(\"quantity\"),n=document.getElementById(\"delivery\"),i=document.getElementById(\"addressFields\"),t=document.getElementById(\"error\"),d=document.getElementById(\"submitBtn\"),r=document.getElementById(\"summaryQty\"),u=document.getElementById(\"summaryBooks\"),y=document.getElementById(\"summaryTotal\"),g=document.getElementById(\"deliveryRow\"),v=400,E=100;function l(){const o=parseInt(c.value),s=n.checked,e=o*v,a=e+(s?E:0);r.textContent=o,u.textContent=e,y.textContent=a,g.style.display=s?\"flex\":\"none\"}c.addEventListener(\"change\",l);n.addEventListener(\"change\",()=>{i.classList.toggle(\"visible\",n.checked),l()});m.addEventListener(\"submit\",async o=>{o.preventDefault(),t.classList.remove(\"visible\"),d.disabled=!0,d.textContent=\"Processing...\";const s={name:document.getElementById(\"name\").value,email:document.getElementById(\"email\").value,phone:document.getElementById(\"phone\").value,quantity:parseInt(c.value),delivery:n.checked,address:n.checked?{street:document.getElementById(\"street\").value,suburb:document.getElementById(\"suburb\").value,city:document.getElementById(\"city\").value,postalCode:document.getElementById(\"postalCode\").value}:null};try{const e=await fetch(\"/api/create-checkout\",{method:\"POST\",headers:{\"Content-Type\":\"application/json\"},body:JSON.stringify(s)}),a=await e.json();if(!e.ok)throw new Error(a.error||\"Something went wrong\");window.location.href=a.checkoutUrl}catch(e){t.textContent=e.message,t.classList.add(\"visible\"),d.disabled=!1,d.textContent=\"Proceed to Payment\"}});window.location.hash===\"#cancelled\"?(t.textContent=\"Payment was cancelled. Please try again.\",t.classList.add(\"visible\")):window.location.hash===\"#failed\"&&(t.textContent=\"Payment failed. Please try again or contact us.\",t.classList.add(\"visible\"));"]],"assets":["/_astro/index.BvZ3I9bo.css","/_astro/index.Col7XwvN.css","/bookScene.js","/favicon.svg","/_astro/client.EAUERNtn.js","/_astro/index.astro_astro_type_script_index_0_lang.Oxy6hP8f.js","/_astro/index.astro_astro_type_script_index_1_lang.C99tDnSG.js","/assets/asherah-transparent.png","/assets/asherah-white.png","/assets/asherah.png","/assets/author.png","/assets/blue-bg.png","/assets/book-back.png","/assets/book-cover.png","/assets/book-front.png","/assets/book-spine-new.png","/assets/book-spine.png","/assets/bottle-white.png","/assets/bottle.jpg","/assets/chariot-white.png","/assets/chariot.jpg","/assets/cover-texture.png","/assets/crow-white.png","/assets/crow.jpg","/assets/ibis-white.png","/assets/ibis.png","/assets/lyre-white.png","/assets/lyre.jpg","/assets/shells-white.png","/assets/shells.png","/assets/tern-white.png","/assets/tern.jpg","/assets/wheelchair-white.png","/assets/wheelchair.jpg","/fonts/joanna-regular.otf"],"buildFormat":"directory","checkOrigin":true,"allowedDomains":[],"serverIslandNameMap":[],"key":"cBjCOA3T0rwcGjGUylnVgQgnquLzex7IXfa4015PtPo="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
