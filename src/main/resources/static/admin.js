function main() {
  //chequea de si es admin o no
  if (localStorage.getItem("userEsAdmin") != "si") {
    alert(
      "No tienes permisos de administrador o no se ha iniciado sesión, debera iniciar sesión para ingresar a esta página."
    );
    window.location.href = "index.html";
  } else {
    const formulario = document.getElementById("formulario");
    const inputs = document.querySelectorAll("#formulario input");
    const formSearch = document.querySelector(".search");
    const containerEliminar = document.querySelector(".containerEliminar");
    const subtituloEl = document.querySelector(".subtitulo");

    const expresiones = {
      apellido: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      nombre: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Letras y espacios, pueden llevar acentos.
      password:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])([A-Za-z\d$@$!%*?&]|[^ ]){8,20}$/,
      /*
      Minimo 8 caracteres
      Maximo 15
      Al menos una letra mayúscula
      Al menos una letra minucula
      Al menos un dígito
      No espacios en blanco
      Al menos 1 caracter especial */
      correo: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
    };

    const campos = {
      apellido: false,
      nombre: false,
      password: false,
      correo: false,
    };

    const validarFormulario = (e) => {
      switch (e.target.name) {
        case "apellido":
          validarCampo(expresiones.apellido, e.target, "apellido");
          break;
        case "nombre":
          validarCampo(expresiones.nombre, e.target, "nombre");
          break;
        case "password":
          validarCampo(expresiones.password, e.target, "password");
          break;
        case "correo":
          validarCampo(expresiones.correo, e.target, "correo");
          break;
      }
    };

    const validarCampo = (expresion, input, campo) => {
      if (expresion.test(input.value)) {
        document
          .getElementById(`grupo__${campo}`)
          .classList.remove("formulario__grupo-incorrecto");
        document
          .getElementById(`grupo__${campo}`)
          .classList.add("formulario__grupo-correcto");
        document
          .querySelector(`#grupo__${campo} i`)
          .classList.add("fa-check-circle");
        document
          .querySelector(`#grupo__${campo} i`)
          .classList.remove("fa-times-circle");
        document
          .querySelector(`#grupo__${campo} .formulario__input-error`)
          .classList.remove("formulario__input-error-activo");
        campos[campo] = true;
      } else {
        document
          .getElementById(`grupo__${campo}`)
          .classList.add("formulario__grupo-incorrecto");
        document
          .getElementById(`grupo__${campo}`)
          .classList.remove("formulario__grupo-correcto");
        document
          .querySelector(`#grupo__${campo} i`)
          .classList.add("fa-times-circle");
        document
          .querySelector(`#grupo__${campo} i`)
          .classList.remove("fa-check-circle");
        document
          .querySelector(`#grupo__${campo} .formulario__input-error`)
          .classList.add("formulario__input-error-activo");
        campos[campo] = false;
      }
    };

    inputs.forEach((input) => {
      input.addEventListener("keyup", validarFormulario);
      input.addEventListener("blur", validarFormulario);
    });

    //este es el primer formulario, el de buscar por mail a un usuario
    formSearch.addEventListener("submit", async (e) => {
      e.preventDefault();
      const mailSearch = e.target.mailSearch.value;

      //se llama a la api con el fetch al endpoint que busca por mail a los usuarios
      const respuesta = await buscarUsuarioPorMail(mailSearch);

      //en la respuesta siempre trae una lista de usuario aunque solo es uno
      //por eso ponemos el [0], que es el primer y unico usuario de la lista,
      //ya que el mail es unico.
      if (respuesta[0]) {
        const usuario = respuesta;

        //guardo todos los datos del usuario buscado por mail en el localstorage
        localStorage.setItem("userId", usuario[0].id);
        localStorage.setItem("userMail", usuario[0].email);
        localStorage.setItem("userNombre", usuario[0].nombre);
        localStorage.setItem("userApellido", usuario[0].apellido);
        localStorage.setItem("userPassword", usuario[0].password);
        localStorage.setItem("userAdmin", usuario[0].admin);

        //hago visible lo que estaba none
        formulario.style.display = "grid";
        containerEliminar.style.display = "flex";

        //pongo en todos los input los valores del usuario buscado
        const nombre = localStorage.getItem("userNombre");
        const nombreEl = document.getElementById("nombre");
        nombreEl.value = nombre;

        const apellido = localStorage.getItem("userApellido");
        const apellidoEl = document.getElementById("apellido");
        apellidoEl.value = apellido;

        const password = localStorage.getItem("userPassword");
        const passwordEl = document.getElementById("password");
        passwordEl.value = password;

        const email = localStorage.getItem("userMail");
        const correoEl = document.getElementById("correo");
        correoEl.value = email;
      } else {
        alert("El usuario con el email ingresado no existe");
      }
    });

    //este el segundo formulario, el del modificar los datos del usuario
    formulario.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (
        campos.apellido &&
        campos.nombre &&
        campos.password &&
        campos.correo
      ) {
        const nombre = e.target.nombre.value;
        const apellido = e.target.apellido.value;
        const email = e.target.correo.value;
        const contrasenia = e.target.password.value;

        //creo un objeto usuario para mandarlo a la api
        const usuario = {
          nombre: nombre,
          apellido: apellido,
          email: email,
          password: contrasenia,
          admin: localStorage.getItem("userAdmin"),
        };

        //me traigo el id del user del localstorage
        const id = localStorage.getItem("userId");

        const respuesta = await modificarUsuario(usuario, id);

        if (respuesta) {
          alert("El nuevo usuario se modifico correctamente");
        } else {
          alert(
            "Se detecto un problema, por favor busque nuevamente el usuario a modificar y envie el formulario nuevamente. (posible error, el mail modificado ya le pertenece a otro usuario)."
          );
        }

        formulario.reset();

        //ponemos los campos vacios del user en el localstorage
        localStorage.setItem("userId", "");
        localStorage.setItem("userMail", "");
        localStorage.setItem("userNombre", "");
        localStorage.setItem("userApellido", "");
        localStorage.setItem("userPassword", "");
        localStorage.setItem("userAdmin", "");

        const mailSearchEl = document.getElementById("mailSearch");
        mailSearchEl.value = "";
      } else {
        alert(
          "No se han modificado los datos, por favor chequear todos los inputs con un click para que validen los datos ingresados, gracias y disculpe las molestias."
        );
      }
    });

    const botonEliminarEl = document.querySelector(".botonEliminar");

    //cuando se hace click en el boton eliminar se eliminara el usuario que se busco
    //mediante el mail
    botonEliminarEl.addEventListener("click", async (e) => {
      e.preventDefault();

      //obtenemos el id del localstorage que se guardo cuando se recupero el usuario
      //mediante el mail
      const userId = localStorage.getItem("userId");

      //se llama la api para borrar el usuario
      const respuesta = await eliminarUsuario(userId);

      if (respuesta) {
        alert("El usuario se elimino correctamente");
      } else {
        alert("Hubo un error y el usuario no se pudo eliminar");
      }

      localStorage.setItem("userMail", "");
      localStorage.setItem("userNombre", "");
      localStorage.setItem("userApellido", "");
      localStorage.setItem("userPassword", "");

      const mailSearchEl = document.getElementById("mailSearch");
      mailSearchEl.value = "";

      const nombre = localStorage.getItem("userNombre");
      const nombreEl = document.getElementById("nombre");
      nombreEl.value = nombre;

      const apellido = localStorage.getItem("userApellido");
      const apellidoEl = document.getElementById("apellido");
      apellidoEl.value = apellido;

      const contrasenia = localStorage.getItem("userContrasenia");
      const passwordEl = document.getElementById("password");
      passwordEl.value = contrasenia;

      const mail = localStorage.getItem("userMail");
      const correoEl = document.getElementById("correo");
      correoEl.value = mail;
    });

    const botonCerrarSesionEl = document.querySelector(".botonCerrarSesion");

    botonCerrarSesionEl.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.setItem("mailUserSesion", "");
      localStorage.setItem("userEsAdmin", "");
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

//Hay que ver si le modificamos el mail o no, si se modifica, vamos a necesitar el id
async function modificarUsuario(usuario, id) {
  const fetchApi = fetch(`http://localhost:8080/api/users/${id}`, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify(usuario),
  });

  try {
    const res = await fetchApi;

    const respuesta = await res.json();

    return respuesta;
  } catch (r) {
    return null;
  }
}

//Hay que ver si le modificamos el mail o no, si se modifica, vamos a necesitar el id
async function buscarUsuarioPorMail(email) {
  const fetchApi = fetch(`http://localhost:8080/api/users/email/${email}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  try {
    const res = await fetchApi;

    const respuesta = await res.json();

    return respuesta;
  } catch (r) {
    return null;
  }
}

//Hay que ver si le modificamos el mail o no, si se modifica, vamos a necesitar el id
async function eliminarUsuario(id) {
  const fetchApi = fetch(`http://localhost:8080/api/users/${id}`, {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  try {
    const res = await fetchApi;

    const respuesta = await res.json();

    if (respuesta) {
      return respuesta;
    } else {
      return null;
    }
  } catch (r) {
    return null;
  }
}

main();
