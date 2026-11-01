/* AI KVETKA: «зарастание». После ~3 с бездействия веточки по краям дорастают: побеги, листья, пионы, лёгкое покачивание.
   Стадия считается по Date.now (идёт и в свёрнутой вкладке), анимируются только transform/opacity, при активности всё осыпается пыльцой. */
(function(){
if(window.AIK_GROW)return;window.AIK_GROW=1;
/* Адаптация по мощности. Уровень: 0 полный, 1 минимальный (без лоз и пыльцы, только лёгкие веточки и плавные появления), 2 без анимаций.
   FPS меряется по rAF окнами ~1 с: на уровне 0 два окна подряд <40 fps -> 1; на уровне 1 два окна подряд <30 fps -> 2.
   Окна с длинным кадром (>250 мс: генерация лоз, переключение вкладки) не считаются, нужно 3 плохих окна подряд.
   Уровень хранится в sessionStorage (aik-lv = 'уровень|время') 15 минут. Save-Data -> 2 (не сохраняется). Класс на <html>: perf-min / perf-off. */
var DE=document.documentElement,LV=0,SK='aik-lv';
try{sessionStorage.removeItem('aik-perf');var sv=(sessionStorage.getItem(SK)||'').split('|');if(Date.now()-(+sv[1]||0)<9e5)LV=Math.min(2,+sv[0]||0)}catch(e){}
var CN=navigator.connection;if(CN&&CN.saveData)LV=2;
var pst=document.createElement('style');pst.textContent='html.perf-min #aik-garden,html.perf-min #aik-vines,html.perf-min #aik-pollen,html.perf-off #aik-garden,html.perf-off #aik-vines,html.perf-off #aik-pollen{display:none!important}html.perf-min .sway,html.perf-min .sway img{animation:none!important}html.perf-off *,html.perf-off *::before,html.perf-off *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}';
document.head.appendChild(pst);
function papply(){DE.classList.toggle('perf-min',LV==1);DE.classList.toggle('perf-off',LV==2);window.AIK_PERF=LV}
function setLV(v){if(v<=LV)return;LV=v;try{sessionStorage.setItem(SK,v+'|'+Date.now())}catch(e){}papply();
 if(raf){clearTimeout(raf);cancelAnimationFrame(raf);raf=0}if(typeof dense!='undefined'&&dense){dense.lay.remove();dense=null}if(pc){pc.remove();pc=null;parts=[]}
 if(LV==1&&!STRONG)kick()}
papply();
if(!window.requestAnimationFrame||matchMedia('(prefers-reduced-motion:reduce)').matches||LV>=2)return;
var fw={t0:0,n:0,bad:0,lt:0,lg:0};
function meter(ts){if(LV>=2)return;
 if(document.hidden){fw.t0=0;fw.bad=0}
 else if(!fw.t0){fw.t0=ts;fw.n=0;fw.lg=0}
 else{fw.n++;if(fw.lt&&ts-fw.lt>250)fw.lg=1;var dt=ts-fw.t0;if(dt>=1000){var fps=fw.n*1000/dt;window.AIK_FPS=Math.round(fps);fw.t0=ts;fw.n=0;
  if(fw.lg||dt>4000){}else if(fps<(LV?24:35)){if(++fw.bad>=3){fw.bad=0;setLV(LV+1)}}else fw.bad=0;fw.lg=0}}
 fw.lt=document.hidden?0:ts;
 requestAnimationFrame(meter)}
function mstart(){setTimeout(function(){requestAnimationFrame(meter)},3000)}
if(document.readyState=='complete')mstart();else addEventListener('load',mstart);
var q=new URLSearchParams(location.search),IDLE=+q.get('growidle')||50000,FULL=+q.get('growms')||75000;
var STRONG=q.get('grow')!='light'&&LV==0;
var weak=LV==1||(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2);
var NS='http://www.w3.org/2000/svg',last=Date.now(),shown=0,decay=null,els=[],sw=[],vis=new Set(),raf=0,parts=[],pc=null,R=Math.random;
function mk(t,a,p){var e=document.createElementNS(NS,t);for(var k in a)e.setAttribute(k,a[k]);if(p)p.appendChild(e);return e}
function sr(s){return function(){s=(s*9301+49297)%233280;return s/233280}}
var st=document.createElement('style');st.textContent='.tw .gw path{stroke-dasharray:none!important;stroke-dashoffset:0!important;fill-opacity:1!important;transition:none!important}.gw .gs{fill:none;stroke:var(--tw,#8a967a);stroke-width:.9;stroke-linecap:round}.gw .gl{fill:rgba(138,150,122,.22);stroke:var(--tw,#8a967a);stroke-width:.7}.gw .gp{fill:rgba(240,214,226,.92);stroke:#c79bb0;stroke-width:.6}.gw .gq{fill:#f8e7ee;stroke:#c79bb0;stroke-width:.5}.gw .gc{fill:#e9c9a0}.gw{will-change:opacity}#aik-pollen{position:fixed;inset:0;pointer-events:none;z-index:50;overflow:hidden}#aik-pollen i{position:absolute;left:0;top:0;width:6px;height:6px;border-radius:50%;will-change:transform,opacity}';
document.head.appendChild(st);
function leaf(p,x,y,a,L){var g=mk('g',{},p);mk('path',{'class':'gl',d:'M0 0Q'+L/2+' '+(-L*.38)+' '+L+' 0Q'+L/2+' '+(L*.38)+' 0 0Z'},g);return {g:g,x:x,y:y,a:a}}
function peony(p,x,y,r){var g=mk('g',{},p),o=mk('g',{},g),i=mk('g',{},g),k;
 for(k=0;k<6;k++)mk('ellipse',{'class':'gp',cx:0,cy:-r*.55,rx:r*.48,ry:r*.62,transform:'rotate('+k*60+')'},o);
 for(k=0;k<5;k++)mk('ellipse',{'class':'gq',cx:0,cy:-r*.3,rx:r*.3,ry:r*.42,transform:'rotate('+(k*72+30)+')'},i);
 mk('circle',{'class':'gc',r:r*.16},g);return {g:g,o:o,i:i,x:x,y:y}}
function build(tw,n){
 var stem=tw.querySelector('path.s');if(!stem)return;var gp=stem.parentNode,L=stem.getTotalLength(),rnd=sr(n*97+13);
 var root=mk('g',{'class':'gw'},gp),cnt=weak?2:(STRONG?6:4),SC=STRONG?1.5:1;
 for(var j=0;j<cnt;j++){
  var f=.15+.75*(j+rnd()*.6)/cnt,pt=stem.getPointAtLength(L*(1-f)),side=j%2?1:-1,ang=-90+side*(18+rnd()*22),len=(34+rnd()*34)*SC;
  var sg=mk('g',{},root),inner=mk('g',{},sg),bend=side*(6+rnd()*6);
  mk('path',{'class':'gs',d:'M0 0Q'+(len*.5)+' '+bend+' '+len+' 0'},inner);
  var t0=.04+j*.11+rnd()*.05,sh={g:sg,in:inner,x:pt.x,y:pt.y,a:ang,t:t0,d:.26,ph:rnd()*6,k:'s'};els.push(sh);sw.push(sh);
  for(var m=0;m<(weak?2:4);m++){var u=.3+m*.17,lf=leaf(inner,len*u,bend*u*(1-u)*1.6,(m%2?1:-1)*(40+rnd()*15),(7+rnd()*4)*SC);
   lf.t=t0+.12+m*.05;lf.d=.14;lf.k='l';els.push(lf)}
  if(j%2==0||!weak){var pe=peony(inner,len,0,(5+rnd()*3.5)*SC);pe.t=.5+j*.08+rnd()*.06;pe.d=.22;pe.k='p';els.push(pe)}
 }
 tw._gw=root;
}
function cl(v){return v<0?0:v>1?1:v}
function ease(v){return 1-Math.pow(1-v,3)}
function draw(g,now){var tm=now/1000;
 for(var i=0;i<els.length;i++){var e=els[i],p=ease(cl((g-e.t)/e.d)),key=Math.round(p*400);
  if(e.k=='s'){var s=0;if(!weak&&p>0)s=Math.sin(tm*.9+e.ph)*3*p;e.g.setAttribute('transform','translate('+e.x+' '+e.y+') rotate('+(e.a+s)+')');
   if(e._p!==key){e._p=key;e.in.setAttribute('transform','scale('+(p||.0001)+')');e.g.style.opacity=p?1:0}continue}
  if(e._p===key)continue;e._p=key;
  if(e.k=='g'){e.g.setAttribute('transform','translate('+e.x+' '+e.y+') rotate('+e.a+') scale('+(p||.0001)+')');e.g.style.opacity=p?1:0;continue}
  if(e.k=='l')e.g.setAttribute('transform','translate('+e.x+' '+e.y+') rotate('+e.a+') scale('+(p||.0001)+')');
  else{e.g.setAttribute('transform','translate('+e.x+' '+e.y+') scale('+(p||.0001)+')');e.o.setAttribute('transform','rotate('+(-40*(1-p))+') scale('+(.6+.4*p)+')');e.i.setAttribute('transform','rotate('+(30*(1-p))+') scale('+(.3+.7*p)+')');e.g.style.opacity=p?1:0}}}
function stage(now){return cl((now-last-IDLE)/FULL)}
function loop(){raf=0;if(document.hidden||LV>=2)return;var now=Date.now(),g;
 if(decay){var k=cl((now-decay.t)/450);g=decay.g*(1-ease(k));if(k>=1)decay=null}else g=stage(now);
 if(Math.abs(g-shown)>.0005||(g>0&&!weak))draw(g,now);shown=g;
 var busy=pollen(now);
 if(!decay&&!busy&&g==0){raf=setTimeout(function(){raf=0;kick()},Math.max(16,last+IDLE-now+16));return}
 if(decay||busy||(g>0&&!weak)||g<1)raf=weak?setTimeout(loop,250):requestAnimationFrame(loop)}
function kick(){if(!raf)raf=weak?setTimeout(loop,250):requestAnimationFrame(loop)}
function pollen(now){if(!parts.length)return false;var alive=0;
 for(var i=0;i<parts.length;i++){var p=parts[i],t=(now-p.t0)/p.life;if(t>=1){if(p.el.parentNode)p.el.remove();continue}alive++;
  var x=p.x+p.vx*t*p.life/16,y=p.y+p.vy*t*p.life/16+40*t*t;p.el.style.transform='translate('+x+'px,'+y+'px) scale('+(1-t*.5)+')';p.el.style.opacity=(1-t)*.9}
 if(!alive){parts=[];return false}return true}
function burst(){if(weak||!pc&&!(pc=document.body.appendChild(Object.assign(document.createElement('div'),{id:'aik-pollen'}))))return;
 var src=[],vh=innerHeight,now=Date.now();
 els.forEach(function(e){if(e.k=='s'||!(e._p>40))return;var r=e.g.getBoundingClientRect();if(r.bottom>0&&r.top<vh)src.push(r)});
 if(!src.length)return;var N=Math.min(60,Math.max(24,src.length*3)),C=['#e3a9c4','#b9a5e3','#e8c77a','#a9bb8f','#f0c8d8'];
 for(var i=0;i<N;i++){var r=src[i%src.length],el=document.createElement('i'),a=R()*Math.PI*2,v=.6+R()*1.8;
  el.style.background=C[i%C.length];pc.appendChild(el);
  parts.push({el:el,x:r.left+r.width*R(),y:r.top+r.height*R(),vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.2,t0:now,life:900+R()*700})}}
function act(){var now=Date.now();if(!document.hidden){var g=decay?shown:stage(now);if(g>.02&&!decay){decay={g:g,t:now};burst()}}last=now;kick()}

/* Сильный режим: лозы на углах блоков, карточек, фото и у заголовков. Держатся краёв (по getBoundingClientRect), без pointer-events. */
var lay=null,cel=[];
function vine(svg,ox,oy,sx,sy,a,b,rnd,t0,big,np){
 var P=[],N=weak?8:16,i,off=5;
 for(i=0;i<=N;i++){var u=i/N,x,y,L=a+b,d=u*L;
  if(d<a){x=a-d;y=-off}else{x=-off;y=d-a}
  var w=Math.sin(u*Math.PI*3+rnd()*.5)*3;if(d<a)y+=w;else x+=w;
  if(Math.abs(d-a)<L/N*1.2){x-=4;y-=4}
  P.push([ox+sx*x,oy+sy*y])}
 var g=mk('g',{},svg),k=0;
 for(i=0;i<N;i++){var A=P[i],B=P[i+1],dx=B[0]-A[0],dy=B[1]-A[1],len=Math.hypot(dx,dy),an=Math.atan2(dy,dx)*180/Math.PI;
  var sg=mk('g',{},g);mk('path',{'class':'gs',d:'M0 0Q'+len/2+' '+(rnd()*4-2)+' '+(len+.6)+' 0','stroke-width':big?1.8:1.4},sg);
  var tt=t0+i*(.32/N);cel.push({g:sg,x:A[0],y:A[1],a:an,t:tt,d:.5/N+.02,k:'g'});
  if(i%2==1||!weak){var side=(k++%2?1:-1),lf=leaf(g,0,0,0,(12+rnd()*8)*(big?1.25:1));lf.x=A[0];lf.y=A[1];lf.a=an+side*(50+rnd()*25);lf.t=tt+.06;lf.d=.12;lf.k='l';cel.push(lf)}
 }
 var ci=Math.round(N*a/(a+b)),pr=np?[ci]:[];
 pr.forEach(function(j,n){var Q=P[Math.min(N,j)],pe=peony(g,0,0,((n?11:16)+rnd()*6)*(big?1.25:1));pe.x=Q[0];pe.y=Q[1];pe.t=.48+n*.1+rnd()*.1+t0*.3;pe.d=.22;pe.k='p';cel.push(pe)});
 if(!weak)for(i=2;i<N;i+=5){var Q2=P[i],bd=mk('g',{},g);mk('circle',{'class':'gp',r:3.2},bd);cel.push({g:bd,x:Q2[0]+sx*3,y:Q2[1]-sy*3,a:0,t:t0+.3+i*.02,d:.1,k:'l'})}
}
function buildStrong(){
 if(lay)lay.remove();els=els.filter(function(e){return cel.indexOf(e)<0});cel=[];
 var de=document.documentElement,W=de.scrollWidth,H=de.scrollHeight,sy=scrollY,sx=scrollX,n=0;
 lay=document.createElement('div');lay.id='aik-vines';lay.setAttribute('aria-hidden','true');
 lay.style.cssText='position:absolute;left:0;top:0;width:'+W+'px;height:'+H+'px;pointer-events:none;overflow:hidden;z-index:5';
 var svg=mk('svg',{width:W,height:H,'class':'gw tw',style:'position:absolute;left:0;top:0;overflow:visible'});lay.appendChild(svg);
 var T=[['.lf',['tr','bl'],1,1],['.rvs,.rv-w,#reviews',['tl'],0,1]];
 T.forEach(function(r){var L=document.querySelectorAll(r[0]);if(weak&&L.length>3)L=[].slice.call(L,0,3);
  [].forEach.call(L,function(el,ix){var b=el.getBoundingClientRect();if(!b.width||!b.height)return;
   var cs=r[1].length==2&&r[0]=='.cc'?[r[1][ix%2]]:r[1];
   var ci=0;cs.forEach(function(c){var rnd=sr(++n*131+7),t0=.02+rnd()*.4,X=b.left+sx,Y=b.top+sy,mw=Math.min(b.width*.7,260),mh=Math.min(b.height*.75,240);
    if(c=='side'){vine(svg,X-14,Y-6,1,1,0,b.height+30,rnd,t0,0);return}
    if(c=='tl')vine(svg,X,Y,1,1,mw,mh,rnd,t0,r[2],r[3]&&(ci++%2==0));
    if(c=='tr')vine(svg,X+b.width,Y,-1,1,mw,mh,rnd,t0,r[2],r[3]&&(ci++%2==0));
    if(c=='bl')vine(svg,X,Y+b.height,1,-1,mw,mh,rnd,t0,r[2],r[3]&&(ci++%2==0));
    if(c=='br')vine(svg,X+b.width,Y+b.height,-1,-1,mw,mh,rnd,t0,r[2])})})});
 document.body.appendChild(lay);els=els.concat(cel);cel.forEach(function(e){e._p=-1});draw(shown,Date.now())}

/* «Старый сад» (только ?grow=strong): в бездействии ветвящиеся лозы с листьями и усиками тянутся от краёв и углов блоков поверх экрана (fixed, pointer-events:none) закрывает фото и карточки.
   При действии густое осыпается (листья и лепестки падают с вращением и тают), остаются базовые лианы по краям и углам. */
var T0=Date.now(),dense=null,GCOL=['#8fa47d','#7d946c','#a3b48f','#6f8a63','#b2c09c','#98ab84'];
function baseG(now){return cl((now-T0)/3500)}
var gst=document.createElement('style');gst.textContent='#aik-garden{position:absolute;left:0;top:0;pointer-events:none;z-index:6;overflow:hidden}#aik-garden svg{position:absolute;left:0;top:0;overflow:visible}#aik-garden .dn{transform:scale(0);opacity:0;transition:transform 1.1s cubic-bezier(.2,.8,.2,1),opacity .6s ease}#aik-garden .dn.on{transform:scale(1);opacity:1}#aik-garden.nt .dn{transition:none!important}#aik-garden.fall .dn:not(.fl){opacity:0!important;transition:opacity .5s ease!important}#aik-garden .iv{stroke:#5d7350;stroke-width:.6}#aik-garden .ivv{fill:none;stroke:#5d7350;stroke-width:.5;opacity:.7}#aik-garden .st{fill:none;stroke:#6d7f5c;stroke-linecap:round}#aik-garden .vl{stroke:#5d7350;stroke-width:.5}#aik-garden .td{fill:none;stroke:#7d8f68;stroke-width:.9;stroke-linecap:round}#aik-garden .dn[data-k=s]{transition:transform .45s ease-out,opacity .2s}#aik-garden .bp{stroke:#b58aa3;stroke-width:.5}';
if(STRONG)document.head.appendChild(gst);
function ivy(p,L,col){mk('path',{'class':'iv',fill:col,d:'M0 0C'+L*.15+' '+(-L*.55)+' '+L*.62+' '+(-L*.62)+' '+L*.7+' '+(-L*.2)+'C'+L*.85+' '+(-L*.25)+' '+L*1.05+' '+(-L*.1)+' '+L+' 0C'+L*1.05+' '+L*.1+' '+L*.85+' '+L*.25+' '+L*.7+' '+L*.2+'C'+L*.62+' '+L*.62+' '+L*.15+' '+L*.55+' 0 0Z'},p);mk('path',{'class':'ivv',d:'M0 0L'+L*.85+' 0M'+L*.35+' 0L'+L*.6+' '+(-L*.3)+'M'+L*.35+' 0L'+L*.6+' '+L*.3},p)}
function blossom(p,r,big){var c=big?['#f3d3e0','#e9c0d3']:(R()<.5?['#e2d6f2','#cdbbe8']:['#f6e0e8','#ecc6d6']),k;
 if(big){var pe=peony(p,0,0,r);return}
 for(k=0;k<5;k++)mk('ellipse',{'class':'bp',fill:c[k%2],cx:0,cy:-r*.55,rx:r*.42,ry:r*.6,transform:'rotate('+k*72+')'},p);mk('circle',{fill:'#e9c9a0',r:r*.22},p)}
function dn(svg,x,y,a,t,k){var o=mk('g',{transform:'translate('+x.toFixed(1)+' '+y.toFixed(1)+') rotate('+a.toFixed(1)+')'},svg),i=mk('g',{'class':'dn','data-k':k},o);var e={i:i,x:x,y:y,a:a,t:t,k:k};dense.e.push(e);return i}
function vleaf(p,L,col){mk('path',{'class':'vl',fill:col,d:'M0 0C'+L*.28+' '+(-L*.36)+' '+L*.72+' '+(-L*.32)+' '+L+' 0C'+L*.72+' '+L*.3+' '+L*.28+' '+L*.34+' 0 0Z'},p);mk('path',{'class':'ivv',d:'M'+L*.05+' 0Q'+L*.5+' '+(-L*.04)+' '+L*.9+' 0'},p)}
function tendril(p,s){var d='M0 0C'+6*s+' '+(-1*s)+' '+11*s+' '+(-6*s)+' '+9*s+' '+(-11*s)+'C'+7*s+' '+(-15*s)+' '+2*s+' '+(-13*s)+' '+4*s+' '+(-9*s)+'C'+5*s+' '+(-7*s)+' '+7*s+' '+(-8*s)+' '+6.5*s+' '+(-10*s);mk('path',{'class':'td',d:d},p)}
/* лозы по всей странице: старты равномерно по сетке (края, углы блоков, секции сверху донизу), каждая лоза тянется в своём направлении от старта, без общего центра */
function genDense(){
 var de=document.documentElement,W=de.clientWidth,H=Math.max(de.scrollHeight,document.body.scrollHeight),VH=innerHeight,sy=scrollY,sx=scrollX,lay=document.createElement('div');lay.id='aik-garden';lay.setAttribute('aria-hidden','true');lay.style.width=W+'px';lay.style.height=H+'px';
 var svg=mk('svg',{width:W,height:H,viewBox:'0 0 '+W+' '+H,'class':'gw'},lay);dense={lay:lay,e:[],n:0};
 var Y0=Math.max(0,sy-30),Y1=Math.min(H,sy+VH+30),CS=weak?600:320,LIM=weak?500:2600,cats=[],cnt=0,corners=[],NAR=W<700,BD=NAR?Math.min(26,W*.07):0,LS=NAR?.6:1;if(NAR)LIM=weak?300:900;
 document.querySelectorAll('img,.cc,.wks,.hm-a,.ftg,.lf,#onas .im,.rvs,section,footer,.sh').forEach(function(el){var r=el.getBoundingClientRect();if(r.width<60||r.height<40)return;
  var x0=r.left+sx,y0=r.top+sy,x1=r.right+sx,y1=r.bottom+sy;corners.push([x0,y0,1,1],[x1,y0,-1,1],[x0,y1,1,-1],[x1,y1,-1,-1])});
 var ccr=null;document.querySelectorAll('.cc').forEach(function(el){var r=el.getBoundingClientRect();if(!r.width)return;var a=[r.left+sx-12,r.top+sy-12,r.right+sx+12,r.bottom+sy+12];ccr=ccr?[Math.min(ccr[0],a[0]),Math.min(ccr[1],a[1]),Math.max(ccr[2],a[2]),Math.max(ccr[3],a[3])]:a});
 var exr=ccr?[ccr]:[];document.querySelectorAll('.hm-a,#onas .im,img').forEach(function(el){var r=el.getBoundingClientRect();if(r.width<120||r.height<120||el.closest('.cc'))return;exr.push([r.left+sx-12,r.top+sy-12,r.right+sx+12,r.bottom+sy+12])});
 /* блок «Цветок недели»: без лоз и цветов по всей ширине */
 var nz=[];document.querySelectorAll('.wks').forEach(function(el){var q=(el.closest('section')||el).getBoundingClientRect();if(q.height)nz.push([q.top+sy-24,q.bottom+sy+24])});
 function inNZ(y){for(var i=0;i<nz.length;i++)if(y>nz[i][0]&&y<nz[i][1])return true;return false}
 function inCC(x,y){for(var i=0;i<exr.length;i++){var e=exr[i];if(x>e[0]&&x<e[2]&&y>e[1]&&y<e[3])return true}return false}
 var cc0=document.querySelector('.cc'),cs0=cc0&&(cc0.closest('section')||cc0.parentNode);if(cs0){var q0=cs0.getBoundingClientRect();cats.push([q0.left+sx,q0.top+sy,q0.right+sx,q0.bottom+sy])}
 function vine(x,y,ang,t,N,sw,dep){var dt=.6/(weak?22:30),side=1,wa=ang,wpt=null;
  function nw(){wa+=(R()-.5)*1.6;var d=110+R()*170;wpt=[x+Math.cos(wa)*d,y+Math.sin(wa)*d];if(inCC(wpt[0],wpt[1])){wa+=Math.PI;wpt=[x+Math.cos(wa)*d,y+Math.sin(wa)*d]}
   if(NAR){wpt[0]=x<W/2?R()*BD:W-R()*BD}
   else if(wpt[0]<20||wpt[0]>W-20){wa=Math.PI-wa;wpt[0]=Math.min(W-20,Math.max(20,wpt[0]))}if(wpt[1]<Y0+20||wpt[1]>Y1-20){wa=-wa;wpt[1]=Math.min(Y1-20,Math.max(Y0+20,wpt[1]))}}
  nw();
  for(var i=0;i<N&&cnt<LIM*1.3;i++){
   var want=Math.atan2(wpt[1]-y,wpt[0]-x),df=Math.atan2(Math.sin(want-ang),Math.cos(want-ang));
   ang+=Math.max(-.3,Math.min(.3,df*.3))+(R()-.5)*.35+.18*Math.sin(i*.45+dep);
   if(Math.hypot(wpt[0]-x,wpt[1]-y)<35)nw();
   var st=(13+R()*5)*LS,nx=x+Math.cos(ang)*st,ny=y+Math.sin(ang)*st;
   if(NAR&&nx>BD&&nx<W-BD){ang=Math.PI-ang;nx=x+Math.cos(ang)*st;if(nx>BD+6&&nx<W-BD-6)return}
   if(inNZ(y)||inNZ(ny))return;
   var ad=ang*180/Math.PI;if(!NAR&&(inCC(x,y)||inCC(nx,ny)))return;
   mk('path',{'class':'st',d:'M0 0Q'+(st/2).toFixed(1)+' '+((R()-.5)*4).toFixed(1)+' '+(st+1).toFixed(1)+' 0','stroke-width':sw.toFixed(2)},dn(svg,x,y,ad,t,'s'));cnt++;
   side=-side;var L=((dep?17:22)+R()*(dep?10:14))*LS;
   if(R()<.9){vleaf(dn(svg,x+Math.cos(ang)*st*.6,y+Math.sin(ang)*st*.6,ad+side*(40+R()*35),t+dt*1.5,'l'),L,GCOL[(R()*GCOL.length)|0]);cnt++}
   if(!weak&&R()<.5){vleaf(dn(svg,x+Math.cos(ang)*st*.3,y+Math.sin(ang)*st*.3,ad-side*(45+R()*40),t+dt*2.2,'l'),L*(.75+R()*.3),GCOL[(R()*GCOL.length)|0]);cnt++}
   if(!weak&&R()<.12){var tg2=dn(svg,nx,ny,ad-side*(30+R()*40),t+dt*2,'d');tendril(side<0?mk('g',{transform:'scale(1,-1)'},tg2):tg2,.7+R()*.6);cnt++}
   if(R()<(NAR?.05:dep?.008:.006)&&!cats.some(function(c){return nx>c[0]&&nx<c[2]&&ny>c[1]&&ny<c[3]})){blossom(dn(svg,nx,ny,R()*360,t+dt*3,'f'),(5+R()*4)*(NAR?.8:1),R()<.25);cnt++}
   if(dep<2&&i>3&&R()<(dep?.08:.13))vine(nx,ny,ang+side*(.7+R()*.6),t+dt,Math.round((N-i)*(.45+R()*.4)),sw*.75,dep+1);
   x=nx;y=ny;t+=dt;sw=Math.max(.7,sw*.985)}}
 /* сетка ячеек: в каждой одна лоза — от угла блока в ячейке, иначе от края страницы, иначе из случайной точки; направление случайное, с уклоном от ближайшего края внутрь */
 var cols=Math.max(2,Math.round(W/CS)),rows=Math.max(2,Math.round((Y1-Y0)/CS)),cw=W/cols,ch=(Y1-Y0)/rows,starts=[];
 if(NAR){rows=Math.max(3,Math.round((Y1-Y0)/210));ch=(Y1-Y0)/rows;for(var r=0;r<rows;r++)for(var c=0;c<2;c++)if((r+c)%2==0||R()<.35){var up=R()<.5;starts.push([c?W+2:-2,Y0+(r+R())*ch,(up?-1:1)*Math.PI/2+(c?1:-1)*(up?-1:1)*(.25+R()*.3)])}rows=0}
 for(var r=0;r<rows;r++)for(var c=0;c<cols;c++){var x0=c*cw,y0=Y0+r*ch,inC=corners.filter(function(p){return p[0]>=x0&&p[0]<x0+cw&&p[1]>=y0&&p[1]<y0+ch}),sx0,sy0,an;
  if(inC.length&&R()<.75){var p=inC[(R()*inC.length)|0];sx0=p[0];sy0=p[1];an=Math.atan2(p[3],p[2])+(R()-.5)*1.6}
  else if(c==0||c==cols-1){sx0=c?W+4:-4;sy0=y0+R()*ch;an=(c?Math.PI:0)+(R()-.5)*1.4}
  else{sx0=x0+R()*cw;sy0=y0+R()*ch;an=R()*Math.PI*2}
  starts.push([sx0,sy0,an])}
 for(var k=starts.length-1;k>0;k--){var j=(R()*(k+1))|0,tmp=starts[k];starts[k]=starts[j];starts[j]=tmp}
 var NS=weak?20:30;
 starts.forEach(function(s){vine(s[0],s[1],s[2],R()*.15,NS,2.3+R()*.9,0)});
 dense.e.sort(function(a,b){return a.t-b.t});
 if(dense.e.length>LIM)dense.e.splice(LIM).forEach(function(e){e.i.parentNode.remove()});
 var mt=dense.e.length?dense.e[dense.e.length-1].t:1;dense.e.forEach(function(e){e.t*=.62/mt});
 document.body.appendChild(lay)}
function upDense(g,instant){if(!dense||dense.fall)return;var e=dense.e,n=dense.n;if(n>=e.length||e[n].t>g)return;
 if(instant)dense.lay.classList.add('nt');
 while(n<e.length&&e[n].t<=g)e[n++].i.classList.add('on');dense.n=n;
 if(instant)requestAnimationFrame(function(){requestAnimationFrame(function(){dense&&dense.lay.classList.remove('nt')})})}
function fallDense(){var d=dense;if(!d||d.fall)return;if(!d.n){d.lay.remove();dense=null;return}d.fall=1;
 var on=d.e.slice(0,d.n),pts=[];
 if(weak){d.lay.style.transition='opacity .5s';d.lay.style.opacity=0}
 else{var vy0=scrollY-60,vy1=scrollY+innerHeight+60,c=on.filter(function(e){return e.k!='s'&&e.y>vy0&&e.y<vy1}),M=Math.min(150,c.length);
  for(var j=0;j<M;j++){var e=c.splice((R()*c.length)|0,1)[0],dx=(R()-.5)*90,dy=140+R()*300,ra=-e.a*Math.PI/180,lx=dx*Math.cos(ra)-dy*Math.sin(ra),ly=dx*Math.sin(ra)+dy*Math.cos(ra);
   e.i.classList.add('fl');if(pts.length<26)pts.push([e.x-scrollX,e.y-scrollY]);
   e.i.animate([{transform:'translate(0px,0px) rotate(0deg) scale(1)',opacity:1},{transform:'translate('+lx.toFixed(0)+'px,'+ly.toFixed(0)+'px) rotate('+((R()-.5)*600).toFixed(0)+'deg) scale(.6)',opacity:0}],{duration:1100+R()*1000,delay:R()*300,easing:'cubic-bezier(.45,.05,.7,.6)',fill:'forwards'})}
  burstAt(pts)}
 d.lay.classList.add('fall');setTimeout(function(){d.lay.remove();if(dense===d)dense=null},2600)}
function burstAt(pts){if(weak||!pts.length)return;if(!pc)pc=document.body.appendChild(Object.assign(document.createElement('div'),{id:'aik-pollen'}));
 var now=Date.now(),C=['#e3a9c4','#b9a5e3','#e8c77a','#a9bb8f','#f0c8d8'],N=Math.min(50,60-parts.length);
 for(var i=0;i<N;i++){var p=pts[i%pts.length],el=document.createElement('i'),a=R()*Math.PI*2,v=.6+R()*1.8;el.style.background=C[i%5];pc.appendChild(el);
  parts.push({el:el,x:p[0],y:p[1],vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.2,t0:now,life:900+R()*800})}}
function loopS(){raf=0;if(document.hidden||LV>0)return;var now=Date.now(),gb=baseG(now);
 if(!weak||gb<1||!shown){draw(gb,now);shown=gb}
 var g=stage(now);if(g>0&&!dense)genDense();if(dense&&!dense.fall)upDense(g);pollen(now);
 raf=weak?setTimeout(loopS,250):requestAnimationFrame(loopS)}
function actS(){if(LV>0)return;last=Date.now();if(dense)fallDense();kickS()}
function kickS(){if(!raf)raf=weak?setTimeout(loopS,250):requestAnimationFrame(loopS)}
function init(){var tws=document.querySelectorAll('svg.tw.L,svg.tw.R');var n=0;
 tws.forEach(function(t){if(t.offsetParent!==null||getComputedStyle(t).display!='none')build(t,n++)});
 draw(0,Date.now());
 if(STRONG){buildStrong();addEventListener('load',buildStrong);var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(buildStrong,300)})}
 if(STRONG){['mousemove','scroll','wheel','touchstart','keydown','pointerdown'].forEach(function(ev){addEventListener(ev,actS,{passive:true})});
  document.addEventListener('visibilitychange',function(){if(!document.hidden){var g=stage(Date.now());if(g>0&&!dense)genDense();upDense(g,true);kickS()}});kickS();return}
 ['mousemove','scroll','wheel','touchstart','keydown','pointerdown'].forEach(function(ev){addEventListener(ev,act,{passive:true})});
 document.addEventListener('visibilitychange',function(){if(!document.hidden){draw(shown=stage(Date.now()),Date.now());kick()}});kick()}
/* старт после load и в idle, чтобы не мешать первой отрисовке */
function boot(){(window.requestIdleCallback||function(f){setTimeout(f,200)})(init,{timeout:1500})}
if(document.readyState=='complete')boot();else addEventListener('load',boot);
})();
