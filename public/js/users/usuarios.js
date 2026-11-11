// JavaScript Document
// Lists the registered users with their creation and last access dates
var db = firebase.apps[0].firestore();

const tablaUsuarios = document.querySelector('#tablaUsuarios');

validar().then(() => {
	db.collection("datosUsuarios").get()
		.then((query) => {
			tablaUsuarios.innerHTML = '';
			if (query.empty) {
				tablaUsuarios.innerHTML = '<tr><td colspan="4" class="text-muted">No hay usuarios registrados.</td></tr>';
				return;
			}
			query.forEach((doc) => {
				const d = doc.data();
				const fila = document.createElement('tr');
				[d.usuario, d.email, formatoFecha(d.fechaCreacion), formatoFecha(d.ultAcceso)].forEach((valor) => {
					const celda = document.createElement('td');
					celda.textContent = valor;
					fila.appendChild(celda);
				});
				tablaUsuarios.appendChild(fila);
			});
		})
		.catch((error) => {
			tablaUsuarios.innerHTML = '';
			const fila = document.createElement('tr');
			const celda = document.createElement('td');
			celda.colSpan = 4;
			celda.textContent = 'Error al cargar los usuarios: ' + error.message;
			fila.appendChild(celda);
			tablaUsuarios.appendChild(fila);
		});
});
