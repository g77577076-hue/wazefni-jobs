/* وظفني: service worker. بيخزن الصفحات وأدوات قراءة الملفات عشان تشتغل بدون نت بعد أول زيارة. مفيش بيانات مستخدم بتتخزن. */
var V='wz-v4', BASE=self.registration.scope;
var PAGES=['','index.html','cv.html','cover.html','tracker.html','track.js','scam.html','cvcheck.html','tools.html','style.css','tools.css','app.js','jobs.js','fmt.js'];
var VENDOR=['1-mammoth.min.js','2-pdf.min.js','3-pdf.worker.min.js','4-tesseract.min.js','5-worker.min.js','6-core-simd-lstm.wasm.js','7-core-lstm.wasm.js','8-ara.traineddata.gz','9-eng.traineddata.gz','vendor/tesseract-core-simd-lstm.wasm.js','vendor/tesseract-core-lstm.wasm.js'].map(function(f){return 'vendor/'+f});
var ALIAS={'vendor/vendor/ara.traineddata.gz':'vendor/8-ara.traineddata.gz','vendor/vendor/eng.traineddata.gz':'vendor/9-eng.traineddata.gz'};
function real(u){var p=u.slice(BASE.length).split('?')[0];return ALIAS[p]?BASE+ALIAS[p]:u}
function say(m){return self.clients.matchAll().then(function(cs){cs.forEach(function(c){c.postMessage(m)})})}
self.addEventListener('install',function(e){e.waitUntil(caches.open(V).then(function(c){return Promise.all(PAGES.map(function(p){return c.add(new Request(BASE+p,{cache:'reload'})).catch(function(){})}))}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(k){return Promise.all(k.filter(function(x){return x!==V}).map(function(x){return caches.delete(x)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('message',function(e){ if(!e.data) return;
  if(e.data.type==='status'){ e.waitUntil(caches.open(V).then(function(c){return Promise.all(VENDOR.map(function(v){return c.match(BASE+v)}))}).then(function(r){var n=r.filter(Boolean).length;return say({type:'offline',done:n,total:VENDOR.length})})); }
  if(e.data.type==='warm'){ e.waitUntil(caches.open(V).then(function(c){var n=0;return VENDOR.reduce(function(p,v){return p.then(function(){return c.match(BASE+v).then(function(h){ if(h){n++;return say({type:'offline',done:n,total:VENDOR.length})} return fetch(BASE+v).then(function(r){ if(!r.ok) throw 0; return c.put(BASE+v,r).then(function(){n++;return say({type:'offline',done:n,total:VENDOR.length})}) }) })})},Promise.resolve())}).catch(function(){return say({type:'offline-error'})})); }
});
self.addEventListener('fetch',function(e){ var r=e.request; if(r.method!=='GET') return; var u=new URL(r.url); if(u.origin!==location.origin) return;
  if(u.pathname.indexOf('/vendor/')>-1){ var ru=real(r.url); e.respondWith(caches.match(ru,{ignoreSearch:true}).then(function(h){return h||fetch(ru)})); return; }
  e.respondWith(fetch(r).then(function(res){ if(res&&res.ok){ var cp=res.clone(); caches.open(V).then(function(c){c.put(r,cp)}); } return res; }).catch(function(){ return caches.match(r,{ignoreSearch:true}).then(function(h){ return h||(r.mode==='navigate'?caches.match(BASE+'index.html'):undefined) }) })); });
