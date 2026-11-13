/* Главная */
const app = $('#app');
function pageHome() {
  const adv = [['🎭', 'Профессиональная труппа', 'Более 40 артистов с театральным образованием.'], ['✨', 'Современная сцена', 'Три зала, световое и звуковое оборудование нового поколения.'], ['🎬', 'Премьеры', 'Каждый сезон — минимум шесть новых постановок.'], ['🧒', 'Детские спектакли', 'Сказки и мюзиклы для зрителей от 0+.']];
  const top = PLAYS.filter(p => p.tags.includes('Хит сезона') || p.tags.includes('Для детей')).slice(0, 3);
  const prem = PLAYS.filter(p => p.tags.includes('Премьера'));
  return `<section class="hero wrap"><div class="reveal"><h1 class="hero__title">Театр, где оживает <em>каждая эмоция</em></h1>
<p class="hero__text">Выберите спектакль, дату и лучшие места — купите билет онлайн за пару минут.</p>
<div class="hero__act"><a class="btn btn--gold" href="repertoire.html">🎟 Купить билет</a><button class="btn btn--ghost" data-scroll="about">О театре</button></div></div></section>
<section class="wrap section" id="about"><h2 class="section__title reveal">О <span>театре</span></h2>
<p class="reveal" style="max-width:760px;color:var(--muted)">Театр «Маска» основан в 1987 году. Мы соединяем классику и современные формы — драму, комедию и мюзикл — и ставим спектакли для зрителей любого возраста.</p>
<div class="grid grid--4" style="margin-top:24px">${adv.map(a => `<div class="tile reveal"><div class="tile__icon">${a[0]}</div><h3 class="tile__title">${a[1]}</h3><p>${a[2]}</p></div>`).join('')}</div></section>
<section class="wrap section"><h2 class="section__title reveal">Популярные <span>постановки</span></h2><div class="grid grid--3">${top.map(card).join('')}</div></section>
<section class="wrap section"><h2 class="section__title reveal">Ближайшие <span>премьеры и акции</span></h2><div class="grid grid--3">
${prem.map(p => `<div class="tile reveal"><span class="tag tag--red">Премьера</span><h3 class="tile__title">${p.title}</h3><p>Первый показ ${human(addDays(p.days[0]))} · ${p.stage}</p></div>`).join('')}
<div class="tile reveal"><span class="tag">Акция</span><h3 class="tile__title">−20% студентам</h3><p>В будние дни по студенческому билету.</p></div></div></section>
<section class="wrap section"><div class="grid grid--4">${[['spec', 48, 'спектаклей в сезоне'], ['act', 42, 'актёра в труппе'], ['aud', 120000, 'зрителей в год']].map(s => `<div class="stat tile reveal"><div class="stat__num" data-count="${s[1]}">0</div><div class="stat__label">${s[2]}</div></div>`).join('')}</div></section>
<section class="wrap section"><h2 class="section__title reveal">Новости <span>театра</span></h2>
<div class="tabs" id="newsTabs">${['Все', 'Премьеры', 'Акции', 'Жизнь театра'].map((t, i) => `<button class="tabs__btn ${i ? '' : 'tabs__btn--active'}" data-tab="${t}">${t}</button>`).join('')}</div>
<div class="grid grid--3" id="newsList"></div></section>
<section class="wrap section"><h2 class="section__title reveal">Отзывы <span>зрителей</span></h2><div class="grid grid--3" id="reviews"></div>
<form class="form reveal" id="reviewForm" style="margin-top:24px;max-width:560px" novalidate><h3>Оставить отзыв</h3>
<div class="form__row"><label class="field">Имя<input class="input" name="n"><span class="error"></span></label>
<label class="field">Оценка<select class="input" name="s"><option>5</option><option>4</option><option>3</option><option>2</option><option>1</option></select></label></div>
<label class="field">Отзыв<textarea class="input" name="t" rows="3"></textarea><span class="error"></span></label>
<button class="btn" type="submit">Отправить</button><div class="msg" hidden></div></form></section>`;
}
function renderNews(c = 'Все') { $('#newsList').innerHTML = NEWS.filter(n => c === 'Все' || n.c === c).map(n => `<div class="tile news"><div class="news__date">${n.d} · ${n.c}</div><h3 class="tile__title">${n.t}</h3><p>${n.x}</p></div>`).join('') }
function renderReviews() { $('#reviews').innerHTML = REVIEWS.map(r => `<div class="tile reveal is-visible"><div class="review__stars">${stars(r.s)}</div><p style="margin-top:8px">${esc(r.t)}</p><div class="review__name">${esc(r.n)}</div></div>`).join('') }


app.innerHTML = pageHome();
renderNews(); renderReviews();
bindForm('#reviewForm', f => { REVIEWS.unshift({ n: f.n.value, s: +f.s.value, t: f.t.value }); renderReviews(); f.reset(); note(f, 'Спасибо! Ваш отзыв добавлен.', true) });
observe();
