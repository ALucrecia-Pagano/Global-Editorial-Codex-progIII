# altas Specification

## Purpose
Permite gestionar el alta de libros y clientes en el frontend interactuando con la API FastAPI, validando datos local y remotamente, y notificando cambios a las vistas dependientes.

## Requirements

### Requirement: Carga remota de opciones relacionales para libros
El sistema MUST cargar las listas de editoriales (`GET /editoriales/?limit=100`), géneros (`GET /generos/?limit=100`) y autores (`GET /autores/?limit=100`) para poblar los selectores del formulario de libros.

#### Scenario: Carga exitosa de selectores de libro
- **WHEN** el usuario accede a la vista de libros o se inicializa la aplicación
- **THEN** los selectores de editorial, género y autor se pueblan con los datos provistos por la API y quedan habilitados para su selección

#### Scenario: Fallo de conexión al cargar selectores de libro
- **WHEN** la API no responde o se produce un error de red durante la carga de opciones
- **THEN** se muestra un mensaje de error visible indicando el problema de conexión y los selectores muestran un estado informativo

### Requirement: Alta y validación de libro
El sistema MUST validar en el cliente que título, ISBN y editorial no estén vacíos, que el precio sea mayor a cero, que el stock sea un entero mayor o igual a cero, y que se incluya al menos un autor con rol y orden antes de enviar `POST /libros/`.

#### Scenario: Registro exitoso de libro
- **WHEN** el usuario envía un libro con datos válidos y el servidor responde HTTP 201
- **THEN** se muestra mensaje de éxito, se lanzan destellos luminosos sobre el mensaje, se limpia el formulario y se actualiza el catálogo y la tabla de libros

#### Scenario: Validación fallida en el cliente para libro
- **WHEN** el usuario intenta enviar el formulario con campos obligatorios vacíos o valores numéricos inválidos
- **THEN** se bloquea el envío, se marcan los campos inválidos con mensajes de error al lado de cada control y se enfoca el primer campo con error

### Requirement: Alta y validación de cliente
El sistema MUST validar en el cliente que el nombre no esté vacío y que el email tenga un formato válido antes de enviar `POST /clientes/`.

#### Scenario: Registro exitoso de cliente
- **WHEN** el usuario envía un cliente con nombre y email válidos y el servidor responde HTTP 201
- **THEN** se muestra mensaje de éxito, se lanzan partículas de destellos, se limpia el formulario y se notifica el cambio a las demás vistas

#### Scenario: Validación fallida en el cliente para cliente
- **WHEN** el usuario envía el formulario con nombre vacío o email con formato incorrecto
- **THEN** se bloquea el envío y se despliegan mensajes de validación al lado de los campos afectados

### Requirement: Gestión de errores del servidor
El sistema MUST mostrar claramente los errores devueltos por el backend: errores 409 con el detalle de conflicto (ISBN o email duplicado), errores 422 con los mensajes por campo, y fallos de conexión indicando que el servidor no responde. El botón de envío MUST permanecer deshabilitado durante la petición.

#### Scenario: Conflicto por ISBN o email duplicado (HTTP 409)
- **WHEN** el servidor responde HTTP 409 ante un alta de libro o cliente
- **THEN** se muestra en pantalla el mensaje de conflicto devuelto por la API tanto en la zona de avisos como asociado al campo en conflicto

#### Scenario: Error de conexión con el backend
- **WHEN** se intenta registrar un libro o cliente con el backend apagado o inaccesible
- **THEN** el sistema captura `ApiError.esConexion` y muestra un mensaje claro indicando que el servidor no responde

### Requirement: Despacho de eventos de sincronización reactiva
El sistema MUST despachar eventos de dominio personalizados (`libros:cambiaron` y `clientes:cambiaron`) tras cada alta confirmada para que catálogo y ventas actualicen sus datos sin recargar la página.

#### Scenario: Sincronización tras alta de libro
- **WHEN** se completa exitosamente el alta de un libro
- **THEN** se dispara el evento `libros:cambiaron` en el documento y las vistas suscritas (catálogo y ventas) vuelven a consultar los datos automáticamente

#### Scenario: Sincronización tras alta de cliente
- **WHEN** se completa exitosamente el alta de un cliente
- **THEN** se dispara el evento `clientes:cambiaron` en el documento y el selector de clientes en ventas se actualiza de inmediato

### Requirement: Portada de respaldo para libros nuevos
El catálogo y el modal de detalle MUST utilizar la portada de respaldo SVG existente ante libros recién creados sin portada propia, sin emitir excepciones no controladas en la consola del navegador.

#### Scenario: Carga de portada de respaldo en libro recién creado
- **WHEN** se visualiza en el catálogo o modal un libro recién creado que no posee archivo de portada en el servidor
- **THEN** el evento de error de la imagen asigna la ruta de la portada de respaldo (`assets/img/portada-fallback.svg`) sin generar errores en la consola
