/* AI KVETKA · операционка. Без сборки. Данные в localStorage.
   Каталог: window.AIK_KAT из ../js/kat.js (82 позиции, без S/M/L).
   aik_ops_orders_v4 — заказы; aik_ops_kat — правки поверх каталога; aik_ops_cost3 — себестоимость; aik_ops_role — роль. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var KAT=window.AIK_KAT||[],BASE=window.AIK_KAT_BASE||'../',money=window.AIK_MONEY||function(x){return String(Math.round(+x*100)/100).replace('.',',')};
var ST=[['new','Новый'],['work','В работе'],['ready','Готов'],['done','Выдан'],['cancel','Отменён']];
var SN={};ST.forEach(function(s){SN[s[0]]=s[1]});
var PAY=[['card','Карта'],['erip','ЕРИП'],['qr','QR'],['cash','Наличные']];
var PN={};PAY.forEach(function(p){PN[p[0]]=p[1]});
var PACK=10,ENV=4,MIN_ORDER=50,DLV_MINSK=15; // упаковка 10 BYN/букет; конверт 4; мин. заказ 50; Минск 15
var LIVE0=['sharmelia','alstro-white','alstro-pink','rose-explorer','rose-red-fr','rose-mondial','rose-white-fr','rose-pink-fr','rose-veggie','rose-pink-x','rose-fatima','rose-mandatin','rose-melon','eustoma-pink','eustoma-white','ilex-yellow','ilex-red','nutan','eringium','chrys-altai','orchid-vanda','orchid-white-70','orchid-pink-70','anthurium-jumbo','zami-10']; // не витрина: только узнать старый демо-live в правках
var SLOTS=(function(){var a=[];for(var h=9;h<21;h++){var a1=(h<10?'0':'')+h+':00',a2=((h+1)<10?'0':'')+(h+1)+':00';a.push(a1+'–'+a2)}return a})();
var LS={get:function(k,d){try{var v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set:function(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast('Не хватает места в браузере (фото слишком большое?)');return false}}};
function toast(t){var e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(e._t);e._t=setTimeout(function(){e.classList.remove('on')},2200)}
function img(u){return /^(data:|https?:|\/)/.test(u)?u:BASE+u}
function num(v){v=parseFloat(String(v==null?'':v).replace(',','.'));return isFinite(v)?v:0}
function uid(p){return p+Math.random().toString(36).slice(2,8)}
function m0(x){return money(Math.round(x*10)/10)}
function pct(x){return Math.round(x*100)+'%'}
function grade(x){return x.net<0?'bad':x.mg>=.3?'good':'mid'}

/* ---------- Роль: владелец видит всё; флорист — только заказы (демо, позже Telegram) ---------- */
function role(){return LS.get('aik_ops_role','owner')}
function isOwner(){return role()=='owner'}
function applyRole(){
 var r=role(),own=r=='owner';
 document.body.dataset.role=r;
 var sw=$('#role-sw');if(sw){sw.querySelectorAll('[data-role]').forEach(function(b){b.classList.toggle('on',b.dataset.role==r)})}
 document.querySelectorAll('.tabs a').forEach(function(a){
  var t=a.dataset.t;a.hidden=!own&&t!='orders';
 });
 if(!own){var h=location.hash.replace('#','')||'orders';if(h.indexOf('orders')!=0&&h.indexOf('order/')!=0)location.hash='orders'}
}

/* ---------- Каталог: правки поверх AIK_KAT ---------- */
function edits(){return LS.get('aik_ops_kat',{})}
function unitPrice(p){ // цена за шт./ветку/пучок/горшок; st — число в новом прайсе
 if(typeof p.st=='number')return +p.st;
 if(p.price!=null)return +p.price;
 return 0}
function isPot(p){return p.c=='Растения'||p.care=='pot'||p.u=='горшок'}
function isLive(p){var e=edits()[p.id];if(e&&e.live!=null)return !!e.live;return p.live===true} // «на сайте» = явный live:true в kat.js; нет флага — скрыт
function seededLive(p){return p.live!=null?!!p.live:LIVE0.indexOf(p.id)>=0}
function migrateLive(){ // один раз снять демо-live, совпавший со старым списком; осознанный переключатель оставить
 if(LS.get('aik_ops_live_mig',null))return;var E=edits(),ch=false;
 Object.keys(E).forEach(function(id){var e=E[id];if(!e||e.live==null)return;var p=null;KAT.forEach(function(x){if(x.id==id)p=x});if(!p||!!e.live!==seededLive(p))return;delete e.live;ch=true;if(!Object.keys(e).length)delete E[id]});
 if(!ch||LS.set('aik_ops_kat',E))LS.set('aik_ops_live_mig',1)}
function heightOf(p){var e=edits()[p.id];if(e&&e.h!=null&&e.h!=='')return e.h;if(p.h)return p.h;var m=String(p.n||'').match(/(\d+\s*\/\s*\d+\s*см|\d+\s*см)/i);return m?m[1]:''}
function careOf(p){var e=edits()[p.id];if(e&&e.care)return e.care;if(p.care=='pot')return 'pot';if(p.care=='composition'||p.care=='bouquet')return p.care;return isPot(p)?'pot':'bouquet'}
function prod(id){var p=null;KAT.forEach(function(x){if(x.id==id)p=x});if(!p)return null;var e=edits()[id]||{},o={};for(var k in p)o[k]=p[k];
 ['n','d','cm','c','h'].forEach(function(k){if(e[k]!=null)o[k]=e[k]});
 if(e.ph)o.ph=e.ph;if(e.care)o.care=e.care;if(e.live!=null)o.live=!!e.live;else o.live=isLive(p);
 if(e.price!=null&&e.price!==''){o.price=+e.price;o.st=+e.price}else{o.price=unitPrice(o)}
 o.h=heightOf(o);o._ed=!!edits()[id];o._pot=isPot(o);return o}

/* ---------- Себестоимость v3: без S/M/L; упаковка букета = set.pack (10) ---------- */
function demoCost(){
 var fl=KAT.filter(function(x){return !isPot(x)}).map(function(x){return{id:x.id,n:x.n,p:Math.round(unitPrice(x)*.45*10)/10}});
 var pk=[{id:'kraft',n:'Крафт / плёнка (сверх фикс. упаковки)',p:0},{id:'ribbon',n:'Лента',p:1.2},{id:'card',n:'Открытка (себест.)',p:.5}];
 var it={};fl.forEach(function(f){it[f.id]={buy:f.p,f:[[f.id,1]],k:[],ot:0}});
 KAT.filter(isPot).forEach(function(x){it[x.id]={buy:Math.round(unitPrice(x)*.55*10)/10,f:[],k:[],ot:Math.round(unitPrice(x)*.55*10)/10,nw:true}});
 return{v:3,demo:true,set:{tax:6,acq:2.5,ovh:3,dlv:9,pack:PACK},wage:{mode:'fix',flat:14,pct:10},fl:fl,pk:pk,it:it}}
