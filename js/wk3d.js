/* Пион в молочной вазе. Ваза: 3D (форма и цвет по фото img/n4.jpg). Головка пиона: настоящее фото с прозрачным фоном
   (img/wk/peony-head.webp, Valentin Hintikka, CC BY-SA 2.0, см. img/demo/SOURCES.md), стебель и листья 3D. */
const box=document.getElementById('v3');
(async()=>{try{
const c0=document.createElement('canvas');if(!(c0.getContext('webgl2')||c0.getContext('webgl')))return;
const T=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
const Q=new URLSearchParams(location.search);const LAYER=Q.get('wk3d');// служебный режим для рендера фолбэка
const W=()=>box.clientWidth+40,H=()=>box.clientHeight+40;
const r=new T.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:!!LAYER});r.setPixelRatio(LAYER?2:Math.min(devicePixelRatio,2));r.setClearColor(0,0);
r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=.95;
const sc=new T.Scene();const cam=new T.PerspectiveCamera(28,1,.1,100);const C0=new T.Vector3(0,4.3,15.5),LK=new T.Vector3(0,3.05,0);cam.position.copy(C0);cam.lookAt(LK);
// мягкое студийное окружение (аналог RoomEnvironment): светлая комната с крупными софтбоксами
{const es=new T.Scene();const rm=new T.Mesh(new T.BoxGeometry(20,12,20),new T.MeshBasicMaterial({color:0xb9b1a4,side:T.BackSide}));rm.position.y=4;es.add(rm);
const sb=(w,h,x,y,z,c,i)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(i),side:T.DoubleSide}));m.position.set(x,y,z);m.lookAt(0,2,0);es.add(m)};
sb(8,6,6,6,6,0xfff3e4,3.2);sb(6,5,-7,4,3,0xf3f0ea,1.4);sb(10,4,0,9.5,0,0xffffff,1.6);sb(6,4,-2,4,-8,0xffe9e2,1.1);
const pm=new T.PMREMGenerator(r);sc.environment=pm.fromScene(es,.04).texture;pm.dispose()}
sc.add(new T.HemisphereLight(0xfff6ec,0xb8a994,.45));
const dl=new T.DirectionalLight(0xfff0dc,2.0);dl.position.set(1.8,10,8);dl.castShadow=true;dl.shadow.mapSize.set(2048,2048);dl.shadow.radius=8;dl.shadow.bias=-.0006;dl.shadow.normalBias=.03;
Object.assign(dl.shadow.camera,{left:-6,right:6,top:9,bottom:-5,near:1,far:30});sc.add(dl);
const gr=new T.Mesh(new T.PlaneGeometry(16,16),new T.ShadowMaterial({opacity:.13}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;sc.add(gr);
{// мягкая контактная тень под вазой
const cv=document.createElement('canvas');cv.width=cv.height=128;const g=cv.getContext('2d');const rg=g.createRadialGradient(64,64,0,64,64,64);rg.addColorStop(0,'rgba(59,52,40,.55)');rg.addColorStop(.45,'rgba(59,52,40,.22)');rg.addColorStop(1,'rgba(59,52,40,0)');g.fillStyle=rg;g.fillRect(0,0,128,128);
const m=new T.Mesh(new T.PlaneGeometry(2.9,2.9),new T.MeshBasicMaterial({map:new T.CanvasTexture(cv),transparent:true,depthWrite:false,toneMapped:false}));m.rotation.x=-Math.PI/2;m.position.y=.005;sc.add(m);sc.userData.cs=m}
const all=new T.Group();sc.add(all);
let sd=11;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};const rr=(a,b)=>a+(b-a)*rnd();const cl=x=>Math.max(0,Math.min(1,x));
// ===== ваза «молоко»: яйцевидная, широкое плечо в верхней трети, короткое прямое горлышко с плоским краем
const prof=[[0,.03],[.40,.0],[.47,.012],[.5,.05],[.55,.14],[.64,.32],[.79,.6],[.94,.95],[1.08,1.33],[1.18,1.7],[1.22,1.98],[1.21,2.18],[1.15,2.38],[1.03,2.56],[.86,2.71],[.7,2.81],[.615,2.85],[.6,2.88],[.6,2.97],[.59,3.0],[.56,3.01],[.52,3.0],[.505,2.97],[.5,2.8],[.45,2.62],[0,2.55]].map(p=>new T.Vector2(p[0],p[1]));
const vgeo=new T.LatheGeometry(prof,160);
const nz=(()=>{const cv=document.createElement('canvas');cv.width=cv.height=512;const g=cv.getContext('2d');const id=g.createImageData(512,512);
for(let i=0;i<id.data.length;i+=4){const v=128+(Math.random()-.5)*46;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}g.putImageData(id,0,0);
g.globalAlpha=.08;for(let k=0;k<900;k++){g.fillStyle=Math.random()<.5?'#000':'#fff';g.beginPath();g.arc(Math.random()*512,Math.random()*512,Math.random()*2.2,0,7);g.fill()}
const t=new T.CanvasTexture(cv);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(3,2);return t})();
const vmat=new T.MeshPhysicalMaterial({color:0xf2ebdd,roughness:.62,metalness:0,clearcoat:.18,clearcoatRoughness:.55,sheen:.25,sheenRoughness:.8,sheenColor:new T.Color(0xfff7ea),bumpMap:nz,bumpScale:.35,roughnessMap:nz,envMapIntensity:.7});
const vase=new T.Mesh(vgeo,vmat);vase.castShadow=true;vase.receiveShadow=true;all.add(vase);
const vin=new T.Mesh(new T.CircleGeometry(.5,64),new T.MeshStandardMaterial({color:0x8a8070,roughness:1}));vin.rotation.x=-Math.PI/2;vin.position.y=2.78;all.add(vin);
// ===== стебель (гибкая цепочка), листья
const stemMat=new T.MeshPhysicalMaterial({color:0x56743a,roughness:.5,clearcoat:.2,clearcoatRoughness:.6});
// стебель выходит из горлышка: нижний кусок внутри вазы неподвижен, точка поворота у края горлышка
const SEG=6,SL=.25,joints=[];const base=new T.Group();base.position.set(.02,2.99,0);all.add(base);let par=base;
{const m=new T.Mesh(new T.CylinderGeometry(.052,.054,.32,14,1),stemMat);m.position.y=-.16;base.add(m)}
for(let i=0;i<SEG;i++){const j=new T.Group();if(i)j.position.y=SL;par.add(j);const rad=.052-.01*i/SEG;
const m=new T.Mesh(new T.CylinderGeometry(rad*.96,rad,SL*1.08,14,1),stemMat);m.position.y=SL/2;m.castShadow=true;j.add(m);joints.push(j);par=j}
const bend=[.02,.05,.08,.11,.14,.17];// изгиб под тяжёлую головку
function leafGeo(len,wid){const g=new T.PlaneGeometry(1,1,20,36),p=g.attributes.position,cs=[],a=new T.Color(0x24461f),b=new T.Color(0x3d6a30),vn=new T.Color(0x6f9356),tc=new T.Color();
for(let i=0;i<p.count;i++){const u=p.getX(i),v=p.getY(i)+.5;const w=wid*Math.pow(Math.sin(Math.PI*Math.min(1,v*1.02)),.75)*(1-.35*v)+.004;const x=u*w*2,ax=Math.abs(x);
p.setXYZ(i,x,v*len,-ax*.5-v*v*.25*len+.015*Math.sin(v*22)*ax);tc.copy(a).lerp(b,cl(.25+.55*v-.4*Math.abs(2*u)));
const mid=cl(1-Math.abs(u)/.03);const side=Math.pow(Math.max(0,Math.cos((v*len-ax*1.3)*16)),5)*(Math.abs(2*u)<.85?1:0)*.18;tc.lerp(vn,Math.max(mid*.6,side));cs.push(tc.r,tc.g,tc.b)}
g.setAttribute('color',new T.Float32BufferAttribute(cs,3));g.computeVertexNormals();return g}
const leafMat=new T.MeshPhysicalMaterial({vertexColors:true,roughness:.42,side:T.DoubleSide,clearcoat:.3,clearcoatRoughness:.5,sheen:.2,sheenColor:new T.Color(0xb9d4a0)});
const leaves=[];
[[1,.9,1.15,-.95],[2,-2.0,1.05,-1.0],[3,2.5,.9,-1.05],[4,-.6,.75,-1.1]].forEach(([ji,ry,s,rx])=>{const L=new T.Group();L.rotation.y=ry;joints[ji].add(L);
[[0,1.05,.24],[.5,.78,.18],[-.5,.78,.18]].forEach(([rz,len,wid])=>{const pv=new T.Group();pv.rotation.set(rx+Math.abs(rz)*.25,0,rz);L.add(pv);
const lf=new T.Mesh(leafGeo(len*s,wid*s),leafMat);lf.castShadow=true;lf.position.z=.04;pv.add(lf);leaves.push({pv,bx:pv.rotation.x,ph:rr(0,6.3)})})});
// ===== головка: фото пиона
const tex=await new Promise((ok,no)=>{const im=new Image();im.onload=()=>{const t=new T.Texture(im);t.needsUpdate=true;ok(t)};im.onerror=no;im.src='img/wk/peony-head.webp'});tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;
const HW=3.0,HH=HW*tex.image.height/tex.image.width;
const hp=new T.Group();hp.position.y=SL;joints[SEG-1].add(hp);
const hb=new T.Group();hp.add(hb);
const hm=new T.Mesh(new T.PlaneGeometry(HW,HH),new T.MeshBasicMaterial({map:tex,transparent:true,alphaTest:.04,toneMapped:false,side:T.DoubleSide,color:0xfaf6f2}));
hm.position.set(HW*(0.5-.47),HH*(.5-.12)-.05,.32);hm.castShadow=true;hm.customDepthMaterial=new T.MeshDepthMaterial({depthPacking:T.RGBADepthPacking,map:tex,alphaTest:.5});
hb.add(hm);
// ===== размер, анимация
box.appendChild(r.domElement);
function size(){const w=W(),h=H();r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
size();addEventListener('resize',size);
const red=matchMedia('(prefers-reduced-motion: reduce)').matches||!!LAYER;
const wind=t=>.5*Math.sin(t*.61)+.27*Math.sin(t*1.13+1.3)+.14*Math.sin(t*2.07+.4)+.06*Math.sin(t*3.9+2.1);
const mx={x:0,y:0,tx:0,ty:0};if(!red)addEventListener('pointermove',e=>{const b=box.getBoundingClientRect();mx.tx=cl((e.clientX-b.left)/b.width)*2-1;mx.ty=cl((e.clientY-b.top)/b.height)*2-1},{passive:true});
const qi=new T.Quaternion(),qz=new T.Quaternion(),qx=new T.Quaternion(),Z=new T.Vector3(0,0,1),X=new T.Vector3(1,0,0);
function pose(t){all.rotation.y=.25+Math.sin(t*.11)*.06;
for(let i=0;i<SEG;i++){const k=(i+1)/SEG,d=i*.12;joints[i].rotation.z=-bend[i]+wind(t-d)*.02*k;joints[i].rotation.x=bend[i]*.4+wind(t*.87+2-d)*.013*k}
const g=.6+.4*Math.abs(wind(t*.7));for(const l of leaves)l.pv.rotation.x=l.bx+Math.sin(t*1.3+l.ph)*.035*g+wind(t+l.ph)*.02;
mx.x+=(mx.tx-mx.x)*.04;mx.y+=(mx.ty-mx.y)*.04;cam.position.set(C0.x+mx.x*.9,C0.y-mx.y*.45,C0.z);cam.lookAt(LK);
// головка всегда смотрит в камеру, но наклоняется вместе со стеблем
hp.updateWorldMatrix(true,false);hp.getWorldQuaternion(qi).invert();// наклон головки: около 25° вбок по изгибу стебля и около 20° к зрителю, мягкое покачивание
qz.setFromAxisAngle(Z,-.44+wind(t-1.1)*.035);qx.setFromAxisAngle(X,.34+wind(t*.8+.7)*.02);
hb.quaternion.copy(qi).multiply(cam.quaternion).multiply(qz).multiply(qx);const br=1+Math.sin(t*.9)*.006;hb.scale.set(br,br,1)}
if(LAYER=='vase'){hp.visible=false;joints.forEach(j=>j.visible=false);base.visible=false}
if(LAYER=='flower'){vase.visible=false;vin.visible=false;gr.visible=false;sc.userData.cs.visible=false}
if(LAYER){pose(0);const v=new T.Vector3(.02,2.99,0).applyMatrix4(all.matrixWorld).project(cam);box.dataset.o=((v.x+1)/2).toFixed(4)+' '+((1-v.y)/2).toFixed(4)}
if(LAYER=='check'){const P=prof.slice(0,22),rad=y=>{for(let i=1;i<P.length;i++)if(P[i].y>=y){const a=P[i-1],b=P[i];return a.x+(b.x-a.x)*(y-a.y)/(b.y-a.y||1)}return 0};const iv=new T.Matrix4(),w=new T.Vector3();let bad=0,n=0,miny=9;
for(let t=0;t<60;t+=.37){pose(t);all.updateMatrixWorld(true);iv.copy(all.matrixWorld).invert();base.traverse(o=>{if(!o.isMesh)return;const p=o.geometry.attributes.position;for(let i=0;i<p.count;i++){w.fromBufferAttribute(p,i).applyMatrix4(o.matrixWorld).applyMatrix4(iv);n++;const rr=Math.hypot(w.x,w.z);if(w.y<3.0&&w.y>0&&rr>.47&&rr<=rad(w.y)+.02)bad++;if(rr>.47&&w.y<miny)miny=w.y}})}box.dataset.chk=bad+'/'+n+' miny_out='+miny.toFixed(3)}
const clk=new T.Clock();let vis=true;new IntersectionObserver(e=>{vis=e[0].isIntersecting}).observe(box);
(function loop(){if(red){pose(0);r.render(sc,cam);return}requestAnimationFrame(loop);if(!vis||document.hidden)return;pose(clk.getElapsedTime());r.render(sc,cam)})();
box.classList.add('on');box.dataset.ok=1;
}catch(e){console.warn('3D off',e)}})();
