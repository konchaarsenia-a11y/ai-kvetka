/* AI KVETKA · ops · раздел «Главная»: цветок недели и категории.
   Хранение: localStorage aik_ops_home. Экспорт: js/home.js (window.AIK_HOME) — его читает ops/site-patch/home-apply.js.
   Значения по умолчанию берутся из текущего ../index.html (блоки #cats .cgr и #wk). */
(function(){
var O=window.OPS;if(!O)return;var $=O.$,esc=O.esc,LS=O.LS,K='aik_ops_home',KAT=O.KAT;
var DEF={wk:{id:'rose-mondial',mode:'draw',lbl:'Только на этой неделе',lat:'Rosa Mondial',h:'Роза белая Mondial',t:'Крупный цветок чистого белого цвета — классика для букетов и торжеств.',p:9,q:'за 1 шт.',img:'',btn:'https://ig.me/m/ai_kvetka',care:'Уход за букетом',careHref:'returns.html#care'},
 cats:[['bouquets','Букеты','Авторские и сезонные','img/opt/g37-800.webp'],['roses','Розы','Моно и микс сортов','img/opt/g23-800.webp'],['plants','Растения','Комнатные в горшках','img/opt/n1-800.webp'],['vases','Вазы','Керамика и стекло','img/opt/g22-800.webp'],['sweets','Сладости','Цветы и десерты в коробке','img/opt/ig-sweets1-800.webp'],['wedding','Свадьба','Букет невесты и декор','img/opt/bridal-800.webp'],['pumpkins','Тыквы','Осенние композиции','img/opt/ig-reel2-800.webp']].map(function(a){return{s:a[0],n:a[1],sub:a[2],img:a[3],on:true}})};
function byCat(n){return KAT.filter(function(p){return p.c==n}).map(function(p){return p.id})}
function fixIds(d){d.cats.forEach(function(c){if(!c.ids)c.ids=byCat(c.n)});return d}
function clone(x){return JSON.parse(JSON.stringify(x))}
function tx(r,s){var e=r&&r.querySelector(s);return e?e.textContent.trim():''}
function at(r,s,a){var e=r&&r.querySelector(s);return e?e.getAttribute(a)||'':''}
function parseSite(t){try{var d=new DOMParser().parseFromString(t,'text/html'),cs=[].map.call(d.querySelectorAll('.cgr a.cc:not(.all)'),function(a){return{s:(a.getAttribute('href').split('#')[1]||''),n:tx(a,'b'),sub:tx(a,'small'),img:at(a,'img','src'),on:true}}),w=d.getElementById('wk');
 if(cs.length)DEF.cats=cs;if(w){var k=DEF.wk;k.lbl=tx(w,'.lbl')||k.lbl;k.lat=tx(w,'.lat')||k.lat;k.h=tx(w,'h3')||k.h;k.t=tx(w,'.wkd p')||k.t;k.p=+tx(w,'.kp b').replace(/[^\d.]/g,'')||k.p;k.q=tx(w,'.kp span')||k.q;k.btn=at(w,'.wbk','href')||k.btn;k.care=tx(w,'.cr')||k.care;k.careHref=at(w,'.cr','href')||k.careHref}}catch(e){}}
function get(){return fixIds(LS.get(K,null)||clone(DEF))}
var S=null;function st(){return S||(S=get())}
function save(){LS.set(K,S)}
var TR='a b v g d e zh z i y k l m n o p r s t u f h c ch sh sch  y  e yu ya'.split(' ');
function slug(n){return String(n).toLowerCase().replace(/[а-яё]/g,function(c){var i=c=='ё'?5:c.charCodeAt(0)-1072;return TR[i]||''}).replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'cat'}
function P(id){return O.prod(id)}
function th(u){return u?'style="background-image:url(\''+esc(O.img(u))+'\')"':''}
function pr(p){if(!p)return '';if(p.st&&typeof p.st=='object'){var vals=Object.keys(p.st).map(function(k){return +p.st[k]}).filter(function(n){return isFinite(n)});return vals.length?'от '+Math.min.apply(null,vals)+' BYN/шт.':O.basePrice(p)+' BYN'}return O.basePrice(p)+' BYN'}
function match(p,q){q=q.trim().toLowerCase();return !q||(p.n+' '+(p.cm||'')+' '+(p.c||'')).toLowerCase().indexOf(q)>=0}
var wq='',bq='';

/* ---------- отрисовка ---------- */
function render(){var s=st(),v=$('#h-body');
 v.innerHTML='<div class="panel hwk"><div class="ptl"><h3>Цветок недели</h3><span>блок «'+esc(s.wk.lbl)+'» на главной</span></div><div class="hwg">'
 +'<div class="hpick"><input type="search" id="h-wq" placeholder="Найти товар по названию или составу" value="'+esc(wq)+'"><div class="hres" id="h-wres"></div></div>'
 +'<div class="hform" id="h-wf"></div></div></div>'
 +'<div class="panel"><div class="ptl"><h3>Категории на главной</h3><span>Перетащите за ⋮⋮, чтобы поменять порядок. Переключатель — показывать на главной. На телефоне сайт показывает только первые 4 включённые.</span></div>'
 +'<div class="pvbar"><span class="lbl2">Превью блока «Категории» на сайте</span><div class="seg">'+segB('pv','pc','💻 Вид с ПК',pv)+segB('pv','ph','📱 Вид с телефона',pv)+'</div></div><div id="h-cpv"></div>'
 +'<ol class="hcl" id="h-cl">'+s.cats.map(function(c,i){return '<li data-c="'+i+'" class="'+(c.on?'':'off')+'"><span class="hdg" aria-label="Перетащить">⋮⋮</span><i '+th(c.img)+'></i><div class="hcn"><b>'+esc(c.n)+'</b><small>'+esc(c.sub)+' · '+c.ids.length+' тов. · #'+esc(c.s)+'</small><span class="dvs" data-dv="'+i+'"></span></div>'
  +'<label class="sw" title="Показывать на главной"><input type="checkbox" data-on="'+i+'"'+(c.on?' checked':'')+'><span></span></label><button class="btn ghost sm" data-ce="'+i+'">Изменить</button></li>'}).join('')+'</ol>'
 +'<button class="btn" data-cnew>+ Новая категория</button></div>'
 +'<div class="panel"><div class="ptl"><h3>Товары и категории</h3><span>Нажмите на категорию, чтобы добавить товар в неё или убрать. Товар может быть в нескольких.</span></div><input type="search" id="h-bq" placeholder="Поиск товара" value="'+esc(bq)+'"><div class="hbl" id="h-bl"></div></div>';
 wkRes();wkForm();bindList();live()}
var pv='pc',wpv='pc';
function segB(k,v,l,cur){return '<button data-'+k+'="'+v+'" class="'+(cur==v?'on':'')+'">'+l+'</button>'}
function order(){var s=st(),li=document.querySelectorAll('#h-cl li');return li.length==s.cats.length?[].map.call(li,function(x){return s.cats[+x.dataset.c]}):s.cats}
function live(){var o=order(),n=0;o.forEach(function(c){var i=st().cats.indexOf(c),ph=c.on&&n<4;if(c.on)n++;var d=document.querySelector('[data-dv="'+i+'"]');if(d)d.innerHTML='<span class="dv'+(c.on?' on':'')+'" title="'+(c.on?'Видна на ПК':'Скрыта на ПК')+'">💻 ПК</span><span class="dv'+(ph?' on':'')+'" title="'+(ph?'Видна на телефоне':c.on?'На телефоне видны только первые 4 включённые — перетащите выше':'Скрыта')+'">📱 Телефон</span>'});catPrev(o)}
function tile(c){return '<div class="stl"><i '+th(c.img)+'></i><b>'+esc(c.n)+'<em>→</em></b><small>'+esc(c.sub)+'</small></div>'}
function catPrev(o){var v=o.filter(function(c){return c.on}),h='<div class="ssh"><small>Ассортимент</small><h5>Категории</h5></div>',el=$('#h-cpv');if(!el)return;
 if(pv=='pc')el.innerHTML='<div class="spv spc"><div class="sbar"><i></i><i></i><i></i><span>ai-kvetka · главная</span></div><div class="sct">'+h+'<div class="sgr">'+v.map(tile).join('')+'<div class="stl all"><i><span>Весь каталог</span><em>Смотреть</em></i></div></div></div></div>';
 else{var hid=v.slice(4).map(function(c){return c.n});el.innerHTML='<div class="sph"><div class="spv sphn"><div class="snt"></div><div class="sct">'+h+'<div class="sgr">'+v.slice(0,4).map(tile).join('')+'</div><span class="spill">Весь каталог</span></div></div><p class="mut">'+(hid.length?'На телефоне не видны: '+esc(hid.join(', '))+'. Перетащите выше, чтобы попали в первые 4.':'На телефоне видны все включённые категории.')+'</p></div>'}}
function wkRes(){var s=st();$('#h-wres').innerHTML=KAT.map(function(x){return P(x.id)}).filter(function(p){return match(p,wq)}).map(function(p){return '<button class="hpr'+(p.id==s.wk.id?' on':'')+'" data-wk="'+p.id+'"><i '+th((p.ph||[])[0])+'></i><span><b>'+esc(p.n)+'</b><small>'+esc(p.cm||p.c||'')+'</small></span><em>'+pr(p)+'</em></button>'}).join('')||'<p class="mut">Ничего не нашлось</p>'}
function wkForm(){var k=st().wk,p=P(k.id),phs=((p&&p.ph)||[]).slice();if(k.img&&phs.indexOf(k.img)<0)phs.push(k.img);
 function f(n,l,a){return '<label><span>'+l+'</span><input data-w="'+n+'" value="'+esc(k[n])+'"'+(a||'')+'></label>'}
 $('#h-wf').innerHTML='<div class="pvbar"><span class="lbl2">Превью на сайте</span><div class="seg">'+segB('wpv','pc','💻 Вид с ПК',wpv)+segB('wpv','ph','📱 Вид с телефона',wpv)+'</div></div><div id="h-wp"></div>'
 +'<div class="seg"><button data-wm="draw" class="'+(k.mode=='draw'?'on':'')+'">Рисунок пиона (как сейчас)</button><button data-wm="photo" class="'+(k.mode=='photo'?'on':'')+'">Фото</button></div>'
 +(k.mode=='photo'?'<div class="hphs">'+phs.map(function(u){return '<button data-wph="'+esc(u)+'" class="'+(u==k.img?'on':'')+'" '+th(u)+'></button>'}).join('')+'<label class="hup">+ Фото<input type="file" accept="image/*" id="h-wup" hidden></label></div>':'<p class="nohint">Рисунок — анимированный пион «Сара Бернар». Для другого цветка выберите «Фото».</p>')
 +'<div class="hfs">'+f('lbl','Метка')+f('lat','Латинское название')+f('h','Заголовок')+'<label class="w2"><span>Описание</span><textarea data-w="t" rows="3">'+esc(k.t)+'</textarea></label>'+f('p','Цена, BYN',' inputmode="decimal"')+f('q','Подпись к цене')+f('care','Ссылка про уход')+f('btn','Кнопка «Забронировать» → адрес')+'</div>'
 +'<button class="btn ghost" data-wfill>Взять название, текст и цену из товара</button>';wkPrev()}
function wkPrev(){var k=st().wk,pic='<div class="swp'+(k.mode=='draw'?' drw':'')+'" '+(k.mode=='photo'?th(k.img):th('img/wk/peony-head.webp'))+'>'+(k.mode=='draw'?'<span>анимированный рисунок</span>':k.img?'':'<span>выберите фото</span>')+'</div>',
 a='<div class="sw1"><small>'+esc(k.lbl)+'</small><h5>Цветок недели</h5><em>'+esc(k.lat)+'</em></div>',b='<div class="sw3"><b>'+esc(k.h)+'</b><p>'+esc(k.t)+'</p><div class="spr"><strong>'+esc(k.p)+' BYN</strong> <span>'+esc(k.q)+'</span><span class="sbk">Забронировать</span></div>'+(k.care?'<u>'+esc(k.care)+'</u>':'')+'</div>';
 $('#h-wp').innerHTML=wpv=='pc'?'<div class="spv spc"><div class="sbar"><i></i><i></i><i></i><span>ai-kvetka · главная</span></div><div class="sct"><div class="swk">'+a+pic+b+'</div></div></div>':'<div class="sph"><div class="spv sphn"><div class="snt"></div><div class="sct"><div class="swk m">'+a+pic+b+'</div></div></div></div>'}
function bindList(){var s=st();$('#h-bl').innerHTML=KAT.map(function(x){return P(x.id)}).filter(function(p){return match(p,bq)}).map(function(p){return '<div class="hb"><i '+th((p.ph||[])[0])+'></i><b>'+esc(p.n)+'</b><div class="hch">'+s.cats.map(function(c,i){return '<button class="chip'+(c.ids.indexOf(p.id)>=0?' on':'')+'" data-bind="'+p.id+'|'+i+'">'+esc(c.n)+'</button>'}).join('')+'</div></div>'}).join('')}

/* ---------- окно категории ---------- */
var D=null,DI=-1,mq='';
function openC(i){DI=i;D=i<0?{s:'',n:'',sub:'',img:'',on:true,ids:[]}:clone(st().cats[i]);mq='';$('#h-modal').hidden=false;drawC()}
function drawC(){var phs=[];D.ids.forEach(function(id){var p=P(id);if(p&&p.ph&&p.ph[0])phs.push(p.ph[0])});if(D.img&&phs.indexOf(D.img)<0)phs.unshift(D.img);
 $('#h-form').innerHTML='<div class="f"><h2>'+(DI<0?'Новая категория':'Категория «'+esc(D.n)+'»')+'</h2>'
 +'<label><span>Название</span><input data-d="n" value="'+esc(D.n)+'" placeholder="Например, Пионы"></label>'
 +'<label><span>Подпись под названием</span><input data-d="sub" value="'+esc(D.sub)+'" placeholder="Коротко, 2–4 слова"></label>'
 +'<label><span>Якорь в каталоге (catalog.html#…)</span><input data-d="s" value="'+esc(D.s)+'" placeholder="'+esc(slug(D.n||'kategoriya'))+'"></label>'
 +'<div><span class="lbl2">Фото плитки</span><div class="hphs">'+phs.map(function(u){return '<button data-dph="'+esc(u)+'" class="'+(u==D.img?'on':'')+'" '+th(u)+'></button>'}).join('')+'<label class="hup">+ Фото<input type="file" accept="image/*" id="h-dup" hidden></label></div>'+(phs.length?'':'<p class="nohint">Отметьте товары ниже — их фото появятся здесь, или загрузите своё.</p>')+'</div>'
 +'<div><span class="lbl2">Товары в категории · <b id="h-dn">'+D.ids.length+'</b></span><input type="search" id="h-mq" placeholder="Поиск товара"><div class="hml" id="h-ml"></div></div>'
 +'<div class="acts">'+(DI>=0?'<button class="btn ghost danger" data-ddel>Удалить</button>':'')+'<button class="btn ghost" data-close>Отмена</button><button class="btn" data-dsave>Сохранить</button></div></div>';drawML()}
function drawML(){$('#h-ml').innerHTML=KAT.map(function(x){return P(x.id)}).filter(function(p){return match(p,mq)}).map(function(p){var on=D.ids.indexOf(p.id)>=0;return '<label class="hmi'+(on?' on':'')+'"><input type="checkbox" data-dp="'+p.id+'"'+(on?' checked':'')+'><i '+th((p.ph||[])[0])+'></i><span><b>'+esc(p.n)+'</b><small>'+esc(p.c||'')+' · '+pr(p)+'</small></span></label>'}).join('')}
function closeC(){$('#h-modal').hidden=true;D=null}

/* ---------- события ---------- */
var V=$('#v-home'),M=$('#h-modal');
V.addEventListener('input',function(e){var t=e.target,k=st().wk;
 if(t.id=='h-wq'){wq=t.value;wkRes()}else if(t.id=='h-bq'){bq=t.value;bindList()}
 else if(t.dataset.w){k[t.dataset.w]=t.dataset.w=='p'?(t.value.replace(',','.')===''?'':+t.value.replace(',','.')||t.value):t.value;save();wkPrev()}});
V.addEventListener('change',function(e){var t=e.target,s=st();
 if(t.dataset.on!=null){s.cats[+t.dataset.on].on=t.checked;save();render();O.toast(t.checked?'Показывается на главной':'Скрыта с главной')}
 else if(t.id=='h-wup'&&t.files[0])O.shrink(t.files[0],function(u){s.wk.img=u;s.wk.mode='photo';save();wkForm()})});
V.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var s=st(),k=s.wk;
 if(b.dataset.wk){var p=P(b.dataset.wk);k.id=p.id;if(p.id!='peony'||k.mode=='photo'){k.mode='photo';if(!k.img||!/^data:/.test(k.img))k.img=(p.ph||[])[0]||''}fill(p);save();wkRes();wkForm();O.toast('Цветок недели: '+p.n)}
 else if(b.dataset.wm){k.mode=b.dataset.wm;if(k.mode=='photo'&&!k.img){var q=P(k.id);k.img=q&&q.ph?q.ph[0]:''}save();wkForm()}
 else if(b.dataset.wph){k.img=b.dataset.wph;save();wkForm()}
 else if(b.hasAttribute('data-wfill')){fill(P(k.id));save();wkForm()}
 else if(b.dataset.pv){pv=b.dataset.pv;b.parentNode.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x==b)});catPrev(order())}
 else if(b.dataset.wpv){wpv=b.dataset.wpv;b.parentNode.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x==b)});wkPrev()}
 else if(b.dataset.ce)openC(+b.dataset.ce);else if(b.hasAttribute('data-cnew'))openC(-1);
 else if(b.dataset.bind){var a=b.dataset.bind.split('|'),c=s.cats[+a[1]],j=c.ids.indexOf(a[0]);j<0?c.ids.push(a[0]):c.ids.splice(j,1);save();b.classList.toggle('on',j<0);
  var sm=document.querySelector('#h-cl li[data-c="'+a[1]+'"] small');if(sm)sm.textContent=c.sub+' · '+c.ids.length+' тов. · #'+c.s}});
