/* AI KVETKA · операционка (черновик). Без сборки. Хранение: localStorage.
   aik_ops_orders — заказы (ДЕМО), aik_ops_kat — правки каталога поверх window.AIK_KAT из ../js/kat.js. */
(function(){
var $=function(s,r){return (r||document).querySelector(s)},esc=function(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})};
var KAT=window.AIK_KAT||[],BASE=window.AIK_KAT_BASE||'../',money=window.AIK_MONEY||function(x){return String(x)};
var ST=[['new','Новый'],['work','В работе'],['ready','Собран'],['ship','Доставка'],['done','Выдан'],['cancel','Отменён']];
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
 ['n','d','cm','c'].forEach(function(k){if(e[k]!=null)o[k]=e[k]});if(e.ph)o.ph=e.ph;o._ed=!!edits()[id];o.price=basePrice(p);return o}

/* ---------- Заказы (ДЕМО) ---------- */
function day(o,h,m){var d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()+o);d.setHours(h,m||0);return d.getTime()}
function demo(){var n=Date.now(),H=3600e3;return[
 {id:'1048',st:'new',at:n-.4*H,name:'Алина Ковалёва',phone:'+375 29 611-24-08',tg:'alina_kv',mode:'dlv',addr:'Минск, ул. Сурганова 47, кв. 12',when:day(0,15),slot:'15:00–17:00',items:[{id:'peony',s:'M',q:15}],dlv:12,card:'С днём рождения, мама! Люблю тебя.',note:'Позвонить получателю за 30 минут'},
 {id:'1047',st:'work',at:n-2*H,name:'Дмитрий Лис',phone:'+375 33 302-77-15',tg:'d_lis',mode:'self',addr:'Самовывоз из студии',when:day(0,13,30),slot:'13:30',items:[{id:'shampan',s:'L',q:1},{id:'macarons',s:'S',q:1}],dlv:0,card:'',note:''},
 {id:'1046',st:'ready',at:n-5*H,name:'Ольга Мирончик',phone:'+375 44 785-90-31',tg:'',mode:'dlv',addr:'Минск, пр. Независимости 95, офис 410',when:day(0,12),slot:'12:00–14:00',items:[{id:'box',s:'M',q:1}],dlv:12,card:'Спасибо за проект!',note:'Ресепшен, 4 этаж'},
 {id:'1045',st:'ship',at:n-7*H,name:'Сергей Ткач',phone:'+375 29 144-03-62',tg:'stkach',mode:'dlv',addr:'Минск, ул. Притыцкого 29, кв. 88',when:day(0,11),slot:'11:00–13:00',items:[{id:'roses101',s:'M',q:101}],dlv:15,card:'Выходи за меня',note:'Сюрприз — не звонить заранее'},
 {id:'1044',st:'new',at:n-.1*H,name:'Мария Жук',phone:'+375 25 909-11-47',tg:'mariazhuk',mode:'self',addr:'Самовывоз из студии',when:day(1,10),slot:'10:00',items:[{id:'tulips',s:'S',q:25},{id:'vase',s:'M',q:1}],dlv:0,card:'',note:'Оплата при получении'},
 {id:'1043',st:'work',at:n-20*H,name:'Екатерина Бондарь',phone:'+375 29 250-66-80',tg:'kate_b',mode:'dlv',addr:'Минск, ул. Кальварийская 21',when:day(1,9),slot:'09:00–11:00',items:[{id:'bride',s:'M',q:1}],dlv:0,card:'',note:'Свадьба, бутоньерка в тон — уточнить'},
 {id:'1042',st:'done',at:n-26*H,name:'Иван Петрович',phone:'+375 33 671-45-19',tg:'',mode:'self',addr:'Самовывоз из студии',when:day(-1,18),slot:'18:00',items:[{id:'pumpkin',s:'M',q:1}],dlv:0,card:'',note:''},
 {id:'1041',st:'cancel',at:n-30*H,name:'Наталья Скорик',phone:'+375 44 512-38-02',tg:'n_skorik',mode:'dlv',addr:'Минск, ул. Немига 3',when:day(-1,16),slot:'16:00–18:00',items:[{id:'blush',s:'S',q:25}],dlv:12,card:'',note:'Клиент перенёс на другую дату'},
 {id:'1040',st:'done',at:n-48*H,name:'Анна Гордей',phone:'+375 29 380-14-55',tg:'annagordey',mode:'dlv',addr:'Минск, ул. Ленина 8',when:day(-2,14),slot:'14:00–16:00',items:[{id:'haworthia',s:'M',q:1},{id:'macarons',s:'M',q:1}],dlv:12,card:'',note:''}
].map(function(o){o.hist=[{st:'new',t:o.at}];if(o.st!='new')o.hist.push({st:o.st,t:Math.min(Date.now(),o.at+H)});return o})}
var orders=LS.get('aik_ops_orders',null);if(!orders){orders=demo();LS.set('aik_ops_orders',orders)}
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
  return '<div class="row'+(sel==o.id?' on':'')+'" data-id="'+o.id+'"><div class="when">'+esc(o.slot.split('–')[0])+'<small>'+fmtD(o.when)+'</small></div><div><div class="who">№'+o.id+' · '+esc(o.name)+'</div><div class="what">'+(o.mode=='dlv'?'Доставка':'Самовывоз')+' · '+esc(w)+'</div></div><div class="right">'+stb(o.st)+'<div class="sum">'+money(total(o))+' BYN</div></div></div>'}).join(''):'<div class="card"><div class="empty">Нет заказов в этом статусе</div></div>'}
