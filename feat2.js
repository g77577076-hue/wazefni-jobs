(function(){
  var jobs=window.WZ_JOBS||[], grid=document.getElementById('grid'), filters=document.getElementById('filters'); if(!grid||!filters) return;
  function el(t,c,x){var e=document.createElement(t); if(c)e.className=c; if(x!=null)e.textContent=x; return e;}
  var GOV=[['cairo','القاهرة'],['giza','الجيزة'],['alex','الإسكندرية'],['gharbia','الغربية'],['dakahlia','الدقهلية'],['sinai','جنوب سيناء'],['remote','عن بعد (ريموت)']];
  var today=new Date().toISOString().slice(0,10);
  function place(j){ var f=(j.facts||[]).filter(function(p){return /المكان/.test(p[0])})[0], s=f?f[1]:'';
    var g=j.gov||(/القاهرة|المعادي|دجلة|الزهراء|الزمالك|مدينة نصر|مصر الجديدة/.test(s)?'cairo':/الجيزة|زايد|أكتوبر|العمرانية|المهندسين/.test(s)?'giza':/الإسكندرية/.test(s)?'alex':/الغربية|طنطا/.test(s)?'gharbia':/الدقهلية|المنصورة/.test(s)?'dakahlia':'');
    return {g:g==='remote'?'':g,r:g==='remote'||j.remote==='only',fresh:j.level==='fresh',home:/من البيت/.test(s)}; }
  var map={}; jobs.forEach(function(j){map[j.title]=place(j);});
  var saved=[]; try{saved=JSON.parse(localStorage.getItem('wz_saved')||'[]')}catch(e){}
  function persist(){ try{localStorage.setItem('wz_saved',JSON.stringify(saved))}catch(e){} }
  var mode='all', fresh=false, onlySaved=false;
  var live=jobs.filter(function(j){return j.expires>=today;});
  var bar=el('div','tbar'), views=el('div','views');
  var sv=el('button','chip','★ المحفوظة'); sv.type='button'; var msg=el('p','tiny tmsg','');
  var nFresh=live.filter(function(j){return j.level==='fresh';}).length;
  var fb=el('a','chip fresh','🎓 بدون خبرة / حديثي التخرج ('+nFresh+')'); fb.href='#view=fresh';
  var fnote=el('p','tiny fnote','وظايف الإعلان نفسه بيقول فيها: بدون خبرة، أو مستوى مبتدئين، أو حديثي التخرج. اقرا شروط كل إعلان قبل ما تقدم.'); fnote.hidden=true;
  var gl=el('div','govrow'); gl.appendChild(el('span','govlab','حسب المكان:'));
  var gchips={}; var allc=el('a','chip','الكل'); allc.href='#view=all'; gl.appendChild(allc); gchips.all=allc;
  GOV.forEach(function(o){ var n=live.filter(function(j){var m=place(j); return o[0]==='remote'?m.r:m.g===o[0];}).length; if(!n) return;
    var c=el('a','chip',o[1]+' ('+n+')'); c.href='#view='+o[0]; gl.appendChild(c); gchips[o[0]]=c; });
  var shr=el('div','viewshare'); var cp=el('button','copy-link','انسخ رابط العرض ده'); cp.type='button'; var wa=el('a','copy-link','ابعته على واتساب'); wa.target='_blank'; wa.rel='noopener'; shr.appendChild(cp); shr.appendChild(wa);
  views.appendChild(fb); views.appendChild(fnote); views.appendChild(gl); views.appendChild(shr);
  bar.appendChild(sv); filters.parentNode.insertBefore(views,filters); filters.parentNode.insertBefore(bar,grid); grid.parentNode.insertBefore(msg,grid);
  var tip=el('p','tiptxt','💡 ادوس ★ على أي وظيفة تحفظها وترجعلها من زرار «المحفوظة». الحفظ على جهازك بس.'); filters.parentNode.insertBefore(tip,grid);
  function viewHash(){ var p=[]; if(mode!=='all') p.push(mode); if(fresh) p.push('fresh'); return '#view='+(p.join('+')||'all'); }
  function viewName(){ var n=''; GOV.forEach(function(o){ if(o[0]===mode) n=o[1]; }); return (fresh?'وظايف بدون خبرة / حديثي التخرج':'وظايف')+(n?' في '+n:''); }
  function sync(push){ fb.classList.toggle('on',fresh); fnote.hidden=!fresh; for(var k in gchips) gchips[k].classList.toggle('on',k===mode);
    var h=viewHash(), url=location.href.split('#')[0].split('?')[0]+h; wa.href='https://api.whatsapp.com/send?text='+encodeURIComponent(viewName()+' على وظفني:\n'+url);
    if(push&&history.replaceState){ try{ history.replaceState(null,'',h==='#view=all'?location.pathname+location.search:h); }catch(e){} } }
  function setView(m,f,push){ mode=m; fresh=f; apply(); sync(push); }
  function parseHash(){ var m=/^#view=([a-z+]+)$/.exec(location.hash); if(!m) return null; var p=m[1].split('+'), g='all', f=false; p.forEach(function(x){ if(x==='fresh') f=true; else if(gchips[x]) g=x; }); return [g,f]; }
  fb.onclick=function(e){ e.preventDefault(); setView(mode,!fresh,true); };
  Object.keys(gchips).forEach(function(k){ gchips[k].onclick=function(e){ e.preventDefault(); setView(k,fresh,true); }; });
  cp.onclick=function(){ var url=location.href.split('#')[0].split('?')[0]+viewHash(); function ok(){ cp.textContent='اتنسخ ✓'; setTimeout(function(){cp.textContent='انسخ رابط العرض ده';},1800); }
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(url).then(ok,function(){}); } else { var ta=el('textarea'); ta.value=url; ta.style.cssText='position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try{document.execCommand('copy');ok();}catch(x){} document.body.removeChild(ta); } };
  function apply(){
    [].forEach.call(filters.querySelectorAll('.chip[data-f]'),function(ch){ var fk=ch.dataset.f, n=live.filter(function(j){ var m=place(j);
      if(fresh&&!m.fresh) return false; if(mode==='remote'&&!m.r) return false; if(mode!=='all'&&mode!=='remote'&&m.g!==mode) return false;
      return fk==='all'||j.field===fk; }).length; ch.textContent=ch.dataset.l+' ('+n+')'; ch.classList.toggle('zero',n===0); });
    var shown=0, cards=grid.querySelectorAll('article.card');
    [].forEach.call(cards,function(c){ var h=c.querySelector('h3'); if(!h) return; var t=h.textContent, m=map[t]||{}, ok=true;
      if(mode==='remote') ok=!!m.r; else if(mode!=='all') ok=m.g===mode;
      if(fresh) ok=ok&&!!m.fresh;
      if(onlySaved) ok=ok&&saved.indexOf(t)>-1;
      c.style.display=ok?'':'none'; if(ok) shown++;
      var b=c.querySelector('.save'); if(b){var on=saved.indexOf(t)>-1; b.textContent=on?'★':'☆'; b.setAttribute('aria-pressed',on); b.title=on?'شيل من المحفوظة':'احفظ الوظيفة';}
    });
    sv.textContent='★ المحفوظة ('+saved.length+')'; sv.classList.toggle('on',onlySaved);
    msg.textContent = shown===0&&cards.length ? (onlySaved?'مفيش وظايف محفوظة هنا. دوس على النجمة في أي وظيفة. الحفظ على جهازك بس.':(fresh?'مفيش وظايف بدون خبرة بالاختيار ده دلوقتي. جرب مكان تاني أو شيل الفلتر.':'مفيش وظايف بالاختيار ده دلوقتي. جرب مكان تاني.')) : (onlySaved?'الوظايف المحفوظة بتتخزن على جهازك بس ومبتتبعتش لأي حد.':'');
  }
  function decorate(){ [].forEach.call(grid.querySelectorAll('article.card'),function(c){ if(c._s) return; var h=c.querySelector('h3'); if(!h) return; c._s=1;
    var b=el('button','save','☆'); b.type='button'; b.addEventListener('click',function(){ var t=h.textContent,i=saved.indexOf(t); if(i>-1) saved.splice(i,1); else saved.push(t); persist(); apply(); }); c.appendChild(b); }); apply(); }
  sv.onclick=function(){onlySaved=!onlySaved; apply();};
  new MutationObserver(decorate).observe(grid,{childList:true}); decorate();
  var pv=parseHash(); if(pv){ setView(pv[0],pv[1],false); setTimeout(function(){ var j=document.getElementById('jobs'); if(j) j.scrollIntoView({behavior:'auto'}); },300); } else sync(false);
  window.addEventListener('hashchange',function(){ var p=parseHash(); if(p){ setView(p[0],p[1],false); var j=document.getElementById('jobs'); if(j) j.scrollIntoView({behavior:'smooth'}); } });
})();
