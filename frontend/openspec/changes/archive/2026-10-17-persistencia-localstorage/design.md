# Design

## Context

C-04 implementó `js/data.js` con arrays en memoria (`libros`, `editoriales`, `generos`, `autores`, `clientes`) y render dinámico. Esos datos se pierden al recargar la página. C-05 añade un repositorio de `localStorage` para `libreria.libros`, `libreria.clientes` y `libreria.ventas`, con comportamiento de arranque (seed si faltan claves; usar lo guardado si ya existen). Todo en JavaScript nativo, sin librerías, sin `fetch`, sin tests automáticos. Verificación manual en el navegador (320px, 1280px, teclado) con resultado en el README.

## Goals / Non-Goals

**Goals:**
- `js/storage.js` con `cargar(clave)` y `guardar(clave, datos)` como único punto de acceso a `localStorage`.
- Acceso envuelto en `try/catch` con lista blanca de claves permitidas.
- Arranque: claves ausentes → cargar seed y guardar; presentes → usar lo guardado sin mezclar.
- Decisión documentada para JSON corrupto (volver al seed + mensaje de error).
- Documentar claves y estructura en el README.

**Non-Goals:**
- Altas de libros y clientes con validación (C-06, C-07).
- Ventas, confirmación e historial (C-08 a C-10).
- Edición o eliminación de registros (RN-FO-05 lo prohíbe).
- UI de preferencias de presentación (tema/sidebar ya persisten en C-02 bajo `libreria.preferencias.*`).

## Decisions

### D1: Archivo dedicado `js/storage.js`
**Opción A:** Todo en `js/app.js`.
**Opción B:** Archivo dedicado `js/storage.js` cargado con `<script defer>`.
**Decisión:** Opción B. Separa la capa de persistencia de la lógica de dominio y navegación, facilitando que C-06, C-07, C-08 y C-09 llamen a `cargar()`/`guardar()` sin tocar `app.js`.

### D2: Lista blanca de claves
Solo se permite acceder a `libreria.libros`, `libreria.clientes`, `libreria.ventas` (y opcionalmente `libreria.preferencias.*` de C-02, pero ese ya tiene su propio acceso en `app.js`). Cualquier otra clave se rechaza silenciosamente.

### D3: try/catch en todo acceso a localStorage
Cada lectura y escritura va en `try/catch`. Si `localStorage` está bloqueado, cuotao excedido o devuelve valor inválido, la aplicación usa valores por defecto y sigue funcionando.

### D4: Comportamiento de arranque
Al iniciar: para cada clave de dominio, verificar existencia en `localStorage`. Si falta → cargar seed desde `js/data.js` y guardar. Si existe → usar lo guardado, sin mezclar con seed (evita duplicados).

### D5: JSON corrupto
Si `JSON.parse()` falla en una clave de dominio, volver al seed inicial para esa clave y mostrar un mensaje de error con texto en pantalla (no solo color, RN-UI-09).

## Risks / Trade-offs

- [localStorage bloqueado o cuota excedida] → Mitigación: try/catch en todo acceso; la app funciona con valores por defecto.
- [JSON corrupto en una clave] → Mitigación: volver al seed y mostrar mensaje de error con texto.
- [Duplicar seed al recargar] → Mitigación: verificar existencia antes de cargar seed; nunca mezclar.
- [Los datos persisten solo en el navegador/perfil actual] → Documentado en el README como límite conocido (RN-PE-03).

## Open Questions

- Ninguna pendiente que cambie los specs, el enfoque o las tareas.
