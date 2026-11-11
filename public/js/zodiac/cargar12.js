// JavaScript Document
// Loads the 12 zodiac signs at once, using the images published in img/zodiaco
const SIGNOS_BASE = [
	{ posic: 1,  signo: 'Acuario',     rango: 'Ene/20 - Feb/18', elemento: 'Aire',   astro: 'Urano',    piedra: 'Amatista',   archivo: '01_Acuario.png' },
	{ posic: 2,  signo: 'Piscis',      rango: 'Feb/19 - Mar/20', elemento: 'Agua',   astro: 'Neptuno',  piedra: 'Aguamarina', archivo: '02_Pisis.png' },
	{ posic: 3,  signo: 'Aries',       rango: 'Mar/21 - Abr/19', elemento: 'Fuego',  astro: 'Marte',    piedra: 'Diamante',   archivo: '03_Aries.png' },
	{ posic: 4,  signo: 'Tauro',       rango: 'Abr/20 - May/20', elemento: 'Tierra', astro: 'Venus',    piedra: 'Esmeralda',  archivo: '04_Tauro.png' },
	{ posic: 5,  signo: 'Géminis',     rango: 'May/21 - Jun/20', elemento: 'Aire',   astro: 'Mercurio', piedra: 'Ágata',      archivo: '05_Geminis.png' },
	{ posic: 6,  signo: 'Cáncer',      rango: 'Jun/21 - Jul/22', elemento: 'Agua',   astro: 'Luna',     piedra: 'Perla',      archivo: '06_Cancer.png' },
	{ posic: 7,  signo: 'Leo',         rango: 'Jul/23 - Ago/22', elemento: 'Fuego',  astro: 'Sol',      piedra: 'Rubí',       archivo: '07_Leo.png' },
	{ posic: 8,  signo: 'Virgo',       rango: 'Ago/23 - Sep/22', elemento: 'Tierra', astro: 'Mercurio', piedra: 'Zafiro',     archivo: '08_Virgo.png' },
	{ posic: 9,  signo: 'Libra',       rango: 'Sep/23 - Oct/22', elemento: 'Aire',   astro: 'Venus',    piedra: 'Ópalo',      archivo: '09_Libra.png' },
	{ posic: 10, signo: 'Escorpio',    rango: 'Oct/23 - Nov/21', elemento: 'Agua',   astro: 'Plutón',   piedra: 'Topacio',    archivo: '10_Escorpio.png' },
	{ posic: 11, signo: 'Sagitario',   rango: 'Nov/22 - Dic/21', elemento: 'Fuego',  astro: 'Júpiter',  piedra: 'Turquesa',   archivo: '11_Sagitario.png' },
	{ posic: 12, signo: 'Capricornio', rango: 'Dic/22 - Ene/19', elemento: 'Tierra', astro: 'Saturno',  piedra: 'Granate',    archivo: '12_Capricornio.png' }
];

const btnCargar12 = document.querySelector('#btnCargar12');
const estadoCarga = document.querySelector('#estadoCarga');

btnCargar12.addEventListener('click', async function () {
	if (!confirm('¿Registrar los 12 signos con sus imágenes?')) {
		return;
	}
	btnCargar12.disabled = true;
	estadoCarga.textContent = 'Revisando los signos existentes...';

	try {
		// Positions that are already registered are skipped
		const existentes = await db.collection("datosZodiaco").get();
		const usadas = new Set(existentes.docs.map(d => d.data().posic));

		let agregados = 0;
		for (const s of SIGNOS_BASE) {
			if (usadas.has(s.posic)) {
				continue;
			}
			estadoCarga.textContent = 'Cargando ' + s.signo + '...';

			// Reads the published image and uploads it to Storage
			const respuesta = await fetch('img/zodiaco/' + s.archivo);
			if (!respuesta.ok) {
				throw new Error('No se encontró la imagen ' + s.archivo);
			}
			const blob = await respuesta.blob();
			const archivo = new File([blob], s.archivo, { type: blob.type || 'image/png' });
			const url = await subirImagen(archivo);

			await db.collection("datosZodiaco").add({
				posic: s.posic, signo: s.signo, rango: s.rango,
				elemento: s.elemento, astro: s.astro, piedra: s.piedra,
				url: url
			});
			agregados++;
		}
		estadoCarga.textContent = 'Listo: ' + agregados + ' signo(s) agregado(s).';
	} catch (error) {
		estadoCarga.textContent = 'Error durante la carga: ' + error.message;
	} finally {
		btnCargar12.disabled = false;
	}
});
