# Design: CH-03 catalogo-y-detalle

## Context

El frontend actualmente posee una maqueta de catálogo en `app.js` que renderiza libros desde un array estático en memoria y filtros en cliente. En este change se sustituye dicha lógica por la integración completa con la API FastAPI (`GET /libros/` y `GET /libros/{id}`) a través del cliente HTTP centralizado `js/api.js`.

Ver `proposal.md` para la motivación y `specs/catalogo/spec.md` para los requerimientos funcionales y escenarios.

## Goals / Non-Goals

**Goals:**
- Implementar `frontend/public/js/catalogo.js` como módulo IIFE nativo que administra el ciclo de vida del catálogo: carga inicial, búsqueda remota, paginación, estados de interfaz y detalle interactivo de libro con autores.
- Crear `frontend/public/assets/img/portada-fallback.svg` con diseño neutro y vectorial para usar de respaldo ante portadas inexistentes o fallos de red.
- Ampliar `frontend/public/css/catalogo.css` (agregando reglas al final sin alterar la grilla compacta ni el efecto 3D de libro existente) para soportar barras de estado, paginador y modal de detalle accesible.
- Actualizar `frontend/public/index.html` vinculando `js/catalogo.js` e incorporando los contenedores de estado, controles de paginación y estructura semántica del modal.
- Cumplir estrictamente la convención de URLs: colecciones con barra final (`/libros/`) y consultas por ID sin barra final (`/libros/{id}` para evitar redirect 307 de FastAPI).
- Manipular el DOM de forma 100% segura mediante `document.createElement` y `textContent` (cero `innerHTML` con datos dinámicos).
- Limpiar en `app.js` exactamente las 8 funciones y la llamada del inicializador especificadas en la ficha de CH-03, preservando las funciones compartidas de nombres.

**Non-Goals:**
- No modificar código del backend (`backend/`).
- No tocar `altas.js`, `ventas.js`, `data.js`, `storage.js` ni `styles.css`.
- No alterar las secciones `#libros`, `#clientes`, `#ventas` ni `#historial` de `index.html`.

## Decisions

### 1. Arquitectura del módulo `catalogo.js` (IIFE nativo)
Se estructura como una función inmediatamente invocada (IIFE) que encapsula el estado local:
- `estadoPaginacion`: `{ limit: 20, offset: 0, busqueda: '', totalEnPagina: 0 }`.
- `librosEnCache`: Array local con los libros de la página activa para rápida referencia.
- `cargando`: Booleano para evitar peticiones concurrentes o solapadas.

*Alternativas consideradas*: Métodos globales en `window`; descartado para mantener el aislamiento estricto y evitar colisiones de nombres.

### 2. Paginación y búsqueda en servidor
- Cada cambio en el término de búsqueda reinicia `offset` a `0`.
- El botón "Anterior" se deshabilita si `offset === 0`.
- El botón "Siguiente" se deshabilita si la cantidad de elementos devuelta por la API es menor a `limit` (indicando que no hay más registros).
- Se muestra un texto de estado legible indicando la página actual (ej. "Página 1 (libros 1 al 2)").

### 3. Gestión de los cuatro estados de interfaz
El contenedor del catálogo gestiona cuatro estados visuales mutuamente excluyentes:
- **Cargando**: mensaje/indicador de carga (`#catalogo-cargando`) visible mientras la petición a la API está pendiente.
- **Con datos**: grilla `#catalogo-lista` visible con las tarjetas de los libros.
- **Vacío**: mensaje accesible (`#catalogo-sin-resultados` o `#catalogo-vacio`) si la lista viene vacía.
- **Error de conexión**: mensaje de alerta (`#catalogo-error`) con texto explicativo si la promesa de `Api.get` falla.

### 4. Detalle modal de libro con autores asociados (`GET /libros/{id}`)
- La tarjeta entera es interactiva: posee `role="button"`, `tabindex="0"`, cursor pointer y respuesta a clic y tecla `Enter`.
- Al accionarse, se ejecuta `Api.get('/libros/' + id)` (sin barra final).
- Se abre un `<dialog>` o modal accesible (`#catalogo-modal`) con foco atrapado en el botón de cerrar (`#catalogo-modal-cerrar`).
- Muestra los datos de la obra: título, ISBN, editorial, género (o "Sin clasificar"), precio, stock y lista de autores con nombre completo y rol.
- Se cierra mediante clic en el botón de cerrar, clic en el fondo oscuro (backdrop) o pulsando la tecla `Escape`. Al cerrarse, se devuelve el foco a la tarjeta que abrió el detalle.

### 5. Respaldo de género y portadas
- Si `libro.genero` es nulo o indefinido, se visualiza "Sin clasificar".
- La imagen de portada asigna un handler `onerror` que reemplaza automáticamente el `src` por `assets/img/portada-fallback.svg` si la imagen local no carga o falla.

### 6. UI Mockups
- `Decision: no (project policy / no UI redesign)`: Se reutiliza la maquetación HTML existente y la hoja `catalogo.css` que ya contiene la grilla compacta y el diseño 3D de libro.

## Risks / Trade-offs

- **[Riesgo] Redirección 307 de FastAPI al consultar por ID**:
  - *Mitigación*: En `catalogo.js` se invoca estrictamente `Api.get('/libros/' + id)` sin barra final.
- **[Riesgo] Portadas faltantes o rotas**:
  - *Mitigación*: Se implementa `portada-fallback.svg` y se adjunta listener `onerror` en cada imagen creada.
- **[Riesgo] Llamadas huérfanas en app.js**:
  - *Mitigación*: Borrar quirúrgicamente solo las funciones de catálogo listadas en la ficha de CH-03, preservando intactas las funciones de nombres (`obtenerNombreEditorial`, etc.).
