# Registro de Despliegue en VPS (Easypanel) · Editorial Codex

Este documento detalla la arquitectura, configuración, puesta en marcha y mantenimiento de los servicios de la **Librería Editorial Codex** desplegados en Easypanel, de acuerdo a las pautas del Ejercicio 5 de la consigna.

---

## 1. Datos generales del entorno

- **Plataforma:** VPS administrada con Easypanel.
- **Proyecto:** `calculadora` (compartido con la aplicación de la calculadora existente, cuyos servicios no se modifican).
- **Repositorio fuente:** `https://github.com/ALucrecia-Pagano/Global-Editorial-Codex-progIII.git`
- **Rama productiva:** `main`
- **URL pública de la aplicación:** [https://editorial-codex.a2qkmo.easypanel.host/](https://editorial-codex.a2qkmo.easypanel.host/)
- **Revisión en producción:** `5ecf509` (CH-06 y la corrección del ISBN en el catálogo), implementada el 13/11/2026 en `libreria-api` y `libreria-web`. Los archivos estáticos se sirven con `?v=20261115`; si se cambia un CSS o JS, hay que subir ese número en todos los `<link>` y `<script>` de `index.html`.

---

## 2. Arquitectura de servicios

```text
[ Navegador del cliente ]
           │  HTTPS (443)
           ▼
[ Easypanel Reverse Proxy / SSL ]
           │  HTTP (80)
           ▼
[ Servicio App: libreria-web ] (Nginx 1.30 Alpine)
   ├── Sirve archivos estáticos de /frontend/public/
   └── Proxy inverso en /api/* ──┐
                                 │  Red interna Easypanel (puerto 8000)
                                 ▼
                    [ Servicio App: libreria-api ] (FastAPI en Python 3.12 Alpine)
                                 │  asyncpg (puerto 5432)
                                 ▼
                    [ Servicio Database: db ] (PostgreSQL 17)
```

---

## 3. Configuración de los servicios

### 3.1 Base de datos: servicio `db` (PostgreSQL 17)
- **Tipo:** Servicio Database existente en el proyecto `calculadora`.
- **Host interno:** `calculadora_db`
- **Puerto interno:** `5432`
- **Base de datos creada:** `libreria`
- **Rol / Usuario:** `libreria` (propietario de la base `libreria`).
- **Seguridad:** La contraseña del rol se definió directamente desde la consola del servicio `db` mediante `ALTER ROLE libreria WITH PASSWORD '...';` y se inyecta de forma privada en el entorno del backend. Nunca se sube ni versiona en el repositorio.

### 3.2 Backend: servicio App `libreria-api`
- **Tipo:** Servicio App (privado; sin dominio público, el dominio asignado por defecto fue eliminado).
- **Origen Git:** `https://github.com/ALucrecia-Pagano/Global-Editorial-Codex-progIII.git`
- **Rama:** `main`
- **Ruta de compilación (Build Path):** `/backend`
- **Método de compilación:** `Dockerfile` (ruta relativa `Dockerfile`).
- **Nombre interno en red Easypanel:** `calculadora_libreria-api`
- **Puerto interno:** `8000`
- **Variables de entorno:**
  - `DATABASE_URL=postgresql+asyncpg://libreria:<contraseña>@calculadora_db:5432/libreria`
  - `DEBUG=false`
- **Migraciones:** Se ejecutan automáticamente al iniciar el contenedor mediante el comando de arranque:
  `sh -c "alembic upgrade head && exec uvicorn app.main:app --host 0.0.0.0 --port 8000"`
- **Healthcheck:** Configurado en el Dockerfile consultando `http://127.0.0.1:8000/health/ready` cada 30 segundos.

### 3.3 Frontend: servicio App `libreria-web`
- **Tipo:** Servicio App (público).
- **Origen Git:** `https://github.com/ALucrecia-Pagano/Global-Editorial-Codex-progIII.git`
- **Rama:** `main`
- **Ruta de compilación (Build Path):** `/frontend`
- **Método de compilación:** `Dockerfile` (ruta relativa `Dockerfile`).
- **Nombre interno en red Easypanel:** `calculadora_libreria-web`
- **Variable de entorno:**
  - `API_UPSTREAM=calculadora_libreria-api:8000`
- **Configuración de dominio:**
  - Dominio principal: `editorial-codex.a2qkmo.easypanel.host` (HTTPS, ruta `/`, destino HTTP puerto 80)
  - Dominio anterior, que se mantiene activo para no romper enlaces ya compartidos: `calculadora-libreria-web.a2qkmo.easypanel.host`
  - Certificado SSL: Administrado automáticamente por Easypanel (Let's Encrypt).
  - Destino interno: Protocolo `HTTP`, puerto `80`.

---

## 4. Puesta en marcha y carga de datos

1. **Migraciones y datos base (Seed):**
   Al levantar el contenedor `libreria-api`, Alembic verifica y aplica revisiones pendientes. La base `libreria` ya tenía aplicadas las migraciones y el seed desde el despliegue del parcial (2 libros, 1 cliente, ventas de prueba), y en el Global solo se agregaron los 10 libros de demostración con el script.
2. **Carga del catálogo de demostración:**
   Para poblar los 10 libros requeridos con autorías múltiples, géneros y portadas, se ejecutó el script idempotente provisto en el repositorio contra la API pública:
   ```bash
   python herramientas/cargar_catalogo.py --base https://editorial-codex.a2qkmo.easypanel.host/api
   ```
   El script detectó las entidades existentes, dio de alta las faltantes y dejó el catálogo con un total de 12 libros listos para evaluación.

---

## 5. Verificación del despliegue

Pruebas ejecutadas directamente sobre el dominio público HTTPS:

1. **Salud de la API y conectividad con la base:**
   - Petición: `GET https://editorial-codex.a2qkmo.easypanel.host/api/health/ready`
   - Respuesta: HTTP `200 OK`
   - Cuerpo: `{"estado":"lista"}`
2. **Catálogo y portadas en el navegador:**
   - URL: `https://editorial-codex.a2qkmo.easypanel.host/#catalogo`
   - Comportamiento: 12 tarjetas de libros renderizadas correctamente con sus portadas asociadas (`/assets/img/portadas/{isbn}.webp`) y la portada de respaldo `assets/img/portada-fallback.svg` para los libros sin imagen.
   - Contador de catálogo: Muestra 12 libros en total.
3. **Consulta de detalle de libro por ID:**
   - Petición: `GET https://editorial-codex.a2qkmo.easypanel.host/api/libros/10`
   - Respuesta: HTTP `200 OK` con el libro "Lo que susurra el pozo", sus metadatos y sus dos autorías vinculadas.
4. **Manejo de recursos inexistentes:**
   - Petición: `GET https://editorial-codex.a2qkmo.easypanel.host/api/libros/999999`
   - Respuesta: HTTP `404 Not Found` con mensaje `{"detail":"Libro no encontrado"}`.

---

## 6. Procedimiento de actualización y redespliegue

El flujo de integración continua es manual y controlado desde el panel de Easypanel:
1. Una vez aprobado y mergeado un Pull Request a la rama `main` en GitHub:
   - Si el cambio afecta a `frontend/`: ingresar al servicio `libreria-web` y pulsar **Deploy** (o **Implementar**).
   - Si el cambio afecta a `backend/`: ingresar al servicio `libreria-api` y pulsar **Deploy**.
2. **Persistencia garantizada:** La base de datos PostgreSQL vive en el volumen del servicio `calculadora_db`, por lo que los redespliegues de los contenedores no borran ni reinician los datos de clientes, libros ni ventas.
3. **Verificación del 13/11/2026, después de implementar `442250f` en `libreria-web`:** la página nueva ya responde en `editorial-codex` y la base sigue igual.
   - `GET /api/health/ready` → 200, `{"estado":"lista"}`
   - `GET /api/libros/?limit=100` → 12 libros
   - `GET /api/clientes/?limit=100` → clientes 1 y 2
   - `GET /api/ventas/3` → 200, total `60500.00`, precios históricos `18500.00` y `21000.00`

---

## 7. Mantenimiento y limpieza del VPS

- **Contenedor del parcial retirado:** El backend anterior corría como contenedor suelto (`docker run`) publicado en el puerto 8000 del VPS; el 13/11/2026 se detuvo y eliminó por SSH (`docker stop libreria && docker rm libreria`) y se borró su archivo de variables `/root/libreria.env`. Verificado: `docker ps` ya no lo lista y `localhost:8000` no responde. En el VPS solo quedan publicados Traefik (80/443) y el panel de Easypanel (3000); `libreria-api` expone 8000 únicamente en la red interna.

---

## 8. Problemas frecuentes y diagnóstico

| Síntoma | Causa probable | Solución |
|---|---|---|
| Error en paso `COPY` durante el build en Easypanel | Ruta de compilación (**Build Path**) mal configurada en Source. | Verificar que el Build Path sea `/backend` para la API y `/frontend` para la web. Si se deja `/`, Docker no encuentra los archivos relativos. |
| Error `502 Bad Gateway` al consultar `/api/*` | Variable `API_UPSTREAM` mal formada o backend apagado. | `API_UPSTREAM` debe ser exactamente `calculadora_libreria-api:8000` (sin `http://` ni barra final `/`). Revisar que el servicio `libreria-api` esté en estado Running. |
| Error al conectar a PostgreSQL (`OperationalError` / asyncpg) | Caracteres especiales sin escapar en la contraseña de `DATABASE_URL`. | Si la contraseña del rol contiene caracteres como `@`, `:`, `/` o `#`, deben URL-encodearse o cambiarse por una clave alfanumérica mediante `ALTER ROLE`. |
| Cambios en la interfaz no se reflejan tras redesplegar | El navegador sigue usando una copia guardada de los JS o CSS. | Al cambiar un CSS o JS, subir el `?v=AAAAMMDD` de todos los `<link>` y `<script>` de `index.html` antes de implementar. Para ver el cambio al instante: `Ctrl+Shift+R` o una ventana de incógnito. |