function migrateCost(old){ // старые v2 с S/M/L → берём M или среднее
 var c=demoCost();c.demo=false;
 if(old.set){['tax','acq','ovh','dlv'].forEach(function(k){if(old.set[k]!=null)c.set[k]=num(old.set[k])});c.set.pack=PACK}
 if(old.wage){c.wage.mode=old.wage.mode=='pct'?'pct':'fix';c.wage.pct=num(old.wage.pct)||10;c.wage.flat=num(old.wage.M)||num(old.wage.flat)||14}
 if(old.fl&&old.fl.length)c.fl=old.fl;if(old.pk&&old.pk.length)c.pk=old.pk;
 if(old.it){Object.keys(old.it).forEach(function(id){var P=old.it[id],r=P.M||P.S||P.L||P;if(!r||typeof r!='object')return;
  c.it[id]={buy:0,f:r.f||[],k:r.k||[],ot:num(r.ot),nw:!!P.nw};(r.f||[]).forEach(function(x){var f=byId(c.fl,x[0]);if(f)c.it[id].buy+=num(f.p)*num(x[1])})})}
 return c}
var _cc=null;
function costDB(){if(_cc)return _cc;var c=LS.get('aik_ops_cost3',null);
 if(!c){var o2=LS.get('aik_ops_cost2',null);c=o2?migrateCost(o2):demoCost();LS.set('aik_ops_cost3',c)}
 if(c.v!=3){c=migrateCost(c);LS.set('aik_ops_cost3',c)}
 return _cc=c}
function saveC(C){delete C.demo;_cc=C;LS.set('aik_ops_cost3',C)}
function byId(L,id){for(var i=0;i<L.length;i++)if(L[i].id==id)return L[i];return null}
function buyOf(id){var C=costDB(),P=C.it[id];if(P&&P.buy!=null&&P.buy!=='')return num(P.buy);
 if(P){var fl=0;(P.f||[]).forEach(function(x){var f=byId(C.fl,x[0]);if(f)fl+=num(f.p)*num(x[1])});return fl+num(P.ot)}
 var f=byId(C.fl,id);return f?num(f.p):0}
function wageOf(rev,nw){if(nw)return 0;var w=costDB().wage||{};return w.mode=='pct'?rev*num(w.pct)/100:num(w.flat)}
function calcUnit(p,unit){ // чистыми с 1 ед.: закуп + налог/эквайринг; ЗП и накладные — на букет/заказ, не на стебель
 var C=costDB(),P=C.it[p.id]||{},buy=buyOf(p.id),wk=0,pack=0,ot=num(P.ot||0),
  c=buy+ot,fee=unit*(num(C.set.tax)+num(C.set.acq))/100,net=unit-fee-c;
 return{rev:unit,cost:c,fee:fee,net:net,mg:unit?net/unit:0,mk:c?(unit-c)/c:0,buy:buy,wk:wk,pack:pack,ot:ot,ovh:0}}
function netBadge(p){var x=calcUnit(p,p.price);if(!buyOf(p.id)&&!(costDB().it[p.id]))return '<a class="nb none" href="#stats/cost">себестоимость не задана</a>';
 return '<div class="nb '+grade(x)+'">чистыми '+m0(x.net)+' BYN <small>· маржа '+pct(x.mg)+(p._pot?'':' · без ЗП/упак. букета')+'</small></div>'}

/* ---------- Заказы (ДЕМО v4 под реальный каталог) ---------- */
function day(o,h,m){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+o);d.setHours(h,m||0);return d.getTime()}
function slotAt(h){return SLOTS[Math.max(0,Math.min(SLOTS.length-1,h-9))]||'12:00–13:00'}
function demo(){var n=Date.now(),H=3600e3;return[
 {id:'1048',st:'new',at:n-.4*H,name:'Алина Ковалёва',phone:'+375 29 611-24-08',mode:'dlv',recipName:'Мария Ковалёва',recipPhone:'+375 29 611-24-08',addr:'Минск, ул. Сурганова 47, кв. 12',zone:'minsk',anon:false,when:day(0,15),slot:slotAt(15),items:[{id:'rose-mondial',q:15},{id:'eucalyptus',q:3}],pack:PACK,env:0,dlv:DLV_MINSK,card:'С днём рождения, мама!',pay:'card',note:'Позвонить получателю за 30 минут'},
 {id:'1047',st:'work',at:n-2*H,name:'Дмитрий Лис',phone:'+375 33 302-77-15',mode:'self',recipName:'',recipPhone:'',addr:'Минск, Брилевская 37, пом. 7',zone:'pickup',anon:false,when:day(0,13),slot:slotAt(13),items:[{id:'rose-veggie',q:9},{id:'eustoma-pink',q:5}],pack:PACK,env:ENV,dlv:0,card:'',pay:'cash',note:''},
 {id:'1046',st:'ready',at:n-5*H,name:'Ольга Мирончик',phone:'+375 44 785-90-31',mode:'dlv',recipName:'Ольга Мирончик',recipPhone:'+375 44 785-90-31',addr:'ЖК Минск-Мир, ул. Брилевская 21',zone:'mir',anon:false,when:day(0,12),slot:slotAt(12),items:[{id:'orchid-white-70',q:1}],pack:0,env:0,dlv:0,card:'Спасибо за проект!',pay:'erip',note:'Ресепшен'},
 {id:'1045',st:'ready',at:n-7*H,name:'Сергей Ткач',phone:'+375 29 144-03-62',mode:'dlv',recipName:'Анна',recipPhone:'+375 29 100-00-01',addr:'Минск, ул. Притыцкого 29, кв. 88',zone:'minsk',anon:true,when:day(0,11),slot:slotAt(11),items:[{id:'rose-explorer',q:51}],pack:PACK,env:0,dlv:DLV_MINSK,card:'Выходи за меня',pay:'card',note:'Сюрприз — не звонить заранее'},
 {id:'1044',st:'new',at:n-.1*H,name:'Мария Жук',phone:'+375 25 909-11-47',mode:'self',recipName:'',recipPhone:'',addr:'Минск, Брилевская 37, пом. 7',zone:'pickup',anon:false,when:day(1,10),slot:slotAt(10),items:[{id:'alstro-pink',q:25}],pack:PACK,env:0,dlv:0,card:'',pay:'qr',note:'Оплата при получении'},
 {id:'1043',st:'work',at:n-20*H,name:'Екатерина Бондарь',phone:'+375 29 250-66-80',mode:'dlv',recipName:'Екатерина',recipPhone:'+375 29 250-66-80',addr:'д. Ратомка (за город)',zone:'out',anon:false,when:day(1,9),slot:slotAt(9),items:[{id:'hydrangea-white',q:3},{id:'ruscus',q:5}],pack:PACK,env:ENV,dlv:28,card:'',pay:'card',note:'Доставка по тарифу Яндекса — сумма внесена вручную'},
 {id:'1042',st:'done',at:n-26*H,name:'Иван Петрович',phone:'+375 33 671-45-19',mode:'self',recipName:'',recipPhone:'',addr:'Минск, Брилевская 37, пом. 7',zone:'pickup',anon:false,when:day(-1,18),slot:slotAt(18),items:[{id:'anthurium-jumbo',q:1}],pack:0,env:0,dlv:0,card:'',pay:'cash',note:''},
 {id:'1041',st:'cancel',at:n-30*H,name:'Наталья Скорик',phone:'+375 44 512-38-02',mode:'dlv',recipName:'Наталья',recipPhone:'+375 44 512-38-02',addr:'Минск, ул. Немига 3',zone:'minsk',anon:false,when:day(-1,16),slot:slotAt(16),items:[{id:'rose-fatima',q:15}],pack:PACK,env:0,dlv:DLV_MINSK,card:'',pay:'card',note:'Клиент перенёс на другую дату'},
 {id:'1040',st:'done',at:n-48*H,name:'Анна Гордей',phone:'+375 29 380-14-55',mode:'dlv',recipName:'Анна Гордей',recipPhone:'+375 29 380-14-55',addr:'Минск, ул. Ленина 8',zone:'minsk',anon:false,when:day(-2,14),slot:slotAt(14),items:[{id:'lily-white',q:3},{id:'eucalyptus',q:2}],pack:PACK,env:0,dlv:DLV_MINSK,card:'',pay:'erip',note:''}
].map(function(o){o.hist=[{st:'new',t:o.at}];if(o.st!='new')o.hist.push({st:o.st,t:Math.min(Date.now(),o.at+H)});return o})}
function demoHist(){var seed=7,R=function(){seed=(seed*16807)%2147483647;return seed/2147483647},ids=KAT.map(function(x){return x.id}),N=['Ирина','Павел','Юлия','Артём','Светлана','Максим','Виктория','Олег','Дарья','Никита'],L=[],num=1039;
 for(var d=1;d<=45;d++){var k=1+Math.floor(R()*3);for(var j=0;j<k;j++){var at=day(-d,9+Math.floor(R()*10),Math.floor(R()*60)),id=ids[Math.floor(R()*ids.length)],p=KAT.filter(function(x){return x.id==id})[0],q=p&&p.qs?p.qs[Math.floor(R()*p.qs.length)]:1,pot=isPot(p);
  var dl=R()<.55,st=R()<.1?'cancel':'done',sub=unitPrice(p)*q,pack=pot?0:PACK,dlv=dl?(R()<.2?0:DLV_MINSK):0;
  L.push({id:String(num--),st:st,at:at,name:N[Math.floor(R()*N.length)],phone:'+375 29 000-00-00',mode:dl?'dlv':'self',recipName:'',recipPhone:'',addr:dl?'Минск':'Минск, Брилевская 37, пом. 7',zone:dl?'minsk':'pickup',anon:false,when:at+4*3600e3,slot:'—',items:[{id:id,q:q}],pack:pack,env:0,dlv:dlv,card:'',pay:PAY[Math.floor(R()*4)][0],note:'',hist:[{st:'new',t:at},{st:st,t:at+3600e3}]})}}
 return L}
