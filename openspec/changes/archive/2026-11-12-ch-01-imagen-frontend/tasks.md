# Tasks: CH-01 imagen-frontend

## 1. Contenedor y configuración de Nginx

- [x] 1.1 Crear `frontend/Dockerfile` idéntico a la consigna y verificar su contenido
- [x] 1.2 Crear `frontend/.dockerignore` idéntico a la consigna y verificar su contenido
- [x] 1.3 Crear `frontend/default.conf.template` idéntico a la consigna y verificar su contenido
- [x] 1.4 Crear `frontend/env.example` con la variable `API_UPSTREAM` y ejemplos local/Easypanel

## 2. Cliente HTTP e integración en index.html

- [x] 2.1 Implementar `frontend/public/js/api.js` con `window.Api` (métodos get, post, patch, manejo de errores ApiError y query params)
- [x] 2.2 Agregar `<script src="js/api.js"></script>` en `frontend/public/index.html` antes de los scripts existentes
- [x] 2.3 Actualizar la ficha de CH-01 en `CHANGES.md` para registrar `index.html` en archivos autorizados

## 3. Ajustes de manejo de conexión y convención de rutas con ID

- [x] 3.1 Actualizar `api.js` con soporte para status 502/503/504 y 0 como error de conexión (`esConexion: true`), lectura segura de cuerpos no JSON y mensaje por defecto en 404
- [x] 3.2 Documentar la convención de rutas con ID sin barra final en `api.js`, `AGENTS.md` (regla 4), `CLAUDE.md` y `CHANGES.md`

## 4. Reconstrucción y verificación final

- [x] 4.1 Reconstruir la imagen Docker `libreria-frontend` y verificar que el build termine sin errores
- [x] 4.2 Iniciar el contenedor con `API_UPSTREAM=host.docker.internal:8000` y verificar respuestas HTTP 200 en `/`, `/api/health/ready`, `/api/libros/?limit=2`, `/js/api.js` y 404 en `/api/libros/999999`
- [x] 4.3 Revisar logs de Nginx en el contenedor para confirmar ausencia de errores y mantener el contenedor corriendo

## 5. Verificación manual en navegador (http://127.0.0.1:8080, consola - 12/11/2026)

- Api cargado en la página: `window.Api` es un objeto.
- `Api.get("/libros/", {limit: 2, titulo: "", offset: null})` → lista con "Rayuela" y "Los que aman, odian" (los parámetros vacíos se omiten).
- `Api.get("/libros/999999")` → 404, `esConexion: false`, "Libro no encontrado".
- `POST /ventas/` sin renglones → 422, "renglones: List should have at least 1 item after validation, not 0".
- `POST /ventas/` con un libro repetido → 422, "renglones: Value error, No se puede repetir un libro en la venta".
- `POST /ventas/` con `cliente_id: 999999` → 409, "No se pudo registrar la venta: el cliente no existe o los datos son inválidos".
- Con uvicorn detenido: `Api.get("/health/ready")` y `Api.get("/libros/")` → 502, `esConexion: true`, "No se pudo conectar con el servidor."
- La consola no muestra errores propios de la página (solo los 404/422/409/502 provocados).
