/* Просмотр товара в каталоге: галерея, описание, состав, размер, «В корзину». */
(function(){
var K=window.AIK_KAT||[],B=window.AIK_KAT_BASE||'';if(!K.length)return;
function src(u){return /^(https?:|\/|\.\.)/.test(u)?u:B+u}
var m=document.createElement('div');m.className='pv';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-hidden','true');
m.innerHTML='<div class="pv-bg" data-x></div><div class="pv-w" role="document"><button type="button" class="pv-x" data-x aria-label="Закрыть">×</button>'+
'<div class="pv-g"><div class="pv-m"><div class="pv-tr"></div><button type="button" class="pv-a pv-p" aria-label="Предыдущее фото">‹</button><button type="button" class="pv-a pv-n" aria-label="Следующее фото">›</button><span class="pv-c"></span></div><div class="pv-th"></div></div>'+
'<div class="pv-i"><small class="pv-cat"></small><h2 class="pv-h"></h2><p class="pv-d"></p><p class="pv-cm"><span>Состав</span><em></em></p><div class="pv-sz"></div><div class="pv-b"><b class="pv-pr"></b><button type="button" class="pv-add">В корзину</button></div></div></div>';
document.body.appendChild(m);
var tr=m.querySelector('.pv-tr'),th=m.querySelector('.pv-th'),cnt=m.querySelector('.pv-c'),szw=m.querySelector('.pv-sz'),pr=m.querySelector('.pv-pr'),ad=m.querySelector('.pv-add'),cmE=m.querySelector('.pv-cm em');
var cur=null,card=null,ix=0,n=0,k=1,sn='',last=null;
function go(i){if(!n)return;ix=(i+n)%n;tr.style.transform='translateX('+(-100*ix)+'%)';cnt.textContent=(ix+1)+' / '+n;th.querySelectorAll('button').forEach(function(b,j){b.classList.toggle('on',j==ix);b.setAttribute('aria-current',j==ix?'true':'false')})}
function price(){return Math.round(+card.dataset.p*k)}
function setSz(b){szw.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x==b)});k=+b.dataset.k||1;sn=b.textContent;pr.textContent=price()+' BYN';cmE.textContent=AIK_COMP(cur,sn)}
function open(c){var p=AIK_FIND({id:c.dataset.id,n:c.querySelector('h3').textContent});if(!p)return;cur=p;card=c;last=document.activeElement;
 var ph=p.ph.slice();n=ph.length;
 tr.innerHTML=ph.map(function(u,i){return '<div class="pv-s"><img src="'+src(u)+'" alt="'+p.n+', фото '+(i+1)+'"'+(i?' loading="lazy"':'')+' draggable="false"></div>'}).join('');
 th.innerHTML=ph.map(function(u,i){return '<button type="button" aria-label="Фото '+(i+1)+'"><img src="'+src(u)+'" alt="" loading="lazy"></button>'}).join('');
 th.querySelectorAll('button').forEach(function(b,i){b.onclick=function(){go(i)}});
 m.querySelector('.pv-cat').textContent=p.c;m.querySelector('.pv-h').textContent=p.n;m.querySelector('.pv-d').textContent=p.d;
 var cs=c.querySelectorAll('.sz button'),on=c.querySelector('.sz .on');
 szw.innerHTML='';szw.style.display=cs.length?'':'none';
 cs.forEach(function(b){var x=document.createElement('button');x.type='button';x.textContent=b.textContent;x.dataset.k=b.dataset.k;x.onclick=function(){setSz(x)};szw.appendChild(x);if(b==on)setSz(x)});
 if(!cs.length){k=1;sn='';pr.textContent=price()+' BYN';cmE.textContent=AIK_COMP(p,'')}
 else if(!szw.querySelector('.on'))setSz(szw.firstChild);
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
ad.onclick=function(){if(!window.AIK||!AIK.add)return;var it={id:cur.id,n:cur.n,s:sn,p:price(),i:card.querySelector('img').getAttribute('src'),q:1,c:cur.c};var cm=AIK_COMP(cur,sn);if(cm)it.m=cm;AIK.add(it);
 var cs=card.querySelectorAll('.sz button');cs.forEach(function(b){if(b.textContent==sn&&!b.classList.contains('on'))b.click()});
 ad.textContent='Добавлено ✓';ad.classList.add('ok');setTimeout(function(){ad.textContent='В корзину';ad.classList.remove('ok')},1400)};
document.querySelectorAll('[data-card]').forEach(function(c){var ph=c.querySelector('.ph'),h=c.querySelector('h3');
 [ph,h].forEach(function(el){if(!el)return;el.style.cursor='pointer';el.setAttribute('tabindex','0');el.setAttribute('role','button');el.setAttribute('aria-label','Подробнее: '+(h?h.textContent:''))
  el.addEventListener('keydown',function(e){if(e.key=='Enter'||e.key==' '){e.preventDefault();open(c)}})});
 c.addEventListener('click',function(e){if(e.target.closest('button,a'))return;open(c)})});
})();
