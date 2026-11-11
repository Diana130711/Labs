// JavaScript Document
// Edits the data of the sign selected in lista.html (editar.html?id=...)
const idSigno = new URLSearchParams(location.search).get('id');

const cargando = document.querySelector('#cargando');
const formEditar = document.querySelector('#formEditar');
const imgActual = document.querySelector('#imgActual');
const txtArchi = document.querySelector('#txtArchi');
const btnGuardar = document.querySelector('#btnGuardar');

let urlActual = '';

if (!idSigno) {
	document.location.href = 'lista.html';
} else {
	// Loads the data of the selected sign
	db.collection("datosZodiaco").doc(idSigno).get()
		.then((doc) => {
			if (!doc.exists) {
				alert('El signo seleccionado no existe');
				document.location.href = 'lista.html';
				return;
			}
			const datos = doc.data();
			urlActual = datos.url;
			imgActual.src = datos.url;
			imgActual.alt = datos.signo;
			mostrarSigno(datos);
			cargando.classList.add('d-none');
			formEditar.classList.remove('d-none');
		})
		.catch((error) => {
			cargando.textContent = 'Error al cargar el signo: ' + error.message;
		});
}

// Preview of the new image
txtArchi.addEventListener('change', function () {
	const archivo = txtArchi.files[0];
	imgActual.src = archivo ? URL.createObjectURL(archivo) : urlActual;
});

btnGuardar.addEventListener('click', function () {
	const datos = leerSigno();
	if (datos == null) {
		return;
	}

	const archivo = txtArchi.files[0];
	if (archivo && !imagenValida(archivo)) {
		return;
	}

	btnGuardar.disabled = true;

	// Uploads a new image only when one was selected
	const obtenerUrl = archivo ? subirImagen(archivo) : Promise.resolve(urlActual);

	obtenerUrl
		.then((url) => {
			datos.url = url;
			return db.collection("datosZodiaco").doc(idSigno).set(datos);
		})
		.then(() => {
			alert('Signo modificado correctamente');
			document.location.href = 'lista.html';
		})
		.catch((error) => {
			alert('Error al modificar el signo: ' + error.message);
		})
		.finally(() => {
			btnGuardar.disabled = false;
		});
});
