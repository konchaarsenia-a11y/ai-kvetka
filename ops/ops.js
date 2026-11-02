/* AI KVETKA · операционка (черновик). Без сборки. Хранение: localStorage.
   aik_ops_orders — заказы (ДЕМО), aik_ops_kat — правки каталога поверх window.AIK_KAT из ../js/kat.js. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var KAT=window.AIK_KAT||[],BASE=window.AIK_KAT_BASE||'../',money=window.AIK_MONEY||function(x){return String(x)};
var ST=[['new','Новый'],['work','В работе'],['ready','Готов'],['done','Выдан'],['cancel','Отменён']];
var SN={};ST.forEach(function(s){SN[s[0]]=s[1]});
var LS={get:function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast('Не хватает места в браузере (фото слишком большое?)');return false}}};
function toast(t){var e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},2200)}
function img(u){return /^(data:|https?:|\/)/.test(u)?u:BASE+u}

/* ---------- Каталог: базовые цены ---------- */
// Базовая цена на сайте лежит в catalog.html (data-p). Пытаемся прочитать её; иначе — демо-фолбэк.
var PFALL={shampan:189,peony:159,tulips:89,box:179,blush:265,pumpkin:120,haworthia:45,vase:70,macarons:38,bride:210,roses101:450};
var PSITE={};
function basePrice(p){var e=edits()[p.id];if(e&&e.p!=null&&e.p!=='')return +e.p;if(p.p!=null)return +p.p;return PSITE[p.id]!=null?PSITE[p.id]:(PFALL[p.id]||0)}
function edits(){return LS.get('aik_ops_kat',{})}
function prod(id){var p=null;KAT.forEach(function(x){if(x.id==id)p=x});if(!p)return null;var e=edits()[id]||{},o={};for(var k in p)o[k]=p[k];
 ['n','d','cm','c'].forEach(function(k){if(e[k]!=null)o[k]=e[k]});if(e.ph)o.ph=e.ph;if(e.sp)applySp(o,e.sp);o._ed=!!edits()[id];o.price=basePrice(p);return o}

/* ---------- Заказы (ДЕМО) ---------- */
function day(o,h,m){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+o);d.setHours(h,m||0);return d.getTime()}
function demo(){var n=Date.now(),H=3600e3;return[
 {id:'1048',st:'new',at:n-.4*H,name:'Алина Ковалёва',phone:'+375 29 611-24-08',tg:'alina_kv',mode:'dlv',addr:'Минск, ул. Сурганова 47, кв. 12',when:day(0,15),slot:'15:00–17:00',items:[{id:'peony',s:'M',q:15}],dlv:12,card:'С днём рождения, мама! Люблю тебя.',note:'Позвонить получателю за 30 минут'},
 {id:'1047',st:'work',at:n-2*H,name:'Дмитрий Лис',phone:'+375 33 302-77-15',tg:'d_lis',mode:'self',addr:'Самовывоз из студии',when:day(0,13,30),slot:'13:30',items:[{id:'shampan',s:'L',q:1},{id:'macarons',s:'S',q:1}],dlv:0,card:'',note:''},
 {id:'1046',st:'ready',at:n-5*H,name:'Ольга Мирончик',phone:'+375 44 785-90-31',tg:'',mode:'dlv',addr:'Минск, пр. Независимости 95, офис 410',when:day(0,12),slot:'12:00–14:00',items:[{id:'box',s:'M',q:1}],dlv:12,card:'Спасибо за проект!',note:'Ресепшен, 4 этаж'},
 {id:'1045',st:'ready',at:n-7*H,name:'Сергей Ткач',phone:'+375 29 144-03-62',tg:'stkach',mode:'dlv',addr:'Минск, ул. Притыцкого 29, кв. 88',when:day(0,11),slot:'11:00–13:00',items:[{id:'roses101',s:'M',q:101}],dlv:15,card:'Выходи за меня',note:'Сюрприз — не звонить заранее'},
 {id:'1044',st:'new',at:n-.1*H,name:'Мария Жук',phone:'+375 25 909-11-47',tg:'mariazhuk',mode:'self',addr:'Самовывоз из студии',when:day(1,10),slot:'10:00',items:[{id:'tulips',s:'S',q:25},{id:'vase',s:'M',q:1}],dlv:0,card:'',note:'Оплата при получении'},
 {id:'1043',st:'work',at:n-20*H,name:'Екатерина Бондарь',phone:'+375 29 250-66-80',tg:'kate_b',mode:'dlv',addr:'Минск, ул. Кальварийская 21',when:day(1,9),slot:'09:00–11:00',items:[{id:'bride',s:'M',q:1}],dlv:0,card:'',note:'Свадьба, бутоньерка в тон — уточнить'},
 {id:'1042',st:'done',at:n-26*H,name:'Иван Петрович',phone:'+375 33 671-45-19',tg:'',mode:'self',addr:'Самовывоз из студии',when:day(-1,18),slot:'18:00',items:[{id:'pumpkin',s:'M',q:1}],dlv:0,card:'',note:''},
 {id:'1041',st:'cancel',at:n-30*H,name:'Наталья Скорик',phone:'+375 44 512-38-02',tg:'n_skorik',mode:'dlv',addr:'Минск, ул. Немига 3',when:day(-1,16),slot:'16:00–18:00',items:[{id:'blush',s:'S',q:25}],dlv:12,card:'',note:'Клиент перенёс на другую дату'},
 {id:'1040',st:'done',at:n-48*H,name:'Анна Гордей',phone:'+375 29 380-14-55',tg:'annagordey',mode:'dlv',addr:'Минск, ул. Ленина 8',when:day(-2,14),slot:'14:00–16:00',items:[{id:'haworthia',s:'M',q:1},{id:'macarons',s:'M',q:1}],dlv:12,card:'',note:''}
].map(function(o){o.hist=[{st:'new',t:o.at}];if(o.st!='new')o.hist.push({st:o.st,t:Math.min(Date.now(),o.at+H)});return o})}
// ДЕМО-история за 30 дней для статистики (детерминированная)
function demoHist(){var seed=7,R=function(){seed=(seed*16807)%2147483647;return seed/2147483647},ids=KAT.map(function(x){return x.id}),N=['Ирина','Павел','Юлия','Артём','Светлана','Максим','Виктория','Олег','Дарья','Никита'],L=[],num=1039;
 for(var d=1;d<=60;d++){var k=1+Math.floor(R()*4);for(var j=0;j<k;j++){var at=day(-d,9+Math.floor(R()*10),Math.floor(R()*60)),its=[],m=1+(R()<.3?1:0);
  for(var i=0;i<m;i++){var id=ids[Math.floor(R()*ids.length)],p=KAT.filter(function(x){return x.id==id})[0],s='SML'[Math.floor(R()*3)];its.push({id:id,s:s,q:p&&p.st?p.qs[Math.floor(R()*p.qs.length)]:1})}
  var dl=R()<.55,st=R()<.1?'cancel':'done';L.push({id:String(num--),st:st,at:at,name:N[Math.floor(R()*N.length)],phone:'+375 29 000-00-00',tg:'',mode:dl?'dlv':'self',addr:dl?'Минск':'Самовывоз из студии',when:at+4*3600e3,slot:'—',items:its,dlv:dl?12:0,card:'',note:'',hist:[{st:'new',t:at},{st:st,t:at+3600e3}]})}}
 return L}
