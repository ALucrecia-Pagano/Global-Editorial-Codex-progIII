# Mapa de Changes · Global de Programación III

## Contexto

- **Proyecto:** Integración y despliegue de la librería web para la Evaluación Global de Programación III (UTN — Tecnicatura Universitaria en Programación).
- **Grupo:** EDITORIAL CODEX — Liendo Mateo, Avila Lucas, García Juan, Pagano Amanda, Valentini Tiziano.
- **Fecha de entrega:** Sábado 14/11 a la noche. La evaluación se realiza directamente sobre la URL pública de producción; el paquete ZIP (`frontend/`, `backend/`, `README.md`, `DEPLOY.md`, `evidencia/`) sirve como respaldo de entrega.
- **Arquitectura de integración:**
  - Frontend del primer parcial (HTML5, CSS3 y JavaScript nativo sin frameworks ni build) alojado en `frontend/public/`.
  - Backend FastAPI (capítulos 1 a 4 aprobados) en `backend/`, conectado a PostgreSQL con SQLAlchemy y SQLModel asincrónicos.
  - Nginx 1.30 Alpine dentro del contenedor del frontend sirve estáticos desde `/` y reenvía `/api/*` al backend (`API_UPSTREAM`). No se requiere CORS ni cookies en producción.
- **Infraestructura VPS y Local:**
  - **VPS (Easypanel):** Proyecto existente `calculadora` con base PostgreSQL `db` (host interno `calculadora_db`, base y usuario `libreria`). Para el Global se crearon dos servicios App en ese proyecto: `libreria-api` (privado, sin dominio) y `libreria-web` (público con HTTPS y reverse proxy a `calculadora_libreria-api:8000`). El contenedor suelto `libreria` del parcial se retiró sin reiniciar la VPS ni tocar el servicio `db`. Detalle completo en `DEPLOY.md`.
  - **Local:** Backend con Uvicorn en puerto 8000 sobre base local `libreria_global` (datos con `python -m scripts.seed`). Frontend en contenedor Docker mapeado a `127.0.0.1:8080:80` con `API_UPSTREAM=host.docker.internal:8000`.

---

## Decisiones acordadas

1. **Selectores de Autores y Clientes (CH-04 y CH-05):** Se consumen los listados generales `GET /autores/?limit=100` y `GET /clientes/?limit=100` para poblar los selectores al inicializar cada vista. Esta decisión se documentará en `README.md` y `DEPLOY.md` cumpliendo con el recuadro de la consigna.
2. **Portada de respaldo (CH-03):** Se crea `frontend/public/assets/img/portada-fallback.svg` para mostrar una cubierta neutra y homogénea ante libros sin imagen o fallos en la carga (`onerror`), manteniendo las portadas conocidas en `assets/img/portadas/`.
3. **Manejo de errores 422 en `api.js` (CH-01):** Cuando FastAPI devuelva un array de errores de validación en `detail`, `api.js` formateará el mensaje extrayendo y uniendo los campos `msg` correspondientes (ej. `"renglones: campo requerido"`), permitiendo una lectura limpia cerca de los formularios.
4. **CLI de OpenSpec en Windows:** Para evitar restricciones de directiva de ejecución en PowerShell (`ExecutionPolicy`), se utiliza sistemáticamente `openspec.cmd` (en lugar de `openspec.ps1`).
5. **Aislamiento por archivos e independencia:**
   - Cada pantalla tiene su propio archivo JS y su propio CSS: `catalogo.js` + `catalogo.css`, `altas.js` + `altas.css`, `ventas.js` + `ventas.css`.
   - Cada change agrega su `<script>` y su `<link>` en `index.html`.
   - `styles.css` no lo modifica nadie salvo CH-06 para ajustes finales.
   - En `app.js` cada change de pantalla **borra** el bloque viejo de su vista para evitar eventos duplicados. Las funciones compartidas de nombres (`obtenerNombreEditorial`, `obtenerNombreGenero`, `obtenerTextoGenero`, `obtenerNombresAutores`) se dejan intactas hasta CH-06 para evitar romper vistas si un change se mergea antes que otro.
   - CH-05 no toca `storage.js` ni `data.js` (los siguen usando el catálogo y las altas viejas hasta que se mergeen); el retiro de datos de dominio de `localStorage` se consolida en CH-06.

---

## Mapa de personas

El trabajo se reparte entre los 5 integrantes del grupo. Para evitar bloqueos, **CH-03, CH-04 y CH-05 se desarrollan en paralelo** una vez que CH-01 está en `main`.

| Change ID | Nombre | Estado | Rama Git | Casos G |
|---|---|---|---|---|
| **CH-01** | `imagen-frontend` | Hecho | `feat/CH-01-imagen-frontend` | G-07 (local) |
| **CH-02** | `primer-despliegue-easypanel` | Hecho | `feat/CH-02-primer-despliegue-easypanel` | G-07 (VPS) |
| **CH-03** | `catalogo-y-detalle` | Hecho | `feat/CH-03-catalogo-y-detalle` | G-01 |
| **CH-04** | `altas-libros-y-clientes` | Hecho | `feat/CH-04-altas-libros-y-clientes` | G-02, G-03 |
| **CH-05** | `ventas-e-historial` | Hecho | `feat/CH-05-ventas-e-historial` | G-04, G-05, G-06 |
| **CH-06** | `verificacion-y-entrega` | Hecho | `feat/CH-06-verificacion-y-entrega` | G-01 a G-07 |

