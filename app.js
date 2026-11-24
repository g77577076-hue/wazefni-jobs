(function(){
  var jobs = window.WZ_JOBS, grid = document.getElementById('grid'), filters = document.getElementById('filters');
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
      c.appendChild(el('p','tiny',j.posted + '. التقديم عند الشركة نفسها، ووظفني مش وسيط ولا بياخد حاجة من المتقدم.'));
      var a = el('a','btn',j.cta); a.href=j.href; if(j.href.indexOf('http')===0){a.target='_blank'; a.rel='noopener';}
      c.appendChild(a); grid.appendChild(c); observe(c);
    });
  }
  var cats=[['all','الكل']]; jobs.forEach(function(j){ if(!cats.some(function(c){return c[0]===j.field;})) cats.push([j.field,j.fieldLabel]); });
  cats.forEach(function(c,i){ var b=el('button','chip'+(i===0?' on':''),c[1]); b.type='button'; b.onclick=function(){ [].forEach.call(filters.children,function(x){x.classList.remove('on')}); b.classList.add('on'); render(c[0]); }; filters.appendChild(b); });
  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{threshold:.12}) : null;
  function observe(e){ if(io) io.observe(e); else e.classList.add('in'); }
  render('all');
  [].forEach.call(document.querySelectorAll('.reveal'), observe);
  // counter
  var n=jobs.length, cEl=document.getElementById('count'), k=0; var t=setInterval(function(){ k++; cEl.textContent=k; if(k>=n) clearInterval(t); },250);
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
