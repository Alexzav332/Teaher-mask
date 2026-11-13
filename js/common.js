/* Данные, вспомогательные функции, валидация, события — общие для всех страниц */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const fmt=n=>n.toLocaleString('ru-RU')+' ₽';
const isoDate=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)};
const addDays=n=>{const d=new Date();d.setDate(d.getDate()+n);return isoDate(d)};
const human=s=>new Date(s+'T12:00').toLocaleDateString('ru-RU',{day:'numeric',month:'long'});
const esc=s=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const STAGES=['Большая сцена','Малая сцена','Камерная сцена'];
const PLAYS=[
{id:1,title:'Ревизор',genre:'Комедия',age:'12+',stage:STAGES[0],price:1800,tags:['Хит сезона','Есть билеты'],e:'🎩',h:350,dur:'2 ч 40 мин',days:[2,6,11,16],cast:['Игорь Лавров','Мария Ветрова','Павел Соколов','Анна Громова'],desc:'Гоголевская классика в новой постановке: маленький городок, большой страх и одна роковая ошибка. Динамичная режиссура и живая музыка.'},
{id:2,title:'Чайка',genre:'Драма',age:'16+',stage:STAGES[1],price:1500,tags:['Премьера','Есть билеты'],e:'🕊️',h:210,dur:'2 ч 20 мин',days:[4,9,15,21],cast:['Елена Март','Денис Крылов','Ольга Рязанцева'],desc:'Чехов о любви, искусстве и несбывшихся надеждах. Камерная атмосфера и тонкая психологическая игра актёров.'},
{id:3,title:'Щелкунчик',genre:'Мюзикл',age:'0+',stage:STAGES[0],price:2200,tags:['Для детей','Есть билеты'],e:'🎄',h:20,dur:'1 ч 50 мин',days:[1,3,8,13],cast:['Софья Белова','Артём Орлов','Кира Данилова'],desc:'Новогодняя сказка с живым оркестром, красочными костюмами и спецэффектами. Подарок для всей семьи.'},
{id:4,title:'Три сестры',genre:'Драма',age:'16+',stage:STAGES[2],price:1300,tags:['Есть билеты'],e:'🌲',h:150,dur:'2 ч 30 мин',days:[5,12,19],cast:['Алина Фомина','Вера Князева','Юлия Седова','Сергей Яснов'],desc:'«В Москву!» — вечная мечта трёх сестёр. Спектакль на 80 зрителей: вы будете почти внутри гостиной Прозоровых.'},
{id:5,title:'Мастер и Маргарита',genre:'Мюзикл',age:'16+',stage:STAGES[0],price:2600,tags:['Хит сезона','Премьера'],e:'🐈‍⬛',h:280,dur:'3 ч 00 мин',days:[3,7,14,22],cast:['Роман Дымов','Татьяна Лис','Виктор Ларин','Ева Север'],desc:'Масштабный мюзикл по роману Булгакова: Москва и Ершалаим, бал сатаны и вечная любовь.'},
{id:6,title:'Золотой ключик',genre:'Комедия',age:'0+',stage:STAGES[1],price:900,tags:['Для детей','Премьера','Есть билеты'],e:'🗝️',h:45,dur:'1 ч 10 мин',days:[2,4,9,10],cast:['Лиза Ромашова','Тимур Грин','Нина Алая'],desc:'Весёлая история Буратино с песнями, куклами и интерактивом со зрителями.'}
];
const TAGCLS={'Премьера':'tag--red','Для детей':'','Хит сезона':'tag--red','Есть билеты':'tag--ok'};
const NEWS=[
{c:'Премьеры',d:'12 ноября',t:'Премьера «Золотого ключика»',x:'Новая детская постановка на Малой сцене — первые показы уже в продаже.'},
{c:'Акции',d:'8 ноября',t:'Скидка 20% для студентов',x:'По студенческому билету — скидка на все спектакли в будние дни.'},
{c:'Жизнь театра',d:'1 ноября',t:'Открытая репетиция «Мастера и Маргариты»',x:'Режиссёр пригласил зрителей заглянуть за кулисы большого мюзикла.'},
{c:'Акции',d:'25 октября',t:'Семейный билет',x:'Два взрослых и двое детей на «Щелкунчика» — со скидкой 15%.'},
{c:'Премьеры',d:'20 октября',t:'«Чайка» на Малой сцене',x:'Чеховская драма в современной интерпретации открыла сезон.'}
];
const REVIEWS=[{n:'Ирина К.',s:5,t:'«Мастер и Маргарита» — потрясающе! Музыка, свет, декорации на высоте.'},{n:'Алексей П.',s:5,t:'Водил детей на «Щелкунчика». Они в восторге, мы тоже. Билеты купили за пару минут.'},{n:'Марина С.',s:4,t:'Очень уютный зал и удобная схема выбора мест. Хотелось бы больше вечерних показов.'}];
const FAQ=[['Как вернуть билет?','Билет можно вернуть не позднее чем за 24 часа до начала спектакля — деньги вернутся на карту в течение 5 дней.'],['С какого возраста можно приходить?','Возраст указан на каждой карточке спектакля. Дети до 6 лет допускаются только на спектакли 0+.'],['Нужно ли печатать билет?','Нет, достаточно показать QR-код из письма на экране телефона.'],['За сколько приходить?','Гардероб открывается за час до начала. Опоздавших пускают в антракте.']];
const stars=n=>'★'.repeat(n)+'☆'.repeat(5-n);
const poster=p=>`background:linear-gradient(135deg,hsl(${p.h} 65% 30%),hsl(${p.h+40} 70% 12%))`;
const tagsHtml=p=>p.tags.map(t=>`<span class="tag ${TAGCLS[t]}">${t}</span>`).join('');
const crumbs=a=>`<div class="wrap crumbs"><a href="index.html">Главная</a>${a.map(x=>' / '+(x[1]?`<a href="${x[1]}">${x[0]}</a>`:x[0])).join('')}</div>`;
const card=p=>`<article class="card reveal"><div class="card__poster" style="${poster(p)}">${p.e}<div class="card__tags">${tagsHtml(p)}</div></div>
<div class="card__body"><h3 class="card__title">${p.title}</h3><div class="card__meta">${p.genre} · ${p.age} · ${p.stage}</div>
<div class="card__foot"><span class="card__price">от ${fmt(p.price)}</span><span style="display:flex;gap:6px"><button class="btn btn--ghost btn--sm" data-modal="${p.id}">Кратко</button><a class="btn btn--sm" href="play.html?id=${p.id}">Билеты</a></span></div></div></article>`;

