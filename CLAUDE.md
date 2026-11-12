# Reglas y Guía de Agentes · Editorial Codex

## Proyecto y Stack
Evaluación Global de Programación III (UTN). Conecta el frontend nativo del 1° parcial con la API FastAPI (capítulos 1 a 4), sin login y con Nginx como reverse proxy hacia la API en `/api/`.
- **Frontend:** HTML5, CSS3, JavaScript ES nativo (sin frameworks ni build), Nginx 1.30 Alpine.
- **Backend:** Python 3.12, FastAPI, SQLModel/SQLAlchemy async, Alembic, PostgreSQL (asyncpg).
- **Consigna:** `docs/Global_Consigna.md` (transcripción canónica para grep) y `docs/Global_Consigna.pdf`.

## Estructura del repositorio
```
├── backend/          # API FastAPI, modelos, migraciones y seed (NO tocar lógica)
├── docs/             # Consigna en PDF y Markdown
├── frontend/         # Dockerfile, Nginx proxy y carpeta public/
│   └── public/       # index.html, css/ (styles.css + vistas), js/ (app.js, api.js, vistas)
├── openspec/         # Especificaciones y changes OpenSpec
├── CHANGES.md        # Mapa, fichas, personas y ramas (CH-01 a CH-06)
└── DEPLOY.md         # Registro de despliegue en VPS (Easypanel)
```

## Flujo OpenSpec (/opsx:*) y Git
Para cada change de `CHANGES.md`:
1. **Rama dedicada:** crear `feat/CH-NN-nombre` desde `main` actualizado (`git checkout main && git pull`).
2. **Leer la ficha en `CHANGES.md`** y la sección referenciada de `docs/Global_Consigna.md`.
3. Proponer: `/opsx:propose CH-XX` (generar proposal, design y tasks enfocados).
4. Implementar: `/opsx:apply CH-XX` (estrictamente los archivos autorizados en la ficha).
5. Archivar: `/opsx:archive CH-XX` (sync delta specs y archivar).
6. Pull Request a `main`: nadie commitea directo en `main`.

## Reglas obligatorias
1. **NUNCA commitees:** los commits los hace la usuaria, con conventional commits en español y el change entre paréntesis, p. ej. `feat(CH-03): catalogo y detalle`.
2. **NUNCA credenciales reales:** solo datos ficticios; secretos en `.env` (ignorado) o entorno de Easypanel.
3. **Frontend nativo:** JavaScript nativo sin frameworks, sin build y sin CDN (recursos 100% locales).
4. **Cliente centralizado:** todo fetch pasa por `js/api.js` con base `/api` y respeta la barra final de las rutas (ej. `/api/libros/`).
5. **Cero datos de dominio en localStorage:** solo preferencias de UI (tema, sidebar). El borrador de venta vive únicamente en memoria.
6. **Importes inalterables:** los importes confirmados provienen de la respuesta de la API; nunca se recalculan en el navegador.
7. **Manipulación segura del DOM:** armar con `textContent` y `createElement`; nunca `innerHTML` con datos dinámicos.
8. **Backend intocable:** no se modifica la lógica de `backend/`; si un change lo necesita, frenar y avisar.
9. **Sin pytest:** verificar en navegador en `127.0.0.1:8080` y con `curl` a través de `/api`, pegando la salida real en la verificación. "Debería funcionar" no es evidencia.
10. **Aislamiento estricto de archivos:** cada change toca SOLO los archivos autorizados en su ficha de `CHANGES.md` (y en `app.js` únicamente borra el bloque viejo de su propia vista); si necesita otro, frenar y avisar.
11. **Cierre conciso:** cerrar cada change con un resumen en criollo de no más de 10 líneas.
