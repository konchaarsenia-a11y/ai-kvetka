/* AI KVETKA: «зарастание». После ~3 с бездействия веточки по краям дорастают: побеги, листья, пионы, лёгкое покачивание.
   Стадия считается по Date.now (идёт и в свёрнутой вкладке), анимируются только transform/opacity, при активности всё осыпается пыльцой. */
(function(){
if(window.AIK_GROW)return;window.AIK_GROW=1;
if(!window.requestAnimationFrame||matchMedia('(prefers-reduced-motion:reduce)').matches)return;
var q=new URLSearchParams(location.search),IDLE=+q.get('growidle')||3000,FULL=+q.get('growms')||25000;
var STRONG=q.get('grow')=='strong'||window.AIK_GROW_STRONG;
var weak=(navigator.deviceMemory&&navigator.deviceMemory<=2)||(navigator.hardwareConcurrency&&navigator.hardwareConcurrency<=2);
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
function loop(){raf=0;if(document.hidden)return;var now=Date.now(),g;
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
function vine(svg,ox,oy,sx,sy,a,b,rnd,t0,big){
 var P=[],N=weak?8:16,i,off=5;
 for(i=0;i<=N;i++){var u=i/N,x,y,L=a+b,d=u*L;
  if(d<a){x=a-d;y=-off}else{x=-off;y=d-a}
  var w=Math.sin(u*Math.PI*3+rnd()*.5)*3;if(d<a)y+=w;else x+=w;
  if(Math.abs(d-a)<L/N*1.2){x-=4;y-=4}
  P.push([ox+sx*x,oy+sy*y])}
 var g=mk('g',{},svg),k=0;
 for(i=0;i<N;i++){var A=P[i],B=P[i+1],dx=B[0]-A[0],dy=B[1]-A[1],len=Math.hypot(dx,dy),an=Math.atan2(dy,dx)*180/Math.PI;
  var sg=mk('g',{},g);mk('path',{'class':'gs',d:'M0 0Q'+len/2+' '+(rnd()*4-2)+' '+(len+.6)+' 0','stroke-width':big?1.3:1},sg);
  var tt=t0+i*(.32/N);cel.push({g:sg,x:A[0],y:A[1],a:an,t:tt,d:.5/N+.02,k:'g'});
  if(i%2==1||(!weak&&i%3==0)){var side=(k++%2?1:-1),lf=leaf(g,0,0,0,(9+rnd()*7)*(big?1.2:1));lf.x=A[0];lf.y=A[1];lf.a=an+side*(50+rnd()*25);lf.t=tt+.06;lf.d=.12;lf.k='l';cel.push(lf)}
 }
 var ci=Math.round(N*a/(a+b)),pr=[ci,N];if(!weak)pr.push(Math.max(2,ci-3));
 pr.forEach(function(j,n){var Q=P[Math.min(N,j)],pe=peony(g,0,0,(n?8:12)+rnd()*4*(big?1.4:1));pe.x=Q[0];pe.y=Q[1];pe.t=.48+n*.1+rnd()*.1+t0*.3;pe.d=.22;pe.k='p';cel.push(pe)});
 if(!weak)for(i=2;i<N;i+=5){var Q2=P[i],bd=mk('g',{},g);mk('circle',{'class':'gp',r:3.2},bd);cel.push({g:bd,x:Q2[0]+sx*3,y:Q2[1]-sy*3,a:0,t:t0+.3+i*.02,d:.1,k:'l'})}
}
function buildStrong(){
 if(lay)lay.remove();els=els.filter(function(e){return cel.indexOf(e)<0});cel=[];
 var de=document.documentElement,W=de.scrollWidth,H=de.scrollHeight,sy=scrollY,sx=scrollX,n=0;
 lay=document.createElement('div');lay.id='aik-vines';lay.setAttribute('aria-hidden','true');
 lay.style.cssText='position:absolute;left:0;top:0;width:'+W+'px;height:'+H+'px;pointer-events:none;overflow:hidden;z-index:5';
 var svg=mk('svg',{width:W,height:H,'class':'gw tw',style:'position:absolute;left:0;top:0;overflow:visible'});lay.appendChild(svg);
 var T=[['.hm-a',['tr','bl'],1],['.cc',['tl','tr'],0],['.wks',['tl','br'],1],['.lf',['tr','bl'],1],['#onas .im',['tl','br'],1],['.sh h2,#onas h2',['side'],0],['.rvs,.rv-w,#reviews',['tl'],0]];
 T.forEach(function(r){var L=document.querySelectorAll(r[0]);if(weak&&L.length>3)L=[].slice.call(L,0,3);
  [].forEach.call(L,function(el,ix){var b=el.getBoundingClientRect();if(!b.width||!b.height)return;
   var cs=r[1].length==2&&r[0]=='.cc'?[r[1][ix%2]]:r[1];
   cs.forEach(function(c){var rnd=sr(++n*131+7),t0=.02+rnd()*.4,X=b.left+sx,Y=b.top+sy,mw=Math.min(b.width*.55,170),mh=Math.min(b.height*.6,150);
    if(c=='side'){vine(svg,X-14,Y-6,1,1,0,b.height+30,rnd,t0,0);return}
    if(c=='tl')vine(svg,X,Y,1,1,mw,mh,rnd,t0,r[2]);
    if(c=='tr')vine(svg,X+b.width,Y,-1,1,mw,mh,rnd,t0,r[2]);
    if(c=='bl')vine(svg,X,Y+b.height,1,-1,mw,mh,rnd,t0,r[2]);
    if(c=='br')vine(svg,X+b.width,Y+b.height,-1,-1,mw,mh,rnd,t0,r[2])})})});
 document.body.appendChild(lay);els=els.concat(cel);cel.forEach(function(e){e._p=-1});draw(shown,Date.now())}
function init(){var tws=document.querySelectorAll('svg.tw.L,svg.tw.R');var n=0;
 tws.forEach(function(t){if(t.offsetParent!==null||getComputedStyle(t).display!='none')build(t,n++)});
 draw(0,Date.now());
 if(STRONG){buildStrong();addEventListener('load',buildStrong);var rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(buildStrong,300)})}
 ['mousemove','scroll','wheel','touchstart','keydown','pointerdown'].forEach(function(ev){addEventListener(ev,act,{passive:true})});
 document.addEventListener('visibilitychange',function(){if(!document.hidden){draw(shown=stage(Date.now()),Date.now());kick()}});kick()}
if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