*Integrantes del grupo:* Liendo Mateo, Avila Lucas, García Juan, Pagano Amanda, Valentini Tiziano.  
*Entrega final:* Sábado 14/11 a la noche.

---

## Cómo arrancar tu change

Guía paso a paso para cualquier integrante o IA que ejecute un change:

1. **Actualizar main y crear rama:**
   ```bash
   git checkout main
   git pull
   git checkout -b feat/CH-NN-nombre-del-change
   ```
   *Regla:* cada change vive en su rama y entra por Pull Request. Los ajustes chicos de documentación o estilo posteriores a un change se integraron directo en `main`, siempre con conventional commits.
2. **Levantar el backend local:**
   - Asegurar PostgreSQL corriendo con base `libreria_global`.
   - Desde la carpeta `backend/`:
     ```bash
     alembic upgrade head
     python -m scripts.seed
     uvicorn app.main:app --host 0.0.0.0 --port 8000
     ```
3. **Levantar el frontend local con Docker (a partir de CH-01):**
   - Desde la carpeta `frontend/`:
     ```bash
     docker build -t libreria-frontend .
     docker run --rm --name libreria-frontend -p 127.0.0.1:8080:80 --add-host=host.docker.internal:host-gateway -e API_UPSTREAM=host.docker.internal:8000 libreria-frontend
     ```
4. **Proponer el change con OpenSpec:**
   - Ejecutar `/opsx:propose CH-NN` o `openspec.cmd new change "CH-NN-nombre"`.
5. **Implementar respetando el alcance:**
   - Trabajar **exclusivamente** sobre los archivos autorizados en la ficha de tu change.
   - En `app.js`, **borrar únicamente** las funciones y llamadas viejas especificadas en tu ficha.
   - No tocar archivos prohibidos ni de otros changes.
   - **Rutas en `api.js` y barra final:** Las colecciones van con barra final (ej. `Api.get('/libros/')`, `Api.post('/ventas/', ...)`), pero las rutas con ID van **sin** barra final (ej. `Api.get('/libros/1')`, `Api.patch('/libros/1', ...)`). Con barra de más, FastAPI responde 307 hacia el host interno y la petición falla en el navegador.
6. **Probar localmente:**
   - Verificar en `http://127.0.0.1:8080/` desde el navegador y con comandos `curl.exe`.
   - Al probar cambios del front, recargar con Ctrl+Shift+R, porque con F5 el navegador puede usar JS y CSS viejos en caché.
   - Tomar capturas de los casos G asignados para la carpeta `evidencia/`.
7. **Archivar y subir:**
   - Ejecutar `/opsx:archive CH-NN`.
   - Solicitar a la usuaria el commit (conventional commit en español, ej: `feat(CH-03): catalogo y detalle`) y abrir Pull Request hacia `main`.

---

## Tabla resumen de Changes

