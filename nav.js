(function(){
  if(document.getElementById('wzNav')) return;
  var S=[['منشئ السيرة الذاتية','cv.html','📄'],['خطاب التقديم','cover.html','✉️'],['فاحص الـCV','cvcheck.html','🔍'],['فاحص الوظايف المضروبة','scam.html','🛡️'],['تحضير للمقابلة','interview.html','🎤'],['الرواتب المعلنة','salary.html','💰'],['بلّغ عن نصب','report.html','🚩']];
  var F=[['شارة الموثوق على كل وظيفة','./#jobs','✔'],['تنبيهات تليجرام بالمجال','./#alerts','🔔'],['فلتر المكان والوظايف المحفوظة','./#jobs','★'],['انشر وظيفة مجانًا','./#post','📢'],['كل الأدوات','tools.html','🧰']];
  function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e;}
  var css=el('style');css.textContent='#wzNav{position:fixed;bottom:16px;right:16px;z-index:9999;font-family:Cairo,system-ui,sans-serif}#wzNav .fab{border:0;background:#7a1530;color:#fff;font:inherit;font-weight:800;padding:12px 18px;border-radius:999px;box-shadow:0 6px 20px rgba(122,21,48,.35);cursor:pointer}#wzNav .sheet{display:none;position:absolute;bottom:56px;right:0;width:min(340px,calc(100vw - 32px));max-height:70vh;overflow:auto;background:#fff;border:1px solid #e8dccb;border-radius:18px;box-shadow:0 12px 36px rgba(0,0,0,.2);padding:12px}#wzNav.open .sheet{display:block}#wzNav .sw{display:flex;gap:6px;margin-bottom:8px}#wzNav .sw button{flex:1;font:inherit;font-weight:800;padding:8px;border-radius:999px;border:1.5px solid #7a1530;background:#fff;color:#7a1530;cursor:pointer}#wzNav .sw button.on{background:#7a1530;color:#fff}#wzNav a{display:flex;gap:10px;align-items:center;padding:10px 8px;border-radius:12px;text-decoration:none;color:#2a1218;font-weight:700}#wzNav a:hover{background:#fbf6ef}@media(min-width:820px){#wzNav{display:none}}';
  document.head.appendChild(css);
  var w=el('div');w.id='wzNav';var fab=el('button','fab','☰ الخدمات والمميزات');fab.type='button';fab.setAttribute('aria-expanded','false');
  var sh=el('div','sheet');var sw=el('div','sw');var bs=el('button','on','الخدمات'),bf=el('button','','المميزات');bs.type=bf.type='button';sw.appendChild(bs);sw.appendChild(bf);var ls=el('div'),lf=el('div');lf.style.display='none';
  function fill(box,arr){arr.forEach(function(x){var a=el('a');a.href=x[1];a.appendChild(el('span','',x[2]));a.appendChild(el('span','',x[0]));box.appendChild(a);});}
  fill(ls,S);fill(lf,F);sh.appendChild(sw);sh.appendChild(ls);sh.appendChild(lf);w.appendChild(sh);w.appendChild(fab);document.body.appendChild(w);
  bs.onclick=function(){bs.className='on';bf.className='';ls.style.display='';lf.style.display='none';};
  bf.onclick=function(){bf.className='on';bs.className='';lf.style.display='';ls.style.display='none';};
  fab.onclick=function(){var o=w.classList.toggle('open');fab.setAttribute('aria-expanded',o);};
  sh.addEventListener('click',function(e){if(e.target.closest('a'))w.classList.remove('open');});
  document.addEventListener('click',function(e){if(!w.contains(e.target))w.classList.remove('open');});
})();