/* ---------- Общий каркас: меню, подвал, модальное окно, кнопка «Наверх» ---------- */
const PAGE=document.body.dataset.page;
const NAV=[['index','index.html','Главная'],['repertoire','repertoire.html','Репертуар'],['play','play.html','Билеты'],['contacts','contacts.html','Контакты']];
document.body.insertAdjacentHTML('afterbegin',`<div class="bg" aria-hidden="true"><div class="bg__blob bg__blob--a"></div><div class="bg__blob bg__blob--b"></div></div>
<header class="header"><div class="header__in"><a class="header__logo" href="index.html">🎭 Маска</a>
<nav class="header__nav">${NAV.map(n=>`<a class="header__link ${n[0]===PAGE?'header__link--active':''}" href="${n[1]}">${n[2]}</a>`).join('')}</nav></div></header>`);
$('#app').insertAdjacentHTML('afterend',`<footer class="footer"><div class="wrap footer__in">
<div><b style="color:var(--gold);font-family:var(--serif);font-size:1.2rem">Театр «Маска»</b><br>ул. Театральная, 12 · Ежедневно 10:00–21:00</div>
<div>+7 (495) 123-45-67<br>info@mask-theatre.ru</div><div>© 2026 Театр «Маска». Учебный проект.</div></div></footer>
<div class="modal" id="modal"><div class="modal__box" id="modalBox"></div></div>
<button class="up" id="up" aria-label="Наверх">↑</button>`);