| ID | Nombre | Ejercicio | Estado | Rama | Archivos autorizados | Funciones de app.js a borrar | Casos G |
|---|---|---|---|---|---|---|---|
| **CH-01** | `imagen-frontend` | Ej. 4 | Hecho | `feat/CH-01-imagen-frontend` | `frontend/Dockerfile`, `.dockerignore`, `default.conf.template`, `env.example`, `public/js/api.js`, `public/index.html` (solo script) | *Ninguna* (no toca `app.js`) | G-07 (local) |
| **CH-02** | `primer-despliegue-easypanel` | Ej. 5 | Hecho | `feat/CH-02-primer-despliegue-easypanel` | `DEPLOY.md` | *Ninguna* | G-07 (VPS) |
| **CH-03** | `catalogo-y-detalle` | Ej. 1 | Hecho | `feat/CH-03-catalogo-y-detalle` | `public/js/catalogo.js`, `public/css/catalogo.css` (ya creado), `public/assets/img/portada-fallback.svg`, `public/index.html` (solo script y `#catalogo`), `public/js/app.js` (solo borrar) | `normalizarTexto`, `coincideTitulo`, `textoResultadosCatalogo`, `PORTADAS_IDS_CONOCIDOS`, `resolverPortada`, `renderCatalogo`, `filtrarCatalogo`, `alEnviarBusqueda`, `iniciarFiltroCatalogo`, y llamada `iniciarFiltroCatalogo()` *(no borra funciones de nombres compartidas)* | G-01 |
| **CH-04** | `altas-libros-y-clientes` | Ej. 2 | Hecho | `feat/CH-04-altas-libros-y-clientes` | `public/js/altas.js`, `public/css/altas.css`, `public/index.html` (solo script/link, `#libros`, `#clientes`), `public/js/app.js` (solo borrar) | `renderLibros`, `renderClientes`, `actualizarContadorLibros`, `llenarOpciones`, `poblarFormularioLibro`, `normalizarIsbn`, `validarLibro`, `refrescarVistasLibros`, `registrarHandlerAltaLibro`, `validarCliente`, `refrescarVistasClientes`, `registrarHandlerAltaCliente`, y llamadas en DOMContentLoaded (`poblarFormularioLibro`, `registrarHandlerAltaLibro`, `registrarHandlerAltaCliente`, `actualizarContadorLibros`) *(no borra funciones de nombres compartidas; pasan a CH-06)* | G-02, G-03 |
| **CH-05** | `ventas-e-historial` | Ej. 3 | Hecho | `feat/CH-05-ventas-e-historial` | `public/js/ventas.js`, `public/css/ventas.css`, `public/index.html` (solo script/link, `#ventas`, `#historial`), `public/js/app.js` (solo borrar) | `renglonesBorrador`, `TEXTO_ERROR_CANTIDAD`, `esCantidadValida`, `buscarLibroPorId`, `renderSelectorVenta`, `renderSelectorClientesVenta`, `renderSelectorLibrosVenta`, `calcularTotalBorrador`, `actualizarTotalVenta`, `agregarRenglonBorrador`, `registrarHandlerAgregarDetalle`, `aplicarCantidadRenglon`, `renderRenglonesVenta`, `sincronizarCantidadesBorrador`, `calcularSiguienteIdVenta`, `validarVenta`, `construirVenta`, `registrarHandlerConfirmarVenta`, `numeroDeVenta`, `agregarCeldaTexto`, `renderHistorialVentas`, `escribirTituloConId`, `mostrarDetalleVenta`, y llamadas en DOMContentLoaded (`renderSelectorClientesVenta`, `renderSelectorLibrosVenta`, `registrarHandlerAgregarDetalle`, `renderRenglonesVenta`, `registrarHandlerConfirmarVenta`, `renderHistorialVentas`) | G-04, G-05, G-06 |
| **CH-06** | `verificacion-y-entrega` | Verif. | Hecho | `feat/CH-06-verificacion-y-entrega` | `README.md`, `DEPLOY.md`, `evidencia/`, `public/js/storage.js`, `public/js/data.js`, `public/js/app.js`, `public/css/styles.css` (opcional) | Limpieza final en `app.js`: funciones compartidas de nombres (`obtenerNombreEditorial`, `obtenerNombreGenero`, `obtenerTextoGenero`, `obtenerNombresAutores`), `iniciarPersistencia`, `mostrarErrorPersistencia`, validadores `es*GuardadoValido`, y `registrarFormulariosMaqueta` | G-01 a G-07 |

---

## Fichas detalladas de Changes

### CH-01 · imagen-frontend (Hecho)
- **Estado:** Hecho
- **Rama:** `feat/CH-01-imagen-frontend`
- **Objetivo:**
  1. Construir la imagen Docker del frontend con Nginx 1.30 Alpine sirviendo `public/` y configurando `default.conf.template` para reenviar `/api/*` al backend mediante `API_UPSTREAM`.
  2. Implementar el módulo cliente HTTP centralizado `frontend/public/js/api.js` que usarán todos los demás changes.
- **Especificación de `frontend/public/js/api.js`:**
  - Base de peticiones: `/api` (respetando la barra final de las rutas que la requieran, ej. `/api/libros/`).
  - Funciones exportadas / disponibles globalmente: `get(ruta, params)`, `post(ruta, body)`, `patch(ruta, body)`.
  - Construcción de URL con query params omitiendo valores nulos, indefinidos o cadenas vacías.
  - Manejo de errores unificado: lanza un error con propiedad `status` (0 si falla la conexión de red) y propiedad `message` extraída del campo `detail` de FastAPI (si `detail` es array de errores 422, une los mensajes de los campos `msg`; si es string, lo devuelve tal cual).
- **Archivos que puede tocar (autorizados):**
  - `frontend/Dockerfile`
  - `frontend/.dockerignore`
  - `frontend/default.conf.template`
  - `frontend/env.example`
  - `frontend/public/js/api.js`
  - `frontend/public/index.html` (solo agregar `<script src="js/api.js"></script>`)
- **Archivos que NO puede tocar (prohibidos):** `frontend/public/js/app.js`, `frontend/public/js/storage.js`, `frontend/public/js/data.js`, `backend/*`.
- **Funciones de app.js a borrar:** *Ninguna* (`app.js` no se toca en este change).
- **Sección de docs/Global_Consigna.md a leer:** `## Ejercicio 4 · Dockerfile del frontend` (Pasos 1 al 4).
- **Endpoints:**
  - `GET /health/ready` -> Respuesta esperada: HTTP 200 `{"status": "ready", "database": "connected"}`.
