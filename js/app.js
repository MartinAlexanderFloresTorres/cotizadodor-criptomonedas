const monedaSelect = document.querySelector("#moneda");
const criptomonedaSelect = document.querySelector("#criptomonedas");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
    moneda: "",
    criptomoneda: "",
};

window.onload = function () {
    ConsultarCriptomonedas();
    monedaSelect.addEventListener("change", leerValor);
    criptomonedaSelect.addEventListener("change", leerValor);
    formulario.addEventListener("submit", validarFormulario);
};
const obtenerCriptomonedas = (criptomonedas) =>
    new Promise((reject) => {
        if (criptomonedas) {
            reject(criptomonedas);
        }
    });

function ConsultarCriptomonedas() {
    const url =
        "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=100&tsym=USD";
    console.log(url);
    fetch(url)
        .then((resultados) => resultados.json())
        .then((respuesta) => obtenerCriptomonedas(respuesta.Data))
        .then((criptomonedas) => llenarSelect(criptomonedas));
}
function llenarSelect(criptomonedas) {
    criptomonedas.forEach((cripto) => {
        const { FullName, Name } = cripto.CoinInfo;
        const option = document.createElement("OPTION");
        option.value = Name;
        option.textContent = FullName;
        criptomonedaSelect.appendChild(option);
    });
}
function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}
function validarFormulario(e) {
    e.preventDefault();
    const { moneda, criptomoneda } = objBusqueda;
    const vacio = [moneda, criptomoneda].some((campo) => campo === "");

    if (vacio) {
        mostrarAlerta("Todo los campos son obligatorios");
    } else {
        consultarApi();
    }
}
function mostrarAlerta(mensage) {
    const alertas = document.querySelector(".error");
    if (!alertas) {
        const alerta = document.createElement("DIV");
        alerta.classList.add("error");
        alerta.textContent = mensage;

        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}
function consultarApi() {
    const { moneda, criptomoneda } = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    mostrarSpiner();
    fetch(url)
        .then((respuesta) => respuesta.json())
        .then((resultado) =>
            mostrarCotizacionHtml(resultado.DISPLAY[criptomoneda][moneda])
        );
}
function mostrarCotizacionHtml(criptomoneda) {
    limpiarHtml();

    const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } =
        criptomoneda;

    const precio = document.createElement("P");
    precio.classList.add("precio");
    precio.innerHTML = `Precio: <span>${PRICE}</span>`;

    const precioAlto = document.createElement("P");
    precioAlto.innerHTML = `Precio mas Alto del dia: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement("P");
    precioBajo.innerHTML = `Precio mas Bajo del dia: <span>${LOWDAY}</span>`;

    const precio24H = document.createElement("P");
    precio24H.innerHTML = `Variacion ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

    const actualicacion = document.createElement("P");
    actualicacion.innerHTML = `Ultima actializacion: <span>${LASTUPDATE}</span>`;

    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(precio24H);
    resultado.appendChild(actualicacion);
}
function limpiarHtml() {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstChild);
    }
}
function mostrarSpiner() {
    limpiarHtml();
    const spiner = document.createElement("div");
    spiner.classList.add("spinner");
    spiner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;
    resultado.appendChild(spiner);
}
