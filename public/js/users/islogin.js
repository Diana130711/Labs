// JavaScript Document
// validate that user is log-in
var auth = firebase.apps[0].auth();

// Sends the user to login.html when there is no active session.
// Returns a promise with the authenticated user.
function validar() {
	return new Promise((resolve) => {
		const detener = auth.onAuthStateChanged((user) => {
			detener();
			if (user) {
				resolve(user);
			} else {
				document.location.href = 'login.html';
			}
		});
	});
}

// close current session
function salir(motivo) {
	auth.signOut().then(() => {
		document.location.href = motivo ? 'login.html?motivo=' + motivo : 'login.html';
	}).catch((error) => {
		alert('Error al cerrar la sesión: ' + error.message);
	});
}

// Formats a Firestore Timestamp (or a Date) as a readable date
function formatoFecha(valor) {
	if (!valor) {
		return 'Sin registro';
	}
	const fecha = (typeof valor.toDate === 'function') ? valor.toDate() : new Date(valor);
	return fecha.toLocaleString('es-CR', {
		year: 'numeric', month: 'short', day: '2-digit',
		hour: '2-digit', minute: '2-digit'
	});
}
