// JavaScript Document
// Shows the data of the authenticated user on the home page
var db = firebase.apps[0].firestore();

const bienvenida = document.querySelector('#bienvenida');

validar().then((user) => {
	db.collection("datosUsuarios").where('idemp', '==', user.uid).get()
		.then((query) => {
			if (query.empty) {
				bienvenida.textContent = 'Sesión iniciada como ' + user.email;
				return;
			}
			const datos = query.docs[0].data();
			bienvenida.innerHTML = '';

			const nombre = document.createElement('h5');
			nombre.textContent = 'Hola, ' + datos.usuario;

			const correo = document.createElement('div');
			correo.textContent = datos.email;

			const creacion = document.createElement('div');
			creacion.textContent = 'Cuenta creada: ' + formatoFecha(datos.fechaCreacion);

			const acceso = document.createElement('div');
			acceso.textContent = 'Último acceso: ' + formatoFecha(datos.ultAcceso);

			bienvenida.append(nombre, correo, creacion, acceso);
		})
		.catch((error) => {
			bienvenida.textContent = 'No se pudieron cargar los datos del usuario: ' + error.message;
		});
});
