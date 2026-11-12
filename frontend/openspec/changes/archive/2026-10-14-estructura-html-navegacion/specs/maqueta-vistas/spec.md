# Spec Delta: maqueta-vistas

## Purpose

Define la estructura semántica y el contenido estático de las 5 vistas de Editorial Codex, y fija el contrato de `id`/`name` del que depende la Etapa 2 para conectar datos y comportamiento sin reescribir el HTML.

## ADDED Requirements

### Requirement: Página única con estructura semántica
La aplicación SHALL ser un único `index.html` en español (`lang="es"`) con `header` (con un único `h1` "Editorial Codex"), `nav` y `main`; dentro de `main`, 5 `section` con ids `catalogo`, `libros`, `clientes`, `ventas`, `historial`, cada una titulada por un `h2` sin saltar niveles de encabezado.

#### Scenario: Apertura por file://
- **WHEN** se abre `index.html` con doble clic
- **THEN** la página carga sin errores en la consola, sin pedir recursos externos y muestra "Editorial Codex" como título

#### Scenario: Landmarks
- **WHEN** se inspecciona la página con las herramientas de accesibilidad del navegador
- **THEN** aparecen los landmarks banner, navigation y main, y 5 secciones con su encabezado

### Requirement: Contrato de id y name
Cada elemento listado en la tabla de contrato `id`/`name` de `knowledge-base/08_arquitectura_propuesta.md` SHALL existir en `index.html` con exactamente ese `id` y, cuando corresponde, ese `name`. El `README.md` SHALL contener una copia idéntica de esa tabla.

#### Scenario: Correspondencia 1 a 1
- **WHEN** se compara cada fila de la tabla del README con el HTML
- **THEN** cada `id` y `name` existe en el HTML y coincide exactamente

#### Scenario: Tablas sincronizadas
- **WHEN** se comparan la tabla de `knowledge-base/08` y la del `README.md`
- **THEN** son idénticas

### Requirement: Vista Catálogo maquetada
La vista Catálogo SHALL incluir un formulario de búsqueda por título y un listado de tarjetas estáticas de libros, cada una con título, ISBN, editorial, género, autores y precio; al menos una tarjeta SHALL mostrar el género «Sin clasificar».

#### Scenario: Datos de cada tarjeta
- **WHEN** se observa cualquier tarjeta del catálogo
- **THEN** muestra título, ISBN, editorial, género, autores y precio en formato `$ 1.500,00`

#### Scenario: Libro sin género
- **WHEN** se recorre el catálogo
- **THEN** al menos una tarjeta muestra «Sin clasificar» como género

### Requirement: Vistas de alta maquetadas
La vista Libros SHALL incluir el formulario de alta (título, ISBN, precio, editorial, género con opción «Sin clasificar» de valor vacío, autores como grupo de casillas con `fieldset`/`legend`) y una tabla con libros de ejemplo. La vista Clientes SHALL incluir el formulario (nombre completo, email) y una tabla con clientes de ejemplo.

#### Scenario: Selector de género
- **WHEN** se abre el selector de género del formulario de libros
- **THEN** incluye la opción «Sin clasificar» con valor vacío

#### Scenario: Autores agrupados
- **WHEN** se inspecciona el campo de autores
- **THEN** es un `fieldset` con `legend` y casillas con `name="autorIds"`

### Requirement: Vista Ventas maquetada
La vista Ventas SHALL incluir selector de cliente, selector de libro, cantidad, un botón para agregar renglón, una tabla de renglones con precio unitario y subtotal, el total y un botón para confirmar la venta.

#### Scenario: Renglones y total coherentes
- **WHEN** se observan los renglones de ejemplo
- **THEN** cada subtotal es cantidad × precio unitario y el total es la suma de subtotales, todos con 2 decimales en formato ARS

### Requirement: Vista Historial maquetada
La vista Historial SHALL incluir una tabla de ventas de ejemplo con id (formato `V-0001`), fecha (formato `dd/mm/aaaa hh:mm`), cliente, total y un control para ver el detalle, y un panel de detalle con los renglones de una venta.

#### Scenario: Formatos del historial
- **WHEN** se observa una fila del historial
- **THEN** el id tiene la forma `V-0001`, la fecha `dd/mm/aaaa hh:mm` y el total formato `$ 5.000,00`

### Requirement: Campos con etiqueta asociada
Cada campo de formulario SHALL tener un `label` asociado por `for`/`id`, y cada botón SHALL describir su acción con su texto.

#### Scenario: Clic en la etiqueta
- **WHEN** se hace clic en la etiqueta de cualquier campo
- **THEN** el foco pasa a ese campo

### Requirement: Tablas con encabezados
Cada tabla SHALL tener encabezados de columna `th` y un título (`caption`) que la identifique.

#### Scenario: Encabezados presentes
- **WHEN** se inspecciona cualquier tabla de la maqueta
- **THEN** tiene una fila de `th` con el nombre de cada columna

### Requirement: Mensajes de estado presentes y ocultos
Los mensajes de estado de cada vista (vacío, sin resultados, errores, resultado de operación) SHALL estar presentes en el HTML con su texto de ejemplo y ocultos con `hidden`. Los mensajes de error SHALL expresarse con texto (prefijo "Error:"), no solo con color.

#### Scenario: Mensajes ocultos al cargar
- **WHEN** se carga la página
- **THEN** `catalogo-sin-resultados`, `catalogo-vacio`, `libros-vacio`, `clientes-vacio`, `venta-renglones-vacio`, `historial-vacio` y los `*-errores`/`*-mensaje` existen en el DOM con `hidden`

#### Scenario: Mensaje revelado manualmente
- **WHEN** en DevTools se quita `hidden` a un contenedor de errores
- **THEN** su texto comunica el error sin depender del color

### Requirement: Controles de maqueta rotulados
Los controles que todavía no funcionan SHALL estar identificados como maqueta mediante un aviso visible en su vista, asociado a esos controles para lectores de pantalla.

#### Scenario: Aviso visible
- **WHEN** se muestra la vista Libros
- **THEN** se lee un aviso que indica que el formulario es una maqueta y aún no guarda datos

### Requirement: Formularios sin recarga
Ningún formulario de la maqueta SHALL recargar la página ni cambiar la URL al enviarse (Enter en un campo o clic en su botón de envío) cuando JavaScript está disponible.

#### Scenario: Enter en un formulario
- **WHEN** el operador presiona Enter dentro del campo email del formulario de clientes
- **THEN** la página no se recarga, la URL no cambia y la vista Clientes sigue visible

### Requirement: Datos y formatos de ejemplo
Los ejemplos estáticos SHALL usar los formatos finales: importes como `$ 1.500,00` (ARS, 2 decimales), fechas `dd/mm/aaaa hh:mm` e ids de venta `V-0001`, y SHALL ser coherentes entre vistas (los libros y clientes de ventas e historial existen en Catálogo, Libros y Clientes).

#### Scenario: Coherencia entre vistas
- **WHEN** se observa el cliente y los libros de la venta `V-0001` en el historial
- **THEN** ese cliente figura en la tabla de Clientes y esos libros en Catálogo y Libros
