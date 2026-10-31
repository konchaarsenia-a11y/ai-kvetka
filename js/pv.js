/* Просмотр товара в каталоге: галерея, описание, состав, размер (кол-во, см, доп. инфо из AIK_KAT sz), количество −/+, «В корзину». */
(function(){
var K=window.AIK_KAT||[],B=window.AIK_KAT_BASE||'';if(!K.length)return;
function src(u){return /^(https?:|\/|\.\.)/.test(u)?u:B+u}
var m=document.createElement('div');m.className='pv';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-hidden','true');
m.innerHTML='<div class="pv-bg" data-x></div><div class="pv-w" role="document"><button type="button" class="pv-x" data-x aria-label="Закрыть">×</button>'+
'<div class="pv-g"><div class="pv-m"><div class="pv-tr"></div><button type="button" class="pv-a pv-p" aria-label="Предыдущее фото">‹</button><button type="button" class="pv-a pv-n" aria-label="Следующее фото">›</button><span class="pv-c"></span></div><div class="pv-th"></div></div>'+
'<div class="pv-i"><small class="pv-cat"></small><h2 class="pv-h"></h2><p class="pv-d"></p><p class="pv-cm"><span>Состав</span><em></em></p><div class="pv-sz"></div><div class="pv-si"><b class="pv-sq"></b><span class="pv-sd"></span><span class="pv-sx"></span></div><div class="pv-qs" role="group" aria-label="Готовое количество"></div><div class="pv-b"><b class="pv-pr"></b><div class="pv-q" role="group" aria-label="Количество"><button type="button" data-q="-1" aria-label="Меньше">−</button><span aria-live="polite">1</span><button type="button" data-q="1" aria-label="Больше">+</button></div><button type="button" class="pv-add">В корзину</button></div></div></div>';
document.body.appendChild(m);
var cs0=document.createElement('style');cs0.textContent='.pv-si{display:none;flex-direction:column;gap:3px;font-size:14px;line-height:1.5;margin:-8px 0 20px}.pv-si.on{display:flex}.pv-si b{font-weight:400;font-size:15px}.pv-si span{opacity:.8}.pv-si span:empty{display:none}.pv-q{display:inline-flex;align-items:center;border:1px solid #cfc6b3;border-radius:10px;height:48px;flex:none}.pv-q button{width:42px;height:100%;border:0;background:none;font-size:20px;line-height:1;color:inherit;padding:0}.pv-q button:disabled{opacity:.35}.pv-q span{min-width:26px;text-align:center;font-size:15px}.pv-b{gap:14px}.pv-qs{display:none;margin:-10px 0 12px;max-width:420px}.pv-qs .qsl{padding-left:14px;padding-right:14px}.pv-qs.on{display:block}.pv-q.st span{min-width:64px}'+
'.qy{margin:0 0 2px}.qy .qsl{padding:28px 10px 30px}.qn{display:flex;align-items:center;gap:4px;font-size:12px;margin:0 0 10px}.qn button{background:none;border:1px solid var(--b,#cfc6b3);width:28px;height:28px;font-size:15px;line-height:1;padding:0;color:inherit}.qn span{min-width:52px;text-align:center}.qn em{font-style:normal;opacity:.7;margin-left:6px}'+
'@media(max-width:820px){.pv .pv-w{display:block;height:100%;overflow-y:auto;-webkit-overflow-scrolling:touch}.pv .pv-g{display:block;min-height:auto}.pv .pv-m{width:100%;height:auto;aspect-ratio:1/1}.pv .pv-th{padding:12px 16px 0;margin:0}.pv .pv-i{display:block;padding:22px 20px 34px}.pv .pv-h{margin:4px 0 12px!important}.pv .pv-b{gap:12px}.pv .pv-pr{flex:0 0 100%}.pv .pv-add{flex:1;min-width:0;height:48px;padding:0 16px}}';document.head.appendChild(cs0);
var tr=m.querySelector('.pv-tr'),th=m.querySelector('.pv-th'),cnt=m.querySelector('.pv-c'),szw=m.querySelector('.pv-sz'),pr=m.querySelector('.pv-pr'),ad=m.querySelector('.pv-add'),cmE=m.querySelector('.pv-cm em'),si=m.querySelector('.pv-si'),qw=m.querySelector('.pv-q'),qE=qw.querySelector('span'),qm=qw.querySelector('[data-q="-1"]'),qsw=m.querySelector('.pv-qs');
var cur=null,card=null,ix=0,n=0,k=1,sn='',last=null,q=1,QX=99,mono=false;
var ST=2,SX=301;/* монобукет: шаг −/+ по 2, чтобы количество оставалось нечётным */
function go(i){if(!n)return;ix=(i+n)%n;tr.style.transform='translateX('+(-100*ix)+'%)';cnt.textContent=(ix+1)+' / '+n;th.querySelectorAll('button').forEach(function(b,j){b.classList.toggle('on',j==ix);b.setAttribute('aria-current',j==ix?'true':'false')})}
function zz(){return window.AIK_SZ?AIK_SZ(cur,sn):null}
function price(){if(mono)return +cur.st[sn]||0;var z=zz();return z&&z.p?+z.p:Math.round(+card.dataset.p*k)}
function tot(){return mono?Math.round(price()*q*100)/100:price()*q}
function showPr(){AIK_TWEEN(pr,tot(),prA());qE.textContent=mono?q+' шт.':q;qm.disabled=q<=1;if(qsl&&qsl.get()!=q)qsl.set(q)}
function setQ(v){q=Math.max(1,Math.min(mono?SX:QX,v));showPr()}
qw.addEventListener('click',function(e){var b=e.target.closest('[data-q]');if(b)setQ(q+(+b.dataset.q)*(mono?ST:1))});
var qsl=null;function prA(){return function(x){return AIK_MONEY(mono?Math.round(x):x)+' BYN'}}
function setSi(){var z=zz();si.classList.toggle('on',!!z);if(!z)return;if(mono){si.querySelector('.pv-sq').textContent='Размер '+sn+', '+z.d;si.querySelector('.pv-sd').textContent=AIK_MONEY(price())+' BYN за 1 цветок';si.querySelector('.pv-sx').textContent='';return}si.querySelector('.pv-sq').textContent=(sn?'Размер '+sn+': ':'')+(z.q||'');si.querySelector('.pv-sd').textContent=z.d?z.d.charAt(0).toUpperCase()+z.d.slice(1):'';si.querySelector('.pv-sx').textContent=z.x||''}
function setSz(b){szw.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x==b)});k=+b.dataset.k||1;sn=b.textContent;cmE.textContent=cur.cm||AIK_COMP(cur,sn);setSi();showPr()}
function open(c){var p=AIK_FIND({id:c.dataset.id,n:c.querySelector('h3').textContent});if(!p)return;cur=p;card=c;last=document.activeElement;
 var ph=p.ph.slice();n=ph.length;
 tr.innerHTML=ph.map(function(u,i){return '<div class="pv-s"><img src="'+src(u)+'" alt="'+p.n+', фото '+(i+1)+'"'+(i?' loading="lazy"':'')+' draggable="false"></div>'}).join('');
 th.innerHTML=ph.map(function(u,i){return '<button type="button" aria-label="Фото '+(i+1)+'"><img src="'+src(u)+'" alt="" loading="lazy"></button>'}).join('');
 th.querySelectorAll('button').forEach(function(b,i){b.onclick=function(){go(i)}});
 m.querySelector('.pv-cat').textContent=p.c;m.querySelector('.pv-h').textContent=p.n;m.querySelector('.pv-d').textContent=p.d;
 mono=!!(p.st&&p.qs);q=mono?(+c.dataset.n||p.q0||p.qs[0]):1;qw.classList.toggle('st',mono);qw.setAttribute('aria-label',mono?'Количество цветов':'Количество');
 qsw.classList.toggle('on',mono);qsw.innerHTML='';qsl=null;pr._v=null;if(mono){qsl=AIK_QSL({marks:p.qs,value:q,max:SX,label:'Количество цветов',onChange:function(v){q=v;showPr()}});qsw.appendChild(qsl.el)}
 var cs=c.querySelectorAll('.sz button'),on=c.querySelector('.sz .on');
 szw.innerHTML='';szw.style.display=cs.length?'':'none';
 cs.forEach(function(b){var x=document.createElement('button');x.type='button';x.textContent=b.textContent;x.dataset.k=b.dataset.k;x.onclick=function(){setSz(x)};szw.appendChild(x);if(b==on)setSz(x)});
 if(!cs.length){k=1;sn='';cmE.textContent=AIK_COMP(p,'');setSi();showPr()}
 else if(!szw.querySelector('.on'))setSz(szw.firstChild);
 var sb=szw.querySelector('button:not(.on)')||szw.querySelector('button'),so=szw.querySelector('.on');if(sb){qw.style.borderColor=getComputedStyle(sb).borderColor;m.style.setProperty('--b',getComputedStyle(sb).borderColor)}if(so)m.style.setProperty('--o',getComputedStyle(so).borderColor);if(qsl)qsl.color(getComputedStyle(ad).backgroundColor,sb?getComputedStyle(sb).borderColor:'');
 ad.textContent='В корзину';ad.classList.remove('ok');
 tr.style.transition='none';go(0);tr.offsetWidth;tr.style.transition='';
 m.classList.add('op');m.setAttribute('aria-hidden','false');document.body.classList.add('pv-nl');m.querySelector('.pv-x').focus()}
