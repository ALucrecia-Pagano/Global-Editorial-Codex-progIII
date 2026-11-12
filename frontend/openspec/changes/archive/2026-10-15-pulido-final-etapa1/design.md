# Design

## Context

Estado observado en el código (después de `ajustes-auditoria-etapa1`):

- `css/styles.css`: `.tabla` tiene `width: 100%; min-width: 34rem`; `.tabla th, .tabla td` tienen `white-space: nowrap`. El `caption` (`.tabla__titulo`) mide lo mismo que la tabla (34rem o más), así que a 320 px su texto queda en parte fuera del área visible de `.tabla-contenedor` (`overflow-x: auto`) y se corta.
- `js/app.js:294`: `coincideTitulo` compara con `toLowerCase()` y `includes()`. Un comentario documenta la limitación «no normaliza acentos».
- `index.html:29`: `<a class="sidebar__marca" href="#catalogo">` con `span.sidebar__editorial` y `strong.sidebar__codex` (con estrella `aria-hidden`).
- `js/app.js:235`: el listener que cierra el menú móvil recorre `.navegacion__enlace, .sidebar__marca`.
- `css/styles.css:1441-1446` y `1519-1522`: efectos de hover y `:focus-visible` de `.sidebar__marca` (brillo, giro y titileo de la estrella).
- `index.html:261, 354, 416, 466, 500`: cinco `<div class="tabla-contenedor" tabindex="0" role="region" aria-label="…">`. Ni CSS ni JS seleccionan por `div`, `section` ni `[role]`; todo usa la clase.
- La KB define RN-CA-04 sin tildes; el README documenta la limitación de acentos y el caso manual 1 tiene 8 pasos.

## Goals / Non-Goals

**Goals:** título de tabla legible a 320 px sin partir celdas; filtro insensible a tildes como función pura; marca de la sidebar no interactiva; contenedores de tabla con elemento nativo; tarea de C-11 agregada.

**Non-Goals:** cambios en `id`/`name`, rediseño visual, normalizar puntuación, borrar la consigna, Etapa 2.

## Decisions

### D1: el caption se limita al ancho visible y queda fijo a la izquierda
```
.tabla-contenedor { container-type: inline-size; }
.tabla__titulo { position: sticky; left: 0; max-width: 100cqi; white-space: normal; box-sizing: border-box; }
```
`container-type: inline-size` convierte a `.tabla-contenedor` en contenedor de consulta, así que `100cqi` es su ancho visible. El caption deja de medir lo mismo que la tabla y se parte en líneas si hace falta. Con `sticky; left: 0` queda a la izquierda mientras la tabla se desplaza. Solo se tocan `.tabla-contenedor` y `.tabla__titulo`; el `nowrap` de las celdas no cambia.
- Descartada: sacar el título de la tabla (un `h3` fuera del `<table>`). Rompe el requisito de `caption` y la asociación semántica.
- Descartada: `display: block` en el caption. Puede alterar cómo el navegador expone la tabla a los lectores de pantalla.
- Riesgo: si Edge no respeta `max-width` en un `caption`, se detiene el apply y se consulta. La alternativa sería un `span` interno con esas mismas reglas.
- **Resultado en el apply (15/10/2026):** Edge sí respeta el ancho del caption. Se comprobó con una captura de Edge sin interfaz con la página en un `iframe` de 320 px; con la ventana en 320 px no sirve, porque la ventana sin interfaz no baja de cierto ancho y recorta la captura. Se vio un efecto no previsto: el título se partía en el guion del id («Renglones de la venta V-» / «0001»). Con el OK de Amanda, el id va envuelto en `<span class="tabla__id">` con `white-space: nowrap`. **Para C-10:** al generar el título del detalle, crear ese `span` con `createElement` y `textContent`.

### D2: `coincideTitulo` normaliza con NFD y quita los diacríticos
Se agrega una función auxiliar pura `normalizarTexto(texto)`: `String(texto == null ? '' : texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()`. `coincideTitulo` la aplica al título y a la búsqueda (a esta, después de `trim()`). Se conservan la firma, el resultado `true` con búsqueda vacía y la tolerancia a `null`/`undefined`. Se actualiza el comentario de la limitación.
- Rango `̀-ͯ` (diacríticos combinables) en lugar de `\p{Diacritic}`: no necesita el flag `u` y cubre las tildes, la diéresis y la virgulilla del español.
- Efecto aceptado: la ñ se descompone en «n» + virgulilla, así que `nino` encuentra «niño». Se documenta en el README.

### D3: la marca de la sidebar pasa a `<p class="sidebar__marca">`
Mismo contenido y misma clase; se quita `href`. Como deja de ser un enlace no recibe foco, y los lectores de pantalla la leen como texto. Se quitan `.sidebar__marca` del listener de `js/app.js:235` (y del comentario) y las reglas de `:hover`/`:focus-visible` de `.sidebar__marca` (incluidas las animaciones de `prefers-reduced-motion: no-preference`), porque un efecto de hover en algo no interactivo sugiere un clic que no existe. La regla base (`.sidebar__marca { min-width: 0; text-decoration: none; color: … }`) se conserva. `text-decoration` queda sin efecto, pero no molesta.
- Se revisa que `<p>` no herede márgenes por defecto que cambien el aspecto: si los hereda, se agrega `margin: 0` a `.sidebar__marca`.

### D4: los contenedores de tabla pasan a `<section>` sin `role`
Se reemplaza `div` por `section` y se quita `role="region"`, conservando la clase, `tabindex="0"` y `aria-label`. Una `section` con nombre accesible ya se expone como `region`. No hay CSS ni JS que dependa del elemento. Se aclara en `maqueta-vistas` que las «5 section» son las de las vistas, porque ahora `main` tiene más `section`.

### D5: KB y roadmap
- `knowledge-base/05_reglas_de_negocio.md` RN-CA-04: agregar que el filtro también ignora tildes y diacríticos.
- `CHANGES.md`, bloque C-11, viñetas de Scope: agregar «Eliminar `docs/consigna-tpi.pdf` del repo al terminar el TPI (se mantiene mientras el equipo lo use)».

## Risks / Trade-offs

- [Edge no respeta el ancho del caption] → se verifica en el navegador en la tarea correspondiente; si falla, se pausa y se consulta (D1).
- [La ñ coincide con la n] → aceptado y documentado; ningún título del catálogo de ejemplo tiene ñ.
- [Se pierde el efecto decorativo de la marca de la sidebar] → era interacción de un enlace que deja de existir; el aspecto en reposo no cambia.
