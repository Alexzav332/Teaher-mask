/* Контакты */
const app=$('#app');
function pageContacts(){
  return crumbs([['Контакты']])+`<section class="wrap section"><h1 class="section__title">Контакты</h1><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(300px,1fr))">
<div class="tile reveal"><h3 class="tile__title">Театр «Маска»</h3><p>📍 г. Москва, ул. Театральная, 12<br>🕙 Касса: ежедневно 10:00–21:00<br>📞 +7 (495) 123-45-67<br>✉️ info@mask-theatre.ru</p>
<div class="chips" style="margin-top:14px"><a class="chip" href="contacts.html">VK</a><a class="chip" href="contacts.html">Telegram</a><a class="chip" href="contacts.html">YouTube</a></div></div>
<form class="form reveal" id="feedForm" novalidate style="position:static"><h3>Обратная связь</h3>
<label class="field">Имя<input class="input" name="name"><span class="error"></span></label>
<label class="field">E-mail<input class="input" name="email"><span class="error"></span></label>
<label class="field">Сообщение<textarea class="input" name="text" rows="3"></textarea><span class="error"></span></label>
<button class="btn" type="submit">Отправить</button><div class="msg" hidden></div></form></div>
<h2 class="section__title reveal" style="margin-top:44px">Частые <span>вопросы</span></h2>
${FAQ.map(f=>`<div class="faq reveal"><button class="faq__q">${f[0]}<span>+</span></button><div class="faq__a">${f[1]}</div></div>`).join('')}</section>`;
}


app.innerHTML=pageContacts();
bindForm('#feedForm',f=>{f.reset();note(f,'Сообщение отправлено. Мы ответим в течение суток.',true)});
observe();