- **Cómo probar en 127.0.0.1:8080:**
  1. Levantar backend local en puerto 8000.
  2. En `frontend/`: `docker build -t libreria-frontend .`
  3. Ejecutar: `docker run --rm --name libreria-frontend -p 127.0.0.1:8080:80 --add-host=host.docker.internal:host-gateway -e API_UPSTREAM=host.docker.internal:8000 libreria-frontend`
  4. En terminal: `curl.exe -i http://127.0.0.1:8080/api/health/ready` debe devolver HTTP 200.
- **Casos G que cubre:** Base preparatoria de **G-07** (build exitoso y proxy local operativo).

---

### CH-02 · primer-despliegue-easypanel (Hecho)
- **Estado:** Hecho
- **Requisitos de acceso:** Requiere credenciales de acceso al panel de Easypanel del VPS.
- **Rama:** `feat/CH-02-primer-despliegue-easypanel`
- **Objetivo:** Configurar en Easypanel (proyecto `calculadora`) los dos servicios App: `libreria-api` (privado, conectado a `calculadora_db` con base y usuario `libreria`) y `libreria-web` (público con certificado HTTPS y `API_UPSTREAM=calculadora_libreria-api:8000`). Iniciar `DEPLOY.md` con los detalles de despliegue.
- **Archivos que puede tocar (autorizados):**
  - `DEPLOY.md` (creación y registro de pasos).
- **Archivos que NO puede tocar (prohibidos):** Todo `frontend/`, todo `backend/`.
- **Funciones de app.js a borrar:** *Ninguna*.
- **Sección de docs/Global_Consigna.md a leer:** `## Ejercicio 5 · Servicios en Easypanel` (Pasos 5 al 8).
- **Endpoints:**
  - `GET /health/ready` sobre la URL HTTPS pública asignada al frontend -> Respuesta esperada: HTTP 200.
- **Cómo probar:**
  1. En navegador o curl: `curl.exe -i https://<dominio-publico>/api/health/ready` -> HTTP 200.
  2. En Shell de Easypanel del backend: verificar conexión a PostgreSQL y correr seed si la base está limpia.
  3. Después de migrar y ejecutar el seed, cargar el catálogo de demostración (editoriales, géneros, autores y libros) contra la URL pública:
     ```bash
     python herramientas/cargar_catalogo.py --base https://<dominio>/api
     ```
     Registrar el comando y su salida en `DEPLOY.md`.
- **Casos G que cubre:** **G-07** (despliegue en VPS, HTTPS activo, salud 200 y persistencia en base de datos).

---

### CH-03 · catalogo-y-detalle (Hecho)
- **Estado:** Hecho
- **Rama:** `feat/CH-03-catalogo-y-detalle`
- **Objetivo:** Conectar el catálogo de libros con la API usando `api.js`. Toda la lógica de catálogo vive en `frontend/public/js/catalogo.js` y sus estilos en `frontend/public/css/catalogo.css`. `css/catalogo.css` ya existe con la grilla compacta y el estilo de libro, y CH-03 agrega sus estilos debajo sin borrar lo existente. Manejar búsqueda en servidor, paginación, los 4 estados de la vista, libros sin género ("Sin clasificar"), detalle de autores al hacer clic en tarjeta (`GET /libros/{id}`), portadas compactas y portada de respaldo SVG.
- **Criterios de aceptación:** En 1280 px entran al menos 4 tarjetas por fila, ninguna portada supera 320 px de alto, en 375 px entran 2 por fila; la tarjeta completa es clickeable para abrir el detalle (`GET /libros/{id}`) con cursor pointer, foco visible y Enter.
- **Nota posterior (portadas por ISBN, con acuerdo de su autor):** fuera del alcance original de CH-03, la portada se resuelve por `assets/img/portadas/{isbn}.webp` (y `portada-fallback.svg` si el libro no tiene ISBN o la imagen no existe). Se eliminó el mapa `PORTADAS_CONOCIDAS` que asociaba las tapas por id de la base y asignaba imágenes equivocadas a los libros del seed.
- **Archivos que puede tocar (autorizados):**
  - `frontend/public/js/catalogo.js` (creación del módulo).
  - `frontend/public/css/catalogo.css` (`css/catalogo.css` ya existe con la grilla compacta y el estilo de libro; CH-03 agrega sus estilos debajo sin borrar lo existente).
  - `frontend/public/assets/img/portada-fallback.svg` (creación de portada de respaldo).
  - `frontend/public/index.html` (únicamente agregar `<script src="js/catalogo.js" defer></script>` y ajustar la sección `<section id="catalogo">`; `<link rel="stylesheet" href="css/catalogo.css">` ya está vinculado).
  - `frontend/public/js/app.js` (exclusivamente para BORRAR el código viejo de catálogo).
