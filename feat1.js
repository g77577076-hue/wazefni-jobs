(function(){
  var jobs=window.WZ_JOBS||[], grid=document.getElementById('grid'); if(!grid) return;
  function el(t,c,x){var e=document.createElement(t); if(c)e.className=c; if(x!=null)e.textContent=x; return e;}
  function trust(j){
    var r=(j.routes||[[j.cta,j.href]]).map(function(x){return x[1]}), s=(j.source&&j.source[0]||'').toLowerCase();
    var wz=r.some(function(h){return /wuzzuf\.net/.test(h)}), li=r.some(function(h){return /linkedin\.com/.test(h)}), ml=r.some(function(h){return /^mailto:/.test(h)}), rd=/reddit/.test(s)||r.some(function(h){return /reddit\.com/.test(h)});
    if(wz||li||(ml&&!rd)){
      var why=[]; if(wz) why.push('رابط التقديم على Wuzzuf، وهو موقع توظيف معروف'); if(li) why.push('رابط التقديم على LinkedIn'); if(ml&&!wz&&!li) why.push('التقديم بإيميل معلن في إعلان الشركة نفسها');
      why.push('طريقة التقديم زي ما هي في الإعلان الأصلي، من غير تعديل'); why.push('مفيش أي رسوم على المتقدم، وبنذكر الراتب "حسب الإعلان" من غير وعود');
      return {k:'ok',label:'مصدر موثّق',why:why,note:'ده معناه إن المصدر والرابط معروفين مش إننا بنضمن الشركة. برضه ما تدفعش أي فلوس.'};
    }
    var w=['الإعلان منشور من حساب فرد على Reddit، مش من موقع توظيف رسمي','الشركة نفسها ملهاش صفحة تقدر نتأكد منها','لينك الإعلان الأصلي موجود تحت للتأكد'];
    return {k:'warn',label:'مصدر مفتوح: اتأكد بنفسك',why:w,note:'ما تدفعش أي مبلغ ولا تبعت صورة بطاقة أو بيانات بنك. اعمل فحص سريع من صفحة فاحص الوظايف المشبوهة.'};
  }
  function decorate(){
    [].forEach.call(grid.querySelectorAll('article.card'),function(c){
      if(c._t) return; var h=c.querySelector('h3'); if(!h) return;
      var j=jobs.filter(function(x){return x.title===h.textContent})[0]; if(!j) return; c._t=1;
      var t=trust(j), d=el('details','trust '+t.k), sm=el('summary','',(t.k==='ok'?'✔ ':'⚠ ')+t.label); d.appendChild(sm);
      var ul=el('ul'); t.why.forEach(function(w){ul.appendChild(el('li','',w))}); d.appendChild(ul); d.appendChild(el('p','tiny',t.note));
      var a=el('a','tiny-link','افحص الإعلان بنفسك'); a.href='scam.html'; d.appendChild(a);
      var tag=c.querySelector('.tag'); if(tag&&tag.nextSibling) c.insertBefore(d,h); else c.insertBefore(d,c.firstChild);
    });
  }
  new MutationObserver(decorate).observe(grid,{childList:true}); decorate();
})();
