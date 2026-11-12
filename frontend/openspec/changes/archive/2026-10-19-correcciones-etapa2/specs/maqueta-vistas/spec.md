# Spec Delta

## MODIFIED Requirements

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

## REMOVED Requirements

### Requirement: Controles de maqueta rotulados
**Reason**: En la Etapa 2 todos los controles de Libros, Clientes, Ventas e Historial funcionan; los avisos `aviso-maqueta-*` y sus `aria-describedby` ya no describen la realidad y confundirían al operador y a los lectores de pantalla.
**Migration**: Se quitan de `index.html` los párrafos `aviso-maqueta-libros`, `aviso-maqueta-clientes`, `aviso-maqueta-ventas` y `aviso-maqueta-historial` y todos los `aria-describedby` que apuntaban a ellos. Ningún `id` del contrato cambia (esos ids eran internos de la maqueta).

### Requirement: Datos y formatos de ejemplo
**Reason**: Ya no quedan ejemplos estáticos de ventas, renglones ni historial en el HTML: los datos salen de los arrays y de `localStorage`, y los formatos los garantizan los requisitos de `catalogo-dinamico`, `composicion-venta`, `confirmacion-venta` e `historial-ventas`.
**Migration**: Los formatos (`$ 1.500,00`, `dd/mm/aaaa hh:mm`, `V-0001`) se verifican sobre los datos generados, con los casos manuales 5 y 6.
