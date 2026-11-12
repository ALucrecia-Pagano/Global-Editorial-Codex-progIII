## MODIFIED Requirements

### Requirement: Diseño adaptable a 320 px y 1280 px
Con estilos mobile-first, todas las vistas SHALL ser legibles a 320 px y a 1280 px de ancho sin scroll horizontal de la página. Las celdas de las tablas NO SHALL partir su contenido en varias líneas (ids como "V-0001", fechas, importes); cuando la tabla no entra en el ancho disponible SHALL desplazarse dentro de su propio contenedor. El título (`caption`) de cada tabla SHALL verse completo en el ancho visible del contenedor.

#### Scenario: Sin scroll horizontal
- **WHEN** se emula 320 px y luego 1280 px en DevTools y se recorre cada vista
- **THEN** en consola `document.documentElement.scrollWidth <= window.innerWidth` da `true` en todas

#### Scenario: Tabla desplazable
- **WHEN** se muestra Historial a 320 px
- **THEN** la tabla se desplaza dentro de su contenedor y la página no

#### Scenario: Celdas sin cortes
- **WHEN** se muestra Historial a 320 px
- **THEN** "V-0001", la fecha "13/10/2026 14:30" y el total se ven cada uno en una sola línea, sin partirse

#### Scenario: Título de tabla completo
- **WHEN** se muestra Historial a 320 px, sin desplazar la tabla del detalle
- **THEN** el título "Renglones de la venta V-0001" se lee completo (en una o más líneas) dentro del área visible de su contenedor, sin partir "V-0001" en el guion, y lo mismo ocurre con el título de las demás tablas

#### Scenario: Título fijo al desplazar
- **WHEN** a 320 px el operador desplaza horizontalmente una tabla hasta su última columna
- **THEN** el título de la tabla sigue visible a la izquierda del contenedor

#### Scenario: Región con scroll enfocable
- **WHEN** a 320 px el operador llega con Tab a la tabla de Historial
- **THEN** el contenedor recibe foco visible y las flechas del teclado desplazan la tabla
