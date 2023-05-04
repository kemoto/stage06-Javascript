const routes = {
  "/": "/pages/home.html",
  "/universe": "/pages/universe.html",
  "/exploration": "/pages/exploration.html",
  404: "/pages/404.html"
}

function route(event) {
  event = event || window.event; //garantia de que o evento está sendo capturado
  event.preventDefault();

  window.history.pushState({}, "", event.target.href) //adicionando o href do evento no histórico do window
  
  handle();
}

function handle() {
  const {pathname} = window.location; //pegando o pathname (conteúdo após a / no link da window) pele método de desestruturação do objeto 
  const route = routes[pathname] || routes[404]; //route recebe a propriedade do objeto 'routes'

  fetch(route).then(data => data.text()).then(html => {
    document.querySelector('#app').innerHTML = html;
    changeBackground();
  })
}

function changeBackground() {
  const app = document.querySelector("#app");
  if(app.children[0].classList == "home") {
    document.documentElement.style.setProperty("--backgroundImg", "url('/assets/mountains-universe-1.png')")
  }

  if(app.children[0].classList == "universe") {
    document.documentElement.style.setProperty("--backgroundImg", "url('/assets/mountains-universe02.png')")
  }

  if(app.children[0].classList == "exploration") {
    document.documentElement.style.setProperty("--backgroundImg", "url('/assets/mountains-universe-3.png')")
  }
}

handle();

window.onpopstate = () => handle()
window.route = () => route()