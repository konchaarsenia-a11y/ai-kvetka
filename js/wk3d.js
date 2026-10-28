const box=document.getElementById('v3');
(async()=>{try{
const c0=document.createElement('canvas');if(!(c0.getContext('webgl2')||c0.getContext('webgl')))return;
const T=await import('https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js');
const W=()=>box.clientWidth+40,H=()=>box.clientHeight+40;
const r=new T.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.setClearColor(0,0);
r.shadowMap.enabled=true;r.shadowMap.type=T.PCFSoftShadowMap;r.outputColorSpace=T.SRGBColorSpace;r.toneMapping=T.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
box.appendChild(r.domElement);
const sc=new T.Scene();const cam=new T.PerspectiveCamera(30,1,.1,100);cam.position.set(0,4.6,14.2);cam.lookAt(0,2.85,0);
sc.add(new T.HemisphereLight(0xfff6e8,0x8a8560,1.35));
const dl=new T.DirectionalLight(0xfff1dc,2.2);dl.position.set(3,7,5);dl.castShadow=true;dl.shadow.mapSize.set(1024,1024);dl.shadow.radius=6;dl.shadow.bias=-.0008;dl.shadow.normalBias=.03;
Object.assign(dl.shadow.camera,{left:-6,right:6,top:8,bottom:-6,near:1,far:30});sc.add(dl);
const fl=new T.DirectionalLight(0xe9efe0,.6);fl.position.set(-5,3,2);sc.add(fl);
const gr=new T.Mesh(new T.PlaneGeometry(14,14),new T.ShadowMaterial({opacity:.16}));gr.rotation.x=-Math.PI/2;gr.receiveShadow=true;sc.add(gr);
const all=new T.Group();sc.add(all);
// vase
const pr=[[0,0],[.62,0],[.7,.04],[.86,.35],[1.02,.8],[1.08,1.2],[1.02,1.6],[.86,1.95],[.62,2.25],[.44,2.5],[.4,2.75],[.46,2.92],[.5,2.98],[.44,3.0]].map(p=>new T.Vector2(p[0],p[1]));
const vm=new T.MeshStandardMaterial({vertexColors:true,roughness:.88,metalness:0,side:T.DoubleSide});
const vgeo=new T.LatheGeometry(pr,96);{const p=vgeo.attributes.position,cs=[],a=new T.Color(0x8f8c5c),b=new T.Color(0xd3cbad),c=new T.Color();for(let i=0;i<p.count;i++){const y=p.getY(i);const f=T.MathUtils.smoothstep(y,1.12,1.3);c.copy(a).lerp(b,f);cs.push(c.r,c.g,c.b)}vgeo.setAttribute('color',new T.Float32BufferAttribute(cs,3))}
const vase=new T.Mesh(vgeo,vm);vase.castShadow=true;vase.receiveShadow=true;all.add(vase);
const band=new T.Mesh(new T.TorusGeometry(1.075,.018,8,96),new T.MeshStandardMaterial({color:0x6b6b3f,roughness:.7}));band.rotation.x=Math.PI/2;band.position.y=1.2;all.add(band);
const inner=new T.Mesh(new T.CircleGeometry(.4,48),new T.MeshStandardMaterial({color:0x4a4632,roughness:1}));inner.rotation.x=-Math.PI/2;inner.position.y=2.8;all.add(inner);
// flower
const fg=new T.Group();fg.position.y=2.6;all.add(fg);
const sm=new T.MeshStandardMaterial({color:0x6f8a4a,roughness:.7});
const top=new T.Vector3(.12,1.75,.3);
const stem=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(0,0,0),new T.Vector3(.04,.6,.05),new T.Vector3(.1,1.25,.18),top]),40,.045,10),sm);fg.add(stem);
function petalGeo(len,wid,cup,curl){const g=new T.PlaneGeometry(1,1,12,14);const p=g.attributes.position;
for(let i=0;i<p.count;i++){const u=p.getX(i),v=p.getY(i)+.5;const w=wid*Math.pow(Math.sin(Math.PI*Math.min(1,v*.92+.04)),.7)*(1-.25*v)+.02;
const x=u*w*2,y=v*len;const z=-cup*(x*x)/(w*w+.001)*w*.9+curl*v*v*len+(.03*Math.sin(u*9+v*5))*v;p.setXYZ(i,x,y,z)}g.computeVertexNormals();return g}
const head=new T.Group();head.position.copy(top);head.rotation.set(.55,0,-.1);head.scale.setScalar(1.75);fg.add(head);
const pinks=[0xf09ab4,0xea8fab,0xf4abc0,0xe47f9d,0xf6bacb,0xec96b0];
const rings=[{n:7,len:.9,wid:.48,tilt:1.25,cup:.5,curl:.1,y:0},{n:9,len:.8,wid:.42,tilt:1.0,cup:.55,curl:.2,y:.04},{n:10,len:.7,wid:.36,tilt:.78,cup:.6,curl:.28,y:.1},{n:12,len:.6,wid:.3,tilt:.58,cup:.65,curl:.32,y:.16},{n:13,len:.5,wid:.26,tilt:.4,cup:.7,curl:.36,y:.22},{n:13,len:.4,wid:.22,tilt:.26,cup:.7,curl:.38,y:.28},{n:11,len:.3,wid:.18,tilt:.14,cup:.75,curl:.4,y:.34},{n:8,len:.22,wid:.14,tilt:.05,cup:.8,curl:.4,y:.4}];
let k=0;const petals=[];
rings.forEach((R,ri)=>{const g=petalGeo(R.len,R.wid,R.cup,R.curl);for(let i=0;i<R.n;i++){
const col=new T.Color(pinks[(k++)%pinks.length]);const m=new T.MeshStandardMaterial({color:col,emissive:col.clone().multiplyScalar(.28),roughness:.7,side:T.DoubleSide});
const piv=new T.Group();piv.rotation.y=i/R.n*Math.PI*2+ri*.45+Math.sin(k)*.15;piv.position.y=R.y;
const pm=new T.Mesh(g,m);pm.rotation.x=-(R.tilt+Math.sin(k*1.7)*.08);pm.position.z=.04+ri*-.004;piv.add(pm);head.add(piv);petals.push(pm)}});
const ctr=new T.Mesh(new T.SphereGeometry(.16,20,16),new T.MeshStandardMaterial({color:0xf3c9cf,roughness:.7}));ctr.position.y=.4;head.add(ctr);
// leaves
function leafGeo(len,wid){const g=new T.PlaneGeometry(1,1,8,14);const p=g.attributes.position;for(let i=0;i<p.count;i++){const u=p.getX(i),v=p.getY(i)+.5;const w=wid*Math.sin(Math.PI*v)*(1-.35*v);const x=u*w*2;p.setXYZ(i,x,v*len,-Math.abs(x)*.6+(v*v)*.25*len)}g.computeVertexNormals();return g}
const lm=new T.MeshStandardMaterial({color:0x4f7444,roughness:.55,side:T.DoubleSide});
[[.75,0.6,1.15,.24,0],[.95,-2.2,1.0,.22,0],[1.2,2.6,.85,.19,0]].forEach(([y,ry,len,wid,rz])=>{const L=new T.Group();L.position.set(.1,y,.12);L.rotation.y=ry;const lf=new T.Mesh(leafGeo(len,wid),lm);lf.rotation.x=-1.2;L.add(lf);fg.add(L)});
function size(){const w=W(),h=H();r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
size();addEventListener('resize',size);
const red=matchMedia('(prefers-reduced-motion: reduce)').matches;
const clk=new T.Clock();
(function loop(){const t=red?0:clk.getElapsedTime();
all.rotation.y=Math.sin(t*.25)*.5+.3;
fg.rotation.z=Math.sin(t*.7)*.035;fg.rotation.x=Math.sin(t*.55+1)*.025;
head.scale.setScalar(1.75*(1+Math.sin(t*1.1)*.012));
r.render(sc,cam);if(!red)requestAnimationFrame(loop)})();
box.classList.add('on');box.dataset.ok=1;
}catch(e){console.warn('3D off',e)}})();
