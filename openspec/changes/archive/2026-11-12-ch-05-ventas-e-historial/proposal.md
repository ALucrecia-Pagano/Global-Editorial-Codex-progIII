# Proposal: CH-05 ventas-e-historial

## Why

El frontend actual conserva la maqueta estática en memoria y localStorage del primer parcial para las secciones de Ventas e Historial. Para cumplir con el Ejercicio 3 de la consigna y los casos G-04, G-05 y G-06, es necesario conectar la composición y registro de ventas con la API FastAPI (`POST /ventas/`) y consultar el historial y detalle con importes históricos inalterables (`GET /ventas/` y `GET /ventas/{id}`).

## What Changes

- **Nuevo módulo de ventas (`frontend/public/js/ventas.js`)**: módulo nativo IIFE que gestiona la carga inicial de selectores desde la API (`GET /clientes/?limit=100`, `GET /libros/?limit=100`), la manipulación del borrador en memoria sin tocar localStorage, la validación en cliente, el envío al servidor y el manejo del historial con paginación y detalle por ID.
- **Nuevos estilos (`frontend/public/css/ventas.css`)**: estilos complementarios para los indicadores de importes estimados en borrador, controles de paginación del historial y resumen de venta confirmada.
- **Actualización de `frontend/public/index.html`**:
  - Inclusión de `<link rel="stylesheet" href="css/ventas.css">` después de `styles.css`.
  - Inclusión de `<script src="js/ventas.js" defer></script>` después de `app.js`.
  - Eliminación de opciones predeterminadas cableadas a mano en `#venta-cliente` y `#venta-libro` (conservando únicamente la opción vacía inicial).
- **Limpieza modular de `frontend/public/js/app.js`**: eliminación estricta y quirúrgica del bloque C-08, C-09 y C-10 (22 funciones/variables obsoletas y 6 llamadas en `DOMContentLoaded`), garantizando que no queden referencias residuales.

## Capabilities

### New Capabilities
- `ventas`: Gestión completa del ciclo de ventas en el frontend: carga remota de opciones de clientes y libros, composición de borrador en memoria, confirmación de venta con importes provistos por el backend, preservación del borrador ante errores 409/422, y consulta paginada de historial y detalle histórico inalterable.

### Modified Capabilities
*(Ninguna)*

## Impact

- **Archivos creados**: `frontend/public/js/ventas.js`, `frontend/public/css/ventas.css`.
- **Archivos modificados**: `frontend/public/index.html`, `frontend/public/js/app.js`.
- **Endpoints de la API consumidos**: `GET /clientes/?limit=100`, `GET /libros/?limit=100`, `POST /ventas/`, `GET /ventas/?limit=10&offset={offset}`, `GET /ventas/{id}` (sin barra final).
- **Aislamiento**: No modifica `backend/`, `catalogo.js`, `altas.js`, `styles.css`, `storage.js` ni `data.js`.
