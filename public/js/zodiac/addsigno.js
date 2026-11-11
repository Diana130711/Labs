// JavaScript Document
// Registers a new zodiac sign (data in Firestore, image in Storage)
const txtArchi = document.querySelector('#txtArchi');
const imgPrevia = document.querySelector('#imgPrevia');
const btnLoad = document.querySelector('#btnLoad');

// Preview of the selected image
txtArchi.addEventListener('change', function () {
	const archivo = txtArchi.files[0];
	if (archivo) {
		imgPrevia.src = URL.createObjectURL(archivo);
		imgPrevia.classList.remove('d-none');
	} else {
		imgPrevia.classList.add('d-none');
	}
});

btnLoad.addEventListener('click', function () {
	const datos = leerSigno();
	if (datos == null) {
		return;
	}

	// The file is validated BEFORE reading its name (error fixed from the guide)
	const archivo = txtArchi.files[0];
	if (archivo == null) {
		alert('Debe seleccionar una imagen');
		return;
	}
	if (!imagenValida(archivo)) {
		return;
	}

	btnLoad.disabled = true;
	subirImagen(archivo)
		.then(url => {
			datos.url = url;
			return db.collection("datosZodiaco").add(datos);
		})
		.then(function (docRef) {
			alert("ID del registro: " + docRef.id);
			limpiar();
		})
		.catch(function (FirebaseError) {
			alert("Error al registrar el signo: " + FirebaseError);
		})
		.finally(() => {
			btnLoad.disabled = false;
		});
});

function limpiar() {
	document.querySelector('#txtPosic').value = '';
	document.querySelector('#txtSigno').value = '';
	document.querySelector('#txtRango').value = '';
	document.querySelector('#cboElemento').value = '';
	document.querySelector('#txtAstro').value = '';
	document.querySelector('#txtPiedra').value = '';
	txtArchi.value = '';
	imgPrevia.classList.add('d-none');
	document.querySelector('#txtPosic').focus();
}