var orders=LS.get('aik_ops_orders_v3',null);if(!orders){orders=demo().concat(demoHist());LS.set('aik_ops_orders_v3',orders)}
orders.forEach(function(o){if(o.st=='ship')o.st='ready'}); // миграция старого статуса «Доставка» → «Готов»
function saveO(){LS.set('aik_ops_orders',orders)}
function line(it){var p=prod(it.id)||{n:it.id,ph:[],price:0},k={S:.8,M:1,L:1.3}[it.s]||1,mono=p.st&&p.st[it.s]!=null;
 var unit=mono?p.st[it.s]:(p.sz&&p.sz[it.s]&&p.sz[it.s].p)||Math.round(p.price*k),qty=mono?1:it.q,sum=mono?unit*it.q:unit*it.q;
 return{p:p,label:mono?('Размер '+it.s+' · '+it.q+' шт. × '+money(unit)+' BYN'):('Размер '+it.s+(window.AIK_COMP?' · '+window.AIK_COMP(p,it.s):'')+(it.q>1?' · ×'+it.q:'')),sum:sum,qty:qty}}
function total(o){return o.items.reduce(function(a,it){return a+line(it).sum},0)+(o.dlv||0)}
function fmtD(t){var d=new Date(t),t0=new Date();t0.setHours(0,0,0,0);var df=Math.round((new Date(d).setHours(0,0,0,0)-t0)/864e5);
 return df==0?'Сегодня':df==1?'Завтра':df==-1?'Вчера':d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}
