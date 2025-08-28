// Burger Menu
const lanzador = '#menu-toggle';
const desplegable = '#navegador';
const claseAbierto = 'open';

function initNav() {
  const btn = document.querySelector(lanzador);
  const nav = document.querySelector(desplegable);
  if (!btn || !nav) return;

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.toggle(claseAbierto);
  });

  nav.addEventListener('click', (e) => {
    if (e.target.closest('a')) nav.classList.remove(claseAbierto);
  });
}
initNav();


//Cookies
const popup = document.getElementById("cookiePopup")
const btn = document.getElementById("acceptCookies")
if (!localStorage.cookiesAcepted){
    popup.classList.add("show")
}

btn.addEventListener("click", function(){
    localStorage.cookiesAcepted = "true";
    popup.classList.remove("show");
})