function fill(p){if(!p)return;var k=st().wk;k.h=p.n;k.t=p.d||p.cm||'';if(typeof p.st=='number'){k.p=+p.st;k.q='за шт.'}else if(p.st&&typeof p.st=='object'){var vals=Object.keys(p.st).map(function(x){return +p.st[x]}).filter(function(n){return isFinite(n)});k.p=vals.length?Math.min.apply(null,vals):O.basePrice(p);k.q='за шт.'}else{k.p=O.basePrice(p);k.q=''}}
M.addEventListener('input',function(e){var t=e.target;if(!D)return;if(t.id=='h-mq'){mq=t.value;drawML()}else if(t.dataset.d)D[t.dataset.d]=t.value});
M.addEventListener('change',function(e){var t=e.target;if(!D)return;
 if(t.dataset.dp){var j=D.ids.indexOf(t.dataset.dp);t.checked?j<0&&D.ids.push(t.dataset.dp):j>=0&&D.ids.splice(j,1);t.closest('label').classList.toggle('on',t.checked);$('#h-dn').textContent=D.ids.length;
  if(!D.img){var p=P(t.dataset.dp);if(p&&p.ph)D.img=p.ph[0]}var y=$('#h-ml').scrollTop;var keep={n:D.n,sub:D.sub,s:D.s};drawC();$('#h-ml').scrollTop=y}
 else if(t.id=='h-dup'&&t.files[0])O.shrink(t.files[0],function(u){D.img=u;drawC()})});