var orders=LS.get('aik_ops_orders_v4',null);if(!orders){orders=demo().concat(demoHist());LS.set('aik_ops_orders_v4',orders)}
orders.forEach(function(o){if(o.st=='ship')o.st='ready';if(o.pack==null)o.pack=0;if(o.env==null)o.env=0;if(!o.pay)o.pay='card';
 if(o.items)o.items.forEach(function(it){delete it.s;if(!it.q)it.q=1})});
function saveO(){LS.set('aik_ops_orders_v4',orders)}
function line(it){var p=prod(it.id)||{n:it.id,ph:[],price:0,_pot:false},unit=p.price,q=it.q||1,sum=unit*q,un=p.u||'шт.';
 return{p:p,label:q+' '+un+' × '+money(unit)+' BYN',sum:sum,qty:q,unit:unit}}
function goodsSum(o){return o.items.reduce(function(a,it){return a+line(it).sum},0)}
function total(o){return goodsSum(o)+(o.pack||0)+(o.env||0)+(o.dlv||0)}
function underMin(o){return goodsSum(o)<MIN_ORDER}
function fmtD(t){var d=new Date(t),t0=new Date();t0.setHours(0,0,0,0);var df=Math.round((new Date(d).setHours(0,0,0,0)-t0)/864e5);
 return df==0?'Сегодня':df==1?'Завтра':df==-1?'Вчера':d.toLocaleDateString('ru-RU',{day:'numeric',month:'long'})}
