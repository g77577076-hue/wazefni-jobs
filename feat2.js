(function(){
  var jobs=window.WZ_JOBS||[], grid=document.getElementById('grid'), filters=document.getElementById('filters'); if(!grid||!filters) return;
  function el(t,c,x){var e=document.createElement(t); if(c)e.className=c; if(x!=null)e.textContent=x; return e;}
  function place(j){ var f=(j.facts||[]).filter(function(p){return /المكان/.test(p[0])})[0], s=f?f[1]:'';
    var g=/القاهرة|المعادي|دجلة|الزهراء/.test(s)?'cairo':/الجيزة|زايد|أكتوبر|العمرانية|المهندسين/.test(s)?'giza':'';
    var r=j.remote==='only'||/ريموت|عن بعد/.test(s)&&!g; return {g:g,r:r,home:/من البيت/.test(s)}; }
  var map={}; jobs.forEach(function(j){map[j.title]=place(j);});
  var saved=[]; try{saved=JSON.parse(localStorage.getItem('wz_saved')||'[]')}catch(e){}
  function persist(){ try{localStorage.setItem('wz_saved',JSON.stringify(saved))}catch(e){} }
  var mode='all', onlySaved=false;
  var bar=el('div','tbar'), sel=el('select'); sel.setAttribute('aria-label','المكان');
  [['all','كل الأماكن'],['cairo','القاهرة'],['giza','الجيزة'],['remote','عن بعد']].forEach(function(o){var op=el('option','',o[1]);op.value=o[0];sel.appendChild(op);});
  var sv=el('button','chip','★ المحفوظة'); sv.type='button'; var msg=el('p','tiny tmsg','');
  bar.appendChild(sel); bar.appendChild(sv); var tip=el('p','tiptxt','💡 اختار مكانك من القايمة، وادوس ★ على أي وظيفة تحفظها وترجعلها من زرار «المحفوظة». الحفظ على جهازك بس.'); filters.parentNode.insertBefore(tip,grid); filters.parentNode.insertBefore(bar,grid); grid.parentNode.insertBefore(msg,grid);
  function apply(){
    var shown=0, cards=grid.querySelectorAll('article.card');
    [].forEach.call(cards,function(c){ var h=c.querySelector('h3'); if(!h) return; var t=h.textContent, m=map[t]||{}, ok=true;
      if(mode==='remote') ok=!!m.r; else if(mode!=='all') ok=m.g===mode;
      if(onlySaved) ok=ok&&saved.indexOf(t)>-1;
      c.style.display=ok?'':'none'; if(ok) shown++;
      var b=c.querySelector('.save'); if(b){var on=saved.indexOf(t)>-1; b.textContent=on?'★':'☆'; b.setAttribute('aria-pressed',on); b.title=on?'شيل من المحفوظة':'احفظ الوظيفة';}
    });
    sv.textContent='★ المحفوظة ('+saved.length+')'; sv.classList.toggle('on',onlySaved);
    msg.textContent = shown===0&&cards.length ? (onlySaved?'مفيش وظايف محفوظة هنا. دوس على النجمة في أي وظيفة. الحفظ على جهازك بس.':'مفيش وظايف بالاختيار ده دلوقتي. جرب مكان تاني.') : (onlySaved?'الوظايف المحفوظة بتتخزن على جهازك بس ومبتتبعتش لأي حد.':'');
  }
  function decorate(){ [].forEach.call(grid.querySelectorAll('article.card'),function(c){ if(c._s) return; var h=c.querySelector('h3'); if(!h) return; c._s=1;
    var b=el('button','save','☆'); b.type='button'; b.addEventListener('click',function(){ var t=h.textContent,i=saved.indexOf(t); if(i>-1) saved.splice(i,1); else saved.push(t); persist(); apply(); }); c.appendChild(b); }); apply(); }
  sel.onchange=function(){mode=sel.value; apply();}; sv.onclick=function(){onlySaved=!onlySaved; apply();};
  new MutationObserver(decorate).observe(grid,{childList:true}); decorate();
})();
