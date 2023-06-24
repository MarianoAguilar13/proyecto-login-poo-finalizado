async function main() {
  const dataGoogle = await buscarDatosGoogle();

  console.log(dataGoogle);

  localStorage.setItem("mailUserSesion", dataGoogle.email);
  localStorage.setItem("nombreUserSesion", dataGoogle.nombre);
  localStorage.setItem("userEsAdmin", "no");

  window.location.href = "index.html";
}

async function buscarDatosGoogle() {
  const fetchApi = fetch(`http://localhost:8080/api/users/data-google`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  const res = await fetchApi;

  const respuesta = await res.json();

  console.log("soy la respuesta en el endpoint: ", respuesta);

  return respuesta;
}

main();
