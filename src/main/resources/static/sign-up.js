function main() {
  const formulario = document.getElementById("formulario");
  const inputs = document.querySelectorAll("#formulario input");

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
        validarPassword2();
        break;
      case "password2":
        validarPassword2();
        break;
      case "correo":
        validarCampo(expresiones.correo, e.target, "correo");
        break;
    }
  };

  //funcion para validar el campo, con las expresiones y los valores del imput
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

  //esto sirve para chequear que la pass y la pass repetida sean iguales
  const validarPassword2 = () => {
    const inputPassword1 = document.getElementById("password");
    const inputPassword2 = document.getElementById("password2");

    if (inputPassword1.value !== inputPassword2.value) {
      document
        .getElementById(`grupo__password2`)
        .classList.add("formulario__grupo-incorrecto");
      document
        .getElementById(`grupo__password2`)
        .classList.remove("formulario__grupo-correcto");
      document
        .querySelector(`#grupo__password2 i`)
        .classList.add("fa-times-circle");
      document
        .querySelector(`#grupo__password2 i`)
        .classList.remove("fa-check-circle");
      document
        .querySelector(`#grupo__password2 .formulario__input-error`)
        .classList.add("formulario__input-error-activo");
      campos["password"] = false;
    } else {
      document
        .getElementById(`grupo__password2`)
        .classList.remove("formulario__grupo-incorrecto");
      document
        .getElementById(`grupo__password2`)
        .classList.add("formulario__grupo-correcto");
      document
        .querySelector(`#grupo__password2 i`)
        .classList.remove("fa-times-circle");
      document
        .querySelector(`#grupo__password2 i`)
        .classList.add("fa-check-circle");
      document
        .querySelector(`#grupo__password2 .formulario__input-error`)
        .classList.remove("formulario__input-error-activo");
      campos["password"] = true;
    }
  };

  //va a recorrer todos los imput y chequear que este validado el dato
  inputs.forEach((input) => {
    input.addEventListener("keyup", validarFormulario);
    input.addEventListener("blur", validarFormulario);
  });

  //se envia el formulario y se chequean todos los datos que existan
  formulario.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (campos.apellido && campos.nombre && campos.password && campos.correo) {
      const nombre = e.target.nombre.value;
      const apellido = e.target.apellido.value;
      const email = e.target.correo.value;
      const password = e.target.password.value;

      //creo un objeto del tipo usuario como no admin predeterminado
      const user = {
        nombre: nombre,
        apellido: apellido,
        email: email,
        password: password,
        admin: "no",
      };

      //hago el llamado a la api con el fetch post de crear usuario
      const respuesta = await crearUsuario(user);

      if (respuesta) {
        formulario.reset();
        alert("El Formulario se envió correctamente.");
        window.location.href = "index.html";
      } else {
        formulario.reset();
        alert("Ocurrio un error en la creación del usuario.");
      }
    } else {
      alert(
        "El Formulario tiene algunos errores y no se envió, asegurese de tener todos los datos ingresados correctamente."
      );
    }
  });
}

//fetch al endpoint para crear usuarios
async function crearUsuario(user) {
  console.log(user);

  const fetchApi = fetch("http://localhost:8080/api/users", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    body: JSON.stringify(user),
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