function close(){m.classList.remove('op');m.setAttribute('aria-hidden','true');document.body.classList.remove('pv-nl');if(last&&last.focus)last.focus()}
m.addEventListener('click',function(e){if(e.target.closest('[data-x]'))close()});
m.querySelector('.pv-p').onclick=function(){go(ix-1)};m.querySelector('.pv-n').onclick=function(){go(ix+1)};
document.addEventListener('keydown',function(e){if(!m.classList.contains('op'))return;if(e.key=='Escape')close();else if(e.key=='ArrowLeft')go(ix-1);else if(e.key=='ArrowRight')go(ix+1)});
var sx=null,sy=0,dx=0;var mm=m.querySelector('.pv-m');
mm.addEventListener('pointerdown',function(e){if(e.target.closest('button'))return;sx=e.clientX;sy=e.clientY;dx=0;tr.style.transition='none'});
mm.addEventListener('pointermove',function(e){if(sx===null)return;dx=e.clientX-sx;tr.style.transform='translateX(calc('+(-100*ix)+'% + '+dx+'px))'});
function up(){if(sx===null)return;sx=null;tr.style.transition='';if(Math.abs(dx)>40)go(ix+(dx<0?1:-1));else go(ix)}
mm.addEventListener('pointerup',up);mm.addEventListener('pointercancel',up);mm.addEventListener('pointerleave',up);
ad.onclick=function(){if(!window.AIK||!AIK.add)return;var it={id:cur.id,n:cur.n,s:sn,p:price(),i:card.querySelector('img').getAttribute('src'),q:q,c:cur.c};var cm=AIK_COMP(cur,sn);if(cm)it.m=cm;if(mono){it.p=tot();it.q=1;it.m=q+' шт.'}AIK.add(it);
 var cs=card.querySelectorAll('.sz button');cs.forEach(function(b){if(b.textContent==sn&&!b.classList.contains('on'))b.click()});if(mono&&card._aikN)card._aikN(q);
 ad.textContent='Добавлено ✓';ad.classList.add('ok');if(!mono)setQ(1);setTimeout(function(){ad.textContent='В корзину';ad.classList.remove('ok')},1400)};