function fmtT(t){return new Date(t).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
function stb(s){return '<span class="st" style="--c:var(--s-'+s+')">'+SN[s]+'</span>'}
var fil=LS.get('aik_ops_fil','active'),sel=null;
function renderFilters(){var c={all:orders.length,active:0};orders.forEach(function(o){c[o.st]=(c[o.st]||0)+1;if(o.st!='done'&&o.st!='cancel')c.active++});
 var h=[['active','Активные'],['all','Все']].concat(ST).map(function(s){return '<button class="chip'+(fil==s[0]?' on':'')+'" data-f="'+s[0]+'" style="--c:var(--s-'+s[0]+',var(--ol))"><i></i>'+s[1]+' <b>'+(c[s[0]]||0)+'</b></button>'}).join('');
 $('#o-filters').innerHTML=h;var today=orders.filter(function(o){return fmtD(o.when)=='Сегодня'&&o.st!='cancel'});
 $('#o-sum').textContent='Сегодня к выдаче: '+today.length+' · новых: '+(c.new||0)+' · сумма активных: '+money(orders.filter(function(o){return o.st!='done'&&o.st!='cancel'}).reduce(function(a,o){return a+total(o)},0))+' BYN'}
function renderList(){var q=($('#o-q').value||'').toLowerCase().trim(),srt=$('#o-sort').value;
 var L=orders.filter(function(o){return fil=='all'||(fil=='active'?(o.st!='done'&&o.st!='cancel'):o.st==fil)}).filter(function(o){return !q||(o.id+' '+o.name+' '+o.phone+' '+o.tg).toLowerCase().indexOf(q)>=0});
 L.sort(srt=='new'?function(a,b){return b.at-a.at}:function(a,b){return a.when-b.when});
 $('#o-list').innerHTML=L.length?L.map(function(o){var w=o.items.map(function(it){return (prod(it.id)||{n:it.id}).n}).join(', ');
  return '<div class="row'+(sel==o.id?' on':'')+(o.st=='cancel'?' cx':'')+'" data-id="'+o.id+'"><div class="when">'+esc(o.slot.split('–')[0])+'<small>'+fmtD(o.when)+'</small></div><div><div class="who">№'+o.id+' · '+esc(o.name)+'</div><div class="what">'+(o.mode=='dlv'?'Доставка':'Самовывоз')+' · '+esc(w)+'</div></div><div class="right">'+stb(o.st)+'<div class="sum">'+money(total(o))+' BYN</div></div></div>'}).join(''):'<div class="card"><div class="empty">Нет заказов в этом статусе</div></div>'}
function renderCard(){var o=orders.filter(function(x){return x.id==sel})[0],c=$('#o-card');document.body.classList.toggle('card-open',!!o);
 if(!o){c.innerHTML='<div class="empty">Выберите заказ слева</div>';return}
 var tel=o.phone.replace(/[^\d+]/g,'');
 c.classList.toggle('cx',o.st=='cancel');
 c.innerHTML='<button class="btn ghost sm back" data-back>← К списку</button><h2>Заказ №'+o.id+'</h2><div class="meta">Оформлен '+fmtT(o.at)+' · '+stb(o.st)+'</div>'+
 (o.st=='cancel'?'<div class="sad">🥀 Заказ отменён'+(o.note?' — '+esc(o.note):'')+'</div>':'')+
 '<div class="blk"><h3>Получение</h3><div class="pick">'+fmtD(o.when)+', '+esc(o.slot)+'<small>'+(o.mode=='dlv'?'Доставка · ':'')+esc(o.addr)+'</small></div></div>'+
 '<div class="blk"><h3>Клиент</h3><div>'+esc(o.name)+'</div><div class="cont"><a href="tel:'+tel+'">☎ '+esc(o.phone)+'</a>'+(o.tg?'<a href="https://t.me/'+esc(o.tg)+'" target="_blank" rel="noopener">✈ @'+esc(o.tg)+'</a>':'')+'</div></div>'+
 '<div class="blk"><h3>Состав</h3>'+o.items.map(function(it){var l=line(it);return '<div class="it"><img src="'+esc(img((l.p.ph||[])[0]||''))+'" alt=""><div>'+esc(l.p.n)+'<small>'+esc(l.label)+'</small></div><div>'+money(l.sum)+'</div></div>'}).join('')+
 (o.dlv?'<div class="tot"><span>Доставка</span><span>'+money(o.dlv)+'</span></div>':'')+'<div class="tot big"><span>Итого</span><span>'+money(total(o))+' BYN</span></div></div>'+
 (o.card||o.note?'<div class="blk"><h3>Пожелания</h3>'+(o.card?'<div class="note">Открытка: «'+esc(o.card)+'»</div>':'')+(o.note?'<div class="note" style="margin-top:6px">'+esc(o.note)+'</div>':'')+'</div>':'')+
 '<div class="blk"><h3>Статус</h3><div class="stsel">'+ST.map(function(s){return '<button data-st="'+s[0]+'" class="'+(o.st==s[0]?'on':'')+'" style="--c:var(--s-'+s[0]+')">'+s[1]+'</button>'}).join('')+'</div></div>'+
 '<div class="blk"><h3>История</h3><ul class="hist">'+o.hist.slice().reverse().map(function(h){return '<li>'+fmtT(h.t)+' — '+SN[h.st]+'</li>'}).join('')+'</ul></div>'}
function renderOrders(){renderFilters();renderList();renderCard()}
$('#o-filters').onclick=function(e){var b=e.target.closest('[data-f]');if(!b)return;fil=b.dataset.f;LS.set('aik_ops_fil',fil);renderOrders()};
$('#o-q').oninput=renderList;$('#o-sort').onchange=renderList;
$('#o-list').onclick=function(e){var r=e.target.closest('.row');if(!r)return;location.hash='order/'+r.dataset.id};
$('#o-card').onclick=function(e){if(e.target.closest('[data-back]')){location.hash='orders';return}var b=e.target.closest('[data-st]');if(!b)return;
 var o=orders.filter(function(x){return x.id==sel})[0];if(!o||o.st==b.dataset.st)return;o.st=b.dataset.st;o.hist.push({st:o.st,t:Date.now()});saveO();renderOrders();toast('Заказ №'+o.id+': '+SN[o.st])};

/* ---------- Каталог ---------- */

/* ---------- Себестоимость v2 (внутренние данные: localStorage aik_ops_cost2 / ops-cost.json, НЕ в kat.js) ----------
   fl — справочник цветов (закупка за шт.), pk — справочник упаковки, wage — ЗП флориста (fix по размеру или % от цены),
   set — налог %, эквайринг %, накладные на заказ, доставка (затраты курьера на заказ с доставкой),
   it[товар][S|M|L] = {f:[[цветок,кол-во]], k:[[упаковка,кол-во]], ot:прочее}; it[товар].nw — без ЗП флориста.
   Монобукет: состав «цветы» — на 1 шт., умножается на количество; упаковка, ЗП и прочее — на букет. */
var SZ=['S','M','L'],KF={S:.8,M:1,L:1.3};
function applySp(o,sp){var mono=!!o.st;if(mono){o.st=JSON.parse(JSON.stringify(KAT.filter(function(x){return x.id==o.id})[0].st));SZ.forEach(function(s){if(sp[s]!=null&&sp[s]!=='')o.st[s]=+sp[s]})}
 else if(o.sz){o.sz=JSON.parse(JSON.stringify(o.sz));SZ.forEach(function(s){if(sp[s]!=null&&sp[s]!==''&&o.sz[s])o.sz[s].p=+sp[s]})}}
function num(v){v=parseFloat(String(v==null?'':v).replace(',','.'));return isFinite(v)?v:0}
function origPrice(id,s,base){var o=KAT.filter(function(x){return x.id==id})[0];return o.st?num(o.st[s]):((o.sz&&o.sz[s]&&o.sz[s].p)||Math.round(base*KF[s]))}
function sizePrice(p,s){return p.st?num(p.st[s]):((p.sz&&p.sz[s]&&p.sz[s].p)||Math.round(p.price*KF[s]))}
function grade(x){return x.net<0?'bad':x.mg>=.3?'good':'mid'}
function pct(x){return Math.round(x*100)+'%'}
function m0(x){return money(Math.round(x*10)/10)}
function uid(p){return p+Math.random().toString(36).slice(2,8)}
function demoCost(){function c(f,k,ot){return{f:f,k:k||[],ot:ot||0}}var kl=[['kr',1],['le',1]];
 return{v:2,demo:true,set:{tax:6,acq:2.5,ovh:3,dlv:9}, // ДЕМО-цены, заменить реальными закупочными
 fl:[{id:'rp',n:'Роза пионовидная',p:3.2},{id:'ro',n:'Роза',p:1.9},{id:'di',n:'Диантус',p:1.1},{id:'pi',n:'Пион',p:8.5},{id:'tu',n:'Тюльпан',p:1.6},{id:'hr',n:'Хризантема кустовая',p:2.4},{id:'ev',n:'Эвкалипт',p:1.3},{id:'gy',n:'Гипсофила',p:1.5},{id:'ru',n:'Рускус',p:.8},{id:'al',n:'Альстромерия',p:1.7},{id:'rk',n:'Роза кустовая',p:2.6}],
 pk:[{id:'kr',n:'Крафт',p:2.5},{id:'pl',n:'Плёнка матовая',p:1.8},{id:'le',n:'Лента атласная',p:1.2},{id:'bx',n:'Коробка шляпная',p:18},{id:'ok',n:'Открытка',p:1.5},{id:'se',n:'Сетка флористическая',p:2},{id:'oa',n:'Губка-оазис',p:3}],
 wage:{mode:'fix',S:10,M:14,L:18,pct:10},
 it:{shampan:{S:c([['rp',9],['di',6]],[['kr',1],['le',1],['ok',1]]),M:c([['rp',15],['di',10]],[['kr',1],['le',1],['ok',1]]),L:c([['rp',21],['di',14],['ev',3]],[['kr',2],['le',1],['ok',1]])},
  peony:{S:c([['pi',1]],kl),M:c([['pi',1]],kl),L:c([['pi',1]],kl)},tulips:{S:c([['tu',1]],[['pl',1],['le',1]]),M:c([['tu',1]],[['pl',1],['le',1]]),L:c([['tu',1]],[['pl',1],['le',1]])},
  box:{S:c([['ro',8],['hr',5]],[['bx',1],['oa',1]]),M:c([['ro',12],['hr',8]],[['bx',1],['oa',1]]),L:c([['ro',18],['hr',12]],[['bx',1],['oa',1]])},
  blush:{S:c([['rp',1]],kl),M:c([['rp',1]],kl),L:c([['rp',1]],kl)},roses101:{S:c([['ro',1]],[['pl',2],['le',1]]),M:c([['ro',1]],[['pl',2],['le',1]]),L:c([['ro',1]],[['pl',2],['le',1]])},
  bride:{S:c([['rp',12],['ev',3]],[['le',2]]),M:c([['rp',16],['ev',4]],[['le',2]]),L:c([['rp',22],['ev',5]],[['le',2]])},
  pumpkin:{S:c([['hr',5]],[['oa',1]],8),M:c([['hr',8]],[['oa',1]],10),L:c([['hr',11]],[['oa',1]],12)},
  haworthia:{nw:true,S:c([],[],18),M:c([],[],24),L:c([],[],30)},vase:{nw:true,S:c([],[],30),M:c([],[],40),L:c([],[],50)},macarons:{nw:true,S:c([],[['ok',1]],15),M:c([],[['ok',1]],22),L:c([],[['ok',1]],29)}}}}
// Миграция старой модели (суммы fl/pk/wk/lg/ot по размеру): цветы → основной цветок товара × кол-во, упаковка+логистика+прочее → «прочее», ЗП → общая ставка
function migrate(o,c){c.demo=false;if(o.set){c.set.tax=num(o.set.tax);c.set.acq=num(o.set.acq);c.set.ovh=num(o.set.ovh)}c.it={};
 Object.keys(o.it||{}).forEach(function(id){var p=KAT.filter(function(x){return x.id==id})[0];if(!p)return;var cm=(p.cm+' '+p.n).toLowerCase(),f=c.fl.filter(function(x){return cm.indexOf(x.n.toLowerCase().slice(0,4))>=0})[0]||c.fl[1];
  c.it[id]={};SZ.forEach(function(s){var r=o.it[id][s];if(!r)return;c.it[id][s]={f:num(r.fl)?[[f.id,Math.max(1,Math.round(num(r.fl)/(num(f.p)||1)))]]:[],k:[],ot:num(r.pk)+num(r.lg)+num(r.ot)}})});return c}
var _cc=null;function costDB(){if(_cc)return _cc;var c=LS.get('aik_ops_cost2',null);if(!c){var o=LS.get('aik_ops_cost',null);c=demoCost();if(o&&!o.demo)c=migrate(o,c);LS.set('aik_ops_cost2',c)}return _cc=c}
function saveC(C){delete C.demo;_cc=C;LS.set('aik_ops_cost2',C)}
function byId(L,id){for(var i=0;i<L.length;i++)if(L[i].id==id)return L[i];return null}
function comp(id,s){var C=costDB(),P=C.it[id];if(!P||!P[s])return null;var r=P[s],fl=0,pk=0;
 (r.f||[]).forEach(function(x){var f=byId(C.fl,x[0]);if(f)fl+=num(f.p)*num(x[1])});(r.k||[]).forEach(function(x){var k=byId(C.pk,x[0]);if(k)pk+=num(k.p)*num(x[1])});
 if(!fl&&!pk&&!num(r.ot))return null;return{fl:fl,pk:pk,ot:num(r.ot),nw:!!P.nw}}
function wageOf(s,rev,nw){if(nw)return 0;var w=costDB().wage||{};return w.mode=='pct'?rev*num(w.pct)/100:num(w[s])}
// Расчёт по размеру. Монобукет — на q0 шт.
function calc(p,s,unit,r,set){var mono=!!p.st,q=mono?(p.q0||1):1,rev=mono?unit*q:unit,wk=wageOf(s,rev,r.nw),fl=r.fl*q,ovh=num(set.ovh),c=fl+r.pk+wk+r.ot+ovh,fee=rev*(num(set.tax)+num(set.acq))/100,net=rev-fee-c;
 return{rev:rev,cost:c,fee:fee,net:net,mg:rev?net/rev:0,mk:c?(rev-c)/c:0,fl:fl,pk:r.pk,wk:wk,ot:r.ot,ovh:ovh}}
function netBadge(p){var r=comp(p.id,'M');if(!r)return '<a class="nb none" href="#stats/cost">себестоимость не задана</a>';var x=calc(p,'M',sizePrice(p,'M'),r,costDB().set);
 return '<div class="nb '+grade(x)+'">чистыми '+m0(x.net)+' BYN <small>· M'+(p.st?', '+p.q0+' шт.':'')+' · маржа '+pct(x.mg)+'</small></div>'}
function itemCost(it,r,p,l){var q=it.q||1;if(p.st)return r.fl*q+r.pk+r.ot+wageOf(it.s,l.sum,r.nw);var u=l.sum/q;return (r.fl+r.pk+r.ot+wageOf(it.s,u,r.nw))*q}
// Чистая прибыль по заказу или null, если по какой-то позиции нет себестоимости
function orderNet(o){var C=costDB(),net=0;for(var i=0;i<o.items.length;i++){var it=o.items[i],r=comp(it.id,it.s);if(!r)return null;var l=line(it);net+=l.sum-itemCost(it,r,l.p,l)}
 var t=total(o);return net+(o.dlv||0)-(o.mode=='dlv'?num(C.set.dlv):0)-t*(num(C.set.tax)+num(C.set.acq))/100-num(C.set.ovh)}
function costForm(p){var e=edits()[p.id]||{},sp=e.sp||{},mono=!!p.st;
 return '<div class="cost"><h3>Цены по размерам и прибыль <small>себестоимость задаётся во вкладке <a href="#stats/cost" class="lnk">Статистика → Себестоимость</a></small></h3>'+(mono?'<div class="hint">Монобукет: цена за 1 шт., расчёт на букет из '+p.q0+' шт. (по умолчанию на сайте).</div>':'')+
 '<table class="ct"><thead><tr><th></th>'+SZ.map(function(s){return '<th>'+s+(p.sz&&p.sz[s]&&p.sz[s].d?'<small>'+esc(p.sz[s].d)+'</small>':'')+'</th>'}).join('')+'</tr></thead><tbody>'+
 '<tr class="pr"><td>'+(mono?'Цена за 1 шт., BYN':'Цена, BYN')+'</td>'+SZ.map(function(s){return '<td><input data-sp="'+s+'" inputmode="decimal" value="'+esc(sp[s]!=null?sp[s]:'')+'" placeholder="'+origPrice(p.id,s,p.price)+'"></td>'}).join('')+'</tr>'+
 '</tbody><tbody id="c-out"></tbody></table><div class="hint">Пустая цена размера = как на сайте'+(mono?'':' (S ×0,8, M = цена, L ×1,3)')+'. Результат только для чтения.</div></div>'}
function resRows(out,full){function row(t,fn,cls){return '<tr class="'+(cls||'')+'"><td>'+t+'</td>'+out.map(function(x){return x?'<td class="'+(cls=='net'||cls=='pc'?grade(x):'')+'">'+fn(x)+'</td>':'<td class="na">—</td>'}).join('')+'</tr>'}
 return (full?row('Выручка с букета',function(x){return m0(x.rev)}):'')+row('Себестоимость итого',function(x){return m0(x.cost)})+(full?row('Налог + эквайринг',function(x){return m0(x.fee)}):'')+
  row('Чистыми, BYN',function(x){return '<b>'+m0(x.net)+'</b>'},'net')+row('Маржа / наценка',function(x){return pct(x.mg)+' / '+pct(x.mk)},'pc')}
function costLive(){var f=$('#k-form form');if(!f||!$('#c-out'))return;var p=prod(cur),C=costDB(),base=num(f.p.value);if(!p.st)p.price=base;
 var out=SZ.map(function(s){var ip=f.querySelector('[data-sp="'+s+'"]');ip.placeholder=origPrice(cur,s,base);var unit=ip.value!==''?num(ip.value):num(ip.placeholder),r=comp(cur,s);return r?calc(p,s,unit,r,C.set):null});
 $('#c-out').innerHTML=out.some(Boolean)?resRows(out,true):'<tr><td colspan="4" class="nohint">Себестоимость не задана — <a href="#stats/cost" class="lnk">задайте в Статистике</a>, и здесь появится «чистыми» и маржа.</td></tr>'}
function costRes(id,s){var r=comp(id,s),p=prod(id);return r?calc(p,s,sizePrice(p,s),r,costDB().set):null}

/* ---------- Вкладка «Статистика → Себестоимость» ---------- */
var cOpen={shampan:1},cQ={f:'',k:'',b:''};
function usedIn(kind,id){var C=costDB(),n=0;Object.keys(C.it).forEach(function(p){SZ.forEach(function(s){var r=C.it[p][s];if(r&&(r[kind]||[]).some(function(x){return x[0]==id}))n++})});return n}
function dirPanel(kind,title,ph){var C=costDB(),L=C[kind=='f'?'fl':'pk'];
 return '<div class="panel cdir" data-dir="'+kind+'"><div class="ph2"><h3>'+title+' <small>'+L.length+'</small></h3><input type="search" class="cq" data-q="'+kind+'" placeholder="'+ph+'" value="'+esc(cQ[kind])+'"></div>'+
 '<table class="dt"><thead><tr><th>Название</th><th>'+(kind=='f'?'Закупка за шт.':'Цена за шт.')+', BYN</th><th>В букетах</th><th></th></tr></thead><tbody>'+
 L.map(function(x){var u=usedIn(kind,x.id);return '<tr data-row="'+esc(x.n.toLowerCase())+'"><td><input data-dn="'+kind+'.'+x.id+'" value="'+esc(x.n)+'"></td><td><input class="pp" data-dp="'+kind+'.'+x.id+'" inputmode="decimal" value="'+x.p+'"></td><td class="mut">'+(u?u+' разм.':'—')+'</td><td><button class="xb" data-ddel="'+kind+'.'+x.id+'" title="Удалить">×</button></td></tr>'}).join('')+
 '</tbody></table><button class="btn ghost sm" data-dadd="'+kind+'">＋ '+(kind=='f'?'Добавить цветок':'Добавить упаковку')+'</button></div>'}
function lines(C,id,s,kind){var r=(C.it[id]||{})[s]||{},L=r[kind]||[],D=C[kind=='f'?'fl':'pk'];
 return L.map(function(x,i){return '<div class="ln"><select data-bl="'+id+'.'+s+'.'+kind+'.'+i+'">'+D.map(function(d){return '<option value="'+d.id+'"'+(d.id==x[0]?' selected':'')+'>'+esc(d.n)+' · '+money(d.p)+'</option>'}).join('')+'</select><input data-bq="'+id+'.'+s+'.'+kind+'.'+i+'" inputmode="decimal" value="'+x[1]+'"><button class="xb" data-bx="'+id+'.'+s+'.'+kind+'.'+i+'">×</button></div>'}).join('')+
 '<button class="addl" data-ba="'+id+'.'+s+'.'+kind+'">＋ '+(kind=='f'?'цветок':'упаковка')+'</button>'}
function bouquetPanel(){var C=costDB();
 return '<div class="panel"><div class="ph2"><h3>Букеты <small>состав по размерам → себестоимость считается сама</small></h3><input type="search" class="cq" data-q="b" placeholder="Поиск букета" value="'+esc(cQ.b)+'"></div>'+
 KAT.map(function(x){var p=prod(x.id),P=C.it[x.id]||{},mono=!!p.st;
  return '<details class="bq" data-b="'+x.id+'" data-row="'+esc(p.n.toLowerCase())+'"'+(cOpen[x.id]?' open':'')+'><summary><img src="'+esc(img(p.ph[0]))+'" alt=""><span class="bn">'+esc(p.n)+'<small>'+esc(p.c)+(mono?' · поштучно, букет '+p.q0+' шт.':'')+'</small></span><span class="bsum" data-bres="'+x.id+'"></span></summary>'+
  '<div class="bb"><label class="nw"><input type="checkbox" data-nw="'+x.id+'"'+(P.nw?' checked':'')+'> без ЗП флориста (готовый товар)</label><div class="szg">'+SZ.map(function(s){var r=P[s]||{};
   return '<div class="szc"><h4>'+s+' <small>'+(mono?money(sizePrice(p,s))+' BYN/шт.':money(sizePrice(p,s))+' BYN')+(p.sz&&p.sz[s]&&p.sz[s].d?' · '+esc(p.sz[s].d):'')+'</small></h4>'+
   '<div class="lb">Цветы'+(mono?' (на 1 шт.)':'')+'</div>'+lines(C,x.id,s,'f')+'<div class="lb">Упаковка</div>'+lines(C,x.id,s,'k')+
   '<div class="lb">Прочее, BYN</div><input class="oth" data-bo="'+x.id+'.'+s+'" inputmode="decimal" value="'+(num(r.ot)||'')+'" placeholder="0"><div class="res" data-res="'+x.id+'.'+s+'"></div></div>'}).join('')+'</div></div></details>'}).join('')+'</div>'}
function renderCostView(){var C=costDB(),s=C.set,w=C.wage||{};
 var h='<div class="cgrid"><div class="panel"><h3>Общие'+(C.demo?' <span class="demo-s">демо-значения</span>':'')+'</h3><div class="sets">'+
  [['tax','Налог, %'],['acq','Эквайринг, %'],['ovh','Накладные на заказ, BYN'],['dlv','Доставка (курьер) на заказ, BYN']].map(function(f){return '<label>'+f[1]+'<input data-set="'+f[0]+'" inputmode="decimal" value="'+num(s[f[0]])+'"></label>'}).join('')+'</div>'+
  '<div class="sets" style="margin-top:12px"><button class="btn ghost sm" id="c-exp">Скачать ops-cost.json</button><label class="btn ghost sm imp">Загрузить ops-cost.json<input type="file" accept="application/json,.json" id="c-imp"></label></div></div>'+
  '<div class="panel"><h3>ЗП флориста</h3><div class="seg"><button data-wm="fix" class="'+(w.mode!='pct'?'on':'')+'">Ставка за букет</button><button data-wm="pct" class="'+(w.mode=='pct'?'on':'')+'">% от цены</button></div><div class="sets">'+
  (w.mode=='pct'?'<label>Процент от цены букета, %<input data-w="pct" inputmode="decimal" value="'+num(w.pct)+'"></label>':SZ.map(function(z){return '<label>Размер '+z+', BYN<input data-w="'+z+'" inputmode="decimal" value="'+num(w[z])+'"></label>'}).join(''))+'</div><div class="hint">Не начисляется на товары с отметкой «без ЗП флориста».</div></div></div>'+
  '<div class="cgrid">'+dirPanel('f','Цветы','Поиск цветка по названию')+dirPanel('k','Упаковка','Поиск упаковки')+'</div>'+bouquetPanel();
 $('#s-costv').innerHTML=h;['f','k','b'].forEach(filt);fillRes()}
function filt(k){var q=cQ[k].toLowerCase().trim(),box=k=='b'?$('#s-costv'):$('#s-costv [data-dir="'+k+'"]');if(!box)return;(k=='b'?box.querySelectorAll('details.bq'):box.querySelectorAll('tbody tr')).forEach(function(r){r.style.display=!q||r.dataset.row.indexOf(q)>=0?'':'none'})}
function fillRes(){document.querySelectorAll('#s-costv [data-res]').forEach(function(el){var k=el.dataset.res.split('.'),x=costRes(k[0],k[1]);
  el.className='res '+(x?grade(x):'');el.innerHTML=x?'<div><span>Цветы</span><b>'+m0(x.fl)+'</b></div><div><span>Упаковка</span><b>'+m0(x.pk)+'</b></div><div><span>ЗП флориста</span><b>'+m0(x.wk)+'</b></div><div><span>Прочее + накладные</span><b>'+m0(x.ot+x.ovh)+'</b></div>'+
  '<div class="t"><span>Себестоимость</span><b>'+m0(x.cost)+'</b></div><div><span>Налог + эквайринг</span><b>'+m0(x.fee)+'</b></div><div class="n"><span>Чистыми</span><b>'+m0(x.net)+' BYN</b></div><div class="m"><span>Маржа / наценка</span><b>'+pct(x.mg)+' / '+pct(x.mk)+'</b></div>':'<div class="mut">Добавьте состав — расчёт появится здесь</div>'});
 document.querySelectorAll('#s-costv [data-bres]').forEach(function(el){var x=costRes(el.dataset.bres,'M');el.innerHTML=x?'<span class="nb '+grade(x)+'">M: чистыми '+m0(x.net)+' · '+pct(x.mg)+'</span>':'<span class="nb none">не задано</span>'})}
function lineRef(k){k=k.split('.');var C=costDB(),P=C.it[k[0]]=C.it[k[0]]||{},r=P[k[1]]=P[k[1]]||{f:[],k:[],ot:0};r.f=r.f||[];r.k=r.k||[];return{C:C,r:r,kind:k[2],i:+k[3]}}
var CV=$('#s-costv');
CV.addEventListener('input',function(e){var d=e.target.dataset,C,R;
 if(d.q!=null){cQ[d.q]=e.target.value;filt(d.q);return}
 if(d.set){C=costDB();C.set[d.set]=num(e.target.value);saveC(C)}
 else if(d.w){C=costDB();C.wage[d.w]=num(e.target.value);saveC(C)}
 else if(d.dp||d.dn){var k=(d.dp||d.dn).split('.');C=costDB();var x=byId(C[k[0]=='f'?'fl':'pk'],k[1]);if(!x)return;if(d.dp)x.p=num(e.target.value);else x.n=e.target.value;saveC(C)}
 else if(d.bq){R=lineRef(d.bq);R.r[R.kind][R.i][1]=num(e.target.value);saveC(R.C)}
 else if(d.bo){R=lineRef(d.bo+'.f.0');R.r.ot=num(e.target.value);saveC(R.C)}
 else return;fillRes()});
CV.addEventListener('change',function(e){var d=e.target.dataset,R,C;
 if(d.bl){R=lineRef(d.bl);R.r[R.kind][R.i][0]=e.target.value;saveC(R.C);fillRes()}
 else if(d.nw){C=costDB();C.it[d.nw]=C.it[d.nw]||{};C.it[d.nw].nw=e.target.checked;saveC(C);fillRes()}
 else if(d.dn){renderCostView()}
 else if(e.target.id=='c-imp'&&e.target.files[0]){var fr=new FileReader();fr.onload=function(){try{var c=JSON.parse(fr.result);if(!c.fl||!c.pk||!c.it)throw 0;LS.set('aik_ops_cost2',c);_cc=c;renderCostView();toast('Себестоимость загружена')}catch(x){toast('Файл не похож на ops-cost.json')}};fr.readAsText(e.target.files[0])}});
CV.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var d=b.dataset,C,R,k;
 if(b.id=='c-exp'){dl('ops-cost.json',new Blob([JSON.stringify(costDB(),null,1)],{type:'application/json'}));return}
 if(d.wm){C=costDB();C.wage.mode=d.wm;saveC(C)}
 else if(d.dadd){C=costDB();var L=C[d.dadd=='f'?'fl':'pk'],nid=uid(d.dadd);L.push({id:nid,n:d.dadd=='f'?'Новый цветок':'Новая упаковка',p:0});saveC(C);cQ[d.dadd]='';renderCostView();var inp=$('[data-dn="'+d.dadd+'.'+nid+'"]');if(inp){inp.focus();inp.select()}return}
 else if(d.ddel){k=d.ddel.split('.');var u=usedIn(k[0],k[1]);if(u&&!confirm('Используется в '+u+' размерах букетов. Удалить и убрать из составов?'))return;C=costDB();var key=k[0]=='f'?'fl':'pk';C[key]=C[key].filter(function(x){return x.id!=k[1]});
  Object.keys(C.it).forEach(function(p){SZ.forEach(function(s){var r=C.it[p][s];if(r&&r[k[0]])r[k[0]]=r[k[0]].filter(function(x){return x[0]!=k[1]})})});saveC(C)}
 else if(d.bx){R=lineRef(d.bx);R.r[R.kind].splice(R.i,1);saveC(R.C)}
 else if(d.ba){R=lineRef(d.ba+'.0');var D=R.C[R.kind=='f'?'fl':'pk'];if(!D.length){toast('Сначала добавьте позицию в справочник');return}R.r[R.kind].push([D[0].id,1]);saveC(R.C)}
 else return;e.preventDefault();var y=scrollY;renderCostView();scrollTo(0,y)});
