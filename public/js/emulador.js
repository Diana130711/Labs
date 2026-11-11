// JavaScript Document
// When the site runs on the local computer (firebase emulators:start),
// connect the Firebase services to the local emulators instead of the cloud.
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
	const app = firebase.apps[0];
	app.auth().useEmulator('http://127.0.0.1:9099');
	app.firestore().useEmulator('127.0.0.1', 8080);
	app.storage().useEmulator('127.0.0.1', 9199);
	console.log('Usando los emuladores locales de Firebase');
}
