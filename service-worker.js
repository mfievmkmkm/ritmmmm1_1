'use strict';
const CACHE='ritm-v3-1-live-2026-10-31';
const ASSETS=['./','./index.html','./styles.css','./config.js','./app.js','./cloud.js','./manifest.webmanifest','./icons/icon.svg'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('ritm-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
  if(req.mode==='navigate'){
    event.respondWith(fetch(req).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)));}
      return response;
    }).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
  }else{
    event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(response=>{
      if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(req,copy)));}
      return response;
    })));
  }
});
