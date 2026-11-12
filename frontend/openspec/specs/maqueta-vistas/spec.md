# maqueta-vistas Specification

## Purpose

Define la estructura semántica y el contenido estático de las 5 vistas de Editorial Codex, y fija el contrato de `id`/`name` del que depende la Etapa 2 para conectar datos y comportamiento sin reescribir el HTML.

## Requirements

### Requirement: Página única con estructura semántica
La aplicación SHALL ser un único `index.html` en español (`lang="es"`) con un skip-link como primer elemento enfocable que lleva a `main#contenido`, un `header` con un único `h1` "Editorial Codex", un `aside` que contiene el `nav` principal, una barra superior como región con nombre accesible y `main`. Dentro de `main` SHALL haber 5 `section` de vista con ids `catalogo`, `libros`, `clientes`, `ventas` e `historial`, cada una titulada por un `h2` sin saltar niveles de encabezado.

#### Scenario: Apertura por file://
- **WHEN** se abre `index.html` con doble clic
- **THEN** la página carga sin errores en la consola, sin pedir recursos externos y muestra "Editorial Codex" como título

#### Scenario: Landmarks
- **WHEN** se inspecciona la página con las herramientas de accesibilidad del navegador
- **THEN** aparecen los landmarks banner, complementary (con la navegación adentro), navigation, region "Barra superior" y main, y una sección con encabezado por cada una de las 5 vistas

#### Scenario: Barra superior dentro de un landmark
- **WHEN** se inspecciona la barra superior (hamburguesa, enlace Inicio, "Tu espacio de lectura" y botón de tema)
- **THEN** su contenedor tiene rol `region` con nombre accesible "Barra superior", conserva los `id` `menu-abrir` y `tema-alternar`, y ningún texto de la página queda fuera de un landmark

#### Scenario: Skip-link
- **WHEN** se carga la página y se presiona Tab una vez
- **THEN** aparece visible el enlace "Saltar al contenido" y al activarlo el foco pasa al contenido principal

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
La vista Libros SHALL incluir el formulario de alta (título, ISBN, precio, editorial, género con opción «Sin clasificar» de valor vacío, autores como grupo de casillas con `fieldset`/`legend`) y una tabla cuyas filas se generan desde los libros cargados. La vista Clientes SHALL incluir el formulario (nombre completo, email) y una tabla cuyas filas se generan desde los clientes cargados.

#### Scenario: Selector de género
- **WHEN** se abre el selector de género del formulario de libros
- **THEN** incluye la opción «Sin clasificar» con valor vacío

#### Scenario: Autores agrupados
- **WHEN** se inspecciona el campo de autores
- **THEN** es un `fieldset` con `legend` y casillas con `name="autorIds"`

### Requirement: Vista Ventas maquetada
La vista Ventas SHALL incluir selector de cliente, selector de libro, cantidad, un botón para agregar renglón, una tabla de renglones con precio unitario y subtotal, el total y un botón para confirmar la venta. El HTML no SHALL traer renglones de ejemplo: los renglones los genera la composición de la venta y, sin renglones, se muestra `#venta-renglones-vacio`.

#### Scenario: Renglones y total coherentes
- **WHEN** se observan los renglones agregados a la venta
- **THEN** cada subtotal es cantidad × precio unitario y el total es la suma de subtotales, todos con 2 decimales en formato ARS

#### Scenario: Sin renglones de ejemplo
- **WHEN** se abre la vista Ventas sin haber agregado libros
- **THEN** `#venta-renglones` no tiene filas, se muestra `#venta-renglones-vacio` y el total es `$ 0,00`

### Requirement: Vista Historial maquetada
La vista Historial SHALL incluir una tabla de ventas con id (formato `V-0001`), fecha (formato `dd/mm/aaaa hh:mm`), cliente, total y un control para ver el detalle, y un panel de detalle con los renglones de una venta. El HTML no SHALL traer ventas ni renglones de ejemplo: el estado vacío lo muestra `#historial-vacio` y el panel de detalle permanece oculto hasta elegir una venta.

#### Scenario: Formatos del historial
- **WHEN** se observa una fila del historial generada desde una venta confirmada
- **THEN** el id tiene la forma `V-0001`, la fecha `dd/mm/aaaa hh:mm` y el total formato `$ 5.000,00`

#### Scenario: Sin ventas de ejemplo
- **WHEN** se abre Historial sin ventas guardadas
- **THEN** `#historial-tabla` no tiene filas, se muestra `#historial-vacio` y `#historial-detalle` está oculto

### Requirement: Campos con etiqueta asociada
Cada campo de formulario SHALL tener un `label` asociado por `for`/`id`, y cada botón SHALL describir su acción con su texto.

#### Scenario: Clic en la etiqueta
- **WHEN** se hace clic en la etiqueta de cualquier campo
- **THEN** el foco pasa a ese campo

### Requirement: Tablas con encabezados
Cada tabla SHALL tener encabezados de columna `th` y un título (`caption`) que la identifique. Cada tabla SHALL estar dentro de un contenedor desplazable que sea un elemento `section` nativo (sin `role` explícito), con nombre accesible propio y enfocable con Tab.

#### Scenario: Encabezados presentes
- **WHEN** se inspecciona cualquier tabla de la maqueta
- **THEN** tiene una fila de `th` con el nombre de cada columna

#### Scenario: Contenedor de tabla nativo
- **WHEN** se inspeccionan los 5 contenedores de tabla en el HTML y en el panel Accessibility de DevTools
- **THEN** cada uno es un `<section>` sin atributo `role`, con su `aria-label` (por ejemplo "Tabla de ventas registradas"), `tabindex="0"`, y se expone con rol `region` y ese nombre

### Requirement: Mensajes de estado presentes y ocultos
Los mensajes de estado de cada vista (vacío, sin resultados, errores, resultado de operación) SHALL estar presentes en el HTML con su texto de ejemplo. En el HTML inicial SHALL llevar `hidden`. Los mensajes de error SHALL expresarse con texto (prefijo "Error:"), no solo con color. Después de renderizar, `#catalogo-vacio`, `#libros-vacio` y `#clientes-vacio` SHALL ocultarse solo cuando su colección tiene al menos un elemento, y SHALL mostrarse cuando esa colección tiene longitud 0.

#### Scenario: Mensajes ocultos al cargar
- **WHEN** se carga la página con el seed (hay libros y clientes)
- **THEN** `catalogo-sin-resultados`, `catalogo-vacio`, `libros-vacio`, `clientes-vacio` y los `*-errores`/`*-mensaje` existen en el DOM con `hidden`

#### Scenario: Mensaje revelado manualmente
- **WHEN** en DevTools se quita `hidden` a un contenedor de errores
- **THEN** su texto comunica el error sin depender del color

#### Scenario: Lista vacía
- **WHEN** la colección de libros, la de clientes o el catálogo queda en cero elementos
- **THEN** se muestra el mensaje vacío de esa lista (`#libros-vacio`, `#clientes-vacio` o `#catalogo-vacio`) y vuelve a ocultarse cuando la colección tiene elementos

### Requirement: Formularios sin recarga
Ningún formulario de la maqueta SHALL recargar la página ni cambiar la URL al enviarse (Enter en un campo o clic en su botón de envío) cuando JavaScript está disponible.

#### Scenario: Enter en un formulario
- **WHEN** el operador presiona Enter dentro del campo email del formulario de clientes
- **THEN** la página no se recarga, la URL no cambia y la vista Clientes sigue visible
