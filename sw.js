"use strict";
const CACHE="calm-down-quotes-v2";
const CORE=["./","./index.html","./style.css","./script.js","./quotes-safe.json","./dawn-bg.webp","./water-bg.webp","./moonlight-bg.webp","./privacy.html","./terms.html"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith("calm-down-quotes-")&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{
  if(event.request.method!=="GET")return;
  const url=new URL(event.request.url);
  if(url.origin!==location.origin)return;
  const save=response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}return response};
  // Pages, scripts, styles and data: network first so updates appear immediately; cache is the offline fallback.
  if(event.request.mode==="navigate"||/\.(?:html|css|js|json|xml|txt)$/.test(url.pathname)){
    event.respondWith(fetch(event.request).then(save).catch(()=>caches.match(event.request).then(hit=>hit||caches.match("./index.html"))));
    return;
  }
  event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request).then(save)));
});
