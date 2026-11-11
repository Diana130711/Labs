// JavaScript Document
// Closes the user session after 3 minutes without activity.
// Used by the zodiac pages: lista.html, agregar.html and editar.html
(function () {
	const LIMITE = 3 * 60 * 1000;   // 3 minutes without movement
	const AVISO = 30 * 1000;        // warns 30 seconds before closing

	// Any of these events counts as activity
	const EVENTOS = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'wheel'];

	let ultimaActividad = Date.now();
	let cerrando = false;

	// Small message shown before the session is closed
	const aviso = document.createElement('div');
	aviso.id = 'avisoInactividad';
	aviso.setAttribute('role', 'alert');
	document.addEventListener('DOMContentLoaded', () => document.body.appendChild(aviso));

	function registrarActividad() {
		ultimaActividad = Date.now();
		aviso.classList.remove('visible');
	}

	EVENTOS.forEach((evento) => {
		window.addEventListener(evento, registrarActividad, { passive: true });
	});

	// Checks every second how long the user has been inactive.
	// Comparing times (instead of a single setTimeout) also works when the tab was in the background.
	setInterval(() => {
		if (cerrando) {
			return;
		}
		const inactivo = Date.now() - ultimaActividad;
		const restante = LIMITE - inactivo;

		if (restante <= 0) {
			cerrando = true;
			aviso.textContent = 'Cerrando la sesión por inactividad...';
			aviso.classList.add('visible');
			salir('inactividad');
		} else if (restante <= AVISO) {
			aviso.textContent = 'Su sesión se cerrará en ' + Math.ceil(restante / 1000) +
				' segundos por inactividad. Mueva el mouse o presione una tecla para continuar.';
			aviso.classList.add('visible');
		}
	}, 1000);
})();