/* ---------- Формы ---------- */
const V={name:v=>v.trim().length>=2||'Введите имя (от 2 символов)',phone:v=>/^\+?[0-9\s\-()]{10,18}$/.test(v.trim())||'Неверный формат телефона',email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim())||'Неверный формат e-mail',
  date:v=>!v?'Выберите дату':v<isoDate(new Date())?'Дата не может быть раньше сегодняшней':true,
  qty:v=>+v>0||'Выберите хотя бы одно место на схеме',text:v=>v.trim().length>=10||'Сообщение — минимум 10 символов',t:v=>v.trim().length>=5||'Напишите отзыв (от 5 символов)',n:v=>v.trim().length>=2||'Введите имя'};
function validate(form){
  let ok=true;
  $$('.input',form).forEach(i=>{const f=V[i.name];if(!f)return;const r=f(i.value),err=i.parentElement.querySelector('.error');
    i.classList.toggle('input--bad',r!==true);if(err)err.textContent=r===true?'':r;if(r!==true)ok=false});
  return ok;
}
function note(form,text,ok){const m=$('.msg',form);m.hidden=false;m.className='msg '+(ok?'msg--ok':'msg--err');m.textContent=text}
function bindForm(sel,onOk){const f=$(sel);if(!f)return;f.addEventListener('submit',e=>{e.preventDefault();validate(f)?onOk(f):note(f,'Проверьте выделенные поля — есть ошибки.',false)})}

let io;
function observe(){
  io&&io.disconnect();
  io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;e.target.classList.add('is-visible');
    const c=$('[data-count]',e.target)||(e.target.dataset.count?e.target:null);
    if(c&&!c.dataset.done){c.dataset.done=1;const to=+c.dataset.count,t0=performance.now();
      (function s(t){const k=Math.min((t-t0)/1500,1);c.textContent=Math.round(to*k).toLocaleString('ru-RU');k<1&&requestAnimationFrame(s)})(t0)}
    io.unobserve(e.target)}),{threshold:.15});
  $$('.reveal').forEach(el=>io.observe(el));
}
document.addEventListener('click',e=>{
  const t=e.target;
  const sBtn=t.closest('[data-seat]');
  if(sBtn){const id=sBtn.dataset.seat;seats.has(id)?seats.delete(id):seats.add(id);if(seats.size>8){seats.delete(id);alert('Не более 8 мест в одном заказе')}renderHall()}
  const m=t.closest('[data-modal]');
  if(m){const p=PLAYS.find(x=>x.id==m.dataset.modal);
    $('#modalBox').innerHTML=`<button class="modal__close" aria-label="Закрыть">×</button><h2 style="margin-bottom:8px">${p.title}</h2><div class="chips" style="margin-bottom:12px"><span class="chip">${p.genre}</span><span class="chip">${p.age}</span><span class="chip">⏱ ${p.dur}</span></div><p style="color:var(--muted)">${p.desc}</p><p>Ближайший показ: <b>${human(addDays(p.days[0]))}</b><br>Билеты от <b style="color:var(--gold)">${fmt(p.price)}</b></p><a class="btn btn--gold" href="play.html?id=${p.id}">Перейти к покупке</a>`;
    $('#modal').classList.add('modal--open')}
  if(t.closest('.modal__close')||t.id==='modal'||(t.closest('#modalBox a')))$('#modal').classList.remove('modal--open');
  const q=t.closest('.faq__q');if(q)q.parentElement.classList.toggle('faq--open');
  const tb=t.closest('[data-tab]');if(tb){$$('.tabs__btn').forEach(b=>b.classList.toggle('tabs__btn--active',b===tb));renderNews(tb.dataset.tab)}
  const sc=t.closest('[data-scroll]');if(sc)document.getElementById(sc.dataset.scroll).scrollIntoView({behavior:'smooth'});
});
document.addEventListener('keydown',e=>e.key==='Escape'&&$('#modal').classList.remove('modal--open'));
const up=$('#up');up.onclick=()=>window.scrollTo({top:0,behavior:'smooth'});
addEventListener('scroll',()=>up.classList.toggle('up--show',scrollY>500),{passive:true});
