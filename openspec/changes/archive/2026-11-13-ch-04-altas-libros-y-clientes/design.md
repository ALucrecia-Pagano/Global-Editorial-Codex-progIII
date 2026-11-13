# Design: CH-04 altas-libros-y-clientes

## Context

El proyecto utiliza JavaScript ES nativo sin herramientas de empaquetado ni frameworks. Las vistas de altas de libros (`#libros`) y de clientes (`#clientes`) funcionaban en base a simulaciones del primer parcial en `js/app.js`, almacenando datos de prueba en `localStorage`. CH-04 traslada toda la lógica de alta a `frontend/public/js/altas.js` y `frontend/public/css/altas.css`, conectándola con los endpoints de la API FastAPI mediante el cliente `window.Api`.

## Goals / Non-Goals

**Goals:**
- Implementar un módulo autónomo IIFE (`js/altas.js`) para gestionar las altas de libros y clientes.
- Cargar opciones remotas para editoriales (`GET /editoriales/?limit=100`), géneros (`GET /generos/?limit=100`) y autores (`GET /autores/?limit=100`).
- Modelar autorías completas para libros (`autor_id`, `rol`, `orden`) permitiendo asignar múltiples autores con sus roles (`autor`, `coautor`, `traductor`, `ilustrador`).
- Validar exhaustivamente en el cliente antes del envío y desplegar mensajes de error junto a cada campo y en banner accesible (`role="alert"`).
- Gestionar respuestas del servidor: 201 (éxito con destellos y reseteo), 409 (conflicto por ISBN/email duplicado), 422 (errores de validación Pydantic) y errores de conexión (`ApiError.esConexion`).
- Deshabilitar botones de envío durante la petición para prevenir envíos duplicados.
- Notificar cambios a otras vistas mediante `document.dispatchEvent(new CustomEvent('libros:cambiaron'))` y `clientes:cambiaron`.
- Asegurar visualización de portada de respaldo (`portada-fallback.svg`) para libros nuevos en catálogo.
- Limpiar de forma quirúrgica en `app.js` únicamente el bloque viejo de altas y tablas de libros/clientes.

**Non-Goals:**
- Modificar el backend FastAPI o sus modelos.
- Modificar `frontend/public/css/styles.css` (reservado para CH-06).
- Borrar funciones compartidas de nombres en `app.js` (`obtenerNombreEditorial`, etc., reservadas para CH-06).
- Implementar librerías externas o dependencias npm.

## Decisions

### 1. Selección y gestión de autorías múltiples
- **Decisión:** Proveer un selector de autor (`#libro-autor-select`) junto con un selector de rol (`#libro-autor-rol`) y un botón "Agregar autor". Los autores agregados se listan dinámicamente con su rol, orden y opción para quitar. Como optimización ergonómica, si el usuario seleccionó un autor en el dropdown pero no presionó "Agregar autor" antes de enviar, el submit lo incorpora automáticamente como autor principal.
- **Alternativas consideradas:**
  - Checkboxes estáticos como en el primer parcial: descartado porque no permitían asignar rol (`coautor`, `traductor`, etc.) ni orden exigidos por `AutoriaCreate` en FastAPI.

### 2. Mensajes de error en dos niveles (campo y banner)
- **Decisión:** Cada campo posee un elemento `<span class="formulario__error-campo" id="error-..." aria-live="polite">` adyacente. Al fallar la validación (local o remota), se colorea el control (`formulario__control--invalido`), se coloca `aria-invalid="true"`, se escribe el texto en el span correspondiente y se muestra además el resumen en `#libro-errores` o `#cliente-errores`.
- **Alternativas consideradas:**
  - Solo alerta global arriba: descartado porque la consigna exige explícitamente "mensajes al lado del campo".

### 3. Comunicación reactiva desacoplada entre vistas
- **Decisión:** Al completar exitosamente un alta, se despacha un evento en `document`: `new CustomEvent('libros:cambiaron', { detail: libro })` o `new CustomEvent('clientes:cambiaron', { detail: cliente })`. En `catalogo.js` y `ventas.js` se agregan listeners mínimos que vuelven a invocar sus funciones de recarga (`actualizarContadorCatalogo()`, `cargarCatalogo()` y `cargarOpciones()`).
- **Alternativas consideradas:**
  - Invocar directamente funciones globales de catálogo o ventas: descartado para mantener independencia total y aislamiento entre módulos.

### 4. Portada de respaldo para libros nuevos
- **Decisión:** Los libros nuevos creados vía API no poseen archivo webp en `assets/img/portadas/{isbn}.webp`. El catálogo ya dispone de un manejador `onerror` en las imágenes que redirige a `assets/img/portada-fallback.svg`. Se verifica que la carga ocurra limpiamente sin errores no capturados en consola.

## Risks / Trade-offs

- **[Riesgo: Intentar registrar el mismo autor dos veces en un libro]** → **Mitigación:** La función de agregar autor en el front verifica si el `autor_id` ya fue añadido y emite una advertencia al usuario.
- **[Riesgo: Error 409 con mensaje no estándar del backend]** → **Mitigación:** Se lee `error.message` que ya procesa el campo `detail` de FastAPI en `api.js`. Si el mensaje menciona "ISBN", se asocia también al campo ISBN; si menciona "email", se asocia al campo email.
- **[Riesgo: Pérdida de estado al fallar el envío]** → **Mitigación:** Los valores ingresados en los campos del formulario se conservan íntegros cuando el servidor rechaza la petición con 409 o 422.
