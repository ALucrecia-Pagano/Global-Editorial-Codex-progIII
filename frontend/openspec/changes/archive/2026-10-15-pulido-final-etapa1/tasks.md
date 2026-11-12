# Tasks

## 1. Título de tabla completo a 320 px

- [x] 1.1 En `css/styles.css`, agregar `container-type: inline-size` a `.tabla-contenedor` y a `.tabla__titulo` `position: sticky; left: 0; max-width: 100cqi; white-space: normal; box-sizing: border-box` (D1), sin tocar `.tabla th, .tabla td`. Verificar: Historial a 320 px → «Renglones de la venta V-0001» se lee completo sin desplazar, y al desplazar la tabla el título queda a la izquierda; «V-0001» y la fecha siguen en una línea. Si Edge no respeta el ancho del caption, pausar y consultar. (Hecho. Se comprobó con capturas de Edge sin interfaz con la página en un iframe de 320 px: el título se ve completo y queda fijo al desplazar. Agregado con el OK de Amanda: el id del título va en `span.tabla__id` con `nowrap`, porque se partía en el guion. Falta la verificación manual: P1–P3.)

## 2. Filtro sin tildes

- [x] 2.1 En `js/app.js`, agregar la función pura `normalizarTexto` y usarla en `coincideTitulo` para el título y la búsqueda; actualizar el comentario de la limitación (D2). Verificar en consola: `coincideTitulo('Órbita lenta', 'orbita')`, `coincideTitulo('Órbita lenta', 'ÓRBITA')` y `coincideTitulo('Manual de jardinería urbana', 'jardineria')` dan `true`; `coincideTitulo('El mapa invisible', 'faro')` da `false`; `coincideTitulo(null, '  ')` da `true`. (Hecho. Casos evaluados en Node con las funciones del archivo: todos dan lo esperado. En el navegador: P5–P7.)
- [x] 2.2 Actualizar RN-CA-04 en `knowledge-base/05_reglas_de_negocio.md` (también ignora tildes y diacríticos). Verificar: el texto coincide con la spec `filtro-catalogo`.
- [x] 2.3 En el `README.md`, sección «Filtro por título»: actualizar la regla (sin mayúsculas ni tildes) y reemplazar la «Limitación conocida (acentos)» por la nota de la ñ (`nino` encuentra «niño»). En «Caso manual 1» agregar el paso 9 «Escribir `orbita` y luego `ÓRBITA`», con resultado esperado «Solo "Órbita lenta" en los dos casos» y estado «Pendiente». Verificar: búsqueda de «acentos» y «orbita» en el README coherente con el nuevo comportamiento.

## 3. Marca de la sidebar como texto

- [x] 3.1 En `index.html`, cambiar `<a class="sidebar__marca" href="#catalogo">…</a>` por `<p class="sidebar__marca">…</p>` con el mismo contenido (D3). Verificar: en la sidebar expandida, la marca se ve igual que antes en ambos temas; si `<p>` agrega margen, sumar `margin: 0` a `.sidebar__marca`. (Hecho. El reset global ya pone `margin: 0` a `p`; no hizo falta agregarlo. Aspecto: P8.)
- [x] 3.2 En `js/app.js`, quitar `.sidebar__marca` del selector del listener que cierra el menú y ajustar su comentario; en `css/styles.css`, quitar las reglas `:hover`/`:focus-visible` de `.sidebar__marca` (también las de `prefers-reduced-motion: no-preference`). Verificar: Tab por la sidebar no se detiene en la marca; a 320 px, clic en la marca con el menú abierto no hace nada y la consola no muestra errores. (Hecho. También se quitó la transición de `.sidebar__estrella` y el bloque `@media` que quedó vacío. Comportamiento: P9–P10.)
- [x] 3.3 Revisar el `README.md` donde se describe la sidebar o el menú y aclarar que la marca de la sidebar es texto y que al Catálogo se llega por el título, «Inicio» y el menú (sin reescribir el registro histórico de C4). Verificar: ninguna descripción vigente del README dice que el logo de la sidebar es un enlace. (Hecho: viñeta «Marca de la sidebar» en «Sidebar y menú móvil».)

## 4. Contenedores de tabla nativos

- [x] 4.1 En `index.html`, cambiar los 5 `<div class="tabla-contenedor" tabindex="0" role="region" aria-label="…">` por `<section class="tabla-contenedor" tabindex="0" aria-label="…">` (y sus cierres), con el mismo `aria-label` (D4). Los checkboxes `name="autorIds"` no se tocan. Verificar: `document.querySelectorAll('[role="region"]').length` da `0`, `document.querySelectorAll('section.tabla-contenedor').length` da `5`, y el panel Accessibility muestra cada contenedor como `region` con su nombre; Tab y las flechas siguen funcionando. (Hecho: 11 `section` abren y cierran parejo, que son 5 vistas, la barra y 5 tablas. Accessibility, Tab y flechas: P11–P12.)

## 5. Roadmap

- [x] 5.1 En `CHANGES.md`, bloque `[C-11]`, agregar al Scope la viñeta «Eliminar `docs/consigna-tpi.pdf` del repo al terminar el TPI (se mantiene mientras el equipo lo use)». Verificar: aparece una sola vez, dentro del bloque de C-11, y el PDF sigue en `docs/`.

## 6. Verificación manual final

- [x] 6.1 Agregar al `README.md` la plantilla «Verificación manual — pulido final» (filas en «Pendiente» para completar), con: Historial a 320 px (caption completo y celdas sin partir), título fijo al desplazar, títulos de las otras 4 tablas, buscar `orbita` y `ÓRBITA` (aparece «Órbita lenta»), `jardineria`, Tab por la sidebar (la marca no recibe foco), clic en la marca con el menú abierto, contenedores `section` en el panel Accessibility, Tab y flechas en las tablas, recorrido con teclado a 320 y 1280 px en ambos temas, y consola sin errores. Verificar: la usuaria completa la plantilla en el navegador y el resultado real queda registrado (aunque falle), junto con el paso 9 del caso manual 1. Sin commits. (Plantilla P1–P15 agregada al README; queda sin marcar hasta que Amanda la complete.)
