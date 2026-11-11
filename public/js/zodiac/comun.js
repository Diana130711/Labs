// JavaScript Document
// Shared functions for the zodiac pages (agregar.html and editar.html)
var db = firebase.apps[0].firestore();
var container = firebase.apps[0].storage().ref();

const ELEMENTOS = ['Fuego', 'Tierra', 'Aire', 'Agua'];
const MAX_IMAGEN = 5 * 1024 * 1024;   // 5 MB, same limit as storage.rules

// Reads the sign fields of the form and validates them.
// Returns the object to store, or null when something is missing.
function leerSigno() {
	const datos = {
		"posic": parseInt(document.querySelector('#txtPosic').value, 10),
		"signo": document.querySelector('#txtSigno').value.trim(),
		"rango": document.querySelector('#txtRango').value.trim(),
		"elemento": document.querySelector('#cboElemento').value,
		"astro": document.querySelector('#txtAstro').value.trim(),
		"piedra": document.querySelector('#txtPiedra').value.trim()
	};

	if (isNaN(datos.posic) || datos.posic < 1 || datos.posic > 12) {
		alert('La posición debe ser un número entre 1 y 12');
		return null;
	}
	if (!datos.signo || !datos.rango || !datos.astro || !datos.piedra) {
		alert('Debe completar el signo, el rango, el astro y la piedra');
		return null;
	}
	if (!ELEMENTOS.includes(datos.elemento)) {
		alert('Debe seleccionar el elemento del signo');
		return null;
	}
	return datos;
}

// Fills the form with the data of a sign
function mostrarSigno(datos) {
	document.querySelector('#txtPosic').value = datos.posic;
	document.querySelector('#txtSigno').value = datos.signo || '';
	document.querySelector('#txtRango').value = datos.rango || '';
	document.querySelector('#cboElemento').value = datos.elemento || '';
	document.querySelector('#txtAstro').value = datos.astro || '';
	document.querySelector('#txtPiedra').value = datos.piedra || '';
}

// Validates the selected image file
function imagenValida(archivo) {
	if (!archivo.type.startsWith('image/')) {
		alert('El archivo debe ser una imagen');
		return false;
	}
	if (archivo.size > MAX_IMAGEN) {
		alert('La imagen no puede pesar más de 5 MB');
		return false;
	}
	return true;
}

// Uploads an image to Storage (folder zodiaco) and returns its download URL
function subirImagen(archivo) {
	const metadata = {
		contentType: archivo.type
	};
	return container.child('zodiaco/' + archivo.name).put(archivo, metadata)
		.then(snapshot => snapshot.ref.getDownloadURL());
}
