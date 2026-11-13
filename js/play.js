/* Страница спектакля, схема зала и покупка билета */
const app=$('#app');
/* Схема зала */
const ROWS=6,COLS=10,MULT=[1.5,1.5,1.2,1,1,0.8];
let seats=new Set(),cur=null;
function hash(s){let h=7;for(const c of s)h=(h*31+c.charCodeAt(0))>>>0;return h}
function busy(r,c){const h=hash(`${cur.id}|${$('#fDate').value}|${$('#fTime').value}`);return ((h>>>(r*COLS+c)%20)*(r+3)*(c+5)+h)%100<26}
function seatPrice(r){return Math.round(cur.price*MULT[r]/10)*10}
function renderHall(){
  let h=`<div class="hall__stage">СЦЕНА</div>`;
  for(let r=0;r<ROWS;r++){h+=`<div class="hall__row"><span class="hall__label">${r+1}</span>`;
    for(let c=0;c<COLS;c++){const id=`${r+1}-${c+1}`,b=busy(r,c);
      h+=`<button type="button" class="seat ${b?'seat--busy':''} ${seats.has(id)?'seat--sel':''} ${r<2?'seat--vip':''}" data-seat="${id}" data-r="${r}" ${b?'disabled':''} title="Ряд ${r+1}, место ${c+1} — ${fmt(seatPrice(r))}" aria-label="Ряд ${r+1} место ${c+1}"></button>`;
      if(c===4)h+='<span style="width:14px"></span>'}
    h+='</div>'}
  h+=`<div class="legend"><span><i style="background:var(--line)"></i>Свободно</span><span><i style="background:var(--red)"></i>Выбрано</span><span><i style="background:#555"></i>Занято</span><span><i style="box-shadow:inset 0 -3px 0 var(--gold);background:var(--line)"></i>Партер (ряды 1–2)</span></div>`;
  $('#hall').innerHTML=h;updateTotal();
}
function updateTotal(){
  let t=0;seats.forEach(id=>t+=seatPrice(+id.split('-')[0]-1));
  $('#fQty').value=seats.size;
  $('#picked').textContent=seats.size?[...seats].map(s=>{const[a,b]=s.split('-');return`р.${a} м.${b}`}).join(', '):'не выбраны';
  $('#total').textContent=fmt(t);
}
/* Шаг 1–2: выбор даты и спектакля (страница «Билеты» без ?id=) */
function pageTickets(){
  const dates=[...new Set(PLAYS.flatMap(p=>p.days))].sort((a,b)=>a-b).slice(0,8).map(addDays);
  return crumbs([['Билеты']])+`<section class="wrap section"><h1 class="section__title">Купить <span>билет</span></h1>
<div class="step"><span class="step__n">1</span>Выберите дату (или пропустите и выберите спектакль)</div>
<div class="picker" id="dates"><button type="button" class="chip chip--btn chip--active" data-d="">Все даты</button>
${dates.map(d=>`<button type="button" class="chip chip--btn" data-d="${d}">${human(d)}</button>`).join('')}
<input class="input" type="date" id="tDate" min="${isoDate(new Date())}" aria-label="Другая дата"></div>
<div class="step"><span class="step__n">2</span><span id="tTitle">Выберите спектакль</span></div>
<div class="grid grid--3" id="tPlays"></div></section>`;
}
function renderTickets(date){
  const l=PLAYS.filter(p=>!date||p.days.map(addDays).includes(date));
  $$('#dates .chip--btn').forEach(b=>b.classList.toggle('chip--active',b.dataset.d===date));
  $('#tTitle').textContent=date?`Спектакли на ${human(date)}: ${l.length}`:'Все спектакли — выберите любой, дату выберете на следующем шаге';
  $('#tPlays').innerHTML=l.length?l.map(p=>card(p).replace(`href="play.html?id=${p.id}"`,`href="play.html?id=${p.id}${date?'&date='+date:''}"`).replace('reveal','reveal is-visible')).join(''):'<div class="tile">На эту дату спектаклей нет — выберите другую дату.</div>';
}

