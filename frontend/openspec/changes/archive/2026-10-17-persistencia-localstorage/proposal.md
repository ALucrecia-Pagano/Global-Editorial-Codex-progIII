# Proposal

## Why

Hasta C-04 los datos (libros, editoriales, géneros, autores, clientes) viven solo en memoria al cargar la página: al recargar, se pierden y vuelven los seed iniciales. No hay forma de conservar altas, ventas u otros cambios hechos por el usuario entre sesiones. Se necesita un repositorio único de `localStorage` para `libreria.libros`, `libreria.clientes` y `libreria.ventas`, con comportamiento de arranque (seed si faltan claves; usar lo guardado si ya existen) y un único punto de acceso a `localStorage`.

## What Changes

- Crear `js/storage.js` con funciones `cargar(clave)` y `guardar(clave, datos)` que accedan a `localStorage` con `try/catch` y lista blanca de claves permitidas.
- Al iniciar la aplicación: si `libreria.libros`, `libreria.clientes` o `libreria.ventas` están ausentes, cargar los seed iniciales y guardarlos; si ya existen, usar lo guardado sin mezclar con seed.
- Todas las altas/ventas posteriores llaman al repositorio (único punto de acceso a `localStorage`).
- Documentar claves y estructura de `localStorage` en el README.
- Decisión documentada: qué hacer si el JSON está corrupto (volver al seed y avisar con mensaje).

## Capabilities

### New Capabilities

- `persistencia-localstorage`: repositorio de `localStorage` para datos de dominio (libros, clientes, ventas) con carga/guardado protegido, comportamiento de arranque con seed y punto único de acceso.

### Modified Capabilities

- (Ninguno: la persistencia es una capa de infraestructura; no cambia los requisitos de comportamiento de `catalogo-dinamico`, `filtro-catalogo` ni otras specs existentes.)

## Impact

- `js/storage.js` (nuevo): módulo de acceso a `localStorage`.
- `js/app.js` o `js/data.js`: al arranque, se llamará al repositorio para cargar datos o inicializar seed.
- `README.md`: documentar claves `libreria.libros`, `libreria.clientes`, `libreria.ventas` y sus límites (navegador, perfil, ubicación de apertura).
- No se agregan ids ni names nuevos al contrato `id`/`name`.

Fuera de alcance:
- Altas de libros y clientes con validación (C-06, C-07).
- Ventas, confirmación e historial (C-08 a C-10).
- Edición o eliminación de registros (RN-FO-05 lo prohíbe).
- UI de preferencias de usuario (tema/sidebar ya persisten en C-02 bajo `libreria.preferencias.*`).

Ejercicio de la consigna cubierto: Ejercicio 6 — Persistencia en `localStorage`.