- **Archivos que NO puede tocar (prohibidos):** `css/styles.css`, `js/api.js`, `js/altas.js`, `js/ventas.js`, `js/storage.js`, `js/data.js`, y secciones de otras vistas en `index.html`.
- **Funciones de `app.js` a BORRAR:**
  - `normalizarTexto`
  - `coincideTitulo`
  - `textoResultadosCatalogo`
  - `PORTADAS_IDS_CONOCIDOS` y `resolverPortada`
  - `renderCatalogo`
  - `filtrarCatalogo`
  - `alEnviarBusqueda`
  - `iniciarFiltroCatalogo`
  - En inicializador (línea 664): llamada a `iniciarFiltroCatalogo()`
  *(Nota de funciones compartidas: las funciones `obtenerNombreEditorial`, `obtenerNombreGenero`, `obtenerTextoGenero` y `obtenerNombresAutores` NO se borran en CH-03 porque también las usa la tabla vieja de libros (`renderLibros`) si CH-03 se mergea primero. Se dejan intactas y las borra CH-06).*
- **Sección de docs/Global_Consigna.md a leer:** `## Ejercicio 1 · Catálogo y cliente HTTP`.
- **Endpoints:**
  - `GET /libros/?limit={limit}&offset={offset}&titulo={titulo}`
    - Query params: `limit` (default 20), `offset` (default 0), `titulo` (opcional).
    - Respuesta 200: Lista de objetos `LibroRead`:
      ```json
      [
        {
          "id": 1,
          "isbn": "978-987-566-646-7",
          "titulo": "Ficciones",
          "precio": 25000.00,
          "stock": 10,
          "editorial_id": 1,
          "genero_id": 1,
          "editorial": {"id": 1, "nombre": "Debolsillo", "pais": "Argentina"},
          "genero": {"id": 1, "nombre": "Ficción"}
        }
      ]
      ```
  - `GET /libros/{id}`
    - Respuesta 200: Objeto `LibroDetalleRead` con autores:
      ```json
      {
        "id": 1,
        "isbn": "978-987-566-646-7",
        "titulo": "Ficciones",
        "precio": 25000.00,
        "stock": 10,
        "editorial_id": 1,
        "genero_id": 1,
        "editorial": {"id": 1, "nombre": "Debolsillo", "pais": "Argentina"},
        "genero": {"id": 1, "nombre": "Ficción"},
        "autores": [
          {
            "autor_id": 1,
            "rol": "autor",
            "orden": 1,
            "autor": {"id": 1, "nombre": "Jorge Luis", "apellido": "Borges", "biografia": "..."}
          }
        ]
      }
      ```
- **Cómo probar en 127.0.0.1:8080:**
  1. Abrir `http://127.0.0.1:8080/#catalogo`.
  2. Escribir fragmento de título (búsqueda insensible a mayúsculas) y comprobar actualización desde la API.
  3. Navegar con paginación (`limit`/`offset`) y verificar que al cambiar el filtro se reinicia a la primera página.
  4. Buscar un texto sin coincidencias -> verificar mensaje "No se encontraron libros que coincidan con la búsqueda."
  5. Clic en una tarjeta -> debe abrirse el modal/detalle con autores reales obtenidos por ID.
  6. Detener el backend y recargar -> verificar mensaje de error de conexión.
- **Casos G que cubre:** **G-01**.

---

### CH-04 · altas-libros-y-clientes (Hecho)
- **Estado:** Hecho
- **Rama:** `feat/CH-04-altas-libros-y-clientes`
- **Fecha de cierre:** 13/11/2026
- **Decisiones técnicas acordadas:**
  1. **Selectores con colecciones reales:** Se consumen `GET /editoriales/?limit=100`, `GET /generos/?limit=100` y `GET /autores/?limit=100` al inicializar la vista, con manejo de fallos y reintentos.
  2. **Gestión interactiva de autorías:** Interfaz dinámica para agregar múltiples autores con rol (`autor`, `coautor`, `traductor`, `ilustrador`) y orden correlativo automático. Si el usuario selecciona un autor en el combo y presiona "Guardar" sin pulsar antes "Agregar autor", se auto-incluye facilitando la experiencia.
  3. **Validación pre-envío en dos niveles:** Spans accesibles junto a cada control (`span.formulario__error-campo`, `aria-invalid="true"`) y banner de alerta general arriba del formulario (`.formulario__alerta`), enfocando automáticamente el primer control inválido.
  4. **Mapeo de errores HTTP:** Los 409 (duplicados de ISBN o email) muestran el mensaje en el banner superior y en el span específico del campo conflictivo, conservando los datos ingresados. Los 422 detallan los campos con formato incorrecto y los errores de red (`ApiError.esConexion`) informan amigablemente que el servidor no responde.
  5. **Prevención de doble envío:** Botones con atributo `aria-busy="true"` y estado `disabled` durante peticiones asincrónicas.
  6. **Comunicación reactiva desacoplada:** Emisión de `document.dispatchEvent(new CustomEvent('libros:cambiaron'))` y `CustomEvent('clientes:cambiaron')`. Listeners mínimos en `catalogo.js` y `ventas.js` para refrescar catálogo, contador y selectores de venta sin recarga de página ni polling.
  7. **Portadas de respaldo:** Los libros nuevos creados sin imagen muestran de manera predeterminada y robusta `assets/img/portada-fallback.svg` sin provocar errores en consola.
  8. **Compatibilidad con navegación:** Se expusieron `cargarTablaLibros` y `cargarTablaClientes` como `window.renderLibros` y `window.renderClientes`, y se protegieron las llamadas en `mostrarVista` de `app.js` con verificación `typeof` para garantizar navegación fluida entre pestañas.