CV.addEventListener('toggle',function(e){var t=e.target;if(t.dataset&&t.dataset.b)cOpen[t.dataset.b]=t.open?1:0},true);
function renderKat(){var q=($('#k-q').value||'').toLowerCase();
 $('#k-grid').innerHTML=KAT.map(function(x){return prod(x.id)}).filter(function(p){return !q||(p.n+' '+p.c).toLowerCase().indexOf(q)>=0}).map(function(p){
  return '<div class="prod"><div class="ph" style="background-image:url(\''+esc(img(p.ph[0]))+'\')"><span class="tag">'+esc(p.c)+'</span>'+(p._ed?'<span class="ed">ИЗМЕНЁН</span>':'')+'</div><div class="bd"><h3>'+esc(p.n)+'</h3><div class="pr">'+(p.st?'от '+money(p.st.S)+' BYN/шт.':money(p.price)+' BYN')+'</div><p>'+esc(p.d)+'</p>'+netBadge(p)+'<div class="act"><button class="btn ghost sm" data-ed="'+p.id+'">Редактировать</button></div></div></div>'}).join('')}
var cur=null,curPh=null,curI=0;
function openEd(id){var p=prod(id);cur=id;curPh=p.ph.slice();curI=0;var m=$('#k-modal');m.hidden=false;
 $('#k-form').innerHTML='<form class="f"><h2>'+esc(p.n)+'</h2><div><div class="main" id="f-main"></div><div class="thumbs" id="f-th"></div>'+
 '<label class="up">＋ Добавить фото<input type="file" accept="image/*" id="f-file"></label><div class="hint">Фото сжимается до 1400 px. Новое фото добавляется в конец. Порядок — перетаскиванием мышью или пальцем, первое фото главное. × — удалить.</div></div>'+
 '<div><label>Название</label><input name="n" value="'+esc(p.n)+'"><label>'+(p.st?'Базовая цена, BYN (у монобукета не используется — цены за 1 шт. в блоке «Себестоимость»)':'Цена, BYN')+'</label><input name="p" type="number" min="0" step="1" value="'+p.price+'">'+
 '<label>Состав (коротко)</label><input name="cm" value="'+esc(p.cm)+'"><label>Описание</label><textarea name="d">'+esc(p.d)+'</textarea></div>'+
 costForm(p)+'<div class="acts"><button type="button" class="btn ghost" data-close>Отмена</button><button class="btn">Сохранить</button></div></form>';drawPh();costLive()}
