# Tasks: CH-03 catalogo-y-detalle

## 1. Maquetación, portada fallback y estilos

- [x] 1.1 Crear `frontend/public/assets/img/portada-fallback.svg` con diseño vectorial neutro y estandarizado para cubiertas de libros y verificar que el archivo SVG renderice correctamente.
- [x] 1.2 Actualizar `frontend/public/index.html` vinculando `js/catalogo.js` (después de `app.js` y antes de `ventas.js`) y estructurando la sección `#catalogo` con contenedores de estados (cargando, error), paginación y el modal accesible `#catalogo-modal` con botón de cerrar.
- [x] 1.3 Ampliar `frontend/public/css/catalogo.css` al final del archivo con estilos para los estados de vista, controles de paginación e interfaz del modal de detalle accesible, y verificar que no altere la grilla ni las portadas existentes.

## 2. Limpieza de código obsoleto en app.js

- [x] 2.1 Borrar de `frontend/public/js/app.js` las funciones obsoletas de catálogo autorizadas en la ficha de CH-03 (`normalizarTexto`, `coincideTitulo`, `textoResultadosCatalogo`, `PORTADAS_IDS_CONOCIDOS`, `resolverPortada`, `renderCatalogo`, `filtrarCatalogo`, `alEnviarBusqueda`, `iniciarFiltroCatalogo`).
- [x] 2.2 Borrar de `frontend/public/js/app.js` en el inicializador la llamada `iniciarFiltroCatalogo()`, asegurando mantener intactas las funciones compartidas de nombres (`obtenerNombreEditorial`, `obtenerNombreGenero`, `obtenerTextoGenero`, `obtenerNombresAutores`).
- [x] 2.3 Verificar mediante búsqueda en `app.js` que no queden referencias residuales ni llamadas rotas a las funciones eliminadas.

## 3. Implementación del módulo catalogo.js

- [x] 3.1 Crear la estructura IIFE en `frontend/public/js/catalogo.js` con el estado local de paginación (`limit: 20`, `offset: 0`, `busqueda`) y la lógica de consumo de `Api.get('/libros/', ...)` manejando los 4 estados de interfaz (cargando, con datos, vacío y error de conexión).
- [x] 3.2 Implementar el renderizado seguro de tarjetas de libro con `document.createElement` y `textContent`, asignando portadas locales con fallback automático a `portada-fallback.svg` mediante `onerror`, visualización de precio en ARS y soporte de "Sin clasificar" si `genero` es nulo.
- [x] 3.3 Implementar la búsqueda por título en el servidor vinculada al formulario `#form-busqueda`, reiniciando la paginación a `offset = 0` y mostrando el mensaje correspondiente si no hay coincidencias.
- [x] 3.4 Implementar los controles de paginación (`Anterior`, indicador de página y `Siguiente`), habilitando o deshabilitando según el `offset` y la cantidad de libros recibidos.
- [x] 3.5 Implementar la apertura del detalle del libro al hacer clic o presionar `Enter` en la tarjeta: consulta `Api.get('/libros/' + id)` (sin barra final), renderizado de autores con rol y cierre accesible con botón, click exterior y tecla `Escape`.

## 4. Verificación y evidencia (Caso G-01)

- [x] 4.1 Recargar el frontend en `http://127.0.0.1:8080/` y verificar carga inicial de libros desde la API FastAPI a través de Nginx.
- [x] 4.2 Probar la búsqueda insensible a mayúsculas y la paginación con `limit=1` o datos del seed, confirmando el reinicio de página ante nueva búsqueda y el mensaje de sin coincidencias.
- [x] 4.3 Probar la apertura del detalle de un libro verificando la consulta `GET /libros/{id}`, visualización de autores reales y cierre con tecla `Escape`.
- [x] 4.4 Simular corte de conexión con el backend y verificar la visualización accesible del mensaje de error en `#catalogo-error`.