function pagePlay(id){
  const p=PLAYS.find(x=>x.id===id)||PLAYS[0];cur=p;seats=new Set();
  const today=isoDate(new Date());
  const q=new URLSearchParams(location.search).get('date');
  const d0=(q&&p.days.map(addDays).includes(q))?q:addDays(p.days[0]);
  return crumbs([['Билеты','play.html'],[p.title]])+`<section class="wrap section"><div class="play">
<div><div class="play__poster" style="${poster(p)}">${p.e}</div>
<div class="chips" style="margin-bottom:14px"><span class="chip">${p.genre}</span><span class="chip">${p.age}</span><span class="chip">${p.stage}</span><span class="chip">⏱ ${p.dur}</span></div>
<div style="margin-bottom:12px;display:flex;gap:6px">${tagsHtml(p)}</div>
<h1 class="section__title" style="margin-bottom:12px">${p.title}</h1><p style="color:var(--muted)">${p.desc}</p>
<h3 style="margin:22px 0 10px">В ролях</h3><div class="chips">${p.cast.map(c=>`<span class="chip">${c}</span>`).join('')}</div>
<h3 style="margin:22px 0 10px">Правила посещения</h3><ul class="list"><li>Приходите за 30–40 минут до начала.</li><li>Опоздавших пускают только в антракте.</li><li>Фото- и видеосъёмка во время спектакля запрещена.</li><li>Возрастное ограничение: ${p.age}.</li></ul>
<h3 style="margin:22px 0 10px">Ближайшие даты</h3><div class="chips">${p.days.map(d=>`<span class="chip">${human(addDays(d))}</span>`).join('')}</div></div>
<form class="form" id="buyForm" novalidate><h2 style="font-size:1.5rem">Купить билет</h2>
<label class="field">Имя<input class="input" name="name" autocomplete="name"><span class="error"></span></label>
<div class="form__row"><label class="field">Телефон<input class="input" name="phone" type="tel" placeholder="+7 999 123-45-67"><span class="error"></span></label>
<label class="field">E-mail<input class="input" name="email" type="email"><span class="error"></span></label></div>
<div class="form__row"><label class="field">Дата<input class="input" name="date" id="fDate" type="date" min="${today}" value="${d0}"><span class="error"></span></label>
<label class="field">Время<select class="input" id="fTime"><option>14:00</option><option selected>19:00</option></select></label></div>
<div class="field">Выбор мест <span id="picked" style="color:var(--text)">не выбраны</span></div>
<div class="hall" id="hall"></div>
<div class="form__row"><label class="field">Количество билетов<input class="input" id="fQty" name="qty" readonly value="0"><span class="error"></span></label>
<div class="field">Цена за ряд<span style="color:var(--text);font-size:.8rem">1–2: ${fmt(seatPrice(0))} · 3: ${fmt(seatPrice(2))} · 4–5: ${fmt(seatPrice(3))} · 6: ${fmt(seatPrice(5))}</span></div></div>
<label class="field">Комментарий<textarea class="input" name="comment" rows="2"></textarea></label>
<div class="total"><span>Итого:</span><b id="total">0 ₽</b></div>
<button class="btn btn--gold" type="submit">Оформить заказ</button><div class="msg" hidden></div></form></div></section>`;
}

if(new URLSearchParams(location.search).get('id')){
  app.innerHTML=pagePlay(+new URLSearchParams(location.search).get('id'));
  document.title=cur.title+' — билеты | Театр «Маска»';
  renderHall();
  $('#fDate').addEventListener('change',()=>{seats.clear();renderHall()});
  $('#fTime').addEventListener('change',()=>{seats.clear();renderHall()});
  bindForm('#buyForm',f=>{
    const n='№'+(100000+Math.floor(Math.random()*899999));
    note(f,`Заказ ${n} оформлен! «${cur.title}», ${human($('#fDate').value)}, ${$('#fTime').value}, билетов: ${seats.size}, сумма ${$('#total').textContent}. Подтверждение отправлено на ${f.email.value}.`,true);
    seats.clear();renderHall();
  });
}else{
  app.innerHTML=pageTickets();
  renderTickets('');
  $('#dates').addEventListener('click',e=>{const b=e.target.closest('[data-d]');if(b){$('#tDate').value=b.dataset.d;renderTickets(b.dataset.d)}});
  $('#tDate').addEventListener('change',e=>renderTickets(e.target.value&&e.target.value>=isoDate(new Date())?e.target.value:''));
}
observe();
