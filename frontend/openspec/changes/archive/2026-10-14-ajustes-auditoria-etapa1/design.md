# Design

## Context

Correcciones puntuales sobre la maqueta de la Etapa 1 (C-01 a C-03 ya archivados). Estado observado en el código:

- `css/styles.css`: `.tabla` tiene `min-width: 34rem` y `.tabla th, .tabla td` no fijan `white-space`, así que a 320 px el navegador parte "V-0001" por el guion y la fecha por el espacio. `.tabla-contenedor` ya tiene `overflow-x: auto`, `tabindex="0"` y `role="region"` en el HTML.
- `index.html:48`: `<div class="barra">` es hermano de `main` dentro de `div.principal`; no está en ningún landmark.
- `js/app.js:227-230`: el clic en `#sidebar-velo` llama `cerrarMenuMovil(false)`; el botón cerrar y Escape pasan `true`.
- `assets/img/banner-biblioteca.jpg`: 3456×5184 px, ~1,9 MB; se usa solo como fondo CSS (banner del Catálogo con `cover` y `html::before` difuminado).
- No hay reglas CSS ni JS que seleccionen por el elemento `section` fuera de `main`, ni JS que dependa de `.barra`.

## Goals / Non-Goals

**Goals:** tablas que scrollean en su contenedor sin partir celdas; barra superior dentro de un landmark con nombre; foco devuelto a la hamburguesa al cerrar con el velo; opcionalmente, banner más liviano y spec `estilos-tema` más legible.

**Non-Goals:** rediseño visual, cambios de `id`/`name`/clases, funcionalidad de la Etapa 2.

## Decisions

### D1 — `white-space: nowrap` en todas las celdas
Se agrega `white-space: nowrap` a la regla existente `.tabla th, .tabla td` (la de la sección "Tablas"). La tabla crece a su ancho natural y `.tabla-contenedor` (ya con `overflow-x: auto`) la desplaza. Se mantiene `min-width: 34rem`.
- Alternativa descartada: nowrap solo en columnas de id/fecha/importe con clases modificadoras. Requiere tocar cada `td` y la Etapa 2 tendría que recordar ponerlas al renderizar.
- Columnas de texto largo: con los datos de ejemplo (títulos y nombres cortos) no hace falta excepción. Si en la verificación alguna tabla queda excesivamente ancha, se agrega un modificador BEM `tabla__celda--texto` (`white-space: normal; min-width: 12rem`) solo en esa columna, y se documenta. Por defecto, no se crea.

### D2 — La barra pasa a ser `<section class="barra" aria-label="Barra superior">`
Se cambia el elemento `div` por `section` con `aria-label`: un `section` con nombre accesible se expone como landmark `region`, que es lo que pide axe. Se conservan la clase `barra`, el orden de los hijos y todos los `id`.
- Alternativa descartada: un segundo `<header>` — fuera de `main`/`aside`/`section` se expondría como un segundo `banner` (axe: `landmark-no-duplicate-banner`).
- Alternativa descartada: `<nav>` — la barra contiene el botón de tema y un texto, no es solo navegación.
- Alternativa descartada: envolver con un elemento nuevo — agrega un nivel de DOM que puede alterar el flex de `.principal`; transformar el propio contenedor es equivalente y no toca el CSS.
- Al no cambiar `id` ni `name`, no se toca la tabla de contrato (DD-08). Se agrega el landmark al README donde se describen los landmarks, si se mencionan.

### D3 — El velo devuelve el foco
En `js/app.js` el listener de `#sidebar-velo` pasa a llamar `cerrarMenuMovil(true)` y se actualiza el comentario de `cerrarMenuMovil` ("al cerrar con botón, Escape o velo"). Los demás llamados con `false` (al activar un enlace, que lleva el foco al `h2` de la vista, y al pasar a escritorio) no cambian.

### D4 (opcional) — Recompresión del banner
Con la herramienta local de Windows (PowerShell + `System.Drawing`, sin instalar nada ni agregar dependencias al proyecto) se genera una copia redimensionada a 1280×1920 (misma proporción) en JPEG calidad ~80 en el scratchpad. Se compara visualmente el banner del Catálogo y el fondo difuminado; si se ve bien, **se pide confirmación a la usuaria antes de reemplazar el archivo original** (regla dura 8). Mismo nombre y ruta, así que no cambian CSS, specs ni README salvo el peso en "Recursos y procedencia".

### D5 (opcional) — Spec `estilos-tema` en escenarios
Los requisitos de más de 500 caracteres (título, fondo galáctico, superficies y foco visible) se reescriben en la delta como enunciado corto + escenarios que conservan cada detalle. No cambia comportamiento; se aplica al archivar. "Recursos solo locales" queda igual (no supera 500).

## Risks / Trade-offs

- [Tablas muy anchas a 320 px por nowrap] → el scroll del contenedor es el comportamiento pedido; mitigación D1 si alguna columna se vuelve inmanejable.
- [`section` sin encabezado] → válido con `aria-label`; no altera el esquema de encabezados (no contiene `h*`).
- [Pérdida de calidad del banner] → se compara antes de reemplazar y se reemplaza solo con OK de la usuaria; si no hay OK, se omite D4.