document.querySelectorAll('[data-card]').forEach(function(c){var ph=c.querySelector('.ph'),h=c.querySelector('h3'),cp=c.querySelector('p'),pd=AIK_FIND({id:c.dataset.id,n:h?h.textContent:''});
 if(pd&&pd.st&&pd.qs){(function(){var N=+pd.q0||pd.qs[0],rw=c.querySelector('.rw'),szb=c.querySelector('.sz'),prE=c.querySelector('.pr');
  var qy=document.createElement('div');qy.className='qy';var sl=AIK_QSL({marks:pd.qs,value:N,max:SX,label:'Количество цветов',onChange:function(v){N=v;upd()}});qy.appendChild(sl.el);
  var qn=document.createElement('div');qn.className='qn';qn.innerHTML='<button type="button" aria-label="Меньше">−</button><span></span><button type="button" aria-label="Больше">+</button><em></em>';
  (rw||szb).parentNode.insertBefore(qy,rw);rw.parentNode.insertBefore(qn,rw);
  var b0=c.querySelector('.sz button:not(.on)'),b1=c.querySelector('.sz .on');if(b0){qy.style.setProperty('--b',getComputedStyle(b0).borderColor);qn.style.setProperty('--b',getComputedStyle(b0).borderColor)}if(b1)qy.style.setProperty('--o',getComputedStyle(b1).borderColor);var ab=c.querySelector('.add');sl.color(ab?getComputedStyle(ab).backgroundColor:'',b0?getComputedStyle(b0).borderColor:'');
  function upd(){var s1=(c.querySelector('.sz .on')||{}).textContent||'S',u=+pd.st[s1]||0,t=Math.round(u*N*100)/100,z=AIK_SZ(pd,s1);c.dataset.n=N;c.dataset.t=t;AIK_TWEEN(prE,t,function(x){return AIK_MONEY(Math.round(x))+' BYN'});
   qn.querySelector('span').textContent=N+' шт.';qn.querySelector('em').textContent='по '+AIK_MONEY(u)+' BYN';qn.firstChild.disabled=N<=1;if(cp)cp.textContent=N+' шт.'+(z&&z.d?', '+z.d:'');
   if(sl.get()!=N)sl.set(N)}
  function setN(v){N=Math.max(1,Math.min(SX,v));upd()}c._aikN=setN;
  
  qn.children[0].onclick=function(){setN(N-ST)};qn.children[2].onclick=function(){setN(N+ST)};
  c.querySelectorAll('.sz button').forEach(function(b){b.addEventListener('click',upd)});upd()})()}
 else if(cp&&pd&&window.AIK_SZ)c.querySelectorAll('.sz button').forEach(function(b){b.addEventListener('click',function(){var z=AIK_SZ(pd,b.textContent);if(z)cp.textContent=z.q+(z.d?', '+z.d:'')})});
if(!(pd&&pd.st)&&cp&&pd&&window.AIK_SZ){var z0=AIK_SZ(pd,(c.querySelector('.sz .on')||{}).textContent);if(z0)cp.textContent=z0.q+(z0.d?', '+z0.d:'')}
 [ph,h].forEach(function(el){if(!el)return;el.style.cursor='pointer';el.setAttribute('tabindex','0');el.setAttribute('role','button');el.setAttribute('aria-label','Подробнее: '+(h?h.textContent:''))
  el.addEventListener('keydown',function(e){if(e.key=='Enter'||e.key==' '){e.preventDefault();open(c)}})});
 c.addEventListener('click',function(e){if(e.target.closest('button,a,.qy,.qn'))return;open(c)})});
})();