- **Objetivo:** Conectar las pantallas de altas de libros (`#libros`) y clientes (`#clientes`) con la API mediante `frontend/public/js/altas.js` y sus estilos en `frontend/public/css/altas.css`. Cargar selectores de editoriales (`GET /editoriales/?limit=100`), géneros (`GET /generos/?limit=100`) y autores (`GET /autores/?limit=100`). Validar en cliente y manejar respuestas 201, 409 y 422 mostrando mensajes de error cerca de cada formulario.
- **Archivos que puede tocar (autorizados):**
  - `frontend/public/js/altas.js` (creación del módulo).
  - `frontend/public/css/altas.css` (creación de estilos de formularios y alertas).
  - `frontend/public/index.html` (únicamente agregar `<link rel="stylesheet" href="css/altas.css">`, `<script src="js/altas.js" defer></script>` y ajustar `<section id="libros">` y `<section id="clientes">`).
  - `frontend/public/js/app.js` (exclusivamente para BORRAR el código viejo de altas y tablas de libros/clientes).
- **Archivos que NO puede tocar (prohibidos):** `css/styles.css`, `js/api.js`, `js/catalogo.js`, `js/ventas.js`, `js/storage.js`, `js/data.js`, y secciones `#catalogo`, `#ventas`, `#historial` en `index.html`.
- **Funciones de `app.js` a BORRAR:**
  - `renderLibros`
  - `renderClientes`
  - `actualizarContadorLibros`
  - `llenarOpciones`
  - `poblarFormularioLibro`
  - `normalizarIsbn`
  - `validarLibro`
  - `refrescarVistasLibros`
  - `registrarHandlerAltaLibro`
  - `validarCliente`
  - `refrescarVistasClientes`
  - `registrarHandlerAltaCliente`
  - En el listener `DOMContentLoaded` al final de `app.js`: borrar las llamadas `poblarFormularioLibro()`, `registrarHandlerAltaLibro()`, `registrarHandlerAltaCliente()` y `actualizarContadorLibros()`.
  *(Nota de funciones compartidas: las funciones `obtenerNombreEditorial`, `obtenerNombreGenero`, `obtenerTextoGenero` y `obtenerNombresAutores` NO se borran en CH-04 porque también las usa el catálogo viejo (`renderCatalogo`) si CH-04 se mergea primero. Se dejan intactas y las borra CH-06).*
  *(Nota de desvío resuelto en CH-05: en `app.js`, las llamadas huérfanas `renderSelectorLibrosVenta()` dentro de `refrescarVistasLibros()` y `renderSelectorClientesVenta()` dentro de `refrescarVistasClientes()` ya fueron eliminadas en CH-05 para evitar `ReferenceError` al borrar los selectores viejos de ventas. Al implementar CH-04 se borran directamente las funciones `refrescarVistasLibros` y `refrescarVistasClientes` completas).*
- **Sección de docs/Global_Consigna.md a leer:** `## Ejercicio 2 · Alta de libros y clientes` (y recuadro *Consultas por ID*).
- **Endpoints:**
  - `GET /editoriales/?limit=100&offset=0` -> 200 `[{"id": 1, "nombre": "Debolsillo", "pais": "Argentina"}, ...]`
  - `GET /generos/?limit=100&offset=0` -> 200 `[{"id": 1, "nombre": "Ficción"}, ...]`
  - `GET /autores/?limit=100&offset=0` -> 200 `[{"id": 1, "nombre": "Jorge Luis", "apellido": "Borges"}, ...]`
  - `POST /libros/`
    - Cuerpo JSON:
      ```json
      {
        "isbn": "978-987-1234-56-7",
        "titulo": "El Aleph",
        "precio": 28500.50,
        "stock": 12,
        "editorial_id": 1,
        "genero_id": 1,
        "autores": [
          {"autor_id": 1, "rol": "autor", "orden": 1}
        ]
      }
      ```
    - Respuestas: 201 Created (devuelve `LibroDetalleRead`), 409 Conflict (`detail`: "Ya existe un libro con ese ISBN"), 422 Unprocessable Entity.
  - `POST /clientes/`
    - Cuerpo JSON:
      ```json
      {
        "nombre": "Mariana Enríquez",
        "email": "mariana.enriquez@example.com"
      }
      ```
    - Respuestas: 201 Created (`ClienteRead`), 409 Conflict (`detail`: "Ya existe un cliente con ese email"), 422.
  - `GET /clientes/{id}` -> 200 `ClienteRead`
- **Cómo probar en 127.0.0.1:8080:**
  1. Abrir formulario de libros, verificar que los selectores cargan editoriales, géneros y autores desde la API.
  2. Registrar un libro completo -> verificar 201 y mensaje de éxito.
  3. Reintentar registrar con el mismo ISBN -> verificar alerta 409 con el mensaje del servidor cerca del formulario.
  4. Registrar un cliente nuevo -> verificar 201.
  5. Reintentar con el mismo email -> verificar 409 con mensaje del servidor.
