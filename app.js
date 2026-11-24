(function(){
  var today=new Date().toISOString().slice(0,10);
  var jobs = window.WZ_JOBS.filter(function(j){return j.expires>=today;}).sort(function(x,y){return y.postedAt<x.postedAt?-1:1;}), grid = document.getElementById('grid'), filters = document.getElementById('filters');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('upd').textContent = 'آخر تحديث: ' + window.WZ_UPDATED;
  function el(t, c, txt){ var e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e; }
  var LINKS=[], NAME='';
  function lineFor(j){ var t=(j.title+' '+j.company).toLowerCase();
    if(/customer|care|support|call center|خدمة|كول سنتر/.test(t)) return 'بحب التعامل مع الناس، وبسمع للعميل كويس وبحل مشكلته بهدوء واحترام، وملتزم بالشيفتات والمواعيد، وبتعلم بسرعة.';
    if(j.field==='sales'||/sales|telesales|closer|setter|lead/.test(t)) return 'أنا شخص بيحب يحقق التارجت، بقنع العميل بأسلوب محترم، وملتزم بالمتابعة والمواعيد، ومستعد أتدرب وأتعلم بسرعة.';
    if(j.field==='design'||j.field==='social') return 'شغلي بيتميز بالاهتمام بالتفاصيل والالتزام بالمواعيد، وجاهز أبعتلك نماذج من أعمالي ولينكاتها فورًا.';
    return 'أنا شخص ملتزم وبتعلم بسرعة ومسؤول عن شغلي، ومستعد أبدأ بأسرع وقت وأقدم أفضل ما عندي.'; }
  function msgFor(j){ var n=NAME||'[اكتب اسمك هنا]';
    return 'السلام عليكم ورحمة الله وبركاته،\n\nأنا '+n+'، وبتقدم لوظيفة «'+j.title+'» عندكم، وشايف إني مناسب ليها وهكون إضافة حقيقية للفريق.\n\n'+lineFor(j)+'\n\nمتاح أبدأ فورًا وأحضر مقابلة في أي وقت يناسبكم، وجاهز أبعتلك الـ CV حالًا. هسعد جدًا لو أخدت فرصة أثبتلكم نفسي.\n\nمنتظر ردكم، وشكرًا لوقتكم.\n'+n; }
  function toast(t){ var d=document.getElementById('wzToast'); if(!d){ d=document.createElement('div'); d.id='wzToast'; d.style.cssText='position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#7a1530;color:#fff;padding:10px 18px;border-radius:999px;font:700 14px Cairo,sans-serif;z-index:99;max-width:90vw;text-align:center;box-shadow:0 6px 20px rgba(0,0,0,.3)'; document.body.appendChild(d);} d.textContent=t; d.style.display='block'; clearTimeout(d._t); d._t=setTimeout(function(){d.style.display='none';},4500); }
  function copyText(m,cb){ function fb(){ var ta=document.createElement('textarea'); ta.value=m; ta.style.cssText='position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); var ok=false; try{ok=document.execCommand('copy');}catch(e){} document.body.removeChild(ta); cb&&cb(ok); }
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(m).then(function(){cb&&cb(true);},fb); } else fb(); }
  function updateLinks(){ LINKS.forEach(function(p){ var a=p[0], j=p[1], m=msgFor(j); a._m=m;
    if(a.dataset.k==='wa') a.href='https://api.whatsapp.com/send?phone='+a.dataset.v+'&text='+encodeURIComponent(m)+'&type=phone_number&app_absent=0';
    else if(a.dataset.k==='rd'){ /* href stays */ }
    else a.href='mailto:'+a.dataset.v+'?subject='+encodeURIComponent('تقديم على وظيفة «'+j.title+'»'+(NAME?' - '+NAME:''))+'&body='+encodeURIComponent(m);
    if(!a._c){ a._c=1; a.addEventListener('click',function(){ copyText(a._m,function(ok){ if(ok) toast(a.dataset.k==='rd'?'اتنسخت الرسالة، الصقها في الكومنت':'الرسالة اتنسخت. لو مظهرتش في الشات، الصقها'); }); }); } }); }
  var box=el('div','namebox'); var nl=el('label','','اسمك (اختياري): بيتكتب تلقائي في رسالة التقديم'); nl.setAttribute('for','applName'); var ni=el('input'); ni.id='applName'; ni.type='text'; ni.autocomplete='name'; ni.placeholder='اكتب اسمك هنا'; box.appendChild(nl); box.appendChild(ni); box.appendChild(el('p','tiny','الاسم بيفضل في متصفحك بس ومبيتبعتش ولا بيتخزن عندنا.'));
  filters.parentNode.insertBefore(box,filters);
  ni.addEventListener('input',function(){ NAME=ni.value.trim(); updateLinks(); });
  function render(f){
    grid.innerHTML='';
    jobs.filter(function(j){return f==='all'||j.field===f;}).forEach(function(j,i){
      var c = el('article','card reveal'); c.style.transitionDelay=(i*80)+'ms';
      c.appendChild(el('span','tag',j.fieldLabel));
      c.appendChild(el('h3','',j.title));
      c.appendChild(el('p','co',j.company));
      var PH=/(?<!\d)(?:\+?20|0)?1[0125][\s-]?\d{4}[\s-]?\d{4}(?!\d)/g;
      function waNum(n){ var d=n.replace(/\D/g,''); return d.replace(/^0020/,'').replace(/^20(?=1)/,'').replace(/^0/,''); }
      var dl = el('dl'); j.facts.forEach(function(p){ var r=el('div'); r.appendChild(el('dt','',p[0])); var dd=el('dd','');
        var s=p[1], last=0, m, any=false; PH.lastIndex=0;
        while((m=PH.exec(s))){ any=true; if(m.index>last) dd.appendChild(document.createTextNode(s.slice(last,m.index)));
          var num=el('bdi','tel'); num.setAttribute('dir','ltr'); num.textContent=m[0].trim(); dd.appendChild(num);
          if(!c._ph) c._ph=waNum(m[0]); last=m.index+m[0].length; }
        if(any){ if(last<s.length) dd.appendChild(document.createTextNode(s.slice(last))); } else dd.textContent=s;
        r.appendChild(dd); dl.appendChild(r); });
      c.appendChild(dl);
      c.appendChild(el('p','exp','التقديم المقترح لحد: '+new Date(j.expires+'T12:00:00').toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'})));
      if(j.source){ var sp=el('p','src','المصدر: '); var sa=el('a','',j.source[0]); sa.href=j.source[1]; sa.target='_blank'; sa.rel='noopener nofollow'; sp.appendChild(sa); c.appendChild(sp); }
      c.appendChild(el('p','tiny',j.posted + '. التقديم عند الشركة نفسها، ووظفني مش وسيط ولا بياخد حاجة من المتقدم.'));
      var rs = el('div','routes'); (j.routes||[[j.cta,j.href]]).forEach(function(r,ri){ var a = el('a','btn'+(ri?' btn-ghost':''),r[0]); a.href=r[1]; var mw=/^https:\/\/wa\.me\/(\d+)$/.exec(r[1]), mm=/^mailto:([^?]+)/i.exec(r[1]); if(/^https:\/\/(www\.)?reddit\.com\//i.test(r[1])){a.dataset.k='rd';LINKS.push([a,j]);} else if(mw){a.dataset.k='wa';a.dataset.v=mw[1];LINKS.push([a,j]);} else if(mm){a.dataset.k='mail';a.dataset.v=mm[1];LINKS.push([a,j]);} if(r[1].indexOf('http')===0){a.target='_blank'; a.rel='noopener';} rs.appendChild(a); });
      var rl=j.routes||[[j.cta,j.href]]; var hasWa=rl.some(function(r){return /^https:\/\/wa\.me\//.test(r[1]);}), hasRd=rl.some(function(r){return /reddit\.com/i.test(r[1]);});
      if(!hasWa && c._ph && !rl.some(function(r){return /^mailto:/i.test(r[1]);})){ var wb=el('a','btn'+(rl.length?' btn-ghost':''),'كلمهم على واتساب'); wb.dataset.k='wa'; wb.dataset.v='20'+c._ph; wb.href='#'; wb.target='_blank'; wb.rel='noopener'; LINKS.push([wb,j]); rs.appendChild(wb); }
      if(hasRd){ var cb=el('button','copy-one','انسخ رسالة التقديم'); cb.type='button'; cb.addEventListener('click',function(){ copyText(msgFor(j),function(ok){ if(ok) toast('الرسالة اتنسخت'); }); }); rs.appendChild(cb); }
      c.appendChild(rs);
      (function(){ var sb=el('a','btn btn-ghost share','شارك على واتساب'); sb.href='https://api.whatsapp.com/send?text='+encodeURIComponent(window.WZ_fmt(j)); sb.target='_blank'; sb.rel='noopener'; sb.className='share-sec'; sb.dataset.share='1'; sb.textContent='شارك الوظيفة على واتساب'; c.appendChild(sb); })();
      grid.appendChild(c); observe(c);
    });
  }
  var cats=[['all','الكل']]; jobs.forEach(function(j){ if(!cats.some(function(c){return c[0]===j.field;})) cats.push([j.field,j.fieldLabel]); });
  cats.forEach(function(c,i){ var b=el('button','chip'+(i===0?' on':''),c[1]); b.type='button'; b.onclick=function(){ [].forEach.call(filters.children,function(x){x.classList.remove('on')}); b.classList.add('on'); render(c[0]); }; filters.appendChild(b); });
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{threshold:.12}) : null;
  function observe(e){ if(io) io.observe(e); else e.classList.add('in'); }
  if(!jobs.length){ grid.appendChild(el('p','note','مفيش وظايف مفتوحة دلوقتي. تابع قناة واتساب وصفحة فيسبوك، وبنضيف وظايف جديدة باستمرار.')); }
  var _r=render; render=function(f){ _r(f); updateLinks(); };
  render('all');
  [].forEach.call(document.querySelectorAll('.reveal'), observe);
  // counter
  var n=jobs.length, cEl=document.getElementById('count'), k=0; cEl.textContent=n?0:0; var t=setInterval(function(){ k++; cEl.textContent=k; if(k>=n) clearInterval(t); },250);
  // scroll: parallax background, progress, nav
  var layers=[].slice.call(document.querySelectorAll('[data-speed]')), prog=document.getElementById('progress'), nav=document.getElementById('nav'), ticking=false;
  function frame(){
    var y=window.scrollY, h=document.documentElement.scrollHeight-window.innerHeight;
    prog.style.transform='scaleX('+(h>0?y/h:0)+')';
    nav.classList.toggle('solid', y>30);
    if(!reduce) layers.forEach(function(l,i){ var s=parseFloat(l.dataset.speed); l.style.transform='translate3d(0,'+(-y*s)+'px,0) rotate('+(y*s*0.1)+'deg)'; });
    ticking=false;
  }
  window.addEventListener('scroll',function(){ if(!ticking){ticking=true; requestAnimationFrame(frame);} },{passive:true}); frame();
  // form
  var form=document.getElementById('jobform'), err=document.getElementById('err');
  function msg(){
    var d=new FormData(form); if(!d.get('title').trim()||!d.get('company').trim()||!d.get('apply').trim()){ err.hidden=false; return null; } err.hidden=true;
    return 'وظيفة جديدة للنشر على وظفني\nالوظيفة: '+d.get('title')+'\nالشركة: '+d.get('company')+'\nالمكان: '+d.get('place')+'\nنوع الدوام: '+d.get('type')+'\nالخبرة والمطلوب: '+d.get('req')+'\nطريقة التقديم: '+d.get('apply');
  }
  document.getElementById('sendWa').onclick=function(){ var m=msg(); if(!m) return; var done=function(){ window.open('https://m.me/wazefni.eg.jobs','_blank'); }; if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(m).then(function(){ alert('تم نسخ بيانات الوظيفة. الصقها في رسالة صفحة وظفني.'); done(); },function(){ prompt('انسخ الرسالة والصقها في ماسنجر:', m); done(); }); } else { prompt('انسخ الرسالة والصقها في ماسنجر:', m); done(); } };
})();

(function(){
  function ev(n){ try{ if(window.goatcounter&&goatcounter.count) goatcounter.count({path:n,title:n,event:true}); }catch(e){} }
  document.addEventListener('click',function(e){
    var el=e.target.closest&&e.target.closest('a,button'); if(!el) return;
    if(el.dataset&&el.dataset.share){ ev('share-whatsapp'); return; }
    if(el.id==='sendWa'){ ev('click-submit-job-form'); return; }
    var h=el.getAttribute('href')||''; if(!h) return;
    var n=null;
    if(/^mailto:/i.test(h)) n='click-apply-email';
    else if(/whatsapp\.com|wa\.me/i.test(h)) n='click-whatsapp';
    else if(/facebook\.com|m\.me/i.test(h)) n='click-facebook';
    else if(/reddit\.com/i.test(h)) n='click-reddit';
    else if(/t\.me\//i.test(h)) n='click-telegram';
    else if(/^https?:/i.test(h)&&h.indexOf(location.host)<0) n='click-apply-link';
    if(n) ev(n+' '+(el.closest('.job,.card,article')?((el.closest('.job,.card,article').querySelector('h3,h2')||{}).textContent||'').trim().slice(0,40):''));
  },true);
})();

(function(){
  var f=document.getElementById('leadform'); if(!f) return;
  f.addEventListener('submit',function(e){
    e.preventDefault(); var m=document.getElementById('leadMsg'), d=new FormData(f);
    var n=d.get('n').trim(), p=d.get('p').trim(), j=d.get('j').trim();
    m.hidden=false;
    if(!n||p.replace(/\D/g,'').length<8||!j){ m.textContent='من فضلك املا الاسم ورقم صحيح والمجال.'; return; }
    var b=new URLSearchParams(); b.append('entry.24709502',n); b.append('entry.1952334928',p); b.append('entry.1355532484',j);
    document.getElementById('leadBtn').disabled=true;
    fetch('https://docs.google.com/forms/d/e/1FAIpQLScdIMgP8eeKgrkdWy8yCOVgZ7j1QOyn58M0N5JnxKmtxCB_XA/formResponse',{method:'POST',mode:'no-cors',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:b.toString()})
    .then(function(){ try{ if(window.goatcounter&&goatcounter.count) goatcounter.count({path:'lead-submit',title:'lead-submit',event:true}); }catch(x){} f.reset(); m.textContent='تم الاستلام. هنتواصل معاك قريب.'; })
    .catch(function(){ m.textContent='حصلت مشكلة. جرب تاني.'; document.getElementById('leadBtn').disabled=false; });
  });
})();

(function(){
  try{
    var B='https://g77577076-hue.github.io/wazefni-jobs/', today=new Date().toISOString().slice(0,10);
    var list=(window.WZ_JOBS||[]).filter(function(j){return j.expires>=today;}).map(function(j){
      var loc=(j.facts||[]).filter(function(f){return f[0]==='المكان';})[0];
      var typ=(j.facts||[]).filter(function(f){return f[0]==='النوع';})[0];
      var t=typ?typ[1]:'', et=/جزئي/.test(t)?'PART_TIME':(/عقد/.test(t)?'CONTRACTOR':'FULL_TIME');
      var d=j.title+' في '+j.company+(loc?' - '+loc[1]:'')+'. '+j.facts.map(function(f){return f[0]+': '+f[1];}).join('. ')+'. التقديم عند الشركة نفسها.';
      var o={'@context':'https://schema.org','@type':'JobPosting','title':j.title,'description':d,'datePosted':j.postedAt,'validThrough':j.expires+'T23:59:59+02:00','employmentType':et,'directApply':false,'inLanguage':'ar-EG','url':B+'#jobs',
        'hiringOrganization':{'@type':'Organization','name':j.company},
        'jobLocation':{'@type':'Place','address':{'@type':'PostalAddress','addressLocality':j.city||'Cairo','addressCountry':'EG'}}};
      if(j.remote){ o.jobLocationType='TELECOMMUTE'; o.applicantLocationRequirements={'@type':'Country','name':'EG'}; if(j.remote==='only') delete o.jobLocation; }
      if(j.source){ o.identifier={'@type':'PropertyValue','name':'Reddit','value':j.source[1]}; }
      return o; });
    if(list.length){ var s=document.createElement('script'); s.type='application/ld+json'; s.text=JSON.stringify(list); document.head.appendChild(s); }
  }catch(e){}
})();
