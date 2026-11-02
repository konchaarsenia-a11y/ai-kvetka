/* Ползунок количества с метками-шаблонами (AI KVETKA). Плавный притяг к меткам, анимация заливки, цифры и цены. */
(function(){
if(window.AIK_QSL)return;
var css='.qsl{position:relative;padding:30px 12px 24px;user-select:none;-webkit-user-select:none;touch-action:none;--a:#6b6b3f;--t:#d8cfbf}'+
'.qsl-tr{position:relative;height:4px;border-radius:4px;background:var(--t);cursor:pointer}'+
'.qsl-f{position:absolute;left:0;top:0;bottom:0;border-radius:4px;background:var(--a);transition:width .45s cubic-bezier(.2,.8,.2,1)}'+
'.qsl-k{position:absolute;top:50%;width:22px;height:22px;margin:-11px 0 0 -11px;border-radius:50%;background:#fff;border:2px solid var(--a);box-shadow:0 2px 8px rgba(0,0,0,.15);transition:left .45s cubic-bezier(.2,.8,.2,1),transform .2s;cursor:grab;outline:none}'+
'.qsl-k:focus-visible{box-shadow:0 0 0 4px rgba(107,107,63,.25)}'+
'.qsl.dr .qsl-f,.qsl.dr .qsl-k{transition:none}.qsl.dr .qsl-k{transform:scale(1.15);cursor:grabbing}'+
'.qsl-b{position:absolute;bottom:100%;left:50%;margin-bottom:8px;transform:translateX(-50%);background:var(--a);color:#fff;font-size:12px;line-height:1;padding:5px 8px;border-radius:12px;white-space:nowrap;pointer-events:none}'+
'.qsl-b:after{content:"";position:absolute;left:50%;top:100%;margin-left:-4px;border:4px solid transparent;border-top-color:var(--a)}'+
'.qsl-m{position:absolute;top:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:var(--t);border:2px solid #fff;transition:background .3s}.qsl-m.in{background:var(--a)}'+
'.qsl .qsl-l{border:0;background:none;min-width:0;height:auto;line-height:1.2;border-radius:0}.qsl-l{position:absolute;top:14px;transform:translateX(-50%);font-size:11px;opacity:.6;cursor:pointer;transition:opacity .3s,transform .3s;background:none;border:0;padding:2px 4px;color:inherit}.qsl-l.on{opacity:1;font-weight:700;transform:translateX(-50%) scale(1.12)}'+
'.qsl.pop .qsl-b{animation:qslp .35s ease}@keyframes qslp{40%{transform:translateX(-50%) scale(1.15)}}'+
'@media(prefers-reduced-motion:reduce){.qsl *{transition:none!important;animation:none!important}}';
var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
/* o: {marks:[9,15,25,51,101], value, step:2, max, unit:'шт.', onChange(v,final)} */
window.AIK_QSL=function(o){
 var M=o.marks,L=M.length,stp=o.step||2,mx=o.max||M[L-1],v=o.value||M[0],el=document.createElement('div');el.className='qsl';
 el.innerHTML='<div class="qsl-tr"><div class="qsl-f"></div>'+M.map(function(x,i){return '<i class="qsl-m" style="left:'+(i/(L-1)*100)+'%"></i><button type="button" class="qsl-l" tabindex="-1" style="left:'+(i/(L-1)*100)+'%">'+x+'</button>'}).join('')+'<div class="qsl-k" role="slider" tabindex="0" aria-label="'+(o.label||'Количество')+'"><span class="qsl-b"></span></div></div>';
 var tr=el.firstChild,f=tr.querySelector('.qsl-f'),k=tr.querySelector('.qsl-k'),bb=k.firstChild,ms=tr.querySelectorAll('.qsl-m'),ls=tr.querySelectorAll('.qsl-l');
 k.setAttribute('aria-valuemin',1);k.setAttribute('aria-valuemax',mx);
 function pos(x){if(x<=M[0])return 0;if(x>=M[L-1])return 1;for(var i=0;i<L-1;i++)if(x<=M[i+1])return (i+(x-M[i])/(M[i+1]-M[i]))/(L-1);return 1}
 function val(p){p=Math.max(0,Math.min(1,p))*(L-1);var i=Math.min(L-2,Math.floor(p));return M[i]+(p-i)*(M[i+1]-M[i])}
 function odd(x){var b=M[0]%stp;return Math.max(1,Math.round((x-b)/stp)*stp+b)}
 function draw(){var p=pos(v)*100;f.style.width=p+'%';k.style.left=p+'%';bb.textContent=v+' '+(o.unit||'шт.');k.setAttribute('aria-valuenow',v);k.setAttribute('aria-valuetext',v+' '+(o.unit||'шт.'));
  for(var i=0;i<L;i++){ms[i].classList.toggle('in',M[i]<=v);ls[i].classList.toggle('on',M[i]==v)}}
 function set(x,fin,quiet){x=Math.max(1,Math.min(mx,Math.round(x)));var ch=x!=v;v=x;draw();if(ch&&!quiet){el.classList.remove('pop');void el.offsetWidth;el.classList.add('pop')}if(o.onChange&&!quiet)o.onChange(v,fin)}
 function fromX(cx){var r=tr.getBoundingClientRect();if(!r.width)return v;var p=(cx-r.left)/r.width,seg=1/(L-1);
  for(var i=0;i<L;i++){if(Math.abs(p-i*seg)*r.width<14)return M[i]}/* притяг к метке */
  return odd(val(p))}
 var drag=false;
 el.addEventListener('pointerdown',function(e){if(e.button)return;var l=e.target.closest('.qsl-l');if(l){set(+l.textContent,true);return}
  drag=true;el.classList.add('dr');try{el.setPointerCapture(e.pointerId)}catch(_){}set(fromX(e.clientX));k.focus({preventScroll:true});e.preventDefault()});
 el.addEventListener('pointermove',function(e){if(drag)set(fromX(e.clientX))});
 function up(e){if(!drag)return;drag=false;el.classList.remove('dr');
  var r=tr.getBoundingClientRect(),p=pos(v),seg=1/(L-1),i=Math.round(p/seg);if(Math.abs(p-i*seg)*r.width<26&&M[i]!=v)set(M[i],true);else if(o.onChange)o.onChange(v,true)}
 el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
 k.addEventListener('keydown',function(e){var d={ArrowRight:stp,ArrowUp:stp,ArrowLeft:-stp,ArrowDown:-stp}[e.key],i;
  if(d){set(v+d,true);e.preventDefault()}
  else if(e.key=='PageUp'){for(i=0;i<L&&M[i]<=v;i++);if(i<L)set(M[i],true);e.preventDefault()}
  else if(e.key=='PageDown'){for(i=L-1;i>=0&&M[i]>=v;i--);if(i>=0)set(M[i],true);e.preventDefault()}});
 draw();
 var api={el:el,set:function(x){set(x,true,true)},get:function(){return v},color:function(a,t){if(a)el.style.setProperty('--a',a);if(t)el.style.setProperty('--t',t)},
  /* для поля ввода количества (каталог): установить с вызовом onChange, чтобы цена и корзина пересчитались */
  pick:function(x){set(x,true)},max:mx};el._aik=api;return api;
};
/* Плавная смена числа (цена/количество). */
window.AIK_TWEEN=function(e,to,fmt){var fr=e._v==null?to:e._v,t0=performance.now(),D=380;e._v=to;cancelAnimationFrame(e._r);
 if(fr==to||matchMedia('(prefers-reduced-motion:reduce)').matches){e.textContent=fmt(to);return}
 (function s(t){var p=Math.min(1,(t-t0)/D),q=1-Math.pow(1-p,3);e.textContent=fmt(fr+(to-fr)*q);if(p<1)e._r=requestAnimationFrame(s)})(t0)};
/* Главная, «Цветок недели»: ползунок количества. ДЕМО: цена за стебель = 159 / 9 из текущей цены недели; согласовать с клиентом. */
document.addEventListener('DOMContentLoaded',function(){
 var root=document.getElementById('wk')||document;var pe=root.querySelector('.kp')||root.querySelector('.wk-p');if(!pe||pe.dataset.qsl)return;pe.dataset.qsl=1;
 var U=159/9,N=9,kp=pe.classList.contains('kp'),bE=kp?pe.querySelector('b'):null,sE=kp?pe.querySelector('span'):null;
 function money(x){return String(Math.round(x*10)/10).replace('.',',')}
 function show(fin){var t=Math.round(U*N);if(kp){AIK_TWEEN(bE,t,function(x){return Math.round(x)+' BYN'});sE.textContent='за '+N+' шт.'}else AIK_TWEEN(pe,t,function(x){return Math.round(x)+' BYN за '+N+' шт.'});mn.disabled=N<=1}
 var w=document.createElement('div');w.className='wkq';
 var s=AIK_QSL({marks:[9,15,25,51],value:N,label:'Количество пионов',onChange:function(v){N=v;show()}});
 var ctl=document.createElement('div');ctl.className='wkq-c';ctl.innerHTML='<button type="button" aria-label="Меньше">−</button><span>Точно: по '+money(U)+' BYN за стебель</span><button type="button" aria-label="Больше">+</button>';
 var mn=ctl.children[0];mn.onclick=function(){N=Math.max(1,N-2);s.set(N);show()};ctl.children[2].onclick=function(){N=Math.min(101,N+2);s.set(N);show()};
 w.appendChild(s.el);w.appendChild(ctl);pe.parentNode.insertBefore(w,pe.nextSibling);
 var bt=(pe.parentNode.querySelector('.kb,.btn'));if(bt){var a=getComputedStyle(bt).backgroundColor;s.color(a);ctl.style.setProperty('--a',a)}
 var c2=document.createElement('style');c2.textContent='.wkq{max-width:360px;margin:-6px 0 22px}.kp+.wkq{margin-left:auto;margin-right:auto}.wkq-c{display:flex;align-items:center;gap:10px;font-size:12px;opacity:.85;justify-content:center}.wkq-c button{width:30px;height:30px;border:1px solid var(--a,#6b6b3f);background:none;border-radius:50%;font-size:16px;line-height:1;color:inherit;padding:0}.wkq-c button:disabled{opacity:.35}';document.head.appendChild(c2);
 if(!kp)pe.style.marginBottom='14px';show()});
})();