function renderCard(){var o=orders.filter(function(x){return x.id==sel})[0],c=$('#o-card');document.body.classList.toggle('card-open',!!o);
 if(!o){c.innerHTML='<div class="empty">Выберите заказ слева</div>';return}
 var tel=o.phone.replace(/[^\d+]/g,'');
 c.innerHTML='<button class="btn ghost sm back" data-back>← К списку</button><h2>Заказ №'+o.id+'</h2><div class="meta">Оформлен '+fmtT(o.at)+' · '+stb(o.st)+'</div>'+
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
function renderKat(){var q=($('#k-q').value||'').toLowerCase();
 $('#k-grid').innerHTML=KAT.map(function(x){return prod(x.id)}).filter(function(p){return !q||(p.n+' '+p.c).toLowerCase().indexOf(q)>=0}).map(function(p){
  return '<div class="prod"><div class="ph" style="background-image:url(\''+esc(img(p.ph[0]))+'\')"><span class="tag">'+esc(p.c)+'</span>'+(p._ed?'<span class="ed">ИЗМЕНЁН</span>':'')+'</div><div class="bd"><h3>'+esc(p.n)+'</h3><div class="pr">'+(p.st?'от '+money(p.st.S)+' BYN/шт.':money(p.price)+' BYN')+'</div><p>'+esc(p.d)+'</p><div class="act"><button class="btn ghost sm" data-ed="'+p.id+'">Редактировать</button></div></div></div>'}).join('')}
var cur=null,curPh=null,curI=0;
function openEd(id){var p=prod(id);cur=id;curPh=p.ph.slice();curI=0;var m=$('#k-modal');m.hidden=false;
 $('#k-form').innerHTML='<form class="f"><h2>'+esc(p.n)+'</h2><div><div class="main" id="f-main"></div><div class="thumbs" id="f-th"></div>'+
 '<label class="up">＋ Загрузить фото (станет главным)<input type="file" accept="image/*" id="f-file"></label><div class="hint">Фото сжимается до 1400 px. Перетаскивать порядок пока нельзя: клик по миниатюре — сделать главной.</div></div>'+
 '<div><label>Название</label><input name="n" value="'+esc(p.n)+'"><label>'+(p.st?'Базовая цена, BYN (поштучные цены st — в kat.js)':'Цена, BYN')+'</label><input name="p" type="number" min="0" step="1" value="'+p.price+'">'+
 '<label>Состав (коротко)</label><input name="cm" value="'+esc(p.cm)+'"><label>Описание</label><textarea name="d">'+esc(p.d)+'</textarea></div>'+
 '<div class="acts"><button type="button" class="btn ghost" data-close>Отмена</button><button class="btn">Сохранить</button></div></form>';drawPh()}
function drawPh(){$('#f-main').style.backgroundImage='url("'+img(curPh[0])+'")';$('#f-th').innerHTML=curPh.map(function(u,i){return '<div class="'+(i==0?'on':'')+'" data-i="'+i+'" style="background-image:url(\''+esc(img(u))+'\')"></div>'}).join('')}
function shrink(file,cb){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){var s=Math.min(1,1400/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);c.getContext('2d').drawImage(im,0,0,c.width,c.height);cb(c.toDataURL('image/jpeg',.85))};im.src=r.result};r.readAsDataURL(file)}
$('#k-grid').onclick=function(e){var b=e.target.closest('[data-ed]');if(b)openEd(b.dataset.ed)};
$('#k-q').oninput=renderKat;
$('#k-modal').onclick=function(e){if(e.target==this||e.target.closest('[data-close]')){this.hidden=true;return}var t=e.target.closest('[data-i]');if(t){var i=+t.dataset.i;curPh.unshift(curPh.splice(i,1)[0]);drawPh()}};
$('#k-modal').onchange=function(e){if(e.target.id=='f-file'&&e.target.files[0])shrink(e.target.files[0],function(u){curPh.unshift(u);drawPh();toast('Фото добавлено — не забудьте «Сохранить»')})};
$('#k-modal').onsubmit=function(e){e.preventDefault();var f=e.target,E=edits(),o=KAT.filter(function(x){return x.id==cur})[0];
 E[cur]={n:f.n.value.trim()||o.n,p:f.p.value,cm:f.cm.value.trim(),d:f.d.value.trim()};if(curPh.join('|')!=o.ph.join('|'))E[cur].ph=curPh;
 if(LS.set('aik_ops_kat',E)){$('#k-modal').hidden=true;renderKat();toast('Сохранено в этом браузере')}};
