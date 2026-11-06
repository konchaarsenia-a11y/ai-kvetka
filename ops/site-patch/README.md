# Правка сайта для раздела ops/ «Главная» (предложение, сайт не менялся)

Сейчас цветок недели и категории зашиты в `index.html` (`#cats .cgr`, `#wk`), а категории каталога — в `catalog.html` (`.fb2 [data-fc]`, `data-c` у карточек). Чтобы правки из ops применялись без ручной вёрстки:

1. Положить экспорт `home.js` из ops/ → `js/home.js`, а `ops/site-patch/home-apply.js` → `js/home-apply.js`. Фото из экспорта положить в `img/ops/`.
2. `index.html`: сразу после `</section>` блока `#cats` вставить
   `<script src="js/home.js"></script><script src="js/home-apply.js"></script>`
3. `catalog.html`: те же два тега перед инлайн-скриптом с `function grp(`; в `function ap()` заменить `c.dataset.c==fc` на
   `(c.dataset.c==fc||(c.dataset.cs||'').indexOf('|'+fc+'|')>=0)` — нужно только чтобы товар мог быть в нескольких категориях.

Без `js/home.js` сайт выглядит как сейчас. Запасной вариант без скриптов: кнопка «HTML-вставка» в ops/ даёт готовую разметку для ручной замены.
