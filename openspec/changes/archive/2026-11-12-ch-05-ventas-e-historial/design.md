# Design: CH-05 ventas-e-historial

## Context

El frontend actualmente posee implementaciones maquetadas de ventas e historial en `app.js` basadas en arreglos en memoria y sincronización con `localStorage`. En este change se reemplaza dicha lógica por la integración completa con los endpoints del backend FastAPI (`POST /ventas/`, `GET /ventas/`, `GET /ventas/{id}`) a través del cliente HTTP centralizado `js/api.js`.

Ver `proposal.md` para la motivación y `specs/ventas/spec.md` para los requerimientos funcionales y escenarios.

## Goals / Non-Goals

**Goals:**
- Implementar `frontend/public/js/ventas.js` como módulo IIFE nativo que se suscribe a `DOMContentLoaded` y orquesta la carga de opciones, gestión de borrador, confirmación de ventas y consulta de historial y detalle.
- Implementar `frontend/public/css/ventas.css` con estilos para importes estimados, navegación paginada y resumen de confirmación, respetando las variables de `styles.css`.
- Actualizar `frontend/public/index.html` incorporando el enlace a `ventas.css`, el script `ventas.js` y limpiando las opciones estáticas en los selectores.
- Garantizar que el borrador de venta resida exclusivamente en memoria (cero datos de dominio en `localStorage`).
- Tomar precios unitarios, subtotales y total confirmados estrictamente de la respuesta de la API (nunca recalcular un importe confirmado).
- Cumplir la convención de barras finales: `/ventas/` (con barra final) y `/ventas/{id}` (sin barra final).
- Mantener la manipulación del DOM 100% segura mediante `document.createElement` y `textContent` (nunca `innerHTML` con datos dinámicos).
- Limpiar en `app.js` exactamente las 22 variables/funciones y 6 llamadas del inicializador especificadas en la ficha de CH-05.

**Non-Goals:**
- No modificar código del backend (`backend/`).
- No tocar `catalogo.js`, `altas.js`, `data.js`, `storage.js` ni `styles.css`.
- No implementar pruebas unitarias automatizadas con pytest (la verificación es mediante curl y navegador).

## Decisions

### 1. Arquitectura del módulo `ventas.js` (IIFE nativo)
Se estructura como una función inmediatamente invocada (IIFE) que encapsula el estado local:
- `clientesMap`: Mapa `Map<id, cliente>` para resolución rápida de nombres.
- `librosMap`: Mapa `Map<id, libro>` para datos de catálogo (título y precio estimado).
- `borrador`: Array de renglones en memoria `[{ libroId, cantidad }]`.
- `historialPaginacion`: Estado de paginación `{ offset: 0, limit: 10, totalCargado: 0 }`.

*Alternativas consideradas*: Exponer métodos globales en `window`; descartado porque la vista se gestiona autónomamente mediante eventos del DOM.

### 2. Borrador en memoria y cálculo estimado
- La lista de renglones solo vive en memoria mientras dure la sesión o hasta confirmar la venta.
- Si el usuario agrega un libro ya existente en el borrador, se incrementa la cantidad en el renglón preexistente, garantizando un solo renglón por libro.
- Los subtotales y total del borrador se etiquetan visiblemente como "Total estimado", calculados con el precio del catálogo. Al recibir la respuesta 201 de la API, se sustituyen por los importes fijos y oficiales del servidor.

### 3. Manejo de errores 409 y 422 y preservación del borrador
- Si la API responde 409 o 422, `Api.post` arroja un `ApiError`. Se extrae `e.message` y se visualiza en `#venta-errores`.
- El borrador y el formulario no se limpian, permitiendo al usuario corregir el error sin perder lo cargado.
- El botón de confirmación se rehabilita inmediatamente y se retira el atributo `aria-busy`.

### 4. Paginación y detalle del historial
- El historial realiza peticiones `GET /ventas/?limit=10&offset={offset}`.
- El botón "Anterior" se deshabilita si `offset === 0`.
- El botón "Siguiente" se deshabilita si la cantidad de registros recibida es menor a 10.
- El detalle de la venta se obtiene bajo demanda mediante `GET /ventas/{id}` (sin barra final para evitar el error 307 de FastAPI) y se renderiza en `#historial-detalle`, permitiendo reabrir la venta tras recargar la página.

### 5. UI Mockups
- `Decision: no (project policy / no UI redesign)`: La maquetación utiliza la estructura HTML existente en `index.html` y las clases de `styles.css`, agregando únicamente reglas auxiliares en `ventas.css` para paginación y etiquetas de estimación.

## Risks / Trade-offs

- **[Riesgo] Redirección 307 en consulta por ID**: Si se envía `/ventas/{id}/` con barra final, FastAPI responde un redirect 307 al host interno, fallando la petición en el navegador.
  - *Mitigación*: Uso estricto de `Api.get('/ventas/' + id)` sin barra final.
- **[Riesgo] Importes decimales y conversión de tipo**: Los importes provienen como cadena ("25000.00") en las respuestas JSON del backend.
  - *Mitigación*: Se convierten a `Number` exclusivamente al momento de pasar el valor a `formatearImporteARS(Number(valor))`.
- **[Riesgo] Referencias residuales en app.js tras el borrado**:
  - *Mitigación*: Verificación exhaustiva con `Select-String` / `grep` de cada identificador eliminado para asegurar cero llamadas huérfanas.

## Verificación manual en navegador (http://127.0.0.1:8080 - 12/11/2026)

- **Selectores remotos**: Cargados dinámicamente desde la API (sin opciones cableadas a mano): cliente "Mateo", libros "Rayuela — $ 25.000,00" y "Los que aman, odian — $ 21.000,00".
- **Borrador en memoria**: Armado con Rayuela ×2 y Los que aman, odian ×1; al agregar de nuevo Los que aman, odian ×1 se incrementa la cantidad en el mismo renglón (×2). Visualiza "Total estimado: $ 92.000,00".
- **Rechazo y conservación de borrador**: Intento de registrar venta con cliente inexistente: durante el envío el botón queda deshabilitado con `aria-busy="true"`; se muestra la alerta "No se pudo registrar la venta: el cliente no existe o los datos son inválidos"; el borrador conserva intactos sus 2 renglones y el historial no se altera.
- **Venta válida confirmada**: Respuesta 201 con "Venta N.º 6 registrada correctamente." y despliegue del resumen confirmado con "Total confirmado: $ 92.000,00" y renglones ordenados alfabéticamente; borrador y formulario limpios; el historial suma la venta 6.
- **Persistencia tras recarga (F5)**: El historial muestra las ventas 1, 3 y 6; al abrir el detalle de la venta 6 vuelve a consultar la API por ID mostrando fecha, cliente (Mateo y su email), los dos renglones ordenados y "Total: $ 92.000,00".
- **Fechas y paginación**: Fechas mostradas en hora local argentina (19:36 UTC se visualiza como 16:36). Botones "Anterior" y "Siguiente" deshabilitados coherentemente al haber 3 ventas en total (< 10).
- **Desvío registrado**: Se borraron también las llamadas huérfanas a `renderSelectorLibrosVenta()` en `refrescarVistasLibros()` y a `renderSelectorClientesVenta()` en `refrescarVistasClientes()`, las cuales no figuraban en la ficha de CH-05; registrado en la ficha de CH-04 en `CHANGES.md`.
