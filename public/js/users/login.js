// JavaScript Document
// create local database firestore variable
var db = firebase.apps[0].firestore();

// create local from webpage inputs
const txtEmail = document.querySelector('#txtEmail');
const txtContra = document.querySelector('#txtContra');
const mensaje = document.querySelector('#mensaje');

// create local insert button
const btnLogin = document.querySelector('#btnLogin');

// Shows why the session was closed (for example, after 3 minutes of inactivity)
const motivo = new URLSearchParams(location.search).get('motivo');
if (motivo === 'inactividad') {
	mensaje.textContent = 'Su sesión se cerró por inactividad (3 minutos sin movimiento). Ingrese de nuevo.';
	mensaje.classList.remove('d-none');
}

// Enter key also logs in
txtContra.addEventListener('keydown', (e) => {
	if (e.key === 'Enter') {
		btnLogin.click();
	}
});

// assign button listener
btnLogin.addEventListener('click', function () {
	btnLogin.disabled = true;
	auth.signInWithEmailAndPassword(txtEmail.value.trim(), txtContra.value)
		.then((userCredential) => {
			const user = userCredential.user;
			// Updates the last access date with the server time
			return db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
				.then(function (docRef) {
					const cambios = [];
					docRef.forEach(function (doc) {
						cambios.push(doc.ref.update({
							ultAcceso: firebase.firestore.FieldValue.serverTimestamp()
						}));
					});
					return Promise.all(cambios);
				})
				.then(function () {
					document.location.href = 'index.html';
				})
				.catch(function (FirebaseError) {
					alert("Error al actualizar el último acceso: " + FirebaseError);
					document.location.href = 'index.html';
				});
		})
		.catch((error) => {
			alert("Error user access: " + error.message);
		})
		.finally(() => {
			btnLogin.disabled = false;
		});
});
