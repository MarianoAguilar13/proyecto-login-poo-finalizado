function main() {
  if (localStorage.getItem("mailUserSesion") == "") {
    alert(
      "No se ha iniciado sesión, debera iniciar sesión para ingresar a esta página."
    );
    window.location.href = "index.html";
  } else {
    const welcomeUserEl = document.querySelector(".welcomeUser");

    const nombre = localStorage.getItem("nombreUserSesion");

    welcomeUserEl.textContent = welcomeUserEl.textContent + " " + nombre;

    const botonAdmin = document.querySelector(".buttonAdmin");

    //si la cuenta no es admin, entonces no muestra el boton
    if (localStorage.getItem("userEsAdmin") == "no") {
      botonAdmin.style.display = "none";
    }

    botonAdmin.addEventListener("click", async (e) => {
      e.preventDefault();

      window.location.href = "admin.html";
    });

    const botonCerrarSesionEl = document.querySelector(".botonCerrarSesion");

    botonCerrarSesionEl.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("mailUserSesion", "");
      localStorage.setItem("userEsAdmin", "");
      localStorage.setItem("nombreUserSesion", "");
      alert("Se ha cerrado la sesión, que tenga un buen día :) ");
      window.location.href = "index.html";
    });

    const botonInicioEl = document.querySelector(".botonInicio");

    botonInicioEl.addEventListener("click", (e) => {
      e.preventDefault();

      window.location.href = "index.html";
    });
  }
}

main();