M.addEventListener('click',function(e){var b=e.target.closest('button');if(e.target==M||(b&&b.hasAttribute('data-close'))){closeC();return}if(!b||!D)return;var s=st();
 if(b.dataset.dph){D.img=b.dataset.dph;drawC()}
 else if(b.hasAttribute('data-dsave')){D.n=D.n.trim();if(!D.n){O.toast('Введите название');return}D.s=slug(D.s||D.n);
  var dup=s.cats.some(function(c,i){return i!=DI&&c.s==D.s});if(dup)D.s+='-'+(s.cats.length+1);
  if(!D.img){O.toast('Выберите фото плитки');return}DI<0?s.cats.push(D):s.cats[DI]=D;save();closeC();render();O.toast('Категория сохранена')}
 else if(b.hasAttribute('data-ddel')){if(!confirm('Удалить категорию «'+D.n+'»? Товары останутся в каталоге.'))return;s.cats.splice(DI,1);save();closeC();render();O.toast('Категория удалена')}});

/* перетаскивание категорий */
(function(){var dr=null;
 document.addEventListener('pointerdown',function(e){var h=e.target.closest('#h-cl .hdg');if(!h)return;e.preventDefault();dr=h.closest('li');dr.classList.add('drag');h.setPointerCapture(e.pointerId)});
 document.addEventListener('pointermove',function(e){if(!dr)return;var el=document.elementFromPoint(e.clientX,e.clientY),li=el&&el.closest('#h-cl li');if(!li||li==dr)return;var r=li.getBoundingClientRect();li.parentNode.insertBefore(dr,e.clientY<r.top+r.height/2?li:li.nextSibling);live()});
 function up(){if(!dr)return;dr.classList.remove('drag');var s=st(),o=[].map.call(document.querySelectorAll('#h-cl li'),function(li){return s.cats[+li.dataset.c]});dr=null;s.cats=o;save();render()}
 document.addEventListener('pointerup',up);document.addEventListener('pointercancel',up)})();

