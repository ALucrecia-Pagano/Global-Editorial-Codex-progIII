# Spec Delta

## Purpose

Muestra las ventas confirmadas en la vista Historial y permite consultar los renglones de cada una con los valores guardados al confirmarla, sin editar ni borrar ventas.

## ADDED Requirements

### Requirement: Listado de ventas confirmadas
`#historial-tabla` SHALL mostrar una fila por venta guardada válida con id, fecha `dd/mm/aaaa hh:mm`, cliente (el nombre guardado en la venta), total en formato ARS y un botón "Ver detalle de V-000X". Con ninguna venta SHALL mostrarse `#historial-vacio` y la tabla SHALL quedar sin filas. Los datos SHALL insertarse como texto.

#### Scenario: Historial vacío
- **WHEN** no hay ventas guardadas y se abre Historial
- **THEN** la tabla no tiene filas de ejemplo y se muestra `#historial-vacio`

#### Scenario: Fila de una venta
- **WHEN** se confirmó la venta `V-0001` de Carla Benítez por 5000
- **THEN** su fila muestra `V-0001`, la fecha como `dd/mm/aaaa hh:mm`, «Carla Benítez», `$ 5.000,00` y el botón "Ver detalle de V-0001"

#### Scenario: Actualización sin recargar
- **WHEN** se confirma una venta y se navega a Historial
- **THEN** la venta aparece sin recargar la página

### Requirement: Orden del historial
Las ventas SHALL listarse de la más reciente a la más antigua (mayor número de id primero), sin cambiar el orden en que están guardadas.

#### Scenario: Dos ventas
- **WHEN** existen `V-0001` y `V-0002`
- **THEN** la primera fila es `V-0002` y la segunda `V-0001`

### Requirement: Ver detalle con valores guardados
El botón "Ver detalle" SHALL ser operable con teclado y mostrar en `#historial-detalle` el título con el id de la venta (dentro de un `span.tabla__id`) y los renglones guardados: título, cantidad, precio unitario, subtotal y total, todos leídos de la venta guardada y nunca del precio actual del catálogo. El foco SHALL moverse al título del detalle. Antes de elegir una venta, el panel SHALL estar oculto.

#### Scenario: Detalle del caso manual 5
- **WHEN** se activa con Enter "Ver detalle de V-0001" (2 × 1500 y 1 × 2000)
- **THEN** `#historial-detalle` se muestra con «La casa del faro», 2, `$ 1.500,00`, `$ 3.000,00`; «Estrellas de papel», 1, `$ 2.000,00`, `$ 2.000,00`; total `$ 5.000,00`, y el foco queda en su título

#### Scenario: Id sin partir a 320 px
- **WHEN** a 320 px se muestra el detalle de `V-0001`
- **THEN** el id del título de la tabla está en un `span.tabla__id` y no se parte en el guion

#### Scenario: Precio histórico (caso manual 6)
- **WHEN** después de confirmar una venta se cambia solo el precio del libro dentro de `libreria.libros` en DevTools, sin tocar `libreria.ventas`, y se recarga
- **THEN** el detalle de esa venta muestra el precio unitario, los subtotales y el total confirmados, no el precio nuevo

#### Scenario: Datos con HTML en el detalle
- **WHEN** se abre el detalle de una venta con un libro titulado `<img src=x onerror=alert(1)>`
- **THEN** el título se ve como texto literal y no se ejecuta ningún código

### Requirement: Sin edición ni borrado en el historial
El historial no SHALL ofrecer controles para editar o eliminar ventas.

#### Scenario: Acciones disponibles
- **WHEN** se revisa la columna Acción del historial
- **THEN** cada fila tiene solo el botón "Ver detalle"