function dayKey(t){var d=new Date(t);return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()}
function todayKey(){return dayKey(Date.now())}
function tomorrowKey(){return dayKey(Date.now()+864e5)}
function fmtT(t){return new Date(t).toLocaleString('ru-RU',{day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'})}
function stb(s){return '<span class="st" style="--c:var(--s-'+s+')">'+SN[s]+'</span>'}
function zoneLbl(o){return o.mode=='self'?'Самовывоз':o.zone=='mir'?'Минск-Мир':o.zone=='out'?'За город':o.anon?'Анонимно · Минск':'Доставка'}
var fil=LS.get('aik_ops_fil','active'),dfil=LS.get('aik_ops_dfil','all'),sel=null,kLive='all';

function renderFilters(){var c={all:orders.length,active:0};orders.forEach(function(o){c[o.st]=(c[o.st]||0)+1;if(o.st!='done'&&o.st!='cancel')c.active++});
 var h=[['active','Активные'],['all','Все']].concat(ST).map(function(s){return '<button class="chip'+(fil==s[0]?' on':'')+'" data-f="'+s[0]+'" style="--c:var(--s-'+s[0]+',var(--ol))"><i></i>'+s[1]+' <b>'+(c[s[0]]||0)+'</b></button>'}).join('');
 $('#o-filters').innerHTML=h;
 var dc={all:0,today:0,tomorrow:0,pre:0},tk=todayKey(),tm=tomorrowKey();
 orders.forEach(function(o){if(o.st=='cancel')return;dc.all++;var k=dayKey(o.when);if(k==tk)dc.today++;else if(k==tm)dc.tomorrow++;else if(o.when>=Date.now()+864e5)dc.pre++});
 var dh=[['all','Все даты'],['today','Сегодня'],['tomorrow','Завтра'],['pre','Предзаказы']].map(function(s){return '<button class="chip'+(dfil==s[0]?' on':'')+'" data-df="'+s[0]+'">'+s[1]+' <b>'+(dc[s[0]]||0)+'</b></button>'}).join('');
 $('#o-dates').innerHTML=dh;
 var today=orders.filter(function(o){return dayKey(o.when)==tk&&o.st!='cancel'});
 $('#o-sum').textContent='Сегодня к выдаче: '+today.length+' · новых: '+(c.new||0)+' · сумма активных: '+money(orders.filter(function(o){return o.st!='done'&&o.st!='cancel'}).reduce(function(a,o){return a+total(o)},0))+' BYN'}
function passDate(o){if(dfil=='all')return true;var k=dayKey(o.when);if(dfil=='today')return k==todayKey();if(dfil=='tomorrow')return k==tomorrowKey();if(dfil=='pre')return o.when>=Date.now()+864e5;return true}
function renderList(){var q=($('#o-q').value||'').toLowerCase().trim(),srt=$('#o-sort').value;
 var L=orders.filter(function(o){return fil=='all'||(fil=='active'?(o.st!='done'&&o.st!='cancel'):o.st==fil)}).filter(passDate)
  .filter(function(o){return !q||(o.id+' '+o.name+' '+o.phone+' '+(o.recipName||'')+' '+(o.recipPhone||'')).toLowerCase().indexOf(q)>=0});
 L.sort(srt=='new'?function(a,b){return b.at-a.at}:function(a,b){return a.when-b.when});
 $('#o-list').innerHTML=L.length?L.map(function(o){var w=o.items.map(function(it){return (prod(it.id)||{n:it.id}).n+(it.q>1?' ×'+it.q:'')}).join(', ');
  return '<div class="row'+(sel==o.id?' on':'')+(o.st=='cancel'?' cx':'')+'" data-id="'+o.id+'"><div class="when">'+esc((o.slot||'').split('–')[0])+'<small>'+fmtD(o.when)+'</small></div><div><div class="who">№'+o.id+' · '+esc(o.name)+'</div><div class="what">'+esc(zoneLbl(o))+' · '+esc(w)+'</div></div><div class="right">'+stb(o.st)+'<div class="sum">'+money(total(o))+' BYN</div></div></div>'}).join(''):'<div class="card"><div class="empty">Нет заказов</div></div>'}
function renderCard(){var o=orders.filter(function(x){return x.id==sel})[0],c=$('#o-card');document.body.classList.toggle('card-open',!!o);
 if(!o){c.innerHTML='<div class="empty">Выберите заказ слева</div>';return}
 var tel=o.phone.replace(/[^\d+]/g,''),rtel=(o.recipPhone||'').replace(/[^\d+]/g,'');
 c.classList.toggle('cx',o.st=='cancel');
 var extras='';
 if(o.pack)extras+='<div class="tot"><span>Упаковка букета</span><span>'+money(o.pack)+'</span></div>';
 if(o.env)extras+='<div class="tot"><span>Конверт для денег</span><span>'+money(o.env)+'</span></div>';
 if(o.dlv)extras+='<div class="tot"><span>Доставка'+(o.zone=='out'?' (Яндекс, вручную)':o.zone=='mir'?' (Минск-Мир)':'')+'</span><span>'+money(o.dlv)+'</span></div>';
 c.innerHTML='<button class="btn ghost sm back" data-back>← К списку</button><h2>Заказ №'+o.id+'</h2><div class="meta">Оформлен '+fmtT(o.at)+' · '+stb(o.st)+' · '+esc(PN[o.pay]||o.pay)+'</div>'+
 (o.st=='cancel'?'<div class="sad">🥀 Заказ отменён'+(o.note?' — '+esc(o.note):'')+'</div>':'')+
 (underMin(o)?'<div class="warn">⚠ Сумма товаров '+money(goodsSum(o))+' BYN — меньше минимума '+MIN_ORDER+' BYN</div>':'')+
 '<div class="blk"><h3>Получение</h3><div class="pick">'+fmtD(o.when)+', '+esc(o.slot)+'<small>'+esc(zoneLbl(o))+(o.anon?' · анонимно':'')+' · '+esc(o.addr)+'</small></div></div>'+
 '<div class="blk"><h3>Клиент</h3><div>'+esc(o.name)+'</div><div class="cont"><a href="tel:'+tel+'">☎ '+esc(o.phone)+'</a></div>'+
 (o.mode=='dlv'&&(o.recipName||o.recipPhone)?'<div style="margin-top:8px"><b>Получатель</b>: '+esc(o.recipName||'—')+(o.recipPhone?' · <a href="tel:'+rtel+'">'+esc(o.recipPhone)+'</a>':'')+'</div>':'')+'</div>'+
 '<div class="blk"><h3>Состав</h3>'+o.items.map(function(it){var l=line(it);return '<div class="it"><img src="'+esc(img((l.p.ph||[])[0]||''))+'" alt=""><div>'+esc(l.p.n)+(l.p.h?' <small>'+esc(l.p.h)+'</small>':'')+'<small>'+esc(l.label)+'</small></div><div>'+money(l.sum)+'</div></div>'}).join('')+
 extras+'<div class="tot big"><span>Итого</span><span>'+money(total(o))+' BYN</span></div></div>'+
 (o.card||o.note?'<div class="blk"><h3>Пожелания</h3>'+(o.card?'<div class="note">Открытка (бесплатно): «'+esc(o.card)+'»</div>':'')+(o.note?'<div class="note" style="margin-top:6px">'+esc(o.note)+'</div>':'')+'</div>':'')+
 '<div class="blk"><h3>Статус</h3><div class="stsel">'+ST.map(function(s){return '<button data-st="'+s[0]+'" class="'+(o.st==s[0]?'on':'')+'" style="--c:var(--s-'+s[0]+')">'+s[1]+'</button>'}).join('')+'</div></div>'+
 '<div class="blk"><h3>История</h3><ul class="hist">'+o.hist.slice().reverse().map(function(h){return '<li>'+fmtT(h.t)+' — '+SN[h.st]+'</li>'}).join('')+'</ul></div>'}
function renderOrders(){renderFilters();renderList();renderCard()}
$('#o-filters').onclick=function(e){var b=e.target.closest('[data-f]');if(!b)return;fil=b.dataset.f;LS.set('aik_ops_fil',fil);renderOrders()};
$('#o-dates').onclick=function(e){var b=e.target.closest('[data-df]');if(!b)return;dfil=b.dataset.df;LS.set('aik_ops_dfil',dfil);renderOrders()};
$('#o-q').oninput=renderList;$('#o-sort').onchange=renderList;
$('#o-list').onclick=function(e){var r=e.target.closest('.row');if(!r)return;location.hash='order/'+r.dataset.id};
$('#o-card').onclick=function(e){if(e.target.closest('[data-back]')){location.hash='orders';return}var b=e.target.closest('[data-st]');if(!b)return;
 var o=orders.filter(function(x){return x.id==sel})[0];if(!o||o.st==b.dataset.st)return;o.st=b.dataset.st;o.hist.push({st:o.st,t:Date.now()});saveO();renderOrders();toast('Заказ №'+o.id+': '+SN[o.st])};

/* ---------- Каталог UI ---------- */
function careLbl(c){return c=='composition'?'композиция':c=='pot'?'горшок':'букет'}
function renderKat(){var q=($('#k-q').value||'').toLowerCase();
 var L=KAT.map(function(x){return prod(x.id)}).filter(function(p){return (kLive!='live'||p.live)&&(!q||(p.n+' '+p.c+' '+(p.h||'')).toLowerCase().indexOf(q)>=0)});
 $('#k-live').querySelectorAll('[data-live]').forEach(function(b){b.classList.toggle('on',b.dataset.live==kLive)});
 $('#k-grid').innerHTML=L.map(function(p){
  return '<div class="prod'+(p.live?'':' dim')+'"><div class="ph" style="background-image:url(\''+esc(img(p.ph[0]))+'\')"><span class="tag">'+esc(p.c)+'</span>'+(p.live?'<span class="live">на сайте</span>':'<span class="off">скрыт</span>')+(p._ed?'<span class="ed">ИЗМЕНЁН</span>':'')+'</div><div class="bd"><h3>'+esc(p.n)+'</h3><div class="pr">'+money(p.price)+' BYN <small>/ '+(p.u||'шт.')+(p.h?' · '+esc(p.h):'')+'</small></div><p>'+esc(p.d)+'</p>'+(p._pot?'':'<div class="mut" style="font-size:12px;margin-bottom:6px">памятка: '+careLbl(careOf(p))+'</div>')+netBadge(p)+(isOwner()?'<div class="act"><button class="btn ghost sm" data-ed="'+p.id+'">Редактировать</button></div>':'')+'</div></div>'}).join('')||'<div class="empty">Нет позиций</div>'}
var cur=null,curPh=null;
function openEd(id){if(!isOwner())return;var p=prod(id);cur=id;curPh=(p.ph||[]).slice();var m=$('#k-modal');m.hidden=false;var cg=careOf(p);
 $('#k-form').innerHTML='<form class="f"><h2>'+esc(p.n)+'</h2><div><div class="main" id="f-main"></div><div class="thumbs" id="f-th"></div>'+
 '<label class="up">＋ Добавить фото<input type="file" accept="image/*" id="f-file"></label><div class="hint">Новое фото — в конец, не становится главным. Порядок — перетаскиванием; первое — главное.</div></div>'+
 '<div><label>Название</label><input name="n" value="'+esc(p.n)+'"><label>Цена, BYN <small>за '+(p.u||'шт.')+'</small></label><input name="p" type="number" inputmode="decimal" min="0" step="1" value="'+p.price+'">'+
 '<label>Ростовка / размер</label><input name="h" value="'+esc(p.h||'')+'" placeholder="напр. 60 см или 12/50">'+
 '<label>Ед. / подпись</label><input name="cm" value="'+esc(p.cm)+'">'+
 '<label>Описание</label><textarea name="d">'+esc(p.d)+'</textarea>'+
 (p._pot?'':'<label>Памятка ухода</label><select name="care"><option value="bouquet"'+(cg=='bouquet'?' selected':'')+'>букет</option><option value="composition"'+(cg=='composition'?' selected':'')+'>композиция</option></select><div class="hint">Текст ухода в карточке не храним — только выбор памятки.</div>')+
 '<label class="nw"><input type="checkbox" name="live"'+(p.live?' checked':'')+'> показывать на сайте (live)</label>'+
 '<div class="cost"><h3>Прибыль <small>себестоимость — во вкладке <a href="#stats/cost" class="lnk">Статистика → Себестоимость</a></small></h3><div id="c-out"></div><div class="hint">Упаковка букета '+PACK+' BYN — фиксирована, в «чистыми» позиции не входит.</div></div>'+
 '</div><div class="acts"><button type="button" class="btn ghost" data-close>Отмена</button><button class="btn">Сохранить</button></div></form>';drawPh();costLive()}
function costLive(){var f=$('#k-form form'),out=$('#c-out');if(!f||!out)return;var p=prod(cur),unit=num(f.p.value);p.price=unit;var x=calcUnit(p,unit),has=buyOf(cur)||costDB().it[cur];
 out.innerHTML=has?'<div class="nb '+grade(x)+'">чистыми <b>'+m0(x.net)+' BYN</b> · маржа '+pct(x.mg)+'<small style="display:block;margin-top:4px">закуп '+m0(x.buy)+' · ЗП '+m0(x.wk)+' · налог/эквайр. '+m0(x.fee)+'</small></div>':'<div class="nohint">Себестоимость не задана — <a href="#stats/cost" class="lnk">задайте в Статистике</a></div>'}
$('#k-modal').addEventListener('input',function(e){if(e.target.name=='p')costLive()});
function drawPh(){$('#f-main').style.backgroundImage=curPh.length?'url("'+img(curPh[0])+'")':'none';$('#f-th').innerHTML=curPh.map(function(u,i){return '<div class="'+(i==0?'on':'')+'" data-i="'+i+'" style="background-image:url(\''+esc(img(u))+'\')">'+(i==0?'<em>главное</em>':'')+'<button type="button" class="del" data-del="'+i+'" aria-label="Удалить фото">×</button></div>'}).join('')}
(function(){var dr=null,sx=0,sy=0,moved=false;
 document.addEventListener('pointerdown',function(e){var t=e.target.closest('#f-th [data-i]');if(!t||e.target.closest('[data-del]'))return;e.preventDefault();dr=t;sx=e.clientX;sy=e.clientY;moved=false;t.setPointerCapture(e.pointerId)});
 document.addEventListener('pointermove',function(e){if(!dr)return;if(!moved&&Math.abs(e.clientX-sx)+Math.abs(e.clientY-sy)<6)return;moved=true;dr.classList.add('drag');
  var u=document.elementFromPoint(e.clientX,e.clientY),o=u&&u.closest('#f-th [data-i]');if(!o||o==dr)return;var r=o.getBoundingClientRect(),after=e.clientX>r.left+r.width/2;o.parentNode.insertBefore(dr,after?o.nextSibling:o)});
 function end(){if(!dr)return;var th=$('#f-th');dr.classList.remove('drag');
  if(moved){var ord=[].map.call(th.children,function(c){return +c.dataset.i});curPh=ord.map(function(i){return curPh[i]})}
  dr=null;drawPh()}
 document.addEventListener('pointerup',end);document.addEventListener('pointercancel',end)})();
function shrink(file,cb){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.85))};im.src=r.result};r.readAsDataURL(file)}
$('#k-grid').onclick=function(e){var b=e.target.closest('[data-ed]');if(b)openEd(b.dataset.ed)};
$('#k-q').oninput=renderKat;
$('#k-live').onclick=function(e){var b=e.target.closest('[data-live]');if(!b)return;kLive=b.dataset.live;renderKat()};
$('#k-modal').onclick=function(e){if(e.target==this||e.target.closest('[data-close]')){this.hidden=true;return}var d=e.target.closest('[data-del]');if(d){if(curPh.length<2){toast('Нужно оставить хотя бы одно фото');return}curPh.splice(+d.dataset.del,1);drawPh()}};
$('#k-modal').onchange=function(e){if(e.target.id=='f-file'&&e.target.files[0])shrink(e.target.files[0],function(u){curPh.push(u);drawPh();toast('Фото добавлено в конец — не забудьте «Сохранить»')})};
$('#k-modal').onsubmit=function(e){e.preventDefault();var f=e.target,E=edits(),o=KAT.filter(function(x){return x.id==cur})[0];
 E[cur]={n:f.n.value.trim()||o.n,price:f.p.value,cm:f.cm.value.trim(),d:f.d.value.trim(),h:f.h.value.trim()};
 if(!!f.live.checked!==(o.live===true))E[cur].live=!!f.live.checked; // в правки только отличие от kat.js
 if(f.care)E[cur].care=f.care.value;if(curPh.join('|')!=(o.ph||[]).join('|'))E[cur].ph=curPh;
 if(LS.set('aik_ops_kat',E)){$('#k-modal').hidden=true;renderKat();toast('Сохранено в этом браузере')}};