/* ---------- экспорт ---------- */
function out(files){var s=st();function f(u,nm){if(/^data:/.test(u)){files.push([nm,u]);return nm}return u}
 var w=clone(s.wk);w.img=f(w.img||'','img/ops/home-wk.jpg');
 return{wk:w,cats:s.cats.map(function(c){return{s:c.s,n:c.n,sub:c.sub,img:f(c.img,'img/ops/cat-'+c.s+'.jpg'),on:!!c.on,ids:c.ids.slice()}})}}
function dlFiles(files){files.forEach(function(x,i){setTimeout(function(){fetch(x[1]).then(function(r){return r.blob()}).then(function(b){O.dl(x[0].split('/').pop(),b)})},400*(i+1))})}
$('#h-export').onclick=function(){var files=[],o=out(files);
 O.dl('home.js',new Blob(['/* Главная AI KVETKA: цветок недели и категории. Сгенерировано в ops/ → «Главная». Положить в js/home.js.\n   wk: mode draw = анимированный пион, photo = фото img. cats: порядок как на главной, on = показывать, ids = товары из kat.js, s = якорь catalog.html#s. */\nwindow.AIK_HOME='+JSON.stringify(o,null,1)+';\n'],{type:'text/javascript'}));
 dlFiles(files);O.toast('home.js скачан'+(files.length?' + фото: '+files.length+' (в img/ops/)':''))};
