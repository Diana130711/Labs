import fs from 'node:fs';
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing';
import { doc, collection, addDoc, setDoc, updateDoc, getDoc, getDocs, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { ref, uploadBytes, getBytes } from 'firebase/storage';

const P = process.argv[2];
const env = await initializeTestEnvironment({
	projectId: 'demo-zodiaco',
	firestore: { rules: fs.readFileSync(P + '/firestore.rules', 'utf8'), host: '127.0.0.1', port: 8080 },
	storage: { rules: fs.readFileSync(P + '/storage.rules', 'utf8'), host: '127.0.0.1', port: 9199 },
});

let ok = 0, bad = 0;
async function t(name, p) {
	try { await p; console.log('PASS', name); ok++; }
	catch (e) { console.log('FAIL', name, '->', e.message); bad++; }
}

const ana = env.authenticatedContext('ana');
const beto = env.authenticatedContext('beto');
const anon = env.unauthenticatedContext();
const adb = ana.firestore(), bdb = beto.firestore(), xdb = anon.firestore();

// ---------- datosUsuarios ----------
const userOk = { idemp: 'ana', usuario: 'Ana', email: 'ana@x.com', fechaCreacion: serverTimestamp(), ultAcceso: serverTimestamp() };
await t('crea su usuario con fechas del servidor', assertSucceeds(setDoc(doc(adb, 'datosUsuarios/u1'), userOk)));
await t('no crea usuario sin fechaCreacion', assertFails(setDoc(doc(adb, 'datosUsuarios/u2'), { idemp: 'ana', usuario: 'Ana', email: 'a', ultAcceso: serverTimestamp() })));
await t('no crea usuario con fecha falsa del cliente', assertFails(setDoc(doc(adb, 'datosUsuarios/u3'), { ...userOk, fechaCreacion: Timestamp.fromDate(new Date('2000-01-01')) })));
await t('no crea usuario a nombre de otro uid', assertFails(setDoc(doc(adb, 'datosUsuarios/u4'), { ...userOk, idemp: 'beto' })));
await t('no crea usuario sin sesion', assertFails(setDoc(doc(xdb, 'datosUsuarios/u5'), userOk)));
await t('actualiza su ultimo acceso', assertSucceeds(updateDoc(doc(adb, 'datosUsuarios/u1'), { ultAcceso: serverTimestamp() })));
await t('no cambia su fechaCreacion', assertFails(updateDoc(doc(adb, 'datosUsuarios/u1'), { fechaCreacion: serverTimestamp() })));
await t('no cambia su nombre al actualizar acceso', assertFails(updateDoc(doc(adb, 'datosUsuarios/u1'), { ultAcceso: serverTimestamp(), usuario: 'Otro' })));
await t('otro usuario no actualiza mi acceso', assertFails(updateDoc(doc(bdb, 'datosUsuarios/u1'), { ultAcceso: serverTimestamp() })));
await t('usuario autenticado lee usuarios', assertSucceeds(getDocs(collection(bdb, 'datosUsuarios'))));
await t('anonimo no lee usuarios', assertFails(getDocs(collection(xdb, 'datosUsuarios'))));
await t('nadie borra usuarios', assertFails(deleteDoc(doc(adb, 'datosUsuarios/u1'))));

// Users created with the original guide (no dates) can still log in
await env.withSecurityRulesDisabled(async (c) => {
	await setDoc(doc(c.firestore(), 'datosUsuarios/viejo'), { idemp: 'ana', usuario: 'Ana', email: 'ana@x.com' });
});
await t('usuario viejo (sin fechas) registra ultimo acceso', assertSucceeds(updateDoc(doc(adb, 'datosUsuarios/viejo'), { ultAcceso: serverTimestamp() })));

// ---------- datosZodiaco ----------
const signo = { posic: 3, signo: 'Aries', rango: 'Mar/21 - Abr/19', elemento: 'Fuego', astro: 'Marte', piedra: 'Diamante', url: 'https://x/aries.png' };
await t('crea signo completo', assertSucceeds(setDoc(doc(adb, 'datosZodiaco/s1'), signo)));
await t('anonimo no crea signo', assertFails(setDoc(doc(xdb, 'datosZodiaco/s2'), signo)));
await t('no crea signo con elemento invalido', assertFails(setDoc(doc(adb, 'datosZodiaco/s3'), { ...signo, elemento: 'Rayo' })));
await t('no crea signo sin astro', assertFails(setDoc(doc(adb, 'datosZodiaco/s4'), (({ astro, ...r }) => r)(signo))));
await t('no crea signo sin piedra', assertFails(setDoc(doc(adb, 'datosZodiaco/s5'), (({ piedra, ...r }) => r)(signo))));
await t('no crea signo con posicion 13', assertFails(setDoc(doc(adb, 'datosZodiaco/s6'), { ...signo, posic: 13 })));
await t('no crea signo con posicion texto', assertFails(setDoc(doc(adb, 'datosZodiaco/s7'), { ...signo, posic: '3' })));
await t('no crea signo con campo extra', assertFails(setDoc(doc(adb, 'datosZodiaco/s8'), { ...signo, hack: true })));
await t('anonimo lee signos', assertSucceeds(getDoc(doc(xdb, 'datosZodiaco/s1'))));
await t('modifica signo (set completo como editsigno.js)', assertSucceeds(setDoc(doc(bdb, 'datosZodiaco/s1'), { ...signo, astro: 'Plutón', piedra: 'Rubí' })));
await t('anonimo no modifica signo', assertFails(setDoc(doc(xdb, 'datosZodiaco/s1'), signo)));
await t('no modifica con elemento invalido', assertFails(setDoc(doc(adb, 'datosZodiaco/s1'), { ...signo, elemento: 'fuego' })));
await t('nadie borra signos', assertFails(deleteDoc(doc(adb, 'datosZodiaco/s1'))));

// ---------- Storage ----------
const png = new Uint8Array([137, 80, 78, 71]);
await t('sube imagen autenticado', assertSucceeds(uploadBytes(ref(ana.storage(), 'zodiaco/aries.png'), png, { contentType: 'image/png' })));
await t('anonimo no sube imagen', assertFails(uploadBytes(ref(anon.storage(), 'zodiaco/x.png'), png, { contentType: 'image/png' })));
await t('no sube archivo que no es imagen', assertFails(uploadBytes(ref(ana.storage(), 'zodiaco/x.txt'), png, { contentType: 'text/plain' })));
await t('no sube fuera de zodiaco/', assertFails(uploadBytes(ref(ana.storage(), 'otra/x.png'), png, { contentType: 'image/png' })));
await t('anonimo lee imagen', assertSucceeds(getBytes(ref(anon.storage(), 'zodiaco/aries.png'))));

console.log(`\n${ok} pasaron, ${bad} fallaron`);
await env.cleanup();
process.exit(bad ? 1 : 0);
