# Tasks: CH-05 ventas-e-historial

## 1. Maquetación y estilos

- [x] 1.1 Actualizar `frontend/public/index.html` vinculando `css/ventas.css` después de `styles.css` y `js/ventas.js` después de `app.js`.
- [x] 1.2 Limpiar las `<option>` hardcodeadas en `#venta-cliente` y `#venta-libro` en `index.html` (dejando únicamente la opción vacía inicial) y preparar los contenedores de paginación e información de carga.
- [x] 1.3 Crear `frontend/public/css/ventas.css` con estilos complementarios para etiquetas estimadas, resumen confirmado y controles de paginación del historial.

## 2. Limpieza de código obsoleto en app.js

- [x] 2.1 Borrar de `frontend/public/js/app.js` las 22 variables y funciones de ventas e historial autorizadas en la ficha de CH-05.
- [x] 2.2 Borrar de `frontend/public/js/app.js` en el listener `DOMContentLoaded` las 6 llamadas a funciones obsoletas de ventas e historial.
- [x] 2.3 Ejecutar verificación con grep en `app.js` confirmando que no quedan referencias residuales a los identificadores borrados.

## 3. Implementación del módulo ventas.js

- [x] 3.1 Crear la estructura IIFE en `frontend/public/js/ventas.js` y programar la carga remota de selectores (`GET /clientes/?limit=100`, `GET /libros/?limit=100`) con estados de carga, deshabilitación y reintento ante fallos.
- [x] 3.2 Implementar la gestión del borrador exclusivamente en memoria: agregar renglón (incrementando cantidad si el libro ya está presente), modificar cantidad, remover renglón y calcular totales rotulados como estimados.
- [x] 3.3 Implementar la confirmación de la venta: validación previa en cliente, envío `POST /ventas/` con `cliente_id` y `renglones`, bloqueo del botón con `aria-busy`, renderizado de importes confirmados devueltos por el backend con 201, y preservación del borrador ante respuestas 409 o 422.
- [x] 3.4 Implementar el historial paginado de ventas (`GET /ventas/?limit=10&offset={offset}`), navegación con Anterior/Siguiente, estados vacío/error, y consulta de detalle histórico por ID (`GET /ventas/{id}` sin barra final).

## 4. Verificación y persistencia

- [x] 4.1 Reconstruir la imagen y relanzar el contenedor `libreria-frontend` en el puerto 8080 con upstream a `host.docker.internal:8000`.
- [x] 4.2 Ejecutar suite de pruebas con `curl` a través de `http://127.0.0.1:8080/api`: endpoints de catálogo/clientes, registro 201 de venta válida con dos renglones, consulta de historial y detalle, y comprobación de rechazos 422 y 409 sin alteración del historial.
- [x] 4.3 Comprobar caso G-05 de inmutabilidad de precios históricos: modificar precio con `PATCH /libros/1`, verificar que la venta histórica mantiene sus importes originales y restaurar el precio en el catálogo.
