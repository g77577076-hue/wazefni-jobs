(function(){
var K="AIzaSyD1z3KsqFExfLkn9HKHoCxSl8omjFK42EI",U="https://firestore.googleapis.com/v1/projects/wazefni-jobs/databases/(default)/documents/hits?key="+K;
function inj(s,a){var e=document.createElement("script");e.async=1;e.src=s;if(a)for(var k in a)e.setAttribute(k,a[k]);document.head.appendChild(e)}
function rid(){return Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4)}
function ls(s,k,f){try{var v=s.getItem(k);if(!v){v=f();s.setItem(k,v)}return v}catch(e){return f()}}
var vid=ls(localStorage,"wz_v",rid),sid=ls(sessionStorage,"wz_s",rid);
var ua=navigator.userAgent||"";
var dev=/iPad|Tablet/i.test(ua)?"tablet":/Mobi|Android|iPhone/i.test(ua)?"mobile":"desktop";
var os=/Android/i.test(ua)?"Android":/iPhone|iPad|iPod/i.test(ua)?"iOS":/Windows/i.test(ua)?"Windows":/Mac OS/i.test(ua)?"macOS":/Linux/i.test(ua)?"Linux":"Other";
var br=/Edg\//.test(ua)?"Edge":/OPR\/|Opera/.test(ua)?"Opera":/SamsungBrowser/.test(ua)?"Samsung":/FBAN|FBAV/.test(ua)?"Facebook":/Instagram/.test(ua)?"Instagram":/Chrome|CriOS/.test(ua)?"Chrome":/Firefox|FxiOS/.test(ua)?"Firefox":/Safari/.test(ua)?"Safari":"Other";
var ref="";try{if(document.referrer){var h=new URL(document.referrer).hostname.replace(/^www\./,"");if(h!==location.hostname)ref=h}}catch(e){}
try{var q=new URLSearchParams(location.search).get("utm_source");if(q)ref=q}catch(e){}
var geo={};
function str(v,n){return {stringValue:String(v==null?"":v).slice(0,n||60)}}
function send(ev,lb){
 var f={ts:{integerValue:String(Date.now())},vid:str(vid,24),sid:str(sid,24),p:str(location.pathname.replace(/index\.html$/,"")||"/",110),ref:str(ref,60),ev:str(ev||"pv",40),lb:str(lb||"",60),dev:str(dev,10),os:str(os,12),br:str(br,12),lg:str((navigator.language||"").slice(0,12),12),sw:{integerValue:String(Math.min(screen.width||0,9999))},co:str(geo.co,40),ci:str(geo.ci,40),nv:str(ls(localStorage,"wz_n",function(){return"1"})==="1"&&!localStorage.getItem("wz_seen")?"new":"ret",4)};
 try{fetch(U,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({fields:f}),keepalive:true,mode:"cors"}).catch(function(){})}catch(e){}
}
window.wzTrack=send;
function go(){
 inj("https://www.googletagmanager.com/gtag/js?id=G-YZT9TVH99Z");
 inj("//gc.zgo.at/count.js",{"data-goatcounter":"https://wazefni.goatcounter.com/count"});
 var og=window.gtag;
 if(typeof og==="function"){window.gtag=function(){try{if(arguments[0]==="event")send("ev:"+arguments[1],(arguments[2]&&(arguments[2].event_label||arguments[2].method||arguments[2].value))||"")}catch(e){}return og.apply(this,arguments)}}
 try{document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest("a[href]");if(!a)return;var h=a.href||"";if(/^https?:/.test(h)&&a.hostname!==location.hostname)send("out",a.hostname)},true)}catch(e){}
 function fin(){send("pv");try{localStorage.setItem("wz_seen","1")}catch(e){}}
 var done=0;function once(){if(!done){done=1;fin()}}
 try{var c=new AbortController();setTimeout(function(){c.abort()},2500);fetch("https://ipapi.co/json/",{signal:c.signal}).then(function(r){return r.json()}).then(function(j){geo.co=j.country_name||j.country||"";geo.ci=j.city||"";once()}).catch(function(){try{geo.co=(Intl.DateTimeFormat().resolvedOptions().timeZone||"").split("/")[0]}catch(e){}once()})}catch(e){once()}
 setTimeout(once,3000);
}
if(document.readyState==="complete")setTimeout(go,50);else addEventListener("load",function(){setTimeout(go,50)});
})();
