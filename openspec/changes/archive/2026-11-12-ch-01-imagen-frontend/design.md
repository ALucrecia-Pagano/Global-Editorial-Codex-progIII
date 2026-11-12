# Design: CH-01 imagen-frontend

## Context

El proyecto requiere servir el frontend nativo del primer parcial con Nginx y reenviar las peticiones `/api/` a la API de FastAPI (`backend/`).
Ver `proposal.md` para la motivación.

## Goals / Non-Goals

**Goals:**
- Configurar el contenedor Docker y Nginx reproduciendo con fidelidad absoluta los archivos especificados en la consigna (`Dockerfile`, `.dockerignore`, `default.conf.template`).
- Documentar las variables de entorno en `frontend/env.example`.
- Crear el módulo `frontend/public/js/api.js` en JavaScript nativo (IIFE sobre `window.Api`) que encapsula `fetch`, serialización de query params y normalización de errores de FastAPI.
- Incluir `js/api.js` en `index.html` antes de los demás scripts.
- Actualizar `CHANGES.md` reflejando la modificación en `index.html`.

**Non-Goals:**
- No modificar lógica del backend (`backend/*`).
- No tocar código de las vistas (`app.js`, `data.js`, `storage.js`, `styles.css`).
- No implementar vistas de catálogo, altas o ventas (corresponden a CH-03, CH-04 y CH-05).

## Decisions

### 1. Archivos Nginx idénticos a la consigna
Se adoptan exactamente las líneas proporcionadas en los pasos 2 y 3 del Ejercicio 4 de la consigna para `Dockerfile`, `.dockerignore` y `default.conf.template`.
- *Alternativas consideradas:* Ajustar directivas de caché o logs; descartado para mantener paridad estricta y predecible con la consigna.

### 2. Módulo IIFE nativo en `window.Api`
Dado que el frontend no utiliza empaquetadores (webpack, vite) ni módulos ES (`<script type="module">`), `api.js` se estructura como una IIFE que adjunta `window.Api` y la clase `ApiError`.
- *Alternativas consideradas:* ES Modules (`export default`); descartado porque requeriría cambiar todos los scripts existentes a módulos y configurar imports relativos.

### 3. Normalización de respuestas y errores
- `ApiError`: Extiende `Error`, con campos `status` (número) y `message` (cadena).
- Si la respuesta trae `detail` como string (ej. HTTP 409 conflicto de ISBN), se usa directamente.
- Si `detail` es un arreglo (HTTP 422 validaciones de Pydantic/FastAPI), se filtran los componentes del arreglo excluyendo `"body"` de la ruta `loc` y formateando `"campo: mensaje"` separados por comas o saltos legibles.
- Si `fetch` lanza una excepción de red (servidor apagado o inaccesible), se captura y produce `ApiError(status: 0, message: "No se pudo conectar con el servidor.")`.
- Respuestas HTTP 204 o con contenido vacío retornan `null`.

### 4. Query Params limpios
`URLSearchParams` filtra automáticamente llaves con valores `undefined`, `null` o cadenas vacías `""`, evitando enviar parámetros como `?search=&filtro=null`.

### 5. UI Mockups
- `Decision: no (no UI)`: Este change es exclusivamente de infraestructura y utilidades HTTP, sin cambios visuales ni maquetación nueva.

## Risks / Trade-offs

- **[Riesgo] Omisión de barra final en endpoints del backend**: FastAPI es estricto con las barras finales (`redirect_slashes=True` genera 307 si falta la barra).
  - *Mitigación:* Se documenta en cabecera de `api.js` y en la especificación que las rutas deben invocarse con su barra final (ej. `Api.get("/libros/")`).
- **[Riesgo] Resolución de `host.docker.internal` en Linux/Docker Desktop**: En Windows y Mac con Docker Desktop funciona por defecto; en Linux requiere `--add-host`.
  - *Mitigación:* Se documenta el comando exacto para Docker Desktop en Windows y las opciones para entornos de hosting como Easypanel (`<proyecto>_backend:8000`).

## Verificación manual en navegador (http://127.0.0.1:8080, consola - 12/11/2026)

- Api cargado en la página: `window.Api` es un objeto.
- `Api.get("/libros/", {limit: 2, titulo: "", offset: null})` → lista con "Rayuela" y "Los que aman, odian" (los parámetros vacíos se omiten).
- `Api.get("/libros/999999")` → 404, `esConexion: false`, "Libro no encontrado".
- `POST /ventas/` sin renglones → 422, "renglones: List should have at least 1 item after validation, not 0".
- `POST /ventas/` con un libro repetido → 422, "renglones: Value error, No se puede repetir un libro en la venta".
- `POST /ventas/` con `cliente_id: 999999` → 409, "No se pudo registrar la venta: el cliente no existe o los datos son inválidos".
- Con uvicorn detenido: `Api.get("/health/ready")` y `Api.get("/libros/")` → 502, `esConexion: true`, "No se pudo conectar con el servidor."
- La consola no muestra errores propios de la página (solo los 404/422/409/502 provocados).