$('#k-reset').onclick=function(){if(confirm('Сбросить все правки каталога в этом браузере?')){localStorage.removeItem('aik_ops_kat');renderKat();toast('Правки сброшены')}};
// Экспорт: подменяем только массив window.AIK_KAT в исходном kat.js, комментарии и функции-помощники сохраняются.
// Загруженные фото выносятся в img/ops/<id>-N.jpg и скачиваются отдельными файлами (их нужно положить в img/ops/).
function dl(name,blob){var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},500)}
function lit(v){return JSON.stringify(v)}
function itemSrc(x){var e=edits()[x.id],o={},files=[];for(var k in x)o[k]=x[k];
 if(e){['n','cm','d'].forEach(function(k){if(e[k])o[k]=e[k]});if(e.p!=null&&e.p!=='')o.p=+e.p;
  if(e.ph)o.ph=e.ph.map(function(u,i){if(/^data:/.test(u)){var nm='img/ops/'+x.id+'-'+(i+1)+'.jpg';files.push([nm,u]);return nm}return u})}
 var s='{'+Object.keys(o).map(function(k){return k+':'+lit(o[k])}).join(',')+'}';return{s:s,files:files}}
$('#k-export').onclick=function(){var files=[],arr='window.AIK_KAT=[\n'+KAT.map(function(x){var r=itemSrc(x);files=files.concat(r.files);return r.s}).join(',\n')+'\n];';
 function out(src){var txt;if(src&&src.indexOf('window.AIK_KAT=[')>=0){var a=src.indexOf('window.AIK_KAT=['),b=src.indexOf('\n];',a);txt=src.slice(0,a)+arr+src.slice(b+3)}
  else txt='/* Каталог AI KVETKA (экспорт из ops). p — базовая цена BYN из операционки. */\n'+arr+'\nwindow.AIK_KAT_BASE=(function(){var s=document.currentScript;return s?s.getAttribute(\'src\').replace(/js\\/kat\\.js.*$/,\'\'):\'\'})();\n'+
   ['AIK_FIND','AIK_SZ','AIK_COMP','AIK_MONEY'].filter(function(k){return window[k]}).map(function(k){return 'window.'+k+'='+window[k].toString()+';'}).join('\n')+'\n';
  dl('kat.js',new Blob([txt],{type:'text/javascript'}));files.forEach(function(f,i){setTimeout(function(){fetch(f[1]).then(function(r){return r.blob()}).then(function(b){dl(f[0].split('/').pop(),b)})},400*(i+1))});
  toast('kat.js скачан'+(files.length?' + фото: '+files.length+' (в img/ops/)':''))}
 fetch(BASE+'js/kat.js',{cache:'no-store'}).then(function(r){return r.ok?r.text():null}).then(out,function(){out(null)})};

/* ---------- Роутинг ---------- */
function route(){var h=location.hash.replace('#','')||'orders',t=h.indexOf('catalog')==0?'catalog':'orders';
 document.querySelectorAll('.tabs a').forEach(function(a){a.classList.toggle('on',a.dataset.t==t)});$('#v-orders').hidden=t!='orders';$('#v-catalog').hidden=t!='catalog';
 sel=h.indexOf('order/')==0?h.slice(6):null;if(t=='orders')renderOrders();else{document.body.classList.remove('card-open');renderKat()}}
window.addEventListener('hashchange',route);
fetch(BASE+'catalog.html').then(function(r){return r.ok?r.text():''}).then(function(t){var re=/data-id="([^"]+)"[^>]*?data-p="(\d+(?:\.\d+)?)"/g,m;while((m=re.exec(t)))PSITE[m[1]]=+m[2];route()},route);
route();
})();