$('#k-modal').addEventListener('input',function(e){if(e.target.dataset.sp||e.target.name=='p')costLive()});
function drawPh(){$('#f-main').style.backgroundImage=curPh.length?'url("'+img(curPh[0])+'")':'none';$('#f-th').innerHTML=curPh.map(function(u,i){return '<div class="'+(i==0?'on':'')+'" data-i="'+i+'" style="background-image:url(\''+esc(img(u))+'\')">'+(i==0?'<em>главное</em>':'')+'<button type="button" class="del" data-del="'+i+'" aria-label="Удалить фото">×</button></div>'}).join('')}
// Перетаскивание миниатюр: Pointer Events (мышь + палец). Порядок = порядок в DOM, первое фото — главное.
(function(){var dr=null,sx=0,sy=0,moved=false;
 document.addEventListener('pointerdown',function(e){var t=e.target.closest('#f-th [data-i]');if(!t||e.target.closest('[data-del]'))return;e.preventDefault();dr=t;sx=e.clientX;sy=e.clientY;moved=false;t.setPointerCapture(e.pointerId)});
 document.addEventListener('pointermove',function(e){if(!dr)return;if(!moved&&Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)<6)return;moved=true;dr.classList.add('drag');
  var u=document.elementFromPoint(e.clientX,e.clientY),o=u&&u.closest('#f-th [data-i]');if(!o||o==dr)return;var r=o.getBoundingClientRect(),after=e.clientX>r.left+r.width/2;o.parentNode.insertBefore(dr,after?o.nextSibling:o)});
 function end(){if(!dr)return;var th=$('#f-th'),i0=+dr.dataset.i;dr.classList.remove('drag');
  if(moved){var ord=[].map.call(th.children,function(c){return +c.dataset.i});curPh=ord.map(function(i){return curPh[i]})}
  dr=null;drawPh()}
 document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end)})();
