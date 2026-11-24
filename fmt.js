/* وظفني: تنسيق الوظيفة كرسالة جاهزة (قناة واتساب / مشاركة). بيشتغل جوه المتصفح بس. */
window.WZ_SITE='https://is.gd/wazefni';
window.WZ_fmt=function(j){
  var L=[], ic={'المكان':'📍','الراتب':'💰','المطلوب':'✅','المواعيد':'🕒','التقديم':'📝'};
  L.push('🔥 *'+j.title+'*');
  L.push('🏢 '+j.company);
  (j.facts||[]).forEach(function(f){ var k=f[0], e='▪️'; Object.keys(ic).forEach(function(x){ if(k.indexOf(x)===0) e=ic[x]; }); L.push(e+' '+k+': '+f[1]); });
  var rs=(j.routes||[[j.cta,j.href]]), A=[];
  rs.forEach(function(r){ var h=r[1], m;
    if((m=/^https:\/\/wa\.me\/(\d+)/.exec(h))) A.push('واتساب: +'+m[1]);
    else if((m=/^mailto:([^?]+)/i.exec(h))) A.push('إيميل: '+m[1]);
    else if(/reddit\.com/.test(h)) A.push('على Reddit: '+h);
    else A.push(r[0]+': '+h); });
  L.push('📩 *التقديم:*'); A.forEach(function(a){ L.push('   '+a); });
  if(j.expires) L.push('📅 التقديم المقترح لحد: '+new Date(j.expires+'T12:00:00').toLocaleDateString('ar-EG',{day:'numeric',month:'long',year:'numeric'}));
  if(j.source&&!rs.some(function(r){return r[1]===j.source[1]})) L.push('🔗 المصدر: '+j.source[0]+' '+j.source[1]);
  L.push('');
  L.push('✨ وظفني مش وسيط ومبياخدش حاجة من المتقدم. التقديم عند الشركة نفسها');
  L.push('🌐 '+window.WZ_SITE);
  return L.join('\n');
};