- **Casos G que cubre:** **G-02** y **G-03**.

---

### CH-05 · ventas-e-historial (Hecho)
- **Estado:** Hecho
- **Rama:** `feat/CH-05-ventas-e-historial`
- **Independencia absoluta:** Es 100% independiente de CH-03 y CH-04. `js/ventas.js` carga por su cuenta los clientes (`GET /clientes/?limit=100`) y los libros (`GET /libros/?limit=100`) para los selectores de la venta usando `api.js`, y **no llama ninguna función** de `catalogo.js` ni de `altas.js`. No toca `storage.js` ni `data.js`. Puede iniciarse e implementarse inmediatamente después de que CH-01 esté mergeado en `main`.
- **Objetivo:**
  1. Conectar el registro de ventas (`POST /ventas/`) y el historial (`GET /ventas/` y `GET /ventas/{id}`) mediante `frontend/public/js/ventas.js` y sus estilos en `frontend/public/css/ventas.css`.
  2. Mantener el borrador de la venta únicamente en memoria. Deshabilitar el botón mientras se envía.
  3. Mostrar precios unitarios, subtotales y total confirmados provenientes de la respuesta 201 del backend (nunca recalcular en cliente).
  4. Conservar el borrador ante 409 (cliente o libro inexistente) o 422 (libros repetidos o cantidades inválidas).
- **Archivos que puede tocar (autorizados):**
  - `frontend/public/js/ventas.js` (creación del módulo).
  - `frontend/public/css/ventas.css` (creación de estilos de venta e historial).
  - `frontend/public/index.html` (únicamente agregar `<link rel="stylesheet" href="css/ventas.css">`, `<script src="js/ventas.js" defer></script>` y ajustar `<section id="ventas">` y `<section id="historial">`).
  - `frontend/public/js/app.js` (exclusivamente para BORRAR el código viejo de ventas e historial).
- **Archivos que NO puede tocar (prohibidos):** `css/styles.css`, `js/api.js`, `js/catalogo.js`, `js/altas.js`, `js/storage.js`, `js/data.js`, y secciones `#catalogo`, `#libros`, `#clientes` en `index.html`.
- **Funciones de `app.js` a BORRAR:**
  - Variable: `let renglonesBorrador = []`
  - Constante: `TEXTO_ERROR_CANTIDAD`
  - `esCantidadValida`
  - `buscarLibroPorId`
  - `renderSelectorVenta`
  - `renderSelectorClientesVenta`
  - `renderSelectorLibrosVenta`
  - `calcularTotalBorrador`
  - `actualizarTotalVenta`
  - `agregarRenglonBorrador`
  - `registrarHandlerAgregarDetalle`
  - `aplicarCantidadRenglon`
  - `renderRenglonesVenta`
  - `sincronizarCantidadesBorrador`
  - `calcularSiguienteIdVenta`
  - `validarVenta`
  - `construirVenta`
  - `registrarHandlerConfirmarVenta`
  - `numeroDeVenta`
  - `agregarCeldaTexto`
  - `renderHistorialVentas`
  - `escribirTituloConId`
  - `mostrarDetalleVenta`
  - En el listener `DOMContentLoaded` al final de `app.js`: borrar las llamadas `renderSelectorClientesVenta()`, `renderSelectorLibrosVenta()`, `registrarHandlerAgregarDetalle()`, `renderRenglonesVenta()`, `registrarHandlerConfirmarVenta()` y `renderHistorialVentas()`.
- **Sección de docs/Global_Consigna.md a leer:** `## Ejercicio 3 · Registrar y consultar ventas` (y recuadro *Verificación de la persistencia*).
- **Endpoints:**
  - `GET /clientes/?limit=100&offset=0` -> 200 (para selector de clientes).
  - `GET /libros/?limit=100&offset=0` -> 200 (para selector de libros en renglones).
  - `POST /ventas/`
    - Cuerpo JSON:
      ```json
      {
        "cliente_id": 2,
        "renglones": [
          {"libro_id": 1, "cantidad": 2},
          {"libro_id": 2, "cantidad": 1}
        ]
      }
      ```
    - Respuesta 201: Objeto `VentaDetalleRead` completo:
      ```json
      {
        "id": 2,
        "cliente_id": 2,
        "fecha": "2026-11-12T19:30:00Z",
        "total": 95000.00,
        "cliente": {"id": 2, "nombre": "Ana García", "email": "ana@example.com"},
        "renglones": [
          {"libro_id": 1, "titulo": "Ficciones", "cantidad": 2, "precio_unitario": 25000.00, "subtotal": 50000.00},
          {"libro_id": 2, "titulo": "Rayuela", "cantidad": 1, "precio_unitario": 45000.00, "subtotal": 45000.00}
        ]
      }
      ```
    - Respuestas de error: 409 Conflict (si el cliente o libro no existe), 422 Unprocessable Entity (si hay libros repetidos o datos inválidos).
  - `GET /ventas/?limit={limit}&offset={offset}` -> 200 `[{"id": 1, "cliente_id": 1, "fecha": "...", "total": 71000.00}, ...]`
  - `GET /ventas/{id}` -> 200 `VentaDetalleRead`
  - `PATCH /libros/{id}` -> para verificar que al cambiar el precio de un libro, las ventas pasadas conservan sus importes históricos intactos.
