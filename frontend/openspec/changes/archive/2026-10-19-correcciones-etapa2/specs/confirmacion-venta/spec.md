# Spec Delta

## Purpose

Define cómo se confirma una venta: qué impide confirmarla, qué datos se guardan (con el precio unitario como valor histórico), cómo se numera y qué ve el operador después de confirmar.

## ADDED Requirements

### Requirement: Condiciones para confirmar
La venta SHALL confirmarse solo con un cliente existente elegido, al menos un renglón y todas las cantidades válidas. En otro caso no SHALL registrarse nada y `#venta-errores` SHALL mostrar el motivo en texto.

#### Scenario: Sin cliente
- **WHEN** se presiona "Confirmar venta" con renglones pero sin cliente elegido
- **THEN** no se registra ninguna venta y se muestra un error en texto sobre el cliente

#### Scenario: Sin renglones
- **WHEN** se presiona "Confirmar venta" con cliente elegido y sin renglones
- **THEN** no se registra ninguna venta y se muestra un error en texto que pide agregar al menos un libro

#### Scenario: Cantidad inválida pendiente
- **WHEN** un renglón tiene en su campo la cantidad `0` y se presiona "Confirmar venta"
- **THEN** no se registra ninguna venta y se muestra un error en texto sobre la cantidad

### Requirement: Formato de la venta guardada
La venta confirmada SHALL guardarse en `libreria.ventas` con la forma `{id, fecha, clienteId, clienteNombre, renglones: [{libroId, titulo, cantidad, precioUnitario, subtotal}], total}`: `fecha` en ISO 8601, `clienteNombre` y `titulo` copiados al confirmar, importes como números (sin formato) y `precioUnitario` copiado del catálogo como valor histórico.

#### Scenario: Venta del caso manual 5
- **WHEN** se confirma una venta de 2 unidades de "La casa del faro" (1500) y 1 de "Estrellas de papel" (2000) para Carla Benítez
- **THEN** en DevTools > Application > Local Storage, `libreria.ventas` contiene una venta con `clienteNombre` "Carla Benítez", dos objetos en `renglones` con `precioUnitario` 1500 y 2000 y `subtotal` 3000 y 2000, `total` 5000 y una `fecha` ISO

### Requirement: Id correlativo de venta
El id de cada venta SHALL tener la forma `V-` seguida de un número de al menos cuatro dígitos completado con ceros, y SHALL ser el siguiente al mayor número de las ventas válidas guardadas; con ninguna venta, `V-0001`. Los ids que no tienen esa forma se ignoran para el cálculo.

#### Scenario: Primera y segunda venta
- **WHEN** no hay ventas guardadas y se confirman dos ventas
- **THEN** sus ids son `V-0001` y `V-0002`

#### Scenario: Después de recargar
- **WHEN** existen `V-0001` y `V-0002`, se recarga la página y se confirma otra venta
- **THEN** su id es `V-0003`

### Requirement: Resultado de la confirmación
Tras confirmar SHALL mostrarse en `#venta-mensaje` un mensaje de éxito con el id de la venta, el borrador y el formulario SHALL quedar limpios (sin renglones, total `$ 0,00`) y el historial SHALL actualizarse sin recargar. Si la venta no se pudo guardar en el navegador, SHALL mostrarse un mensaje de texto que lo indique.

#### Scenario: Confirmación correcta
- **WHEN** se confirma una venta válida
- **THEN** se lee "Venta V-000X registrada correctamente." (con su id), no quedan renglones, el total es `$ 0,00` y la venta ya aparece en el Historial

#### Scenario: Escritura fallida
- **WHEN** se confirma una venta válida y la escritura en `localStorage` falla
- **THEN** se muestra un mensaje de texto que indica que la venta no se pudo guardar en el navegador y la página no se rompe

### Requirement: Venta inmutable
Una venta confirmada no SHALL poder editarse ni eliminarse desde la interfaz.

#### Scenario: Sin controles de edición
- **WHEN** se revisan las vistas Ventas e Historial después de confirmar
- **THEN** no hay ningún control para editar o borrar ventas confirmadas