$('#k-reset').onclick=function(){if(confirm('Сбросить все правки каталога в этом браузере?')){localStorage.removeItem('aik_ops_kat');renderKat();toast('Правки сброшены')}};
function dl(name,blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
function lit(v){return JSON.stringify(v)}
function itemSrc(x){var e=edits()[x.id],o={},files=[];for(var k in x)o[k]=x[k];
 if(e){['n','cm','d','h','care'].forEach(function(k){if(e[k]!=null&&e[k]!=='')o[k]=e[k]});if(e.price!=null&&e.price!==''){o.price=+e.price;if(typeof o.st=='number'||o.st==null)o.st=+e.price}if(e.live!=null)o.live=!!e.live;
  if(e.ph)o.ph=e.ph.map(function(u,i){if(/^data:/.test(u)){var nm='img/ops/'+x.id+'-'+(i+1)+'.jpg';files.push([nm,u]);return nm}return u})}
 var s='{'+Object.keys(o).map(function(k){return JSON.stringify(k)+':'+lit(o[k])}).join(',')+'}';return{s:s,files:files}}
$('#k-export').onclick=function(){var files=[],arr='window.AIK_KAT=[\n'+KAT.map(function(x){var r=itemSrc(x);files=files.concat(r.files);return ' '+r.s}).join(',\n')+'\n]';
 // экспорт: подмена массива в исходном kat.js
 function out(src){var txt;if(src&&src.indexOf('window.AIK_KAT=[')>=0){var a=src.indexOf('window.AIK_KAT=['),i=src.indexOf('[',a),depth=0,end=i;
  for(var j=i;j<src.length;j++){var ch=src[j];if(ch=='[')depth++;else if(ch==']'){depth--;if(!depth){end=j+1;break}}}
  var rest=src.slice(end).replace(/^\s*;?/,'');txt=src.slice(0,a)+arr+';'+rest}
  else txt='/* Каталог AI KVETKA (экспорт из ops). */\n'+arr+';\n';
  dl('kat.js',new Blob([txt],{type:'text/javascript'}));files.forEach(function(f,i){setTimeout(function(){fetch(f[1]).then(function(r){return r.blob()}).then(function(b){dl(f[0].split('/').pop(),b)})},400*(i+1))});
  toast('kat.js скачан'+(files.length?' + фото: '+files.length:''))}
 fetch(BASE+'js/kat.js',{cache:'no-store'}).then(function(r){return r.ok?r.text():null}).then(out,function(){out(null)})};


/* ---------- Статистика → Себестоимость (без размеров) ---------- */
var cOpen={},cQ={f:'',k:'',b:''};
function usedIn(kind,id){var C=costDB(),n=0,key=kind=='f'?'f':'k';Object.keys(C.it).forEach(function(p){var r=C.it[p];if(r&&(r[key]||[]).some(function(x){return x[0]==id}))n++});return n}
function dirPanel(kind,title,ph){var C=costDB(),L=C[kind=='f'?'fl':'pk'];
 return '<div class="panel cdir" data-dir="'+kind+'"><div class="ph2"><h3>'+title+' <small>'+L.length+'</small></h3><input type="search" class="cq" data-q="'+kind+'" placeholder="'+ph+'" value="'+esc(cQ[kind])+'"></div>'+
 '<table class="dt"><thead><tr><th>Название</th><th>Закупка, BYN</th><th>В составах</th><th></th></tr></thead><tbody>'+
 L.map(function(x){var u=usedIn(kind,x.id);return '<tr data-row="'+esc(x.n.toLowerCase())+'"><td><input data-dn="'+kind+'.'+x.id+'" value="'+esc(x.n)+'"></td><td><input class="pp" data-dp="'+kind+'.'+x.id+'" inputmode="decimal" value="'+x.p+'"></td><td class="mut">'+(u||'—')+'</td><td><button class="xb" data-ddel="'+kind+'.'+x.id+'">×</button></td></tr>'}).join('')+
 '</tbody></table><button class="btn ghost sm" data-dadd="'+kind+'">＋ '+(kind=='f'?'Добавить цветок':'Добавить упаковку')+'</button></div>'}
function lines(C,id,kind){var r=C.it[id]||{},L=r[kind]||[],D=C[kind=='f'?'fl':'pk'];
 return L.map(function(x,i){return '<div class="ln"><select data-bl="'+id+'.'+kind+'.'+i+'">'+D.map(function(d){return '<option value="'+d.id+'"'+(d.id==x[0]?' selected':'')+'>'+esc(d.n)+' · '+money(d.p)+'</option>'}).join('')+'</select><input data-bq="'+id+'.'+kind+'.'+i+'" inputmode="decimal" value="'+x[1]+'"><button class="xb" data-bx="'+id+'.'+kind+'.'+i+'">×</button></div>'}).join('')+
 '<button class="addl" data-ba="'+id+'.'+kind+'">＋</button>'}
function bouquetPanel(){var C=costDB();
 return '<div class="panel"><div class="ph2"><h3>Позиции каталога <small>закуп + состав → «чистыми»</small></h3><input type="search" class="cq" data-q="b" placeholder="Поиск" value="'+esc(cQ.b)+'"></div>'+
 KAT.map(function(x){var p=prod(x.id),P=C.it[x.id]||{};
  return '<details class="bq" data-b="'+x.id+'" data-row="'+esc(p.n.toLowerCase())+'"'+(cOpen[x.id]?' open':'')+'><summary><img src="'+esc(img(p.ph[0]))+'" alt=""><span class="bn">'+esc(p.n)+'<small>'+esc(p.c)+' · '+money(p.price)+' BYN/'+(p.u||'шт.')+'</small></span><span class="bsum" data-bres="'+x.id+'"></span></summary>'+
  '<div class="bb"><label>Закуп за 1 ед., BYN <input class="oth" data-buy="'+x.id+'" inputmode="decimal" value="'+(P.buy!=null?P.buy:buyOf(x.id))+'"></label>'+
  '<label class="nw"><input type="checkbox" data-nw="'+x.id+'"'+(P.nw?' checked':'')+'> без ЗП флориста</label>'+
  (p._pot?'':'<div class="lb">Цветы в составе (доп.)</div>'+lines(C,x.id,'f')+'<div class="lb">Доп. упаковка (сверх фикс. '+PACK+' BYN)</div>'+lines(C,x.id,'k'))+
  '<div class="lb">Прочее, BYN</div><input class="oth" data-bo="'+x.id+'" inputmode="decimal" value="'+(num(P.ot)||'')+'" placeholder="0"><div class="res" data-res="'+x.id+'"></div></div></details>'}).join('')+'</div>'}
function renderCostView(){var C=costDB(),s=C.set,w=C.wage||{};
 var h='<div class="cgrid"><div class="panel"><h3>Общие'+(C.demo?' <span class="demo-s">демо-значения</span>':'')+'</h3><div class="sets">'+
  [['tax','Налог, %'],['acq','Эквайринг, %'],['ovh','Накладные на заказ, BYN'],['dlv','Курьер (затраты) на заказ, BYN'],['pack','Упаковка букета, BYN']].map(function(f){return '<label>'+f[1]+'<input data-set="'+f[0]+'" inputmode="decimal" value="'+num(s[f[0]])+'"'+(f[0]=='pack'?'':'')+'></label>'}).join('')+'</div>'+
  '<div class="hint">Упаковка букета — '+PACK+' BYN с клиента (фикс.). Поле выше — для расчёта себестоимости; обычно совпадает.</div>'+
  '<div class="sets" style="margin-top:12px"><button class="btn ghost sm" id="c-exp">Скачать ops-cost.json</button><label class="btn ghost sm imp">Загрузить ops-cost.json<input type="file" accept="application/json,.json" id="c-imp"></label></div></div>'+
  '<div class="panel"><h3>ЗП флориста</h3><div class="seg"><button data-wm="fix" class="'+(w.mode!='pct'?'on':'')+'">Ставка за букет</button><button data-wm="pct" class="'+(w.mode=='pct'?'on':'')+'">% от цены</button></div><div class="sets">'+
  (w.mode=='pct'?'<label>Процент, %<input data-w="pct" inputmode="decimal" value="'+num(w.pct)+'"></label>':'<label>Ставка, BYN<input data-w="flat" inputmode="decimal" value="'+num(w.flat)+'"></label>')+'</div></div></div>'+
  '<div class="cgrid">'+dirPanel('f','Цветы (закуп)','Поиск по названию')+dirPanel('k','Доп. упаковка','Поиск')+'</div>'+bouquetPanel();
 $('#s-costv').innerHTML=h;['f','k','b'].forEach(filt);fillRes()}
function filt(k){var q=cQ[k].toLowerCase().trim(),box=k=='b'?$('#s-costv'):$('#s-costv [data-dir="'+k+'"]');if(!box)return;(k=='b'?box.querySelectorAll('details.bq'):box.querySelectorAll('tbody tr')).forEach(function(r){r.style.display=!q||(r.dataset.row||'').indexOf(q)>=0?'':'none'})}
function fillRes(){document.querySelectorAll('#s-costv [data-res]').forEach(function(el){var id=el.dataset.res,p=prod(id),x=calcUnit(p,p.price);
  el.className='res '+grade(x);el.innerHTML='<div><span>Закуп</span><b>'+m0(x.buy)+'</b></div><div><span>ЗП</span><b>'+m0(x.wk)+'</b></div><div><span>Прочее + накл.</span><b>'+m0(x.ot+x.ovh)+'</b></div>'+
  '<div class="t"><span>Себестоимость</span><b>'+m0(x.cost)+'</b></div><div><span>Налог + эквайринг</span><b>'+m0(x.fee)+'</b></div><div class="n"><span>Чистыми</span><b>'+m0(x.net)+' BYN</b></div><div class="m"><span>Маржа</span><b>'+pct(x.mg)+'</b></div>'});
 document.querySelectorAll('#s-costv [data-bres]').forEach(function(el){var p=prod(el.dataset.bres),x=calcUnit(p,p.price);el.innerHTML='<span class="nb '+grade(x)+'">чистыми '+m0(x.net)+' · '+pct(x.mg)+'</span>'})}
function lineRef(k){k=k.split('.');var C=costDB(),P=C.it[k[0]]=C.it[k[0]]||{f:[],k:[],ot:0,buy:0};P.f=P.f||[];P.k=P.k||[];return{C:C,r:P,kind:k[1],i:+k[2]}}
var CV=$('#s-costv');
CV.addEventListener('input',function(e){var d=e.target.dataset,C,R;
 if(d.q!=null){cQ[d.q]=e.target.value;filt(d.q);return}
 if(d.set){C=costDB();C.set[d.set]=num(e.target.value);if(d.set=='pack'){/* упаковка букета из статистики */}saveC(C)}
 else if(d.w){C=costDB();C.wage[d.w]=num(e.target.value);saveC(C)}
 else if(d.dp||d.dn){var k=(d.dp||d.dn).split('.');C=costDB();var x=byId(C[k[0]=='f'?'fl':'pk'],k[1]);if(!x)return;if(d.dp)x.p=num(e.target.value);else x.n=e.target.value;saveC(C)}
 else if(d.bq){R=lineRef(d.bq);R.r[R.kind][R.i][1]=num(e.target.value);saveC(R.C)}
 else if(d.bo){C=costDB();C.it[d.bo]=C.it[d.bo]||{};C.it[d.bo].ot=num(e.target.value);saveC(C)}
 else if(d.buy){C=costDB();C.it[d.buy]=C.it[d.buy]||{};C.it[d.buy].buy=num(e.target.value);saveC(C)}
 else return;fillRes()});
CV.addEventListener('change',function(e){var d=e.target.dataset,R,C;
 if(d.bl){R=lineRef(d.bl);R.r[R.kind][R.i][0]=e.target.value;saveC(R.C);fillRes()}
 else if(d.nw){C=costDB();C.it[d.nw]=C.it[d.nw]||{};C.it[d.nw].nw=e.target.checked;saveC(C);fillRes()}
 else if(d.dn){renderCostView()}
 else if(e.target.id=='c-imp'&&e.target.files[0]){var fr=new FileReader();fr.onload=function(){try{var c=JSON.parse(fr.result);if(!c.fl||!c.it)throw 0;c.v=3;LS.set('aik_ops_cost3',c);_cc=c;renderCostView();toast('Себестоимость загружена')}catch(x){toast('Файл не похож на ops-cost.json')}};fr.readAsText(e.target.files[0])}});
CV.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var d=b.dataset,C,R,k;
 if(b.id=='c-exp'){dl('ops-cost.json',new Blob([JSON.stringify(costDB(),null,1)],{type:'application/json'}));return}
 if(d.wm){C=costDB();C.wage.mode=d.wm;saveC(C)}
 else if(d.dadd){C=costDB();var L=C[d.dadd=='f'?'fl':'pk'],nid=uid(d.dadd);L.push({id:nid,n:d.dadd=='f'?'Новый цветок':'Новая упаковка',p:0});saveC(C);cQ[d.dadd]='';renderCostView();return}
 else if(d.ddel){k=d.ddel.split('.');C=costDB();var key=k[0]=='f'?'fl':'pk';C[key]=C[key].filter(function(x){return x.id!=k[1]});
  Object.keys(C.it).forEach(function(p){var r=C.it[p];if(r&&r[k[0]])r[k[0]]=r[k[0]].filter(function(x){return x[0]!=k[1]})});saveC(C)}
 else if(d.bx){R=lineRef(d.bx);R.r[R.kind].splice(R.i,1);saveC(R.C)}
 else if(d.ba){R=lineRef(d.ba+'.0');var D=R.C[R.kind=='f'?'fl':'pk'];if(!D.length){toast('Сначала добавьте в справочник');return}R.r[R.kind]=R.r[R.kind]||[];R.r[R.kind].push([D[0].id,1]);saveC(R.C)}
 else return;e.preventDefault();var y=scrollY;renderCostView();scrollTo(0,y)});
