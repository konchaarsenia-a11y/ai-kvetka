/* AI KVETKA · применяет js/home.js (window.AIK_HOME, экспорт из ops/ → «Главная») к сайту.
   Предложение для сайта: положить как js/home-apply.js. Без AIK_HOME ничего не меняет — остаётся текущая вёрстка.
   index.html:  подключить js/home.js и js/home-apply.js (обычные script src) сразу после закрытия section блока #cats
                (до инлайн-скрипта рисунка пиона, он ищет #wkp).
   catalog.html: те же два тега перед инлайн-скриптом с function grp(...), и в ap() условие категории:
                (fc=='all'||c.dataset.c==fc||(c.dataset.cs||'').indexOf('|'+fc+'|')>=0) */
(function(){var H=window.AIK_HOME;if(!H)return;
function e(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function set(r,s,v,html){var x=r.querySelector(s);if(x&&v!=null&&v!=='')x[html?'innerHTML':'textContent']=v}
/* главная: категории */
var g=document.querySelector('#cats .cgr');
if(g&&H.cats){var all=g.querySelector('.cc.all');g.innerHTML=H.cats.filter(function(c){return c.on}).map(function(c){
 var src=c.img,ss=/-800\.webp$/.test(src)?' srcset="'+e(src.replace('-800.','-400.'))+' 400w, '+e(src)+' 800w" sizes="(max-width:900px) 46vw, 276px"':'';
 return '<a class="cc" href="catalog.html#'+e(c.s)+'"><i><img src="'+e(src)+'"'+ss+' alt="" loading="lazy" decoding="async"></i><b>'+e(c.n)+'</b><small>'+e(c.sub)+'</small></a>'}).join('')+(all?all.outerHTML:'')}
/* главная: цветок недели */
var w=document.getElementById('wk'),k=H.wk;
if(w&&k){var d=w.querySelectorAll('.wkd');if(d[0]){set(d[0],'.lbl',k.lbl);set(d[0],'.lat',k.lat)}
 if(d[1]){set(d[1],'h3',k.h);set(d[1],'p',k.t);set(d[1],'.kp b',k.p!==''&&k.p!=null?k.p+' BYN':'');var q=d[1].querySelector('.kp span');if(q)q.textContent=k.q||'';
  var b=d[1].querySelector('.wbk');if(b&&k.btn)b.href=k.btn;var cr=d[1].querySelector('.cr');if(cr){if(k.care)cr.textContent=k.care;if(k.careHref)cr.href=k.careHref}}
 if(k.mode=='photo'&&k.img){var f=document.getElementById('wkp');if(f){var n=document.createElement('figure');n.className='wkph';n.innerHTML='<img src="'+e(k.img)+'" alt="'+e(k.h)+'" loading="lazy" decoding="async">';f.parentNode.replaceChild(n,f)}}}
/* каталог: кнопки категорий, якоря и принадлежность товаров */
var fb=document.querySelector('.fb2');
if(fb&&H.cats){var a=fb.querySelector('[data-fc][data-v="all"]');fb.innerHTML=(a?a.outerHTML:'')+H.cats.map(function(c){return '<button class="" data-fc data-v="'+e(c.n)+'" data-s="'+e(c.s)+'">'+e(c.n)+'</button>'}).join('');
 var sec=document.getElementById('cat'),inn=sec&&sec.querySelector('.in12');if(inn)H.cats.forEach(function(c){if(!document.getElementById(c.s)){var s=document.createElement('span');s.id=c.s;inn.insertBefore(s,inn.firstChild)}});
 [].forEach.call(document.querySelectorAll('[data-card][data-id]'),function(el){var id=el.dataset.id,cs=H.cats.filter(function(c){return (c.ids||[]).indexOf(id)>=0}).map(function(c){return c.n});
  el.dataset.cs='|'+cs.join('|')+'|';if(cs.length==1)el.dataset.c=cs[0]})}
})();
