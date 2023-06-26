function main() {
  //se chequea que este iniciada la sesion, si esta vacio el mailUserSesion, significa
  //que no iniciaron sesion y lo redirige hacia el inicio
  if (localStorage.getItem("mailUserSesion") == "") {
    alert(
      "No se ha iniciado sesión, debera iniciar sesión para ingresar a esta página."
    );
    window.location.href = "index.html";
  } else {
    const welcomeUserEl = document.querySelector(".welcomeUser");

    //se trae el nombre del usuario, guardado en el localstorage
    const nombre = localStorage.getItem("nombreUserSesion");

    welcomeUserEl.textContent = welcomeUserEl.textContent + " " + nombre;

    const botonAdmin = document.querySelector(".buttonAdmin");

    //si la cuenta no es admin, entonces no muestra el boton
    if (localStorage.getItem("userEsAdmin") == "no") {
      botonAdmin.style.display = "none";
    }

    //si realiza un click en el boton admin lo redirige hacia la pagina de admin
    botonAdmin.addEventListener("click", async (e) => {
      e.preventDefault();

      window.location.href = "admin.html";
    });

    const botonCerrarSesionEl = document.querySelector(".botonCerrarSesion");

    //el boton de cerrar sesion igual que en el index
    botonCerrarSesionEl.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("mailUserSesion", "");
      localStorage.setItem("userEsAdmin", "");
      localStorage.setItem("nombreUserSesion", "");
      alert("Se ha cerrado la sesión, que tenga un buen día :) ");
      window.open("http://localhost:8080/logout");
      window.location.href = "index.html";
    });

    const botonInicioEl = document.querySelector(".botonInicio");

    //el boton del inicio te redirige hacia el inicio
    botonInicioEl.addEventListener("click", (e) => {
      e.preventDefault();

      window.location.href = "index.html";
    });
  }
}

main();