function shrink(file,cb){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.85))};im.src=r.result};r.readAsDataURL(file)}
$('#k-grid').onclick=function(e){var b=e.target.closest('[data-ed]');if(b)openEd(b.dataset.ed)};
$('#k-q').oninput=renderKat;
$('#k-modal').onclick=function(e){if(e.target==this||e.target.closest('[data-close]')){this.hidden=true;return}var d=e.target.closest('[data-del]');if(d){if(curPh.length<2){toast('Нужно оставить хотя бы одно фото');return}curPh.splice(+d.dataset.del,1);drawPh()}};
$('#k-modal').onchange=function(e){if(e.target.id=='f-file'&&e.target.files[0])shrink(e.target.files[0],function(u){curPh.push(u);drawPh();toast('Фото добавлено в конец — не забудьте «Сохранить»')})};
$('#k-modal').onsubmit=function(e){e.preventDefault();var f=e.target,E=edits(),o=KAT.filter(function(x){return x.id==cur})[0];
 E[cur]={n:f.n.value.trim()||o.n,p:f.p.value,cm:f.cm.value.trim(),d:f.d.value.trim()};if(curPh.join('|')!=o.ph.join('|'))E[cur].ph=curPh;
 var sp={},any=0;SZ.forEach(function(s){var v=f.querySelector('[data-sp="'+s+'"]').value.trim();if(v!==''){sp[s]=num(v);any=1}});if(any)E[cur].sp=sp;

 if(LS.set('aik_ops_kat',E)){$('#k-modal').hidden=true;renderKat();toast('Сохранено в этом браузере')}};
