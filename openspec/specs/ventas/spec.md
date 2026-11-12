# ventas Specification

## Purpose
Permite gestionar el ciclo de registro de ventas y consulta de historial en el frontend, interactuando con la API FastAPI y garantizando persistencia en backend e inmutabilidad de importes históricos.

## Requirements

### Requirement: Carga remota de opciones de venta
El sistema MUST cargar las listas de clientes (`GET /clientes/?limit=100`) y libros (`GET /libros/?limit=100`) mediante `Api.get` para poblar los selectores de la vista de ventas. Durante la carga, los controles MUST permanecer deshabilitados indicando estado de carga; ante fallos de conexión o HTTP, MUST mostrarse un mensaje de error y un botón para reintentar.

#### Scenario: Carga exitosa de selectores
- **WHEN** el usuario accede a la vista de ventas o se dispara la carga inicial
- **THEN** los selectores de cliente y libro se pueblan con las opciones recibidas de la API y quedan habilitados para su selección

#### Scenario: Error de conexión al cargar selectores
- **WHEN** la petición hacia la API falla o el backend no responde durante la carga de selectores
- **THEN** se muestra un mensaje de error visible cerca del formulario diferenciando errores de red y se ofrece un botón de reintento

### Requirement: Borrador de venta en memoria
El sistema MUST mantener los renglones de la venta en composición estrictamente en memoria del navegador sin escribir datos de dominio en `localStorage`. El sistema MUST permitir agregar libros con cantidades enteras positivas, consolidar renglones sumando cantidades si el libro ya fue añadido, eliminar renglones y calcular subtotales y total rotulados explícitamente como estimados.

#### Scenario: Agregar y sumar renglones
- **WHEN** el usuario selecciona un libro y especifica una cantidad entera mayor a cero
- **THEN** se agrega un renglón a la tabla del borrador; si el libro ya existía, se incrementa su cantidad sin duplicar renglones

#### Scenario: Quitar renglón
- **WHEN** el usuario presiona el botón de eliminar de un renglón del borrador
- **THEN** el renglón es removido de la memoria y la tabla y el total estimado se recalculan inmediatamente

### Requirement: Confirmación y persistencia de venta
El sistema MUST validar en el cliente los datos de la venta y enviar `POST /ventas/` con `cliente_id` y `renglones: [{libro_id, cantidad}]`, deshabilitando el botón de envío y mostrando `aria-busy`. Ante respuesta 201, MUST mostrar los importes provistos por el backend, limpiar el borrador y formulario y actualizar el historial. Ante error 409 o 422, MUST mostrar el mensaje del servidor y conservar el borrador.

#### Scenario: Confirmación exitosa con HTTP 201
- **WHEN** el usuario envía una venta válida y el servidor responde HTTP 201
- **THEN** se muestra mensaje de éxito con el ID asignado, se despliega el resumen con los importes devueltos por el servidor, se limpia el formulario y borrador y se refresca el historial

#### Scenario: Rechazo por conflicto o validación con HTTP 409 o 422
- **WHEN** el servidor responde HTTP 409 (cliente inexistente) o 422 (datos inválidos)
- **THEN** se muestra el mensaje de error provisto por la API en la zona de alertas y los renglones cargados en el borrador se conservan intactos en pantalla

### Requirement: Historial paginado de ventas
El sistema MUST obtener el listado de ventas mediante `GET /ventas/` con parámetros `limit` (fijo en 10) y `offset`, ofreciendo navegación con botones Anterior y Siguiente. Cada fila MUST mostrar número de venta, fecha en formato es-AR con hora, nombre del cliente (o `Cliente #id`), total confirmado y botón para ver detalle.

#### Scenario: Paginación de ventas
- **WHEN** el usuario visualiza el historial con más de 10 ventas y pulsa "Siguiente"
- **THEN** se consulta la API con el siguiente offset y se actualiza la tabla deshabilitando botones según corresponda

#### Scenario: Historial sin registros
- **WHEN** la consulta a `GET /ventas/` devuelve una lista vacía
- **THEN** se muestra un mensaje informativo indicando que todavía no hay ventas registradas

### Requirement: Detalle e inmutabilidad de venta histórica
El sistema MUST consultar el detalle de una venta mediante `GET /ventas/{id}` (sin barra final) y renderizar la información en el panel de detalle `#historial-detalle`. Los importes exhibidos (precio unitario, subtotal y total) MUST corresponder a los valores históricos devueltos por el backend, manteniéndose idénticos ante modificaciones posteriores en el catálogo de libros.

#### Scenario: Consulta de detalle por ID
- **WHEN** el usuario pulsa "Ver detalle" en una fila del historial
- **THEN** el sistema solicita `GET /ventas/{id}` y muestra la fecha, cliente (nombre y email), renglones e importes históricos confirmados

#### Scenario: Preservación de precios históricos ante cambio en catálogo
- **WHEN** se modifica el precio de un libro mediante `PATCH /libros/{id}` y luego se consulta una venta histórica previa
- **THEN** la venta histórica mantiene los importes con los que fue registrada originalmente sin reflejar el nuevo precio del catálogo
