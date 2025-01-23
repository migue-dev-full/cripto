// Selectores
const moneda = document.querySelector('#moneda');
const selectCripto = document.querySelector('#criptomonedas');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

// crear poder guardar

const objBusqueda = {
	moneda: '',
	criptomoneda: ''
}

// Eventos

document.addEventListener('DOMContentLoaded', () => {
	consultarCripto();

	moneda.addEventListener('input', obtenerValores);
	selectCripto.addEventListener('change', obtenerValores);
	formulario.addEventListener('submit', Cotizar);

})

const obtenerCripto = criptomoneda => new Promise(resolve => {
	resolve(criptomoneda);
})

function consultarCripto() {
	//url toplist del market cap API
	const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

	fetch(url)
		.then(respuesta => respuesta.json()) //
		.then(resultado => obtenerCripto(resultado.Data))
		.then(criptomonedas => selectCriptomonedas(criptomonedas))
		.catch(error => console.log(error))

}

function obtenerValores(e) {

	objBusqueda[e.target.name] = e.target.value;
	console.log(objBusqueda)

}

function selectCriptomonedas(criptomonedas) {
	criptomonedas.forEach(cripto => {
		const { Name, FullName } = cripto.CoinInfo;
		const option = document.createElement('option');
		option.textContent = FullName;
		option.value = Name;
		// insertar en el HTML
		selectCripto.appendChild(option)
	});
}

function Cotizar(e) {
	e.preventDefault();

	// consutar valores guardados en el objeto
	const { moneda, criptomoneda } = objBusqueda;

	if (moneda === '' || criptomoneda === '') {
		//validar que no sean vacios
		//console.log('Los datos son obligatorios')
		mostrarError('Los datos son obligatorios')
	}

	consultaApi();
}



function mostrarError(mensaje) {
	const divMensaje = document.createElement('div');
	divMensaje.classList.add('error');

	// mostrar mensaje
	divMensaje.textContent = mensaje;

	// INSERTAR EN HTML
	formulario.appendChild(divMensaje)


	setTimeout(() => {
		divMensaje.remove();
	}, 5000);
}

function consultaApi() {

	
	const { moneda, criptomoneda } = objBusqueda;

	//url 
	const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

  // mostrarSpinner();

	fetch(url) 
		.then(respuesta => respuesta.json())
	 .then(Cotizar=>{
			mostrarResultado (Cotizar.DISPLAY[criptomoneda][moneda])
		})
		

}

function mostrarResultado(cotizacion){
limpiarHTML();

	const {CHANGEPCT24HOUR,PRICE,HIGHDAY,LOWDAY,LASTUPDATE} = cotizacion;

	const ult24horas = document.createElement('p');
	ult24horas.innerHTML = `<p>Variacion ultimas 24 hora: ${CHANGEPCT24HOUR}</p>`

	const precio = document.createElement('p');
	precio.innerHTML = `<p>El precio es: ${PRICE}</p>`

	const precioAlto = document.createElement('p');
	precioAlto.innerHTML = `<p>El precio mas alto del dia es: ${HIGHDAY}</p>`

	const precioBajo = document.createElement('p');
	precioBajo.innerHTML = `<p>El precio mas bajo del dia es: ${LOWDAY}</p>`

		const ultAct = document.createElement('p');
	 ultAct.innerHTML = `<p>Ultima actualizacion del dia es: ${LASTUPDATE}</p>`

	resultado.appendChild(ult24horas)
	resultado.appendChild(precio)
	resultado.appendChild(precioAlto)
	resultado.appendChild(precioBajo)
	resultado.appendChild(ultAct)

	formulario.appendChild(resultado)
}
function limpiarHTML(){
	while(resultado.firstChild){
		resultado.removeChild(firstChild);
	}
}

// function mostrarSpinner(){
// 	const spinner = document.createElement('div');
// 	spinner.classList.add('spinner');

// 	spinner.innerHTML = `
// 	<div class=bounce1></div>
// 	<div class=bounce2></div>
// 	<div class=bounce3></div>
// 	`

// 	//mostrar spinner 
// 	resultado.appendChild(spinner)
// }