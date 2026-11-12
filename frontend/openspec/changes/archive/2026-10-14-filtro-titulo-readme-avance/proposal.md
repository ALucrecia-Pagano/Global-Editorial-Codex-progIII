# Proposal

## Why

La Etapa 1 se entrega con "listados con datos estáticos de ejemplo + una interacción básica": falta esa interacción (el filtro del catálogo por título) y el README de avance que le explica al docente y al equipo de la Etapa 2 qué es maqueta y qué ya funciona. Hoy el buscador de `#form-busqueda` solo evita la recarga y un aviso lo rotula como maqueta. Este change cierra la Etapa 1: después de él Amanda hace el commit de entrega (DD-05) y la Etapa 2 arranca (GATE 3 de `CHANGES.md`).

## Ejercicios de la consigna que cubre

- **Ejercicio 3 (adelantado a la Etapa 1)**: el filtro por título (US-005; RN-CA-04, RN-CA-05, RN-CA-06). En la Etapa 1 filtra las 6 tarjetas estáticas; la regla de coincidencia queda en una función pura que la Etapa 2 (C-04) reutiliza sobre el array (DD-07, IN-01).
- **Entrega de avance de la Etapa 1**: README con nombre, integrantes, cómo abrir sin npm, qué es maqueta y qué funciona por vista, decisiones de la Etapa 1, contrato `id`/`name` confirmado y el registro de los casos manuales 1 y 8 (US-012, nota de Etapa 1; RN-GL-03; RN-UI-11).

## What Changes

- `js/app.js`: función pura `coincideTitulo(titulo, busqueda)` (`trim()` + `toLowerCase()` + `includes`; búsqueda vacía → `true`), que no toca el DOM.
- `js/app.js`: filtro del catálogo escuchando `input` **y** `change` en `#catalogo-busqueda`; muestra u oculta cada tarjeta estática de `#catalogo-lista` con `hidden` y alterna `#catalogo-sin-resultados` cuando hay cero coincidencias. Todo el texto se escribe con `textContent`.
- `js/app.js`: handler propio de `submit` para `#form-busqueda` (`preventDefault()` + aplicar el filtro); el handler genérico de maqueta deja de registrarse en ese formulario.
- `index.html`: nueva zona de anuncio `#catalogo-resultados` (`role="status"`, `aria-live="polite"`, oculta a la vista con la clase existente `solo-lectores`) que anuncia cuántos libros se muestran. **Es el único `id` nuevo**; se agrega en la misma tarea a la tabla de contrato de `knowledge-base/08` y del `README.md` (DD-08).
- `index.html`: se quita el aviso de maqueta del Catálogo (`#aviso-maqueta-catalogo`, interno, fuera del contrato) y sus `aria-describedby`, porque el buscador deja de ser maqueta. Ningún `id`/`name` del contrato cambia.
- `README.md`: sección **"Qué es maqueta y qué funciona"** por vista, datos de entrega (Editorial Codex, integrantes DD-13, cómo abrir sin npm), decisiones de la Etapa 1, confirmación de la tabla de contrato contra el HTML final, explicación de `coincideTitulo` para la Etapa 2, degradación del filtro sin JavaScript y registro de los casos manuales 1 y 8 con el resultado **observado** (o "Pendiente de ejecutar" hasta que se ejecuten; nunca aprobado sin ejecutar).

## Capabilities

### New Capabilities
- `filtro-catalogo`: filtrado del catálogo por título — regla de coincidencia pura y reutilizable, reacción a `input`/`change`/`submit`, visibilidad de tarjetas, mensaje "sin resultados", anuncio accesible del resultado y degradación sin JavaScript.
- `documentacion-readme`: contenido obligatorio del `README.md` de entrega — datos del proyecto, qué es maqueta y qué funciona, decisiones, contrato y registro honesto de casos manuales. C-11 la amplía para el README final.

### Modified Capabilities
- `maqueta-vistas`: el requisito "Controles de maqueta rotulados" se precisa: el buscador del Catálogo ya funciona y deja de llevar aviso de maqueta; los controles de Libros, Clientes, Ventas e Historial lo conservan.

## Fuera de alcance

- Catálogo generado desde el array de libros, quitar las tarjetas estáticas y manejar `#catalogo-vacio` (C-04). En la Etapa 1 `#catalogo-vacio` queda oculto y sin lógica.
- Normalización de acentos o diacríticos: la KB (RN-CA-04, Flujo 1) solo pide `trim()` + minúsculas + coincidencia parcial; "orbita" no encuentra "Órbita lenta" (se documenta como limitación conocida).
- Filtrar por autor, ISBN, editorial o género; resaltar coincidencias; guardar la búsqueda en `localStorage` o en la URL.
- Funcionalidad de altas, ventas, historial y persistencia de dominio (Etapa 2).
- Cambios de estilos de C-02 (`css/styles.css`): este change no agrega clases ni reglas CSS.
- Casos manuales 2 a 7 (Etapa 2) y README final (C-11).
- Commits y push (los hace Amanda al cerrar la etapa).

## Impact

- **Código**: `js/app.js` (funciones nuevas + ajuste de `registrarFormulariosMaqueta`), `index.html` (sección Catálogo: zona `#catalogo-resultados`, sin aviso de maqueta).
- **Documentación**: `README.md` (secciones nuevas y fila de contrato), `knowledge-base/08_arquitectura_propuesta.md` (fila de contrato `catalogo-resultados`).
- **Etapa 2**: C-04 reutiliza `coincideTitulo` y `#catalogo-resultados` sobre el array; la tabla de contrato suma una fila.
- **Dependencias**: C-01 (archivado) y C-02 (implementado, sin archivar). C-03 no depende de la verificación pendiente de C-02: si el caso 8 no se ejecutó, se registra como pendiente.
- **Sin dependencias externas** nuevas; sigue abriendo por `file://` con scripts clásicos `defer`.
