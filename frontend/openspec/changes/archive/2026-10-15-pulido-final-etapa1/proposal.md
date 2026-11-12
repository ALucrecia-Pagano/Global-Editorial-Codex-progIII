# Proposal

## Why

La última auditoría de la Etapa 1 dejó detalles menores. El título de las tablas se corta a 320 px. El filtro no encuentra títulos con tilde si se busca sin ella. El logo de la sidebar es un enlace más al Catálogo, redundante con el título, «Inicio» y el menú. Las regiones de tabla usan `role="region"` sobre un `div` en lugar del elemento nativo. Conviene cerrarlos antes de la Etapa 2, que reutiliza el filtro (`coincideTitulo`) y las tablas.

## What Changes

- **Título de tabla visible a 320 px:** el `caption` de cada tabla se ve completo dentro de su contenedor (puede partirse en líneas y queda a la izquierda al desplazar), sin volver a partir las celdas.
- **Filtro sin tildes:** `coincideTitulo` ignora los diacríticos además de las mayúsculas (`orbita` y `ÓRBITA` encuentran «Órbita lenta»). Sigue siendo una función pura. Se actualizan la regla RN-CA-04 de la KB, el README («Filtro por título», la limitación de acentos y un paso nuevo en el caso manual 1) y la spec `filtro-catalogo`. **Cambia un comportamiento especificado**: el escenario «Acentos sin normalizar» se reemplaza.
- **Logo de la sidebar sin enlace:** «Editorial CODEX» de la sidebar pasa a ser texto de marca con el mismo aspecto, sin foco ni efecto de hover. El título grande, «Inicio» y el enlace Catálogo del menú siguen llevando al Catálogo.
- **Regiones de tabla nativas:** cada `.tabla-contenedor` pasa de `<div role="region">` a `<section>` con el mismo `aria-label`, la misma clase, `tabindex="0"` y el mismo comportamiento. Los checkboxes `name="autorIds"` no cambian.
- **Roadmap:** en el bloque de C-11 de `CHANGES.md` se agrega la tarea «Eliminar `docs/consigna-tpi.pdf` del repo al terminar el TPI (se mantiene mientras el equipo lo use)».

**Ejercicios de la consigna:** Ejercicio 1 (estructura semántica), Ejercicio 2 (responsive y accesibilidad) y Ejercicio 3 (filtro por título).

**Fuera de alcance:**
- Cambiar cualquier `id` o `name` del contrato (la tabla de contrato no cambia).
- Normalizar signos de puntuación o la ñ por separado. La ñ se descompone en «n» + virgulilla con NFD, así que «nino» encontraría «niño»; se acepta y se documenta.
- Borrar `docs/consigna-tpi.pdf` ahora (solo se agrega la tarea a C-11).
- Funcionalidad de la Etapa 2.
- Commits y push.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `filtro-catalogo`: se quita «Regla de coincidencia por título», cuyo escenario «Acentos sin normalizar» pedía lo contrario, y se agrega en su lugar «Regla de coincidencia por título sin mayúsculas ni tildes».
- `estilos-tema`: «Diseño adaptable a 320 px y 1280 px» exige que el título de cada tabla se vea completo a 320 px.
- `maqueta-vistas`: «Tablas con encabezados» exige que el contenedor desplazable de cada tabla sea una `section` con nombre accesible y enfocable; «Página única con estructura semántica» aclara que las 5 `section` son las de las vistas.
- `sidebar-colapsable`: requisito nuevo, la marca de la sidebar es solo texto (no es enlace ni recibe foco).

## Impact

- `js/app.js`: `coincideTitulo` y el listener que cierra el menú (deja de incluir `.sidebar__marca`).
- `index.html`: el logo de la sidebar y los 5 contenedores de tabla (solo elemento y atributos, sin cambios de `id`/`name`).
- `css/styles.css`: `.tabla-contenedor` / `.tabla__titulo` y los estilos de hover/foco de `.sidebar__marca`.
- `README.md`, `knowledge-base/05_reglas_de_negocio.md` (RN-CA-04) y `CHANGES.md` (bloque C-11).
- Specs principales `filtro-catalogo`, `estilos-tema`, `maqueta-vistas` y `sidebar-colapsable` al archivar.