$('#k-reset').onclick=function(){if(confirm('Сбросить все правки каталога в этом браузере?')){localStorage.removeItem('aik_ops_kat');renderKat();toast('Правки сброшены')}};
// Экспорт: подменяем только массив window.AIK_KAT в исходном kat.js, комментарии и функции-помощники сохраняются.
// Загруженные фото выносятся в img/ops/<id>-N.jpg и скачиваются отдельными файлами (их нужно положить в img/ops/).
function dl(name,blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
function lit(v){return JSON.stringify(v)}
function itemSrc(x){var e=edits()[x.id],o={},files=[];for(var k in x)o[k]=x[k];
 if(e){['n','cm','d'].forEach(function(k){if(e[k])o[k]=e[k]});if(e.p!=null&&e.p!=='')o.p=+e.p;if(e.sp)applySp(o,e.sp);
  if(e.ph)o.ph=e.ph.map(function(u,i){if(/^data:/.test(u)){var nm='img/ops/'+x.id+'-'+(i+1)+'.jpg';files.push([nm,u]);return nm}return u})}
 var s='{'+Object.keys(o).map(function(k){return k+':'+lit(o[k])}).join(',')+'}';return{s:s,files:files}}
$('#k-export').onclick=function(){var files=[],arr='window.AIK_KAT=[\n'+KAT.map(function(x){var r=itemSrc(x);files=files.concat(r.files);return r.s}).join(',\n')+'\n];';
 function out(src){var txt;if(src&&src.indexOf('window.AIK_KAT=[')>=0){var a=src.indexOf('window.AIK_KAT=['),b=src.indexOf('\n];',a);txt=src.slice(0,a)+arr+src.slice(b+3)}
  else txt='/* Каталог AI KVETKA (экспорт из ops). p — базовая цена BYN из операционки. */\n'+arr+'\nwindow.AIK_KAT_BASE=(function(){var s=document.currentScript;return s?s.getAttribute(\'src\').replace(/js\\/kat\\.js.*$/,\'\'):\'\'})();\n'+
   ['AIK_FIND','AIK_SZ','AIK_COMP','AIK_MONEY'].filter(function(k){return window[k]}).map(function(k){return 'window.'+k+'='+window[k].toString()+';'}).join('\n')+'\n';
  dl('kat.js',new Blob([txt],{type:'text/javascript'}));files.forEach(function(f,i){setTimeout(function(){fetch(f[1]).then(function(r){return r.blob()}).then(function(b){dl(f[0].split('/').pop(),b)})},400*(i+1))});
  toast('kat.js скачан'+(files.length?' + фото: '+files.length+' (в img/ops/)':''))}
 fetch(BASE+'js/kat.js',{cache:'no-store'}).then(function(r){return r.ok?r.text():null}).then(out,function(){out(null)})};


/* ---------- Статистика ---------- */
var per=LS.get('aik_ops_per',7);
function t0(){var d=new Date();d.setHours(0,0,0,0);return d.getTime()}
function inP(o,days,off){var a=t0()-(days-1+(off||0))*864e5,b=t0()+(1-(off||0))*864e5;return o.at>=a&&o.at<b}
function agg(days,off){var L=orders.filter(function(o){return inP(o,days,off)}),ok=L.filter(function(o){return o.st!='cancel'}),rev=ok.reduce(function(a,o){return a+total(o)},0);
 return{L:L,ok:ok,rev:rev,n:L.length,avg:ok.length?rev/ok.length:0,cx:L.length?(L.length-ok.length)/L.length:0}}
function dlt(a,b){if(!b)return '';var p=Math.round((a-b)/b*100);return '<span class="dl '+(p>=0?'pos':'neg')+'">'+(p>=0?'↑ ':'↓ ')+Math.abs(p)+'%</span>'}
function renderStats(){var A=agg(per),P=agg(per,per),pl=per==1?'вчера':'пред. '+per+' дн.';
 $('#s-per').innerHTML=[[1,'Сегодня'],[7,'7 дней'],[30,'30 дней']].map(function(x){return '<button class="chip'+(per==x[0]?' on':'')+'" data-per="'+x[0]+'">'+x[1]+'</button>'}).join('');
 function kp(t,v,d,s){return '<div class="kpi"><h3>'+t+'</h3><div class="v">'+v+'</div><div class="k">'+d+(s?' <small>vs '+pl+'</small>':'')+'</div></div>'}
 var h='<div class="kpis">'+kp('Выручка',money(Math.round(A.rev))+' <small>BYN</small>',dlt(A.rev,P.rev),1)+kp('Заказы',A.n,dlt(A.n,P.n),1)+kp('Средний чек',money(Math.round(A.avg))+' <small>BYN</small>',dlt(A.avg,P.avg),1)+kp('Отменено',Math.round(A.cx*100)+'%',(A.n-A.ok.length)+' из '+A.n,0)+'</div>';
 var NA=A.ok.map(orderNet),cov=NA.filter(function(x){return x!=null}),netS=cov.reduce(function(a,b){return a+b},0),revC=A.ok.filter(function(o,i){return NA[i]!=null}).reduce(function(a,o){return a+total(o)},0);
 h+='<div class="kpis net1">'+(cov.length?kp('Чистая прибыль',m0(netS)+' <small>BYN</small>','<span class="dl '+(netS>=0?'pos':'neg')+'">маржа '+pct(revC?netS/revC:0)+'</span> · посчитано по '+cov.length+' из '+A.ok.length+' заказов с себестоимостью',0):kp('Чистая прибыль','—','Задайте во вкладке <a class="lnk" href="#stats/cost">Себестоимость</a>',0))+'</div>';
 // график по дням
 var D=per==1?7:per,days=[],mx=1;for(var i=D-1;i>=0;i--){var a=t0()-i*864e5,v=orders.filter(function(o){return o.st!='cancel'&&o.at>=a&&o.at<a+864e5}).reduce(function(s,o){return s+total(o)},0);days.push({a:a,v:v});mx=Math.max(mx,v)}
 var W=720,H=200,bw=W/D,svg='<svg viewBox="0 0 '+W+' '+(H+24)+'" class="chart">'+[.25,.5,.75,1].map(function(f){return '<line x1="0" x2="'+W+'" y1="'+(H-H*f*.9)+'" y2="'+(H-H*f*.9)+'"/>'}).join('')+
  days.map(function(d,i){var bh=d.v/mx*H*.9,x=i*bw+bw*.18,w=bw*.64,td=i==D-1,dt=new Date(d.a);return '<rect class="'+(td?'td':'')+'" x="'+x+'" y="'+(H-bh)+'" width="'+w+'" height="'+Math.max(bh,1)+'" rx="'+Math.min(6,w/3)+'"><title>'+dt.toLocaleDateString('ru-RU')+': '+money(d.v)+' BYN</title></rect>'+
   ((D<=7||i%5==0||td)?'<text x="'+(x+w/2)+'" y="'+(H+17)+'">'+(D<=7?dt.toLocaleDateString('ru-RU',{weekday:'short'}):dt.getDate())+'</text>':'')}).join('')+'</svg>';
 h+='<div class="sgrid"><div class="panel wide"><h3>Выручка по дням'+(per==1?' (последние 7 дней)':'')+'</h3>'+svg+'<div class="k">макс. '+money(mx)+' BYN за день</div></div>';
 // статусы
 var sc={};A.L.forEach(function(o){sc[o.st]=(sc[o.st]||0)+1});
 h+='<div class="panel"><h3>По статусам</h3>'+ST.map(function(s){var c=sc[s[0]]||0;return '<div class="bar"><span>'+stb(s[0])+'</span><i><b style="width:'+(A.n?c/A.n*100:0)+'%;background:var(--s-'+s[0]+')"></b></i><em>'+c+'</em></div>'}).join('')+'</div>';
 // доставка vs самовывоз
 var dl=A.ok.filter(function(o){return o.mode=='dlv'}).length,sf=A.ok.length-dl,pd=A.ok.length?Math.round(dl/A.ok.length*100):0;
 h+='<div class="panel"><h3>Доставка и самовывоз</h3><div class="split2"><i style="width:'+pd+'%"></i></div><div class="lg"><span><b class="c1"></b>Доставка '+dl+' · '+pd+'%</span><span><b class="c2"></b>Самовывоз '+sf+' · '+(A.ok.length?100-pd:0)+'%</span></div></div>';
 // топ товаров
 var tp={};A.ok.forEach(function(o){o.items.forEach(function(it){var l=line(it),k=it.id;tp[k]=tp[k]||{p:l.p,n:0,v:0};tp[k].n+=1;tp[k].v+=l.sum})});
 var T=Object.keys(tp).map(function(k){return tp[k]}).sort(function(a,b){return b.v-a.v}).slice(0,5),tm=T.length?T[0].v:1;
 h+='<div class="panel wide"><h3>Топ товаров</h3>'+(T.length?T.map(function(t,i){return '<div class="tp"><span class="nn">'+(i+1)+'</span><img src="'+esc(img((t.p.ph||[])[0]||''))+'" alt=""><div><div>'+esc(t.p.n)+' <small>· '+t.n+' зак.</small></div><i><b style="width:'+(t.v/tm*100)+'%"></b></i></div><em>'+money(Math.round(t.v))+' BYN</em></div>'}).join(''):'<div class="k">Нет продаж за период</div>')+'</div></div>';
 $('#s-body').innerHTML=h}
$('#s-per').onclick=function(e){var b=e.target.closest('[data-per]');if(!b)return;per=+b.dataset.per;LS.set('aik_ops_per',per);renderStats()};

function statsSub(h){var c=h=='stats/cost';$('#s-m').hidden=c;$('#s-c').hidden=!c;document.querySelectorAll('.subtabs a').forEach(function(a){a.classList.toggle('on',(a.dataset.s=='c')==c)});c?renderCostView():renderStats()}
/* ---------- Роутинг ---------- */
function route(){$('#k-modal').hidden=true;var h=location.hash.replace('#','')||'orders',t=h.indexOf('catalog')==0?'catalog':h.indexOf('stats')==0?'stats':'orders';
 document.querySelectorAll('.tabs a').forEach(function(a){a.classList.toggle('on',a.dataset.t==t)});$('#v-orders').hidden=t!='orders';$('#v-catalog').hidden=t!='catalog';$('#v-stats').hidden=t!='stats';
 sel=h.indexOf('order/')==0?h.slice(6):null;if(t=='orders')renderOrders();else{document.body.classList.remove('card-open');t=='stats'?statsSub(h):renderKat()}}
window.addEventListener('hashchange',route);
fetch(BASE+'catalog.html').then(function(r){return r.ok?r.text():''}).then(function(t){var re=/data-id="([^"]+)"[^>]*?data-p="(\d+(?:\.\d+)?)"/g,m;while((m=re.exec(t)))PSITE[m[1]]=+m[2];route()},route);
route();
})();
