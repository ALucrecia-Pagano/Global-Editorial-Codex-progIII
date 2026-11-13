# Spec Delta: catalogo

## Purpose

Permite a los usuarios consultar el catálogo de libros paginado desde la API, filtrar por fragmento de título, visualizar con claridad los estados de la interfaz y consultar el detalle de autores asociados a cada obra.

## ADDED Requirements

### Requirement: Consulta paginada del catálogo
El sistema MUST consultar la colección de libros mediante `GET /libros/?limit={limit}&offset={offset}&titulo={titulo}` y renderizar las tarjetas correspondientes con título, precio, género y portada.

#### Scenario: Carga inicial de catálogo
- **WHEN** el usuario accede a la vista `#catalogo`
- **THEN** el sistema solicita `GET /libros/?limit=20&offset=0` y dibuja las tarjetas con datos provistos por el servidor.

#### Scenario: Navegación paginada hacia adelante
- **WHEN** el usuario hace clic en el botón "Siguiente" existiendo registros adicionales
- **THEN** el sistema incrementa el `offset` según el `limit`, solicita el siguiente lote y actualiza la grilla y el indicador de página.

#### Scenario: Controles en los límites de paginación
- **WHEN** el usuario se encuentra en la primera página o en la última página de resultados
- **THEN** el botón "Anterior" permanece deshabilitado en la primera página y "Siguiente" se deshabilita cuando la respuesta contiene menos elementos que el `limit`.

### Requirement: Búsqueda de libros por fragmento de título
El sistema MUST permitir filtrar libros en el servidor mediante el parámetro de consulta `titulo`, reiniciando la paginación a la primera página.

#### Scenario: Búsqueda con coincidencias
- **WHEN** el usuario ingresa un término de búsqueda y confirma el formulario
- **THEN** el sistema consulta `GET /libros/` con el parámetro `titulo` y `offset=0`, actualizando el catálogo con los resultados coincidentes.

#### Scenario: Búsqueda sin coincidencias
- **WHEN** la consulta con filtro de título devuelve una lista vacía
- **THEN** el sistema muestra el mensaje "No se encontraron libros que coincidan con la búsqueda." y oculta los controles de paginación.

### Requirement: Gestión de los cuatro estados de interfaz
El sistema MUST presentar de manera diferenciada los cuatro estados de la vista: cargando, con datos, vacío y error de conexión.

#### Scenario: Visualización del estado de carga
- **WHEN** una petición a la API está en curso
- **THEN** el sistema muestra un indicador visible de carga y deshabilita temporalmente las acciones redundantes.

#### Scenario: Visualización del estado de error de conexión
- **WHEN** la llamada a la API falla por caída del backend o corte de red
- **THEN** el sistema muestra un mensaje de error accesible indicando el fallo de comunicación con la API.

### Requirement: Detalle del libro con autores asociados
El sistema MUST consultar `GET /libros/{id}` sin barra final y presentar la ficha completa del libro con sus autores al seleccionar una tarjeta.

#### Scenario: Apertura de ficha de detalle al cliquear tarjeta
- **WHEN** el usuario hace clic o presiona Enter en la tarjeta de un libro con identificador numérico
- **THEN** el sistema realiza la petición `GET /libros/{id}`, abre el modal accesible y muestra título, editorial, género, precio, stock y lista de autores con nombre, apellido y rol.

#### Scenario: Cierre del modal de detalle
- **WHEN** el usuario hace clic en el botón de cerrar, pulsa fuera del contenido o presiona la tecla Escape
- **THEN** el modal se oculta y el foco vuelve al elemento interactivo correspondiente.

### Requirement: Respaldo de género y portada neutra
El sistema MUST mostrar "Sin clasificar" cuando el libro carezca de género y presentar `assets/img/portada-fallback.svg` ante portadas no encontradas o errores de carga.

#### Scenario: Libro sin género asignado
- **WHEN** la API devuelve un libro con `genero: null` o `genero_id: null`
- **THEN** tanto la tarjeta como el modal de detalle muestran el texto "Sin clasificar".

#### Scenario: Reemplazo automático por portada fallback ante error de imagen
- **WHEN** el elemento de imagen de portada dispara el evento `onerror` al intentar cargar un archivo inexistente
- **THEN** el atributo `src` se conmuta automáticamente a `assets/img/portada-fallback.svg`.
