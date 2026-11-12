# Proposal: CH-01 imagen-frontend

## Why

Para integrar el frontend del primer parcial con la API FastAPI en producción y local, se requiere empaquetar el frontend en una imagen Docker con Nginx que sirva los recursos estáticos y actúe como reverse proxy hacia `/api/`, evitando problemas de CORS y centralizando las peticiones HTTP. Además, es indispensable proveer un cliente HTTP unificado (`window.Api`) en JavaScript nativo que estandarice las peticiones, serialización de parámetros y el formateo de errores (especialmente validaciones 422 y conflictos 409 de FastAPI) para que los changes de pantalla (CH-03, CH-04, CH-05) puedan desarrollarse de manera independiente y en paralelo.

## What Changes

- Creación de `frontend/Dockerfile` copiando exactamente la configuración de Nginx 1.30 Alpine con `NGINX_ENVSUBST_FILTER=^API_UPSTREAM$`.
- Creación de `frontend/.dockerignore` excluyendo `.git`, `.env*`, `node_modules` y `.DS_Store`.
- Creación de `frontend/default.conf.template` con reverse proxy hacia `http://${API_UPSTREAM}/` y serving estático con fallback 404.
- Creación de `frontend/env.example` documentando la variable `API_UPSTREAM` con formato `host:puerto` para entorno local y Easypanel.
- Implementación de `frontend/public/js/api.js` exponiendo un IIFE con `window.Api` que provee `Api.get`, `Api.post` y `Api.patch`, serialización segura de parámetros con `URLSearchParams`, manejo de errores `ApiError` extrayendo detalles 422 y texto de errores 409, y detección de fallos de conexión (status 0).
- Inclusión del script `<script src="js/api.js"></script>` en `frontend/public/index.html` antes de los otros scripts de la aplicación.
- Actualización de la ficha de CH-01 en `CHANGES.md` para reflejar la autorización de la edición mínima en `index.html`.

## Capabilities

### New Capabilities
- `api-client`: Cliente HTTP centralizado en JavaScript nativo (`window.Api`) con soporte para peticiones GET/POST/PATCH, serialización de query params y normalización de errores de FastAPI.
- `frontend-proxy`: Configuración de Nginx y contenedor Docker para servir archivos estáticos y enrutar el tráfico `/api/` al servicio backend upstream.

### Modified Capabilities
*(Ninguna; no existen especificaciones previas en el proyecto)*

## Impact

- **Código afectado:** `frontend/` (`Dockerfile`, `.dockerignore`, `default.conf.template`, `env.example`), `frontend/public/js/api.js`, `frontend/public/index.html`, y `CHANGES.md`.
- **APIs y dependencias:** No agrega dependencias externas ni paquetes npm/pip; se apoya exclusivamente en Docker, Nginx Alpine oficial y APIs estándar del navegador (`fetch`, `URLSearchParams`).
- **Siguientes changes:** Desbloquea el trabajo paralelo de CH-03 (`catalogo-y-detalle`), CH-04 (`altas-libros-y-clientes`) y CH-05 (`ventas-e-historial`).
