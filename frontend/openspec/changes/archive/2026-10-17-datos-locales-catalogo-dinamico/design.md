# Design

## Context

C-01 maquetó 5 vistas con tarjetas estáticas en el catálogo y C-03 añadió la función pura `coincideTitulo(titulo, busqueda)` que filtra sobre tarjetas estáticas sin tocar el DOM. C-02 añadió estilos y tema, sin datos de dominio. El change C-04 debe reemplazar las tarjetas estáticas del catálogo por un render dinámico desde arrays de datos locales, y renderizar inicialmente los listados de Libros y Clientes. Todo en JavaScript nativo, sin librerías, sin `fetch`, persistencia solo en `localStorage` (delegada a C-05). Sin tests automáticos; verificación manual en el navegador (320px, 1280px, teclado) con resultado en el README.

## Goals / Non-Goals

**Goals:**
- Arrays con ids estables para libros, editoriales, géneros, autores y clientes.
- Catálogo renderizado desde `libros` en `#catalogo-lista` con `createElement`/`textContent`.
- «Sin clasificar» cuando `generoId` es `null`.
- Filtro por título que re-renderiza desde el array reutilizando `coincideTitulo` de C-03.
- Formateo único de importes (ARS) y fechas (`dd/mm/aaaa hh:mm`).
- Render inicial de listados de Libros y Clientes desde los arrays.

**Non-Goals:**
- Persistencia en `localStorage` (C-05).
- Altas de libros y clientes con validación (C-06, C-07).
- Ventas, confirmación e historial (C-08 a C-10).
- Edición o eliminación de registros (RN-FO-05 lo prohíbe).
- IDs o names nuevos del contrato; no se modifica la tabla de contrato `id`/`name`.

## Decisions

### D1: Dónde vivirán los arrays y el render
**Opción A:** Todo en `js/app.js` (archivo ya existente de C-01/C-02/C-03).
**Opción B:** Archivo dedicado `js/data.js` cargado con `<script defer>` antes de `app.js`.
**Decisión:** Opción B. Separar datos y render de la navegación y el tema (que ya están en `app.js`) mantiene la coherencia con la arquitectura propuesta en `knowledge-base/08` y facilita que C-05, C-06, C-07 y C-08 lean los mismos arrays sin tocar la lógica de presentación. Se carga con `<script src="js/data.js" defer>` antes de `js/app.js`.

### D2: Estructura de datos de un libro
Cada libro del array tiene: `id` (estable, p. ej. `li-1`), `titulo`, `isbn`, `precio` (number), `editorialId`, `generoId` (string o `null`), `autorIds` (array de ids). Los precios son números puros; el formateo a ARS ocurre solo al mostrar.

### D3: Reutilización de `coincideTitulo`
`coincideTitulo` de C-03 se declara global (no módulo ES, por SU-02) y se llama desde el handler de `input` de `#catalogo-busqueda` para filtrar el array `libros` y re-renderizar. No se duplica la regla.

### D4: Quitar tarjetas estáticas
Se eliminan las tarjetas estáticas de `#catalogo-lista` en `index.html` para evitar duplicados (SU-03). Los contenedores (`#catalogo-lista`, `#catalogo-sin-resultados`, `#catalogo-vacio`) se conservan con sus ids del contrato.

## Risks / Trade-offs

- [Los arrays se pierden al recargar si no hay persistencia] → Mitigación: C-05 añadirá `localStorage`; hasta entonces los datos son iniciales en memoria y se recargan al refrescar.
- [Duplicar tarjetas si no se quitan las estáticas] → Mitigación: tarea explícita de quitar tarjetas estáticas de `index.html`.
- [El filtro ahora crea/quita nodos del DOM] → Mitigación: usar `textContent` para todo texto insertado (RN-GL-01) y mantener clases BEM iguales a las estáticas.

## Open Questions

- Ninguna pendiente que cambie los specs, el enfoque o las tareas. La decisión de JSON corrupto (C-05) y la de libro repetido en venta (IN-02, C-08) se resuelven en sus respectivos changes.
