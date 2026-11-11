/* AI KVETKA · ops · раздел «Склад»: остатки, приходы, списания, инвентаризация, журнал.
   Хранение: localStorage aik_ops_stock_v1 (не пишем в kat.js). Демо помечается, существующие ключи не трогаем. */
(function(){
var O=window.OPS;if(!O)return;
var $=O.$,esc=O.esc,LS=O.LS,KAT=O.KAT,K='aik_ops_stock_v1';
var UNITS=['шт.','стебель','ветка','горшок','м','уп.','пучок'];
var REASONS=[['wilt','Увяли'],['defect','Брак'],['dmg','Повреждено'],['used','Использовано в букете'],['other','Другое']];
var RN={wilt:'Увяли',defect:'Брак',dmg:'Повреждено',used:'Использовано в букете',other:'Другое',sale:'Продажа',ret:'Возврат с заказа'};
var TY={in:'Приход',out:'Списание',adj:'Корректировка',sale:'Продажа',ret:'Возврат'};
var FIL_LBL={all:'Все',low:'Мало',out:'Нет в наличии',cons:'Расходники'};

function num(v){return O.num(v)}
function money(v){return O.money(v)}
function m0(v){return O.m0(v)}
function clone(x){return JSON.parse(JSON.stringify(x))}
function isoDay(t){var d=new Date(t==null?Date.now():t),z=d.getTimezoneOffset();return new Date(d.getTime()-z*6e4).toISOString().slice(0,10)}
function parseDay(s){var p=String(s||'').split('-');return p.length<3?Date.now():new Date(+p[0],+p[1]-1,+p[2],12,0,0).getTime()}
function isCons(id){return String(id).indexOf('c:')==0}
function t0(){var d=new Date();d.setHours(0,0,0,0);return d.getTime()}
function inP(t,days){var a=t0()-(days-1)*864e5,b=t0()+864e5;return t>=a&&t<b}

/* ---------- демо-остатки и движения (первый запуск, без перезаписи) ---------- */
function demoDB(){
 var D={v:1,demo:true,items:{},moves:[],suppliers:['ЦветыОпт Минск','ПакМаркет']},n=Date.now();
 function put(id,min,u,nm){D.items[id]={qty:0,min:min||0};if(u)D.items[id].u=u;if(nm){D.items[id].n=nm;D.items[id].kind='cons'}}
 /* живые позиции витрины + расходники, чтобы журнал и фильтры сразу было на что смотреть */
 put('rose-mondial',20);put('rose-explorer',20);put('rose-veggie',15);put('rose-fatima',12);
 put('alstro-pink',20);put('eustoma-pink',15);put('hydrangea-white',8);put('lily-white',10);
 put('eucalyptus',15);put('ruscus',10);put('orchid-white-70',3);put('anthurium-jumbo',2);
 put('c:kraft',15,'шт.','Крафт / плёнка');put('c:ribbon',10,'м','Лента атласная');
 put('c:box',5,'шт.','Коробки для букетов');put('c:foam',4,'шт.','Губка оазис');
 put('c:card',10,'шт.','Открытки');put('c:twine',8,'м','Бечёвка');
 function mv(o){o.id=O.uid('m');o.undone=false;o.demo=true;var it=D.items[o.item]=D.items[o.item]||{qty:0,min:0};
  o.before=num(it.qty);it.qty=o.before+num(o.dlt);o.after=it.qty;if(o.typ=='in'&&o.buy!=null)it.lastBuy=num(o.buy);D.moves.push(o)}
 var b1=O.uid('b');
 [['rose-mondial',100,4],['rose-explorer',60,4.5],['rose-veggie',25,3.8],['rose-fatima',12,4.2],
  ['alstro-pink',60,2.2],['eustoma-pink',35,3],['hydrangea-white',15,8],['lily-white',20,5],
  ['eucalyptus',40,1.8],['ruscus',25,2],['orchid-white-70',6,55],['anthurium-jumbo',5,40]
 ].forEach(function(x){mv({t:n-5*864e5,typ:'in',item:x[0],q:x[1],dlt:x[1],buy:x[2],cost:x[2],supplier:'ЦветыОпт Минск',batch:b1,comment:'Поставка к выходным'})});
 var b2=O.uid('b');
 [['c:kraft',40,.6],['c:ribbon',50,.35],['c:box',15,2.5],['c:foam',10,3.2],['c:card',50,.4]
 ].forEach(function(x){mv({t:n-4*864e5,typ:'in',item:x[0],q:x[1],dlt:x[1],buy:x[2],cost:x[2],supplier:'ПакМаркет',batch:b2,comment:'Упаковка и расходники'})});
 mv({t:n-2*864e5,typ:'out',item:'rose-mondial',q:8,dlt:-8,reason:'wilt',cost:4,comment:'Подвяли в холодильнике'});
 mv({t:n-2*864e5,typ:'out',item:'rose-fatima',q:2,dlt:-2,reason:'wilt',cost:4.2,comment:''});
 mv({t:n-2*864e5,typ:'out',item:'eustoma-pink',q:3,dlt:-3,reason:'defect',cost:3,comment:'Сломан стебель'});
 mv({t:n-2*864e5,typ:'out',item:'c:ribbon',q:5,dlt:-5,reason:'used',cost:.35,comment:'Сборка букетов'});
 mv({t:n-2*864e5,typ:'out',item:'c:kraft',q:4,dlt:-4,reason:'used',cost:.6,comment:''});
 mv({t:n-2*864e5,typ:'out',item:'c:card',q:2,dlt:-2,reason:'used',cost:.4,comment:''});
 var b3=O.uid('b');
 mv({t:n-26*3600e3,typ:'sale',item:'anthurium-jumbo',q:1,dlt:-1,reason:'sale',cost:40,orderId:'1042',batch:b3,comment:'Заказ №1042'});
 var b4=O.uid('b');
 mv({t:n-48*3600e3,typ:'sale',item:'lily-white',q:3,dlt:-3,reason:'sale',cost:5,orderId:'1040',batch:b4,comment:'Заказ №1040'});
 mv({t:n-48*3600e3,typ:'sale',item:'eucalyptus',q:2,dlt:-2,reason:'sale',cost:1.8,orderId:'1040',batch:b4,comment:'Заказ №1040'});
 mv({t:n-20*3600e3,typ:'adj',item:'lily-white',q:16,dlt:-1,reason:'',cost:5,comment:'Пересчёт после выдачи'});
 return D}

var _db=null;
function db(){if(_db)return _db;var d=LS.get(K,null);if(!d||d.v!=1){d=demoDB();LS.set(K,d)}return _db=d}
function save(D){if(D._touched){delete D.demo;delete D._touched}_db=D;LS.set(K,D)}

function rec(id){return db().items[id]||null}
function qtyOf(id){var r=rec(id);return r?num(r.qty):0}
function minOf(id){var r=rec(id);return r?num(r.min):0}
function lastBuyOf(id){var r=rec(id);return r&&r.lastBuy!=null&&r.lastBuy!==''?num(r.lastBuy):null}
function unitOf(id){var r=rec(id);if(r&&r.u)return r.u;if(!isCons(id)){var p=O.prod(id);if(p&&p.u)return p.u}return 'шт.'}
function nameOf(id){if(isCons(id)){var r=rec(id);return (r&&r.n)||id}var p=O.prod(id);return p?p.n:id}
function photoOf(id){if(isCons(id))return '';var p=O.prod(id);return (p&&p.ph&&p.ph[0])||''}
function costUnit(id){var lb=lastBuyOf(id);if(lb!=null)return lb;return isCons(id)?0:(O.buyOf(id)||0)}
function tracked(id){return !!rec(id)} /* в учёте — была поставка, расходник или задан мин. */
function level(id){var q=qtyOf(id),m=minOf(id);if(!tracked(id)&&q<=0)return 'none';return q<=0?'out':(m>0&&q<=m)?'low':'ok'}
function liveMoves(){return db().moves.filter(function(m){return !m.undone&&!m.undoes})}

function apply(D,m){var it=D.items[m.item]=D.items[m.item]||{qty:0,min:0};
 m.before=num(it.qty);it.qty=Math.round((m.before+num(m.dlt))*1000)/1000;m.after=it.qty;
 if(m.typ=='in'&&m.buy!=null&&m.buy!=='')it.lastBuy=num(m.buy);
 D.moves.push(m);return m}
function addMoves(list,touch){var D=db();
 list.forEach(function(m){m.id=m.id||O.uid('m');m.t=m.t||Date.now();m.undone=false;if(m.cost==null)m.cost=m.typ=='in'?num(m.buy):costUnit(m.item);apply(D,m)});
 if(touch)D._touched=1;save(D)}
function undoMove(id){var D=db(),m=null;D.moves.forEach(function(x){if(x.id==id)m=x});
 if(!m||m.undone||m.undoes)return false;
 m.undone=true;D._touched=1;
 apply(D,{id:O.uid('m'),t:Date.now(),typ:m.typ,item:m.item,q:m.q,dlt:-num(m.dlt),buy:m.buy,cost:m.cost,supplier:m.supplier||'',reason:m.reason||'',comment:'Отмена записи',orderId:m.orderId||'',batch:m.batch||'',undoes:m.id});
 save(D);return true}

/* выдача заказа → списание «продажа» один раз; снятие выдачи → возврат */
function activeSales(oid){return liveMoves().filter(function(m){return m.typ=='sale'&&m.orderId==oid})}
function onStatus(o,prev){
 if(!o)return;
 if(o.st=='done'&&prev!='done'){
  if(activeSales(o.id).length)return;
  var batch=O.uid('b'),list=[],neg=false;
  (o.items||[]).forEach(function(it){var q=it.q||1;if(qtyOf(it.id)<q)neg=true;
   list.push({typ:'sale',item:it.id,q:q,dlt:-q,reason:'sale',orderId:o.id,batch:batch,comment:'Заказ №'+o.id})});
  if(list.length){addMoves(list,1);O.toast('Списано со склада по заказу №'+o.id+(neg?' (есть минус по остатку)':''))}
 }else if(prev=='done'&&o.st!='done'){
  var L=activeSales(o.id);if(!L.length)return;
  L.forEach(function(m){undoMove(m.id)});O.toast('Возврат на склад по заказу №'+o.id)}
}

/* подписи в карточке каталога и рядом с себестоимостью — расчёт «чистыми» не меняем */
function hint(p){if(!p)return '';var q=qtyOf(p.id),u=unitOf(p.id),lv=level(p.id);
 var t=lv=='none'?'на складе не ведётся':lv=='out'?'нет на складе':(lv=='low'?'мало · '+fmtQty(q)+' '+u:fmtQty(q)+' '+u+' на складе');
 return '<div class="skhint '+lv+'">'+esc(t)+'</div>'}
function lastBuyHtml(id){var lb=lastBuyOf(id);if(lb==null)return '';
 return '<div class="skbuy">последний приход '+m0(lb)+' BYN / ед. <small>для справки, в расчёт «чистыми» не входит</small></div>'}

function fmtQty(q){var n=num(q);return n===Math.round(n)?String(Math.round(n)):String(Math.round(n*1000)/1000).replace('.',',')}
function ph(id){var u=photoOf(id);return u?'<i class="ski" style="background-image:url(\''+esc(O.img(u))+'\')"></i>':'<i class="ski mon">'+esc((nameOf(id)||'?').charAt(0))+'</i>'}
function pill(id){var lv=level(id);return lv=='out'?'<span class="skp out">нет</span>':lv=='low'?'<span class="skp low">мало</span>':''}

function allIds(){var seen={},L=[];
 KAT.forEach(function(x){seen[x.id]=1;L.push(x.id)});
 Object.keys(db().items).forEach(function(id){if(!seen[id]){seen[id]=1;L.push(id)}});
 return L}
function searchItems(q,opts){q=(q||'').toLowerCase().trim();opts=opts||{};
 return allIds().map(function(id){return {id:id,n:nameOf(id),u:unitOf(id),cons:isCons(id),qty:qtyOf(id),lv:level(id),tr:tracked(id)}})
  .filter(function(x){if(opts.consOnly&&!x.cons)return false;if(!q)return true;return (x.n+' '+x.u+' '+x.id).toLowerCase().indexOf(q)>=0})
  .sort(function(a,b){var w={low:0,ok:1,out:2,none:3};return (opts.byName?0:(w[a.lv]-w[b.lv]))||a.n.localeCompare(b.n,'ru')})}

/* ---------- сводка ---------- */
var per=LS.get('aik_ops_stock_per',7),fil=LS.get('aik_ops_stock_fil','all'),qList='',logFil='all',logPer=30,logQ='';
function periodSum(days){
 var inc=0,out=0,reasons={};
 liveMoves().forEach(function(m){if(!inP(m.t,days))return;var v=Math.abs(num(m.dlt))*num(m.cost||0);
  if(m.typ=='in')inc+=v;else if(m.typ=='out'||m.typ=='sale'){out+=v;var r=m.reason||m.typ;(reasons[r]=reasons[r]||{n:0,v:0});reasons[r].n++;reasons[r].v+=v}});
 return{inc:inc,out:out,reasons:reasons}}
function stockVal(){var s=0;allIds().forEach(function(id){var q=qtyOf(id);if(q>0)s+=q*costUnit(id)});return s}
function kpiHtml(){
 var A=periodSum(per),P=per,val=stockVal(),attn=allIds().filter(function(id){var lv=level(id);return lv=='low'||lv=='out'}).length;
 var outPct=A.inc?Math.round(A.out/A.inc*100): (val?Math.round(A.out/val*100):0);
 var incPct=val?Math.round(A.inc/val*100):0;
 var top=Object.keys(A.reasons).map(function(k){return {k:k,n:A.reasons[k].n,v:A.reasons[k].v}}).sort(function(a,b){return b.v-a.v}).slice(0,3);
 return '<div class="filters" id="st-per">'+[[1,'Сегодня'],[7,'7 дней'],[30,'30 дней']].map(function(x){return '<button class="chip'+(per==x[0]?' on':'')+'" data-sper="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div>'+
  '<div class="kpis skpis">'+
  '<div class="kpi"><h3>Стоимость склада</h3><div class="v">'+money(Math.round(val*10)/10)+' <small>BYN</small></div><div class="k">по закупке · '+attn+' '+(attn==1?'позиция требует':(attn>1&&attn<5)?'позиции требуют':'позиций требуют')+' внимания</div></div>'+
  '<div class="kpi"><h3>Приходы</h3><div class="v">'+money(Math.round(A.inc*10)/10)+' <small>BYN</small></div><div class="k">'+incPct+'% от стоимости склада</div></div>'+
  '<div class="kpi"><h3>Списания</h3><div class="v">'+money(Math.round(A.out*10)/10)+' <small>BYN</small></div><div class="k">'+outPct+'% от приходов за период</div></div>'+
  '<div class="kpi"><h3>Топ причин списаний</h3>'+(top.length?'<ul class="sktop">'+top.map(function(t){return '<li><span>'+esc(RN[t.k]||TY[t.k]||t.k)+'</span><em>'+money(Math.round(t.v))+' BYN · '+t.n+'</em></li>'}).join('')+'</ul>':'<div class="k">За период списаний не было</div>')+'</div></div>'}

function tabsHtml(sub){
 var T=[['list','Остатки','#stock'],['in','Приход','#stock/in'],['out','Списание','#stock/out'],['adj','Инвентаризация','#stock/adj'],['log','Журнал','#stock/log']];
 return '<nav class="subtabs" id="st-tabs">'+T.map(function(t){return '<a href="'+t[2]+'" class="'+(sub==t[0]?'on':'')+'">'+t[1]+'</a>'}).join('')+'</nav>'}

/* ---------- остатки ---------- */
function renderList(){
 var L=searchItems(qList,{byName:fil=='cons'}).filter(function(x){
  if(fil=='low')return x.lv=='low';if(fil=='out')return x.lv=='out';if(fil=='cons')return x.cons;return true});
 var c={all:0,low:0,out:0,cons:0};searchItems('').forEach(function(x){c.all++;if(x.lv=='low')c.low++;if(x.lv=='out')c.out++;if(x.cons)c.cons++});
 return kpiHtml()+'<div class="tools"><input id="st-q" type="search" placeholder="Поиск по складу" value="'+esc(qList)+'"><span class="grow"></span><button class="btn ghost" data-stnew>＋ Расходник</button></div>'+
  '<div class="filters" id="st-fil">'+['all','low','out','cons'].map(function(k){return '<button class="chip'+(fil==k?' on':'')+'" data-sfil="'+k+'">'+FIL_LBL[k]+' <b>'+c[k]+'</b></button>'}).join('')+'</div>'+
  '<div class="sklist">'+(L.length?L.map(rowHtml).join(''):'<div class="panel"><div class="empty" style="padding:40px 0">Ничего не нашлось</div></div>')+'</div>'}
function rowHtml(x){
 var id=x.id,q=x.qty,val=q>0?q*costUnit(id):0,lb=lastBuyOf(id);
 return '<div class="skrow '+x.lv+(x.cons?' cons':'')+'" data-sid="'+esc(id)+'">'+ph(id)+
  '<div class="skn"><b>'+esc(x.n)+'</b><small>'+(x.cons?'расходник · ':'')+esc(x.u)+(lb!=null?' · закуп '+m0(lb):'')+'</small></div>'+
  '<div class="skq">'+pill(id)+'<strong>'+fmtQty(q)+'</strong><small>'+esc(x.u)+'</small>'+
  '<label class="skmin">мин. <input data-smin="'+esc(id)+'" inputmode="decimal" value="'+fmtQty(minOf(id))+'"></label></div>'+
  '<div class="skv">'+(val?m0(val)+' BYN':'—')+'</div>'+
  '<div class="skact"><button class="btn ghost sm" data-go="in" data-id="'+esc(id)+'">Приход</button><button class="btn ghost sm" data-go="out" data-id="'+esc(id)+'">Списать</button><button class="btn ghost sm" data-go="adj" data-id="'+esc(id)+'">Факт</button>'+
  (x.cons?'<button class="xb" data-sdel="'+esc(id)+'" title="Удалить расходник">×</button>':'')+'</div></div>'}

/* ---------- формы: приход / списание / инвентаризация ---------- */
var draftIn={supplier:'',date:isoDay(),comment:'',lines:[{id:'',q:'',buy:'',qstr:''}]},inQ=[];
var draftOut={id:'',q:'',reason:'wilt',comment:'',qstr:''},outQ='';
var draftAdj={qstr:'',vals:{},pre:''};

function pickList(q,sel){return searchItems(q,{byName:1}).slice(0,12).map(function(x){
  return '<button type="button" class="hpr'+(x.id==sel?' on':'')+'" data-pick="'+esc(x.id)+'">'+ph(x.id)+'<span><b>'+esc(x.n)+'</b><small>'+esc(x.u)+' · сейчас '+fmtQty(x.qty)+'</small></span><em>'+pill(x.id)+'</em></button>'}).join('')||'<p class="mut">Ничего не нашлось</p>'}

function renderIn(){
 var d=draftIn,sup=db().suppliers||[];
 return '<div class="panel skform"><h3>Приход поставки</h3><p class="sub">Несколько позиций в одной поставке. Поставщик запоминается.</p>'+
  '<div class="hfs">'+
  '<label><span>Поставщик</span><input list="st-sup" data-in="supplier" value="'+esc(d.supplier)+'" placeholder="Название или новый"><datalist id="st-sup">'+sup.map(function(s){return '<option value="'+esc(s)+'">'}).join('')+'</datalist></label>'+
  '<label><span>Дата</span><input type="date" data-in="date" value="'+esc(d.date)+'"></label>'+
  '<label class="w2"><span>Комментарий</span><input data-in="comment" value="'+esc(d.comment)+'" placeholder="Номер накладной, заметка"></label></div>'+
  d.lines.map(function(ln,i){return '<div class="skline" data-li="'+i+'"><div class="skpickw">'+
   (ln.id?'<div class="sksel">'+ph(ln.id)+'<span><b>'+esc(nameOf(ln.id))+'</b><small>'+esc(unitOf(ln.id))+' · сейчас '+fmtQty(qtyOf(ln.id))+'</small></span><button type="button" class="xb" data-inclr="'+i+'">×</button></div>':
    '<input type="search" data-inq="'+i+'" placeholder="Найти позицию" value="'+esc(inQ[i]||'')+'"><div class="skpick">'+(inQ[i]?'':'')+'</div>')+
   '</div><input data-inqty="'+i+'" inputmode="decimal" placeholder="Кол-во" value="'+esc(ln.q)+'"><input data-inbuy="'+i+'" inputmode="decimal" placeholder="Закуп, BYN" value="'+esc(ln.buy)+'">'+
   '<button type="button" class="xb" data-indel="'+i+'" '+(d.lines.length<2?'hidden':'')+'>×</button></div>'}).join('')+
  '<button type="button" class="btn ghost sm" data-inadd>＋ Ещё позицию</button>'+
  '<div class="acts skacts"><button type="button" class="btn" data-insave>Провести приход</button></div></div>'}

function renderOut(){
 var d=draftOut;
 return '<div class="panel skform"><h3>Списание</h3><p class="sub">Увяли, брак, повреждение или использовано в работе. Продажа списывается сама при статусе «выдан».</p>'+
  '<div class="skline one"><div class="skpickw">'+
  (d.id?'<div class="sksel">'+ph(d.id)+'<span><b>'+esc(nameOf(d.id))+'</b><small>'+esc(unitOf(d.id))+' · сейчас '+fmtQty(qtyOf(d.id))+'</small></span><button type="button" class="xb" data-outclr>×</button></div>':
   '<input type="search" id="st-outq" placeholder="Найти позицию" value="'+esc(outQ)+'"><div class="skpick" id="st-outpick"></div>')+
  '</div></div>'+
  '<div class="hfs">'+
  '<label><span>Количество</span><input data-out="q" inputmode="decimal" value="'+esc(d.q)+'" placeholder="0"></label>'+
  '<label><span>Причина</span><select data-out="reason">'+REASONS.map(function(r){return '<option value="'+r[0]+'"'+(d.reason==r[0]?' selected':'')+'>'+r[1]+'</option>'}).join('')+'</select></label>'+
  '<label class="w2"><span>Комментарий</span><input data-out="comment" value="'+esc(d.comment)+'"></label></div>'+
  '<div class="acts skacts"><button type="button" class="btn" data-outsave>Списать</button></div></div>'}

function renderAdj(){
 var q=draftAdj.qstr,L=searchItems(q,{byName:1});if(draftAdj.pre){L=L.filter(function(x){return x.id==draftAdj.pre||(q&&true)});if(!q)L=searchItems('').filter(function(x){return x.id==draftAdj.pre}).concat(searchItems('').filter(function(x){return x.id!=draftAdj.pre}))}
 return kpiHtml()+'<div class="panel skform"><h3>Инвентаризация</h3><p class="sub">Впишите фактический остаток — система сама запишет разницу. Пустое поле пропускается.</p>'+
  '<div class="tools"><input id="st-adjq" type="search" placeholder="Поиск позиции" value="'+esc(q)+'"></div>'+
  '<div class="skadj">'+(L.length?L.slice(0,80).map(function(x){var v=draftAdj.vals[x.id];v=v==null?'':v;
   return '<div class="skaline" data-aid="'+esc(x.id)+'">'+ph(x.id)+'<div class="skn"><b>'+esc(x.n)+'</b><small>'+esc(x.u)+' · учёт '+fmtQty(x.qty)+'</small></div>'+
   '<label class="skfact">факт <input data-adj="'+esc(x.id)+'" inputmode="decimal" value="'+esc(v)+'" placeholder="'+fmtQty(x.qty)+'"></label></div>'}).join(''):'<div class="k">Ничего не нашлось</div>')+'</div>'+
  '<div class="acts skacts"><button type="button" class="btn" data-adjsave>Записать расхождения</button></div></div>'}

/* ---------- журнал ---------- */
function renderLog(){
 var from=logPer==0?0:t0()-(logPer-1)*864e5,L=db().moves.slice().sort(function(a,b){return b.t-a.t}).filter(function(m){
  if(logFil!='all'&&m.typ!=logFil)return false;if(logPer&&m.t<from)return false;
  if(!logQ)return true;var s=(nameOf(m.item)+' '+(m.supplier||'')+' '+(m.comment||'')+' '+(m.orderId||'')+' '+(RN[m.reason]||'')).toLowerCase();
  return s.indexOf(logQ.toLowerCase().trim())>=0});
 return kpiHtml()+'<div class="tools"><input id="st-logq" type="search" placeholder="Поиск в журнале" value="'+esc(logQ)+'"><span class="grow"></span></div>'+
  '<div class="filters" id="st-logf">'+[['all','Все'],['in','Приходы'],['out','Списания'],['adj','Корректировки'],['sale','Продажи']].map(function(x){return '<button class="chip'+(logFil==x[0]?' on':'')+'" data-logf="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div>'+
  '<div class="filters dates" id="st-logp">'+[[1,'Сегодня'],[7,'7 дней'],[30,'30 дней'],[0,'Всё время']].map(function(x){return '<button class="chip'+(logPer==x[0]?' on':'')+'" data-logp="'+x[0]+'">'+x[1]+'</button>'}).join('')+'</div>'+
  '<div class="sklog">'+(L.length?L.map(function(m){var can=!m.undone&&!m.undoes;
   return '<div class="skm'+(m.undone?' undone':'')+(m.undoes?' rev':'')+(m.demo?' demo':'')+'">'+
    '<div class="skmt">'+esc(O.fmtT(m.t))+'</div><div class="skmn">'+ph(m.item)+'<div><b>'+esc(nameOf(m.item))+'</b><small>'+
    (m.undoes?'Отмена: ':'')+esc(TY[m.typ]||m.typ)+(m.reason&&m.typ!='in'&&m.typ!='adj'?' · '+esc(RN[m.reason]||m.reason):'')+
    (m.supplier?' · '+esc(m.supplier):'')+(m.orderId?' · заказ №'+esc(m.orderId):'')+(m.demo?' · демо':'')+
    (m.comment?' · '+esc(m.comment):'')+'</small></div></div>'+
    '<div class="skmd '+(num(m.dlt)<0?'neg':'pos')+'">'+(num(m.dlt)>0?'+':'')+fmtQty(m.dlt)+' <small>'+esc(unitOf(m.item))+'</small>'+
    (m.typ=='in'&&m.buy!=null?'<em>'+m0(m.buy)+' BYN</em>':'')+'</div>'+
    '<div class="skmb">'+fmtQty(m.before)+' → '+fmtQty(m.after)+(can?'<button class="btn ghost sm" data-sundo="'+m.id+'">Отменить</button>':'')+'</div></div>'}).join(''):'<div class="panel"><div class="empty" style="padding:40px 0">Записей нет</div></div>')+'</div>'}

/* ---------- расходник: модалка ---------- */
function openNew(){
 var m=$('#st-modal');if(!m)return;m.hidden=false;
 $('#st-form').innerHTML='<form class="f sknew"><h2>Новый расходник</h2><div><label>Название</label><input name="n" required placeholder="Например, лента, губка, коробки">'+
  '<label>Единица</label><select name="u">'+UNITS.map(function(u){return '<option>'+u+'</option>'}).join('')+'</select>'+
  '<label>Минимальный остаток</label><input name="min" inputmode="decimal" value="0">'+
  '<label>Начальный остаток <small>необязательно</small></label><input name="qty" inputmode="decimal" value="" placeholder="0">'+
  '<label>Закуп за единицу, BYN <small>если есть</small></label><input name="buy" inputmode="decimal" value=""></div>'+
  '<div class="acts"><button type="button" class="btn ghost" data-close>Отмена</button><button class="btn">Добавить</button></div></form>'}
function closeNew(){var m=$('#st-modal');if(m)m.hidden=true}

/* ---------- отрисовка ---------- */
function subOf(h){h=(h||location.hash).replace('#','');return h=='stock/in'?'in':h=='stock/out'?'out':h=='stock/adj'?'adj':h=='stock/log'?'log':'list'}
function render(h){
 var sub=subOf(h),body=$('#st-body');if(!body)return;
 var demo=db().demo?'<p class="sub" id="st-sub">Данные в этом браузере. Сейчас показан <span class="demo-s">демо-набор</span> — правьте сами, демо-метка снимется после первого прихода или списания.</p>':
  '<p class="sub" id="st-sub">Остатки, приходы и списания. Всё хранится в этом браузере.</p>';
 var head=$('#v-stock .head .sub');if(head)head.outerHTML=demo;
 body.innerHTML=tabsHtml(sub)+(sub=='in'?renderIn():sub=='out'?renderOut():sub=='adj'?renderAdj():sub=='log'?renderLog():renderList());
 if(sub=='out'&&!draftOut.id)fillOutPick();
 if(sub=='in')fillInPicks()}
function fillOutPick(){var el=$('#st-outpick');if(el)el.innerHTML=outQ?pickList(outQ,draftOut.id):''}
function fillInPicks(){draftIn.lines.forEach(function(ln,i){if(ln.id)return;var box=document.querySelector('.skline[data-li="'+i+'"] .skpick');if(box)box.innerHTML=inQ[i]?pickList(inQ[i],ln.id):''})}

function rememberSup(name){name=(name||'').trim();if(!name)return;var D=db();D.suppliers=D.suppliers||[];if(D.suppliers.indexOf(name)<0){D.suppliers.unshift(name);if(D.suppliers.length>20)D.suppliers.pop();save(D)}}

function saveIn(){
 var d=draftIn,lines=d.lines.filter(function(ln){return ln.id&&num(ln.q)>0});
 if(!lines.length){O.toast('Добавьте хотя бы одну позицию с количеством');return}
 var t=parseDay(d.date),batch=O.uid('b'),list=lines.map(function(ln){return {t:t,typ:'in',item:ln.id,q:num(ln.q),dlt:num(ln.q),buy:ln.buy===''?costUnit(ln.id):num(ln.buy),supplier:d.supplier.trim(),batch:batch,comment:d.comment.trim()}});
 rememberSup(d.supplier);addMoves(list,1);
 draftIn={supplier:d.supplier,date:isoDay(),comment:'',lines:[{id:'',q:'',buy:''}]};inQ=[];
 O.toast('Приход проведён: '+lines.length+' поз.');location.hash='stock'}
function saveOut(){
 var d=draftOut;if(!d.id){O.toast('Выберите позицию');return}if(num(d.q)<=0){O.toast('Укажите количество');return}
 if(num(d.q)>qtyOf(d.id)&&!confirm('Списываете больше остатка ('+fmtQty(qtyOf(d.id))+'). Провести в минус?'))return;
 addMoves([{typ:'out',item:d.id,q:num(d.q),dlt:-num(d.q),reason:d.reason,comment:d.comment.trim()}],1);
 draftOut={id:'',q:'',reason:'wilt',comment:''};outQ='';
 O.toast('Списано: '+fmtQty(d.q)+' '+unitOf(d.id)+' · '+nameOf(d.id));location.hash='stock'}
function saveAdj(){
 var list=[];Object.keys(draftAdj.vals).forEach(function(id){var raw=draftAdj.vals[id];if(raw===''||raw==null)return;var fact=num(String(raw).replace(',','.')),cur=qtyOf(id),dlt=Math.round((fact-cur)*1000)/1000;
  if(!dlt)return;list.push({typ:'adj',item:id,q:fact,dlt:dlt,comment:'Инвентаризация: было '+fmtQty(cur)+', стало '+fmtQty(fact)})});
 if(!list.length){O.toast('Нет расхождений для записи');return}
 addMoves(list,1);draftAdj.vals={};O.toast('Записано корректировок: '+list.length);location.hash='stock'}

function go(view,id){
 if(view=='in'){if(id){var ln=draftIn.lines[0];if(!ln.id&&draftIn.lines.length==1){ln.id=id;ln.buy=lastBuyOf(id)!=null?String(lastBuyOf(id)):'';inQ[0]=''}else draftIn.lines.push({id:id,q:'',buy:lastBuyOf(id)!=null?String(lastBuyOf(id)):''})}location.hash='stock/in'}
 else if(view=='out'){if(id){draftOut.id=id;outQ=''}location.hash='stock/out'}
 else if(view=='adj'){draftAdj.pre=id||'';location.hash='stock/adj'}
}

/* ---------- события ---------- */
var V=$('#v-stock'),M=$('#st-modal');
if(V)V.addEventListener('click',function(e){
 var b=e.target.closest('[data-sper],[data-sfil],[data-go],[data-stnew],[data-sdel],[data-sundo],[data-inadd],[data-indel],[data-inclr],[data-insave],[data-outclr],[data-outsave],[data-adjsave],[data-pick],[data-logf],[data-logp]');
 if(!b)return;
 if(b.dataset.sper){per=+b.dataset.sper;LS.set('aik_ops_stock_per',per);render();return}
 if(b.dataset.sfil){fil=b.dataset.sfil;LS.set('aik_ops_stock_fil',fil);render();return}
 if(b.dataset.go){go(b.dataset.go,b.dataset.id);return}
 if(b.hasAttribute('data-stnew')){openNew();return}
 if(b.dataset.sdel){var id=b.dataset.sdel;if(qtyOf(id)&&!confirm('У расходника «'+nameOf(id)+'» остаток '+fmtQty(qtyOf(id))+'. Удалить позицию?'))return;
  var D=db();delete D.items[id];D._touched=1;save(D);O.toast('Расходник удалён');render();return}
 if(b.dataset.sundo){if(!confirm('Отменить эту запись? Остаток вернётся назад.'))return;if(undoMove(b.dataset.sundo)){O.toast('Запись отменена');render()}return}
 if(b.hasAttribute('data-inadd')){draftIn.lines.push({id:'',q:'',buy:''});render();return}
 if(b.dataset.indel!=null){draftIn.lines.splice(+b.dataset.indel,1);inQ.splice(+b.dataset.indel,1);if(!draftIn.lines.length)draftIn.lines=[{id:'',q:'',buy:''}];render();return}
 if(b.dataset.inclr!=null){var i=+b.dataset.inclr;draftIn.lines[i].id='';draftIn.lines[i].buy='';inQ[i]='';render();return}
 if(b.hasAttribute('data-insave')){saveIn();return}
 if(b.hasAttribute('data-outclr')){draftOut.id='';outQ='';render();return}
 if(b.hasAttribute('data-outsave')){saveOut();return}
 if(b.hasAttribute('data-adjsave')){saveAdj();return}
 if(b.dataset.pick){var pid=b.dataset.pick,line=b.closest('.skline');
  if(line&&line.dataset.li!=null){var j=+line.dataset.li;draftIn.lines[j].id=pid;draftIn.lines[j].buy=lastBuyOf(pid)!=null?String(lastBuyOf(pid)):'';inQ[j]='';render()}
  else{draftOut.id=pid;outQ='';render()}return}
 if(b.dataset.logf){logFil=b.dataset.logf;render();return}
 if(b.dataset.logp!=null){logPer=+b.dataset.logp;render();return}
});
if(V)V.addEventListener('input',function(e){var t=e.target;
 if(t.id=='st-q'){qList=t.value;var pos=t.selectionStart;render();var n=$('#st-q');if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(x){}}return}
 if(t.id=='st-adjq'){draftAdj.qstr=t.value;var pos=t.selectionStart;render();var n=$('#st-adjq');if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(x){}}return}
 if(t.id=='st-logq'){logQ=t.value;var pos=t.selectionStart;render();var n=$('#st-logq');if(n){n.focus();try{n.setSelectionRange(pos,pos)}catch(x){}}return}
 if(t.dataset.smin!=null){var D=db(),id=t.dataset.smin;D.items[id]=D.items[id]||{qty:0,min:0};D.items[id].min=num(t.value);D._touched=1;save(D);return}
 if(t.dataset.in){draftIn[t.dataset.in]=t.value;return}
 if(t.dataset.inq!=null){inQ[+t.dataset.inq]=t.value;var box=t.parentNode.querySelector('.skpick');if(box)box.innerHTML=t.value?pickList(t.value,draftIn.lines[+t.dataset.inq].id):'';return}
 if(t.dataset.inqty!=null){draftIn.lines[+t.dataset.inqty].q=t.value;return}
 if(t.dataset.inbuy!=null){draftIn.lines[+t.dataset.inbuy].buy=t.value;return}
 if(t.id=='st-outq'){outQ=t.value;fillOutPick();return}
 if(t.dataset.out){draftOut[t.dataset.out]=t.value;return}
 if(t.dataset.adj!=null){draftAdj.vals[t.dataset.adj]=t.value;return}
});
if(V)V.addEventListener('change',function(e){var t=e.target;if(t.dataset.out)draftOut[t.dataset.out]=t.value;if(t.dataset.in)draftIn[t.dataset.in]=t.value});
if(M){M.addEventListener('click',function(e){if(e.target==M||e.target.closest('[data-close]'))closeNew()});
 M.addEventListener('submit',function(e){e.preventDefault();var f=e.target,n=(f.n.value||'').trim();if(!n){O.toast('Укажите название');return}
  var id=O.uid('c:'),D=db();D.items[id]={n:n,u:f.u.value,min:num(f.min.value),qty:0,kind:'cons'};
  var q=f.qty.value===''?0:num(f.qty.value),buy=f.buy.value===''?null:num(f.buy.value);
  if(buy!=null)D.items[id].lastBuy=buy;D._touched=1;save(D);
  if(q)addMoves([{typ:'adj',item:id,q:q,dlt:q,buy:buy,comment:'Начальный остаток расходника'}],1);
  closeNew();O.toast('Расходник «'+n+'» добавлен');if(subOf()=='list')render()}) }

window.OPS_STOCK={render:render,onStatus:onStatus,hint:hint,lastBuyHtml:lastBuyHtml,qtyOf:qtyOf,lastBuyOf:lastBuyOf};
if($('#v-stock')&&!$('#v-stock').hidden)render();
})();