CV.addEventListener('toggle',function(e){var t=e.target;if(t.dataset&&t.dataset.b)cOpen[t.dataset.b]=t.open?1:0},true);

function orderNet(o){var C=costDB(),net=0,hasB=false;for(var i=0;i<o.items.length;i++){var it=o.items[i],l=line(it),x=calcUnit(l.p,l.unit);net+=l.sum-x.cost*l.qty;if(!l.p._pot)hasB=true}
 var t=total(o),wk=hasB&&o.pack?wageOf(goodsSum(o),false):0;
 return net-wk+(o.dlv||0)-(o.mode=='dlv'?num(C.set.dlv):0)-t*(num(C.set.tax)+num(C.set.acq))/100-num(C.set.ovh)-(o.pack?num(C.set.pack):0)}

/* ---------- Метрики ---------- */
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
 h+='<div class="kpis net1">'+(cov.length?kp('Чистая прибыль',m0(netS)+' <small>BYN</small>','<span class="dl '+(netS>=0?'pos':'neg')+'">маржа '+pct(revC?netS/revC:0)+'</span> · по '+cov.length+' зак.',0):kp('Чистая прибыль','—','Задайте <a class="lnk" href="#stats/cost">Себестоимость</a>',0))+'</div>';
 var D=per==1?7:per,days=[],mx=1;for(var i=D-1;i>=0;i--){var a=t0()-i*864e5,v=orders.filter(function(o){return o.st!='cancel'&&o.at>=a&&o.at<a+864e5}).reduce(function(s,o){return s+total(o)},0);days.push({a:a,v:v});mx=Math.max(mx,v)}
 var W=720,H=200,bw=W/D,svg='<svg viewBox="0 0 '+W+' '+(H+24)+'" class="chart">'+[.25,.5,.75,1].map(function(f){return '<line x1="0" x2="'+W+'" y1="'+(H-H*f*.9)+'" y2="'+(H-H*f*.9)+'"/>'}).join('')+
  days.map(function(d,i){var bh=d.v/mx*H*.9,x=i*bw+bw*.18,w=bw*.64,td=i==D-1,dt=new Date(d.a);return '<rect class="'+(td?'td':'')+'" x="'+x+'" y="'+(H-bh)+'" width="'+w+'" height="'+Math.max(bh,1)+'" rx="'+Math.min(6,w/3)+'"><title>'+dt.toLocaleDateString('ru-RU')+': '+money(d.v)+' BYN</title></rect>'+
   ((D<=7||i%5==0||td)?'<text x="'+(x+w/2)+'" y="'+(H+17)+'">'+(D<=7?dt.toLocaleDateString('ru-RU',{weekday:'short'}):dt.getDate())+'</text>':'')}).join('')+'</svg>';
 h+='<div class="sgrid"><div class="panel wide"><h3>Выручка по дням</h3>'+svg+'</div>';
 var sc={};A.L.forEach(function(o){sc[o.st]=(sc[o.st]||0)+1});
 h+='<div class="panel"><h3>По статусам</h3>'+ST.map(function(s){var c=sc[s[0]]||0;return '<div class="bar"><span>'+stb(s[0])+'</span><i><b style="width:'+(A.n?c/A.n*100:0)+'%;background:var(--s-'+s[0]+')"></b></i><em>'+c+'</em></div>'}).join('')+'</div>';
 var dl=A.ok.filter(function(o){return o.mode=='dlv'}).length,sf=A.ok.length-dl,pd=A.ok.length?Math.round(dl/A.ok.length*100):0;
 h+='<div class="panel"><h3>Доставка / самовывоз</h3><div class="split2"><i style="width:'+pd+'%"></i></div><div class="lg"><span><b class="c1"></b>Доставка '+dl+'</span><span><b class="c2"></b>Самовывоз '+sf+'</span></div></div>';
 var tp={};A.ok.forEach(function(o){o.items.forEach(function(it){var l=line(it),k=it.id;tp[k]=tp[k]||{p:l.p,n:0,v:0};tp[k].n+=it.q||1;tp[k].v+=l.sum})});
 var T=Object.keys(tp).map(function(k){return tp[k]}).sort(function(a,b){return b.v-a.v}).slice(0,5),tm=T.length?T[0].v:1;
 h+='<div class="panel wide"><h3>Топ товаров</h3>'+(T.length?T.map(function(t,i){return '<div class="tp"><span class="nn">'+(i+1)+'</span><img src="'+esc(img((t.p.ph||[])[0]||''))+'" alt=""><div><div>'+esc(t.p.n)+' <small>· '+t.n+' шт.</small></div><i><b style="width:'+(t.v/tm*100)+'%"></b></i></div><em>'+money(Math.round(t.v))+' BYN</em></div>'}).join(''):'<div class="k">Нет продаж</div>')+'</div></div>';
 $('#s-body').innerHTML=h}
