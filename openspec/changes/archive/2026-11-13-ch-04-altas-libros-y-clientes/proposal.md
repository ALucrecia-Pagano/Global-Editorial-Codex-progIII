# Proposal: CH-04 altas-libros-y-clientes

## Why

El frontend actual conserva formularios de alta del primer parcial que operan exclusivamente en memoria local y `localStorage` con estructuras estáticas no sincronizadas con la API. Para cumplir con el Ejercicio 2 de la consigna y cubrir los casos de prueba G-02 y G-03, es necesario conectar los formularios de alta de libros (`#libros`) y de clientes (`#clientes`) con los contratos reales de FastAPI (`POST /libros/` y `POST /clientes/`), poblar dinámicamente los selectores desde la base de datos (`GET /editoriales/?limit=100`, `GET /generos/?limit=100`, `GET /autores/?limit=100`), validar en el cliente con mensajes junto a cada campo y en banner, gestionar errores de duplicados (409), validación (422) y fallos de conexión, y notificar a las vistas de catálogo y ventas mediante eventos desacoplados sin recargar la página.

## What Changes

- **Nuevo módulo de altas (`frontend/public/js/altas.js`)**: módulo nativo IIFE que gestiona la carga de editoriales, géneros y autores desde la API, valida formularios en cliente con mensajes directos en cada campo, envía las peticiones `POST /libros/` y `POST /clientes/` deshabilitando el botón mientras se procesa, gestiona errores 409 (duplicados de ISBN y email) y 422 (validación del servidor), muestra mensajes de éxito con animación de partículas vía `Destellos.lanzar(...)`, limpia los formularios y despacha eventos globales `libros:cambiaron` y `clientes:cambiaron`. Además, actualiza las tablas visuales de libros y clientes en las vistas correspondientes.
- **Nuevos estilos (`frontend/public/css/altas.css`)**: estilos visuales consistentes con la estética de Editorial Codex (pergamino, tipografías y colores existentes, botones sin recuadro) para los mensajes de error por campo, selectores dinámicos y lista interactiva de autores asociados al libro (con rol y orden), garantizando diseño completamente adaptado a dispositivos móviles.
- **Actualización de `frontend/public/index.html`**:
  - Inclusión de `<link rel="stylesheet" href="css/altas.css">` en el `<head>`.
  - Inclusión de `<script src="js/altas.js" defer></script>` antes de `catalogo.js` y `ventas.js`.
  - Actualización del contenido de `<section id="libros">` y `<section id="clientes">` para incorporar campos requeridos por el backend (`stock`, rol y orden de autores, `span.formulario__error-campo` junto a cada control).
- **Limpieza modular de `frontend/public/js/app.js`**: eliminación estricta del bloque viejo de altas y maquetas (`renderLibros`, `renderClientes`, `actualizarContadorLibros`, `llenarOpciones`, `poblarFormularioLibro`, `normalizarIsbn`, `validarLibro`, `refrescarVistasLibros`, `registrarHandlerAltaLibro`, `validarCliente`, `refrescarVistasClientes`, `registrarHandlerAltaCliente` y sus llamadas en `DOMContentLoaded`), conservando intactas las funciones compartidas de nombres para CH-06.
- **Sincronización reactiva en `catalogo.js` y `ventas.js`**: incorporación de listeners mínimos a `libros:cambiaron` y `clientes:cambiaron` para refrescar catálogo, contador y selectores de venta sin recargar la página.

## Capabilities

### New Capabilities
- `altas`: Gestión completa de altas de libros y clientes mediante contratos de FastAPI: carga remota de entidades relacionales (editoriales, géneros, autores), validación local y remota (409 por duplicado, 422 por esquema), soporte para libros sin portada usando la imagen de respaldo existente, y emisión de eventos de cambio de dominio para actualización desacoplada de vistas relacionadas.

### Modified Capabilities
*(Ninguna)*

## Impact

- **Archivos creados**: `frontend/public/js/altas.js`, `frontend/public/css/altas.css`.
- **Archivos modificados**: `frontend/public/index.html`, `frontend/public/js/app.js`, `frontend/public/js/catalogo.js` (solo listener mínimo), `frontend/public/js/ventas.js` (solo listener mínimo).
- **Endpoints consumidos**: `GET /editoriales/?limit=100`, `GET /generos/?limit=100`, `GET /autores/?limit=100`, `POST /libros/`, `POST /clientes/`, `GET /clientes/{id}`, `GET /libros/?limit=20`.
- **Aislamiento**: No modifica `backend/`, `styles.css`, `destellos.js`, `storage.js` ni `data.js`.
