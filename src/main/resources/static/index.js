function main() {
  const form = document.querySelector(".form");

  //escuchamos el evento submit (enviar form)
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    //si ya hay una sesion iniciada, no permite ingresar sesion, primero se debe cerrar sesion

    const email = e.target.email.value;
    const password = e.target.contrasenia.value;

    const signInUser = { email: email, password: password };

    /*
    Aca llamamos al endpoint que nos permita iniciar sesion
    tiene que chequear que los datos email y contrasenia sean igual que los que estan
    guardados en la bd si todo da ok entonces tiene que guardarlos en el localhost en mailSesion
    e indicar si es o no un usuario administrados
    */

    if (signInUser.email && signInUser.password) {
      //hacemos la llamada al endpoint para chequear el mail y pass
      const respuesta = await iniciarSesion(signInUser);

      if (respuesta) {
        const user = respuesta;

        localStorage.setItem("mailUserSesion", user.email);
        localStorage.setItem(
          "nombreUserSesion",
          user.nombre + " " + user.apellido
        );
        localStorage.setItem("userEsAdmin", user.admin);

        alert("El nuevo usuario se ingreso correctamente");

        //con esto indicamos que vamos a cambiar de .html
        window.location.href = "welcome.html";
      } else {
        const emailEl = document.getElementById("emailInput");
        emailEl.value = "";
        const contraseniaEl = document.getElementById("contraseniaInput");
        contraseniaEl.value = "";
        alert(
          "El usuario o la contraseña no coinciden, por favor ingresar nuevamente los datos."
        );
      }
    } else {
      alert("Faltaron ingresar datos");
    }
  });

  const botonGoogle = document.querySelector(".iniciarGoogle");
  const botonCerrarSesionEl = document.querySelector(".botonCerrarSesion");
  const botonWelcomeEl = document.querySelector(".botonWelcome");

  //si no hay una sesion, entonces no se muestra el boton cerrar sesion
  if (localStorage.getItem("mailUserSesion") == "") {
    botonCerrarSesionEl.style.position = "relative";
    botonCerrarSesionEl.style.display = "none";
    botonWelcomeEl.style.display = "none";
    form.style.display = "initial";
    botonGoogle.style.display = "initial";
  }

  //evento del click al boton welcome
  botonWelcomeEl.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "welcome.html";
  });

  //evento del click del boton cerrar sesion
  botonCerrarSesionEl.addEventListener("click", async (e) => {
    e.preventDefault();
    localStorage.setItem("mailUserSesion", "");
    localStorage.setItem("userEsAdmin", "");
    localStorage.setItem("nombreUserSesion", "");
    alert("Se ha cerrado la sesión, que tenga un buen día :) ");
    //esto es para el logout de la cuenta de google
    window.open("http://localhost:8080/logout");
    window.location.href = "index.html";
  });
}

async function iniciarSesion(signInUser) {
  const fetchApi = fetch(`http://localhost:8080/api/users/sign-in`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify(signInUser),
  });

  try {
    const res = await fetchApi;

    const respuesta = await res.json();

    return respuesta;
  } catch (r) {
    return null;
  }
}

main();
