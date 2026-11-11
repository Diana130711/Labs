// JavaScript Document
// create local database firestore variable
var db = firebase.apps[0].firestore();

// create local from webpage inputs
const txtNombre = document.querySelector('#txtNombre');
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');
const txtFechaCreacion = document.querySelector('#txtFechaCreacion');

// create local insert button
const btnInsUser = document.querySelector('#btnInsUser');

// Shows the date the account will be created with
txtFechaCreacion.value = formatoFecha(new Date());

// assign button listener
btnInsUser.addEventListener('click', function () {
	if (txtNombre.value.trim() === '' || txtEmail.value.trim() === '' || txtContra.value === '') {
		alert('Debe completar el nombre, el correo y la contraseña');
		return;
	}

	btnInsUser.disabled = true;
	auth.createUserWithEmailAndPassword(txtEmail.value.trim(), txtContra.value)
		.then((userCredential) => {
			const user = userCredential.user;
			// Both dates use the server time, so they cannot be falsified from the browser
			const ahora = firebase.firestore.FieldValue.serverTimestamp();
			return db.collection("datosUsuarios").add({
				"idemp": user.uid,
				"usuario": txtNombre.value.trim(),
				"email": user.email,
				"fechaCreacion": ahora,
				"ultAcceso": ahora
			}).then(function () {
				alert("Usuario agregado satisfactoriamente");
				limpiar();
				document.location.href = 'index.html';
			}).catch(function (FirebaseError) {
				alert("Error al registrar datos del usuario. " + FirebaseError);
			});
		})
		.catch((error) => {
			alert("Error al agregar el nuevo usuario: " + error.message);
		})
		.finally(() => {
			btnInsUser.disabled = false;
		});
});

function limpiar() {
	txtNombre.value = '';
	txtEmail.value = '';
	txtContra.value = '';
	txtFechaCreacion.value = formatoFecha(new Date());
	txtNombre.focus();
}
