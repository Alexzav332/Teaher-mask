/* Репертуар */
const app = $('#app');
function pageRep() {
  return crumbs([['Репертуар']]) + `<section class="wrap section"><h1 class="section__title">Репертуар <span>сезона</span></h1>
<div class="catalog"><aside class="filters" id="filters"><b>Фильтры</b>
<label class="field">Жанр<select class="input" id="fG"><option value="">Все</option><option>Драма</option><option>Комедия</option><option>Мюзикл</option></select></label>
<label class="field">Сцена<select class="input" id="fS"><option value="">Все</option>${STAGES.map(s => `<option>${s}</option>`).join('')}</select></label>
<label class="field">Дата<input class="input" type="date" id="fD" min="${isoDate(new Date())}"></label>
<label class="field">Цена до: <b id="fPv" style="color:var(--gold)">3000 ₽</b><input type="range" id="fP" min="800" max="3000" step="100" value="3000"></label>
<label class="field">Сортировка<select class="input" id="fO"><option value="">По умолчанию</option><option value="asc">Сначала дешёвые</option><option value="desc">Сначала дорогие</option></select></label>
<button class="btn btn--ghost btn--sm" id="fR">Сбросить</button></aside>
<div><div id="count" style="color:var(--muted);margin-bottom:12px"></div><div class="grid grid--3" id="plays"></div></div></div></section>`;
}
function renderPlays() {
  const g = $('#fG').value, s = $('#fS').value, d = $('#fD').value, pr = +$('#fP').value, o = $('#fO').value;
  $('#fPv').textContent = fmt(pr);
  let l = PLAYS.filter(p => (!g || p.genre === g) && (!s || p.stage === s) && p.price <= pr && (!d || p.days.map(addDays).includes(d)));
  if (o) l.sort((a, b) => o === 'asc' ? a.price - b.price : b.price - a.price);
  $('#count').textContent = 'Найдено спектаклей: ' + l.length;
  $('#plays').innerHTML = l.length ? l.map(p => card(p).replace('reveal', 'reveal is-visible')).join('') : '<div class="tile">Ничего не найдено — измените фильтры.</div>';
}


app.innerHTML = pageRep();
renderPlays();
$('#filters').addEventListener('input', renderPlays);
$('#fR').onclick = () => { $('#fG').value = $('#fS').value = $('#fD').value = $('#fO').value = ''; $('#fP').value = 3000; renderPlays() };
observe();