$('#s-per').onclick=function(e){var b=e.target.closest('[data-per]');if(!b)return;per=+b.dataset.per;LS.set('aik_ops_per',per);renderStats()};
function statsSub(h){var c=h=='stats/cost';$('#s-m').hidden=c;$('#s-c').hidden=!c;document.querySelectorAll('.subtabs a').forEach(function(a){a.classList.toggle('on',(a.dataset.s=='c')==c)});c?renderCostView():renderStats()}

/* ---------- Роутинг + роль ---------- */
window.OPS={$:$,esc:esc,toast:toast,img:img,prod:prod,KAT:KAT,LS:LS,dl:dl,shrink:shrink,basePrice:function(p){return prod(p.id).price},BASE:BASE,role:role,isOwner:isOwner};
function route(){$('#k-modal').hidden=true;if(window.OPS_HOME)OPS_HOME.close();applyRole();
 var h=location.hash.replace('#','')||'orders',t=h.indexOf('catalog')==0?'catalog':h.indexOf('stats')==0?'stats':h.indexOf('home')==0?'home':'orders';
 if(!isOwner()&&t!='orders'){location.hash='orders';return}
 document.querySelectorAll('.tabs a').forEach(function(a){a.classList.toggle('on',a.dataset.t==t)});
 $('#v-orders').hidden=t!='orders';$('#v-catalog').hidden=t!='catalog';$('#v-stats').hidden=t!='stats';$('#v-home').hidden=t!='home';
 sel=h.indexOf('order/')==0?h.slice(6):null;if(t=='orders')renderOrders();else{document.body.classList.remove('card-open');t=='stats'?statsSub(h):t=='home'?(window.OPS_HOME&&OPS_HOME.render()):renderKat()}}
window.addEventListener('hashchange',route);
$('#role-sw').onclick=function(e){var b=e.target.closest('[data-role]');if(!b)return;LS.set('aik_ops_role',b.dataset.role);toast(b.dataset.role=='owner'?'Роль: владелец':'Роль: флорист (только заказы)');route()};
if(!KAT.length){toast('Каталог не загрузился — проверьте ../js/kat.js');console.warn('AIK_KAT empty')}
migrateLive();
route();
})();
