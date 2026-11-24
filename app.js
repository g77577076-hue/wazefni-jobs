(function(){
  var today=new Date().toISOString().slice(0,10);
  var jobs = window.WZ_JOBS.filter(function(j){return j.expires>=today;}).sort(function(x,y){return y.postedAt<x.postedAt?-1:1;}), grid = document.getElementById('grid'), filters = document.getElementById('filters');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.getElementById('upd').textContent = 'آخر تحديث: ' + window.WZ_UPDATED;
  function el(t, c, txt){ var e=document.createElement(t); if(c) e.className=c; if(txt!=null) e.textContent=txt; return e; }
  function render(f){
    grid.innerHTML='';
    jobs.filter(function(j){return f==='all'||j.field===f;}).forEach(function(j,i){
      var c = el('article','card reveal'); c.style.transitionDelay=(i*80)+'ms';
      c.appendChild(el('span','tag',j.fieldLabel));
      c.appendChild(el('h3','',j.title));
      c.appendChild(el('p','co',j.company));
      var dl = el('dl'); j.facts.forEach(function(p){ var r=el('div'); r.appendChild(el('dt','',p[0])); r.appendChild(el('dd','',p[1])); dl.appendChild(r); });
      c.appendChild(dl);
      c.appendChild(el('p','exp','التقديم المقترح لحد: '+new Date(j.expires+'T12:00:00').toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'})));
      if(j.source){ var sp=el('p','src','المصدر: '); var sa=el('a','',j.source[0]); sa.href=j.source[1]; sa.target='_blank'; sa.rel='noopener nofollow'; sp.appendChild(sa); c.appendChild(sp); }
      c.appendChild(el('p','tiny',j.posted + '. التقديم عند الشركة نفسها، ووظفني مش وسيط ولا بياخد حاجة من المتقدم.'));
      var a = el('a','btn',j.cta); a.href=j.href; if(j.href.indexOf('http')===0){a.target='_blank'; a.rel='noopener';}
      c.appendChild(a); grid.appendChild(c); observe(c);
    });
  }
  var cats=[['all','الكل']]; jobs.forEach(function(j){ if(!cats.some(function(c){return c[0]===j.field;})) cats.push([j.field,j.fieldLabel]); });
  cats.forEach(function(c,i){ var b=el('button','chip'+(i===0?' on':''),c[1]); b.type='button'; b.onclick=function(){ [].forEach.call(filters.children,function(x){x.classList.remove('on')}); b.classList.add('on'); render(c[0]); }; filters.appendChild(b); });
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{threshold:.12}) : null;
  function observe(e){ if(io) io.observe(e); else e.classList.add('in'); }
  if(!jobs.length){ grid.appendChild(el('p','note','مفيش وظايف مفتوحة دلوقتي. تابع قناة واتساب وصفحة فيسبوك، وبنضيف وظايف جديدة باستمرار.')); }
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
    if(el.id==='sendWa'){ ev('click-submit-job-form'); return; }
    var h=el.getAttribute('href')||''; if(!h) return;
    var n=null;
    if(/^mailto:/i.test(h)) n='click-apply-email';
    else if(/whatsapp\.com|wa\.me/i.test(h)) n='click-whatsapp';
    else if(/facebook\.com|m\.me/i.test(h)) n='click-facebook';
    else if(/reddit\.com/i.test(h)) n='click-reddit';
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
