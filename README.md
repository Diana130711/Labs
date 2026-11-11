# Zodiaco – Práctica Firebase (ITI-621)

Sitio web con Firebase Hosting, Authentication, Firestore y Storage.

## Qué incluye la práctica

| # | Requisito | Dónde está |
|---|-----------|------------|
| 1 | Registro de usuario con **fecha de creación** y **último acceso** | `registrar.html`, `js/users/signup.js`, `js/users/login.js`, `js/users/inicio.js`, `usuarios.html`, `firestore.rules` (colección `datosUsuarios`) |
| 2 | Signo con **elemento** (Fuego/Tierra/Aire/Agua), **astro** y **piedra preciosa** | `agregar.html`, `js/zodiac/comun.js`, `js/zodiac/addsigno.js`, `firestore.rules` (función `signoValido`) |
| 3 | La tarjeta muestra los datos nuevos (CSS) | `js/zodiac/lstzodiaco.js`, `css/style.css` (`.badgeElemento`, `.elem-*`, `.borde-*`, `.datoSigno`) |
| 4 | Al hacer clic en una tarjeta se abre la edición y las reglas permiten modificar | `lista.html` → `editar.html?id=…`, `js/zodiac/editsigno.js`, `firestore.rules` (`allow update`) |
| 5 | Cierre de sesión tras **3 minutos sin actividad** | `js/inactividad.js` (en `lista`, `agregar` y `editar`); aviso 30 s antes |

Extra: el botón **"Cargar los 12 signos"** en `agregar.html` registra los 12 signos con sus imágenes (`public/img/zodiaco`).

## Estructura

```
zodiaco/
├── firebase.json          configuración de hosting, reglas y emuladores
├── .firebaserc            ID del proyecto Firebase (diana-2bb4f)
├── firestore.rules        reglas de la base de datos
├── storage.rules          reglas de las imágenes
├── firestore.indexes.json
├── public/                el sitio (html, css, js, img)
└── tests/                 pruebas automáticas de las reglas (opcional)
```

## Conectar con Firebase (paso a paso)

Proyecto Firebase: **diana-2bb4f** (ya configurado en `.firebaserc`).

1. En https://console.firebase.google.com, proyecto **diana**:
   - **Authentication** → Método de acceso → **Correo electrónico/contraseña** habilitado. 📸 Captura 1
   - **Firestore Database** → Crear base de datos → Estándar, (default), **nam5**, modo **producción**. 📸 Captura 2
   - Plan **Blaze** (requerido por Storage). 📸 Captura 3
   - **Storage** → Comenzar → **US-CENTRAL1**, modo **producción**. 📸 Captura 4
2. En la terminal de VS Code, dentro de la carpeta `zodiaco`:
   ```
   npm install -g firebase-tools
   firebase login
   firebase apps:create web zodiaco-web
   firebase deploy
   ```
   - `firebase apps:create` registra la app web (necesaria para `/__/firebase/init.js`).
   - Si Storage todavía no está activo: `firebase deploy --only hosting,firestore`
   - 📸 Captura 5: la terminal con **Hosting URL: https://diana-2bb4f.web.app**
3. Abra la Hosting URL y pruebe:
   - **Registrar nuevo usuario**: se muestra la fecha de creación. 📸 Captura 6
   - Inicio: "Cuenta creada" y "Último acceso". 📸 Captura 7
   - **Lista de usuarios**: tabla con las dos fechas. 📸 Captura 8
   - **Agregar Signo** → "Cargar los 12 signos", o agregue uno a mano con elemento, astro y piedra. 📸 Captura 9
   - **Listar Signos**: tarjetas con el color del elemento, el astro y la piedra. 📸 Captura 10
   - Clic en una tarjeta → editar → Guardar cambios. 📸 Captura 11 (antes y después)
   - 3 minutos sin tocar nada en Listar Signos: aparece el aviso y luego vuelve al login con el mensaje de inactividad. 📸 Captura 12
   - Consola → Firestore: `datosUsuarios` y `datosZodiaco` con los campos nuevos; Storage: carpeta `zodiaco/` con las imágenes. 📸 Captura 13

> En `localhost` el sitio usa los emuladores automáticamente (`js/emulador.js`).
> Para probar local: `firebase emulators:start` (requiere Java) y abra http://127.0.0.1:5000

## Pruebas de reglas (opcional)

Necesita Java instalado.
```
cd tests
npm install
npm test
```
Ejecuta unas 31 pruebas: fechas del servidor, elemento válido, solo usuarios autenticados, imágenes de hasta 5 MB, etc.

## Subir a GitHub

```
git init
git add .
git commit -m "Práctica Firebase Zodiaco"
git branch -M main
git remote add origin https://github.com/SU_USUARIO/zodiaco-firebase.git
git push -u origin main
```
Después, en GitHub → Settings → Collaborators → agregue al profesor.
