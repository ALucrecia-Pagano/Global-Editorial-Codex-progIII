# Proposal: CH-03 catalogo-y-detalle

## Why

El frontend actual conserva la maqueta estática del primer parcial en la sección de Catálogo, acoplada a datos simulados en memoria y `localStorage`. Para dar cumplimiento al Ejercicio 1 de la consigna y al caso de prueba G-01, es imprescindible conectar la grilla de libros a la API FastAPI (`GET /libros/`), incorporar búsqueda remota por título insensible a mayúsculas, paginación con `limit` y `offset`, manejo accesible de los 4 estados de vista (cargando, con datos, vacío y error de conexión), consulta de autores por ID (`GET /libros/{id}`) al seleccionar una tarjeta y provisión de una portada neutra de respaldo SVG ante libros sin imagen.

## What Changes

- **Nuevo módulo de catálogo (`frontend/public/js/catalogo.js`)**: módulo nativo IIFE que gestiona el ciclo completo de la vista `#catalogo`: consulta paginada a la API (`Api.get('/libros/', { limit, offset, titulo })`), control de los 4 estados de la interfaz, apertura y renderizado del detalle modal accesible con autores reales (`Api.get('/libros/' + id)`), y manejo de fallbacks en imágenes mediante `createElement` y `textContent`.
- **Nueva portada neutra de respaldo (`frontend/public/assets/img/portada-fallback.svg`)**: vector SVG liviano y homogéneo para representar cubiertas de libros sin imagen o ante errores de carga de red (`onerror`).
- **Ampliación de estilos (`frontend/public/css/catalogo.css`)**: incorporación de estilos complementarios sin alterar la grilla compacta existente: barras de estado (carga, error, vacío), controles de paginación (`Anterior`, indicador de página y `Siguiente`), modal/panel de detalle con foco visible, navegación por teclado (`Enter`, `Escape`) y cursor pointer en tarjetas.
- **Actualización de `frontend/public/index.html`**:
  - Inclusión de `<script src="js/catalogo.js" defer></script>` posterior a `app.js`.
  - Ajuste semántico de `<section id="catalogo">` para incorporar contenedores de estado, controles de paginación y estructura del modal de detalle de libro.
- **Limpieza modular de `frontend/public/js/app.js`**: eliminación estricta y quirúrgica del bloque viejo de catálogo (funciones `normalizarTexto`, `coincideTitulo`, `textoResultadosCatalogo`, `PORTADAS_IDS_CONOCIDOS`, `resolverPortada`, `renderCatalogo`, `filtrarCatalogo`, `alEnviarBusqueda`, `iniciarFiltroCatalogo` y su invocación en el inicializador), manteniendo intactas las funciones compartidas de nombres requeridas por las otras pantallas.

## Capabilities

### New Capabilities

- `catalogo`: Consulta remota y paginada de libros desde la API con filtro por fragmento de título, visualización consistente de los 4 estados de interfaz, consulta de detalle con autores asociados (`GET /libros/{id}`) mediante tarjeta interactiva y soporte de portadas de respaldo.

### Modified Capabilities

*(Ninguna)*

## Impact

- **Archivos creados**: `frontend/public/js/catalogo.js`, `frontend/public/assets/img/portada-fallback.svg`.
- **Archivos modificados**: `frontend/public/css/catalogo.css`, `frontend/public/index.html`, `frontend/public/js/app.js`.
- **Endpoints consumidos**: `GET /libros/?limit={limit}&offset={offset}&titulo={titulo}`, `GET /libros/{id}` (sin barra final para evitar redirección 307 de FastAPI).
- **Aislamiento**: No modifica `backend/`, `js/api.js`, `js/altas.js`, `js/ventas.js`, `css/styles.css`, `js/storage.js` ni `js/data.js`.
