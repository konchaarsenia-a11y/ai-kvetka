const box=document.getElementById('v3');
(async()=>{try{
const c0=document.createElement('canvas');if(!(c0.getContext('webgl2')||c0.getContext('webgl')))return;
const T=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
const W=()=>box.clientWidth+40,H=()=>box.clientHeight+40;
const r=new T.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.setClearColor(0,0);
r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.0;
box.appendChild(r.domElement);
const sc=new T.Scene();const cam=new T.PerspectiveCamera(30,1,.1,100);cam.position.set(0,4.7,14.2);cam.lookAt(0,2.9,0);
sc.add(new T.HemisphereLight(0xfff6ec,0xc9b8a8,1.35));
const dl=new T.DirectionalLight(0xfff0dc,2.3);dl.position.set(3,7,5);dl.castShadow=true;dl.shadow.mapSize.set(1024,1024);dl.shadow.radius=6;dl.shadow.bias=-.0008;dl.shadow.normalBias=.03;
Object.assign(dl.shadow.camera,{left:-6,right:6,top:8,bottom:-6,near:1,far:30});sc.add(dl);
const fl=new T.DirectionalLight(0xe9efe0,.55);fl.position.set(-5,3,2);sc.add(fl);
sc.add(new T.AmbientLight(0xfff0f3,.45));const rim=new T.DirectionalLight(0xffe4ec,.9);rim.position.set(-2,5,-6);sc.add(rim);
const gr=new T.Mesh(new T.PlaneGeometry(14,14),new T.ShadowMaterial({opacity:.16}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;sc.add(gr);
const all=new T.Group();sc.add(all);
// seeded random
let sd=7;const rnd=()=>{sd=(sd*16807)%2147483647;return sd/2147483647};const rr=(a,b)=>a+(b-a)*rnd();
const lerp=(a,b,t)=>a+(b-a)*t,cl=(x)=>Math.max(0,Math.min(1,x));
// vase (almost static)
const pr=[[0,0],[.62,0],[.7,.04],[.86,.35],[1.02,.8],[1.08,1.2],[1.02,1.6],[.86,1.95],[.62,2.25],[.44,2.5],[.4,2.75],[.46,2.92],[.5,2.98],[.44,3.0]].map(p=>new T.Vector2(p[0],p[1]));
const vgeo=new T.LatheGeometry(pr,96);{const p=vgeo.attributes.position,cs=[],a=new T.Color(0x8f8c5c),b=new T.Color(0xd3cbad),c=new T.Color();for(let i=0;i<p.count;i++){const f=T.MathUtils.smoothstep(p.getY(i),1.12,1.3);c.copy(a).lerp(b,f);cs.push(c.r,c.g,c.b)}vgeo.setAttribute('color',new T.Float32BufferAttribute(cs,3))}
const vase=new T.Mesh(vgeo,new T.MeshStandardMaterial({vertexColors:true,roughness:.88,metalness:0,side:T.DoubleSide}));vase.castShadow=true;vase.receiveShadow=true;all.add(vase);
const band=new T.Mesh(new T.TorusGeometry(1.075,.018,8,96),new T.MeshStandardMaterial({color:0x6b6b3f,roughness:.7}));band.rotation.x=Math.PI/2;band.position.y=1.2;all.add(band);
const inner=new T.Mesh(new T.CircleGeometry(.4,48),new T.MeshStandardMaterial({color:0x4a4632,roughness:1}));inner.rotation.x=-Math.PI/2;inner.position.y=2.8;all.add(inner);
// materials
const petalMat=new T.MeshPhysicalMaterial({vertexColors:true,roughness:.5,metalness:0,side:T.DoubleSide,sheen:.55,sheenRoughness:.6,sheenColor:new T.Color(0xffdbe6),emissive:new T.Color(0xd77d97),emissiveIntensity:.3});
const leafMat=new T.MeshPhysicalMaterial({vertexColors:true,roughness:.45,metalness:0,side:T.DoubleSide,sheen:.3,sheenColor:new T.Color(0xb9d4a0),clearcoat:.25,clearcoatRoughness:.6});
const stemMat=new T.MeshStandardMaterial({color:0x6c8a47,roughness:.6});
const cDeep=new T.Color(0xe8899f),cMid=new T.Color(0xf3a9bf),cEdge=new T.Color(0xfde3eb),tmp=new T.Color();
// petal: cup, rounded wavy top edge, random crumple, colour from deep base to pale edge
function petalGeo(o){const sx=20,sy=24,g=new T.PlaneGeometry(1,1,sx,sy),p=g.attributes.position,cs=[];
const s1=rr(0,6.3),s2=rr(0,6.3),wf=rr(4.5,7.5);
for(let i=0;i<p.count;i++){const u=p.getX(i),v=p.getY(i)+.5,au=Math.abs(2*u);
const wv=o.wid*(Math.sqrt(Math.max(0,1-Math.pow((v-.64)/.64,2)))*.94+.06);
const x=u*wv*2;
let y=v*o.len*(1-.2*au*au*Math.pow(v,3));
const e=Math.max(Math.pow(v,4),Math.pow(au,5)*v);
y+=.025*o.len*Math.sin(u*wf+s1)*Math.pow(v,5);
let z=-o.cup*au*au*wv*.9+o.curl*v*v*o.len;
z+=o.ruf*o.len*Math.sin(u*wf*1.3+s2)*e;
z+=o.crm*o.len*Math.sin(u*7+s1)*Math.sin(v*6+s2)*v;
p.setXYZ(i,x,y,z);
const t=cl(.25+.55*Math.pow(v,1.3)+.35*au*au*v-o.deep);
if(t<.5)tmp.copy(cDeep).lerp(cMid,t*2);else tmp.copy(cMid).lerp(cEdge,(t-.5)*2);cs.push(tmp.r,tmp.g,tmp.b)}
g.setAttribute('color',new T.Float32BufferAttribute(cs,3));g.computeVertexNormals();return g}
// leaf with midrib and side veins in vertex colours
function leafGeo(len,wid){const g=new T.PlaneGeometry(1,1,24,40),p=g.attributes.position,cs=[],a=new T.Color(0x4d7a42),b=new T.Color(0x6b9a55),vn=new T.Color(0x9dbb7c);
for(let i=0;i<p.count;i++){const u=p.getX(i),v=p.getY(i)+.5;const w=wid*Math.pow(Math.sin(Math.PI*Math.min(1,v*1.02)),.8)*(1-.3*v)+.005;const x=u*w*2,ax=Math.abs(x);
p.setXYZ(i,x,v*len,-ax*.55-v*v*.22*len+.02*Math.sin(v*20)*ax);
tmp.copy(a).lerp(b,cl(.3+.6*v-.4*Math.abs(2*u)));
const mid=cl(1-Math.abs(u)/.03);const side=Math.pow(Math.max(0,Math.cos((v*len-ax*1.4)*15)),4)*(Math.abs(2*u)<.9?1:0)*.22;
tmp.lerp(vn,Math.max(mid*.8,side));cs.push(tmp.r,tmp.g,tmp.b)}
g.setAttribute('color',new T.Float32BufferAttribute(cs,3));g.computeVertexNormals();return g}
// stem as bendable chain
const SEG=9,SL=.25,joints=[];let par=all;const base=new T.Group();base.position.set(0,2.25,0);all.add(base);par=base;
for(let i=0;i<SEG;i++){const j=new T.Group();if(i)j.position.y=SL;par.add(j);const rad=.05-.012*i/SEG;
const m=new T.Mesh(new T.CylinderGeometry(rad*.97,rad,SL*1.06,12,1),stemMat);m.position.y=SL/2;j.add(m);joints.push(j);par=j}
const bend=[.0,.02,.04,.05,.06,.06,.07,.08,.08];
// leaves on joints
const leaves=[];
[[4,.5,1.5],[6,2.7,1.35],[7,-1.7,1.1]].forEach(([ji,ry,sc])=>{const L=new T.Group();L.rotation.y=ry;joints[ji].add(L);
[[0,1.15,.26,0],[.55,.85,.2,-.5],[-.55,.85,.2,.5]].forEach(([rz,len,wid,sk])=>{const piv=new T.Group();piv.rotation.set(-1.05+Math.abs(rz)*.25,0,rz);L.add(piv);
const lf=new T.Mesh(leafGeo(len*sc,wid*sc),leafMat);lf.position.z=.04;piv.add(lf);leaves.push({piv,bx:piv.rotation.x,ph:rr(0,6.3)})})});
// flower head
const head=new T.Group();head.position.y=SL;head.rotation.set(.12,0,-.06);joints[SEG-1].add(head);
const calyx=new T.Mesh(new T.SphereGeometry(.2,24,16,0,Math.PI*2,Math.PI*.45,Math.PI*.55),stemMat);calyx.position.y=.08;head.add(calyx);
const petals=[];const N=78,GA=2.39996;
for(let i=0;i<N;i++){const f=i/(N-1),fe=Math.pow(f,.85);
const o={len:lerp(1.3,.45,fe)*rr(.88,1.12),wid:lerp(1.0,.55,fe)*rr(.85,1.15),cup:lerp(.3,.5,f)*rr(.9,1.1),curl:lerp(.18,-.32,Math.pow(f,.7))*rr(.8,1.2),ruf:lerp(.04,.07,f),crm:f>.75?lerp(.01,.05,(f-.75)/.25):.004,deep:f>.7?.08*(f-.7)/.3:0};
const piv=new T.Group();piv.rotation.y=i*GA+rr(-.12,.12);piv.position.y=lerp(.05,.55,Math.pow(f,1.1));
const m=new T.Mesh(petalGeo(o),petalMat);const tilt=lerp(1.42,.08,Math.pow(f,.8))+rr(-.12,.12);
m.rotation.set(-tilt,0,rr(-.07,.07));m.position.z=lerp(.22,.02,f)+rr(-.02,.02);piv.add(m);head.add(piv);
petals.push({m,bx:-tilt,bz:m.rotation.z,ph:rr(0,6.3),a:lerp(.035,.012,f)})}
{const cg=new T.SphereGeometry(.72,40,24);const cp=cg.attributes.position,cc=[];for(let i=0;i<cp.count;i++){const y=cp.getY(i),x=cp.getX(i),z=cp.getZ(i);const n=1+.06*Math.sin(x*14)*Math.sin(z*13)*Math.sin(y*11);cp.setXYZ(i,x*n,y*.75*n,z*n);tmp.copy(cMid).lerp(cEdge,cl(.3+y));cc.push(tmp.r,tmp.g,tmp.b)}cg.setAttribute('color',new T.Float32BufferAttribute(cc,3));cg.computeVertexNormals();const core=new T.Mesh(cg,petalMat);core.position.y=.42;head.add(core)}
// tiny crumpled core
for(let i=0;i<18;i++){const o={len:rr(.14,.24),wid:rr(.12,.18),cup:.55,curl:-.4,ruf:.06,crm:.04,deep:.12};
const piv=new T.Group();piv.rotation.y=i*GA;piv.position.y=.62+rr(0,.05);const m=new T.Mesh(petalGeo(o),petalMat);m.rotation.set(-rr(0,.25),0,rr(-.4,.4));m.position.z=rr(0,.05);piv.add(m);head.add(piv)}
function size(){const w=W(),h=H();r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
size();addEventListener('resize',size);
const red=matchMedia('(prefers-reduced-motion: reduce)').matches;
const wind=(t)=>.55*Math.sin(t*.83)+.28*Math.sin(t*1.71+1.3)+.12*Math.sin(t*3.07+.4)+.05*Math.sin(t*5.3+2.1);
const clk=new T.Clock();let vis=true;new IntersectionObserver(e=>{vis=e[0].isIntersecting}).observe(box);
function pose(t){all.rotation.y=.3+Math.sin(t*.13)*.035;
for(let i=0;i<SEG;i++){const k=(i+1)/SEG,d=i*.11;joints[i].rotation.z=bend[i]*-.6+wind(t-d)*.022*k;joints[i].rotation.x=bend[i]*.5+wind(t*.9+2-d)*.014*k}
head.rotation.z=-.08+wind(t-1)*.03;head.rotation.x=.12+wind(t*1.1+4)*.02;
const gust=.6+.4*Math.abs(wind(t*.7));
for(const p of petals){p.m.rotation.x=p.bx+Math.sin(t*2.3+p.ph)*p.a*gust;p.m.rotation.z=p.bz+Math.sin(t*1.7+p.ph*1.3)*p.a*.6*gust}
for(const l of leaves){l.piv.rotation.x=l.bx+Math.sin(t*1.9+l.ph)*.05*gust+wind(t+l.ph)*.03}}
(function loop(){if(red){pose(0);r.render(sc,cam);return}requestAnimationFrame(loop);if(!vis)return;pose(clk.getElapsedTime());r.render(sc,cam)})();
box.classList.add('on');box.dataset.ok=1;
}catch(e){console.warn('3D off',e)}})();
