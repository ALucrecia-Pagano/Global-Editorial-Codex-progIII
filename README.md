# Librería Editorial Codex · Global de Programación III

Librería web que conecta el frontend del primer parcial (HTML, CSS y JavaScript nativos) con la API del TP de los capítulos 1 a 4 (FastAPI + PostgreSQL), servida con Nginx y desplegada en Easypanel.

## Datos del grupo
- Materia: Programación III — Tecnicatura Universitaria en Programación, UTN FRM
- Comisión: 4
- Profesores: Giuliano Espejo y Matías Torres
- Grupo: Editorial Codex
- Integrantes: Liendo Mateo, Avila Lucas, García Juan, Pagano Amanda, Valentini Tiziano
- URL pública: Se completa con el despliegue (CH-02)

## Estructura del repositorio
```text
├── frontend/    # Nginx, Dockerfile, default.conf.template, env.example y carpeta public/
├── backend/     # API FastAPI, modelos SQLModel, migraciones Alembic y seed
├── docs/        # Consigna del examen global en Markdown y PDF
├── openspec/    # Especificaciones y changes del flujo OpenSpec
├── CHANGES.md   # Mapa de personas, tabla resumen y fichas de changes (CH-01 a CH-06)
└── AGENTS.md    # Reglas de desarrollo, arquitectura y convenciones del equipo
```

## Arquitectura y funcionamiento
El navegador solo habla con Nginx. Nginx sirve la carpeta `public/` y reenvía las peticiones a `/api/` hacia el backend mediante la variable de entorno `API_UPSTREAM`, evitando problemas de CORS. Todo pedido pasa por el cliente centralizado `frontend/public/js/api.js`.

## Cómo correrlo en local

### Backend
Desde la carpeta `backend/`:
1. Crear una base de datos nueva en PostgreSQL.
2. Copiar `env.example` a `.env` y completar `DATABASE_URL=postgresql+asyncpg://usuario:contraseña@localhost:puerto/base` sin subirlo al repo.
3. Crear y activar el entorno virtual:
   ```bash
   python -m venv .venv
   # Git Bash (Windows): source .venv/Scripts/activate
   # PowerShell (Windows): .venv\Scripts\Activate.ps1
   # Linux/macOS: source .venv/bin/activate
   ```
4. Instalar dependencias, migrar y sembrar:
   ```bash
   pip install -r requirements.txt
   alembic upgrade head
   python -m scripts.seed
   ```
5. Iniciar la API:
   ```bash
   uvicorn app.main:app --host 0.0.0.0 --port 8000
   ```

### Frontend
Desde la carpeta `frontend/` con Docker Desktop iniciado:
```bash
docker build -t libreria-frontend .
docker run --rm --name libreria-frontend -p 127.0.0.1:8080:80 -e API_UPSTREAM=host.docker.internal:8000 libreria-frontend
```
Abrir `http://127.0.0.1:8080` y comprobar `http://127.0.0.1:8080/api/health/ready`.
Aviso: al probar cambios del front, recargar con `Ctrl+Shift+R`.

## Datos de prueba
El seed carga datos ficticios (1 cliente, 2 libros y 1 venta) y rechaza una base que ya tenga registros.

Después del seed, cargar el catálogo de demostración (editoriales, géneros, autores y 10 libros, total 12 libros) a través de la API con:
```bash
python herramientas/cargar_catalogo.py --base http://127.0.0.1:8080/api
```
El script es idempotente (correrlo dos veces no duplica nada) y también acepta la URL pública: `--base https://<dominio>/api`.

## Decisiones técnicas
- Selectores: los selectores de clientes y autores usan los listados `GET /clientes/` y `GET /autores/` (la consigna pide documentar esta elección).
- Persistencia: el borrador de la venta vive en memoria y `localStorage` solo guarda el tema y el estado de la barra lateral.
- Importes: los importes confirmados salen siempre de la respuesta de la API.

## Estado de los changes
| Change | Nombre | Estado |
|---|---|---|
| CH-01 | `imagen-frontend` | Hecho |
| CH-02 | `primer-despliegue-easypanel` | Pendiente |
| CH-03 | `catalogo-y-detalle` | Pendiente |
| CH-04 | `altas-libros-y-clientes` | Pendiente |
| CH-05 | `ventas-e-historial` | Hecho |
| CH-06 | `verificacion-y-entrega` | Pendiente |

Para consultar el alcance y detalle de cada change, ver `CHANGES.md`.

## Cómo se trabaja
OpenSpec por change, una rama por change y Pull Request a `main`; ver `CHANGES.md` ("Cómo arrancar tu change") y `AGENTS.md`.

## Repositorios de origen
- Frontend del primer parcial: https://github.com/ALucrecia-Pagano/primer-parcial-libreria-frontend
- Backend (TP de capítulos 1 a 4 en `despliegue/`): https://github.com/ALucrecia-Pagano/Parcial-libreria-backend
