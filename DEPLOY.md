# Despliegue en VPS (Easypanel) · Editorial Codex

Registro del despliegue del frontend (Nginx) y del backend (FastAPI + PostgreSQL) en Easypanel.

## Servicios

- **frontend:** público, con certificado HTTPS y `API_UPSTREAM=calculadora_backend:8000`.
- **backend:** privado, conectado a `calculadora_db` (base y usuario `libreria`).
- **URL pública:** `https://<dominio>` (se completa al desplegar).

## Puesta en marcha

1. En el backend: `alembic upgrade head` y luego `python -m scripts.seed` (solo con la base vacía).
2. Verificar salud: `curl -i https://<dominio>/api/health/ready` → HTTP 200.
3. **Después del seed, cargar el catálogo de demostración** contra la URL pública:
   ```bash
   python herramientas/cargar_catalogo.py --base https://<dominio>/api
   ```
   El script es idempotente: reutiliza lo existente y solo crea lo que falta (extensiones editoriales, géneros, autores y 10 libros ficticios; el catálogo queda con 12 libros).
4. Verificar el catálogo: `curl -s "https://<dominio>/api/libros/?limit=100"` → 12 libros.

## Verificación tras redespliegue

- `GET /api/health/ready` responde `{"estado":"lista"}`.
- El catálogo muestra las portadas por ISBN (`/assets/img/portadas/{isbn}.webp`) y la portada de respaldo cuando no hay imagen.
- Los datos de demostración persisten en PostgreSQL (no se recargan en cada arranque del contenedor).
