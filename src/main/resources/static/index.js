function main() {
  const form = document.querySelector(".form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    //si ya hay una sesion iniciada, no permite ingresar sesion, primero se debe cerrar sesion
    if (localStorage.getItem("mailUserSesion") != "") {
      alert(
        "Ya inciaste sesión con una cuenta, por favor cierre sesión para poder ingresar a una nueva cuenta."
      );
      window.location.href = "index.html";
    } else {
      const email = e.target.email.value;
      const password = e.target.contrasenia.value;

      const signInUser = { email: email, password: password };

      /*
    Aca tendriamos que llamar al endpoint que nos permita iniciar sesion
    tiene que chequear que los datos email y contrasenia sean igual que los que estan
    guardados en la bd si todo da ok entonces tiene que guardarlos en el localhost en mailSesion
    e indicar si es o no un usuario administrados
    */

      if (signInUser) {
        console.log(
          "  email: ",
          signInUser.email,
          "  contraseña: ",
          signInUser.password
        );

        const respuesta = await iniciarSesion(signInUser);

        if (respuesta) {
          const user = respuesta;

          console.log("respuesta: ", user);
          localStorage.setItem("mailUserSesion", user.email);
          localStorage.setItem(
            "nombreUserSesion",
            user.nombre + " " + user.apellido
          );
          localStorage.setItem("userEsAdmin", user.admin);

          alert("El nuevo usuario se ingreso correctamente");

          const emailEl = document.getElementById("emailInput");
          emailEl.value = "";
          const contraseniaEl = document.getElementById("contraseniaInput");
          contraseniaEl.value = "";

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

  botonWelcomeEl.addEventListener("click", (e) => {
    e.preventDefault();
    window.location.href = "welcome.html";
  });

  botonCerrarSesionEl.addEventListener("click", async (e) => {
    e.preventDefault();
    localStorage.setItem("mailUserSesion", "");
    localStorage.setItem("userEsAdmin", "");
    localStorage.setItem("nombreUserSesion", "");
    alert("Se ha cerrado la sesión, que tenga un buen día :) ");
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

    console.log("la respuesta es:", respuesta);

    return respuesta;
  } catch (r) {
    console.log("este es el error: ", r);

    return null;
  }
}

main();