- **Cómo probar en 127.0.0.1:8080:**
  1. Armar una venta seleccionando cliente y 2 renglones con libros distintos.
  2. Confirmar venta: botón se deshabilita, responde 201 y la pantalla muestra importes exactos del servidor.
  3. Recargar la página (`F5`), ir a Historial, abrir el detalle de la venta: los datos deben coincidir exactamente.
  4. Desde terminal con curl, hacer `PATCH` modificando el precio de un libro vendido: reabrir la venta en el historial y comprobar que los importes históricos no se alteraron.
  5. Intentar registrar venta con un libro repetido en los renglones: verificar error 422 y comprobar que el borrador no se borró de pantalla.
- **Casos G que cubre:** **G-04**, **G-05** y **G-06**.

---

### CH-06 · verificacion-y-entrega (Hecho)
- **Estado:** Hecho
- **Rama:** `feat/CH-06-verificacion-y-entrega`
- **Datos para README.md:**
  - **Materia:** Programación III — Tecnicatura Universitaria en Programación, UTN FRM
  - **Comisión:** 4
  - **Profesores:** Giuliano Espejo y Matías Torres
  - **Grupo:** Editorial Codex
  - **Integrantes:** Liendo Mateo, Avila Lucas, García Juan, Pagano Amanda, Valentini Tiziano
- **Dinámica de casos G, limpieza final y evidencia:**
  - Cada integrante dueño de un change ejecuta y documenta sus propios casos G sobre la URL pública HTTPS de Easypanel, guardando las capturas en `evidencia/` (ej: `G-01-catalogo.png`, `G-02-alta-libro.png`, etc.).
  - El responsable de CH-06:
    1. Realiza el **retiro definitivo de los datos de dominio de localStorage**:
       - Limpia `frontend/public/js/storage.js` reduciéndolo estrictamente a preferencias de UI (tema y estado del sidebar).
       - Desacopla `frontend/public/js/data.js` para conservar únicamente lo que siga haciendo falta (como el mapeo de portadas estáticas conocidas).
       - Limpia en `frontend/public/js/app.js` las funciones compartidas de nombres (`obtenerNombreEditorial`, `obtenerNombreGenero`, `obtenerTextoGenero`, `obtenerNombresAutores`), las funciones obsoletas de persistencia (`iniciarPersistencia`, `mostrarErrorPersistencia`, los validadores `es*GuardadoValido`) y `registrarFormulariosMaqueta`.
       - Ajustes cosméticos finales en `frontend/public/css/styles.css` si fueran necesarios.
       - Elimina las portadas `frontend/public/assets/img/portadas/li-*.webp`, ya reemplazadas por las portadas por ISBN (`{isbn}.webp`).
    2. Reúne, revisa y consolida todas las capturas y notas de prueba en la carpeta `evidencia/`.
    3. Completa el `README.md` (que ya existe con la base) con la URL pública, el estado final de los changes y la evidencia, sin borrar lo existente.
    4. Completa `DEPLOY.md` con URL pública, revisión Git, variables, proxy, puertos y verificación tras redespliegue.
    5. Empaqueta el archivo ZIP final de entrega excluyendo `.git`, `.env` y credenciales.
- **Archivos que puede tocar (autorizados):**
  - `README.md` (ya existe con la base; CH-06 lo completa con la URL pública, el estado final de los changes y la evidencia, sin borrar lo existente).
  - `DEPLOY.md`
  - `evidencia/` (capturas de pantalla y bitácoras de prueba de G-01 a G-07).
  - `frontend/public/js/storage.js` (limpieza de datos de dominio).
  - `frontend/public/js/data.js` (limpieza de mocks).
  - `frontend/public/js/app.js` (limpieza final de persistencia local y funciones compartidas).
  - `frontend/public/css/styles.css` (ajuste final si hiciera falta).
- **Archivos que NO puede tocar (prohibidos):** Código fuente de `backend/`.
- **Sección de docs/Global_Consigna.md a leer:** `## Casos de prueba y entrega` (Casos G-01 a G-07, Criterios de evaluación y Formato de entrega).
- **Casos G que cubre:** Verificación integral y consolidación de **G-01 a G-07**.

---

## Backlog opcional

- **CORSMiddleware en backend (`backend/app/main.py`):** Configurar `CORSMiddleware` en FastAPI en caso de que alguien desee depurar el frontend sin Nginx (por ejemplo, con Live Server directo al puerto 8000). En la arquitectura de producción y pruebas locales con Nginx reverse proxy, esta configuración no es necesaria porque `/api/` y el HTML comparten el mismo origen.
