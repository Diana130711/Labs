// JavaScript Document
// Shows the zodiac signs as cards. Clicking a card opens editar.html
var db = firebase.apps[0].firestore();

const tabla = document.querySelector('#tabla');

// Creates one line of data inside the card (icon + label + value)
function lineaDato(icono, etiqueta, valor) {
	const linea = document.createElement('div');
	linea.className = 'datoSigno';

	const icon = document.createElement('i');
	icon.className = 'fa-solid ' + icono;

	const texto = document.createElement('span');
	texto.textContent = ' ' + etiqueta + ': ' + (valor || '—');

	linea.append(icon, texto);
	return linea;
}

// Builds the card of a sign
function crearTarjeta(id, d) {
	const tarjeta = document.createElement('div');
	tarjeta.className = 'divAnuncio m-3' + (d.elemento ? ' borde-' + d.elemento : '');
	tarjeta.tabIndex = 0;
	tarjeta.title = 'Modificar ' + d.signo;

	const bloque = document.createElement('div');
	bloque.className = 'imgBlock';
	const img = document.createElement('img');
	img.src = d.url;
	img.alt = d.signo;
	bloque.appendChild(img);

	const nombre = document.createElement('div');
	nombre.className = 'nombreSigno';
	nombre.textContent = d.signo;

	const rango = document.createElement('div');
	rango.className = 'rangoSigno';
	rango.textContent = d.rango;

	const badge = document.createElement('span');
	badge.className = 'badgeElemento elem-' + (d.elemento || 'Aire');
	badge.textContent = d.elemento || 'Sin elemento';

	const editar = document.createElement('div');
	editar.className = 'editarSigno';
	editar.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Modificar';

	tarjeta.append(
		bloque, nombre, rango, badge,
		lineaDato('fa-sun', 'Astro', d.astro),
		lineaDato('fa-gem', 'Piedra', d.piedra),
		editar
	);

	// Opens the edit page with the id of the selected sign
	const abrir = () => { document.location.href = 'editar.html?id=' + encodeURIComponent(id); };
	tarjeta.addEventListener('click', abrir);
	tarjeta.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') {
			abrir();
		}
	});
	return tarjeta;
}

db.collection("datosZodiaco").orderBy('posic', 'asc').get().then(function (query) {
	tabla.innerHTML = "";
	if (query.empty) {
		tabla.innerHTML = '<p class="text-muted">No hay signos registrados. Use Horóscopo / Agregar Signo.</p>';
		return;
	}
	query.forEach(function (doc) {
		tabla.appendChild(crearTarjeta(doc.id, doc.data()));
	});
}).catch(function (error) {
	tabla.textContent = 'Error al cargar los signos: ' + error.message;
});