$('#h-html').onclick=function(){var files=[],o=out(files),e=esc;
 var cg=o.cats.filter(function(c){return c.on}).map(function(c){return '<a class="cc" href="catalog.html#'+e(c.s)+'"><i><img src="'+e(c.img)+'" alt="" loading="lazy" decoding="async"></i><b>'+e(c.n)+'</b><small>'+e(c.sub)+'</small></a>'}).join('')+'<a class="cc all" href="catalog.html"><i><span>Весь каталог</span><em>Смотреть</em></i><b>Каталог</b><small>Все позиции и цены</small></a>',k=o.wk;
 var t='<!-- Вставка для index.html без скриптов. 1) Содержимое <div class="cgr" data-rvg> заменить на: -->\n'+cg+'\n\n<!-- 2) В блоке #wk: -->\n<span class="lbl">'+e(k.lbl)+'</span> · <span class="lat">'+e(k.lat)+'</span>\n<h3>'+e(k.h)+'</h3><p>'+e(k.t)+'</p>\n<div class="kp"><b>'+e(k.p)+' BYN</b> <span>'+e(k.q)+'</span></div>\n'+(k.mode=='photo'?'<!-- фото вместо рисунка: --> <img src="'+e(k.img)+'" alt="'+e(k.h)+'">\n':'');
 O.dl('home-snippet.html',new Blob([t],{type:'text/html'}));dlFiles(files);O.toast('HTML-вставка скачана')};
$('#h-reset').onclick=function(){if(!confirm('Сбросить главную к версии с сайта?'))return;localStorage.removeItem(K);S=null;render();O.toast('Сброшено')};

window.OPS_HOME={render:function(){render()},close:closeC};
fetch(O.BASE+'index.html').then(function(r){return r.ok?r.text():''}).then(function(t){if(t)parseSite(t);if(!localStorage.getItem(K))S=null;if(!$('#v-home').hidden)render()},function(){});
})();
