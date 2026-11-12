# Spec Delta

## Purpose

Permite armar el borrador de una venta en la vista Ventas: elegir cliente y libros, cargar y editar cantidades enteras positivas, evitar renglones repetidos y ver subtotales y total en pesos argentinos antes de confirmar.

## ADDED Requirements

### Requirement: Selectores de Ventas generados desde los datos
Los selectores `#venta-cliente` y `#venta-libro` SHALL generarse desde los clientes y libros cargados, con una primera opción vacía que pide elegir, y SHALL actualizarse tras cada alta de cliente o de libro. Los nombres y títulos SHALL insertarse como texto y los precios en formato ARS.

#### Scenario: Selectores al abrir Ventas
- **WHEN** se abre la vista Ventas
- **THEN** `#venta-cliente` lista todos los clientes y `#venta-libro` todos los libros, cada libro con su precio en formato `$ 1.500,00`

### Requirement: Cantidad entera mayor que cero
La cantidad SHALL aceptarse solo si es un número entero mayor que cero escrito solo con dígitos. Se SHALL rechazar `0`, negativos, decimales (por ejemplo `2.5` o `1,5`), notación exponencial y el campo vacío, con un error en texto.

#### Scenario: Cantidades inválidas al agregar
- **WHEN** se intenta agregar un renglón con cantidad `0`, `-1`, `2.5` o vacía
- **THEN** no se agrega ningún renglón y `#venta-errores` muestra un error en texto sobre la cantidad

#### Scenario: Sin libro elegido
- **WHEN** se presiona "Agregar renglón" sin elegir un libro
- **THEN** no se agrega ningún renglón y `#venta-errores` muestra un error en texto

#### Scenario: Cantidad válida
- **WHEN** se agrega "La casa del faro" con cantidad `2`
- **THEN** aparece un renglón con libro, cantidad 2, precio unitario `$ 1.500,00` y subtotal `$ 3.000,00`

### Requirement: Libro repetido en la venta
Agregar un libro que ya está en el borrador SHALL sumar la cantidad al renglón existente; nunca SHALL crearse un segundo renglón para el mismo libro.

#### Scenario: Mismo libro dos veces
- **WHEN** se agrega "La casa del faro" con cantidad 1 y luego otra vez con cantidad 1
- **THEN** hay un solo renglón de "La casa del faro" con cantidad 2 y subtotal `$ 3.000,00`

### Requirement: Cantidad editable por renglón
Cada renglón SHALL tener un campo de cantidad con etiqueta accesible que nombre el libro. Al cambiarlo SHALL aplicarse la misma validación; si es válida, se recalculan subtotal y total; si no, se muestra el error en texto, el campo queda con `aria-invalid="true"` y la venta no puede confirmarse hasta corregirlo. Enter en ese campo SHALL aplicar el cambio sin confirmar la venta.

#### Scenario: Cambiar cantidad
- **WHEN** en el renglón de "Estrellas de papel" (precio 2000) se cambia la cantidad de 1 a 3
- **THEN** su subtotal pasa a `$ 6.000,00` y el total se recalcula

#### Scenario: Cantidad editada inválida
- **WHEN** en un renglón se escribe `1.5` y se sale del campo
- **THEN** `#venta-errores` muestra un error en texto, el campo queda con `aria-invalid="true"` y el subtotal y el total no cambian

#### Scenario: Etiqueta del campo
- **WHEN** un lector de pantalla o el panel Accessibility llega al campo de cantidad del renglón de "La casa del faro"
- **THEN** su nombre accesible incluye "Cantidad" y "La casa del faro"

### Requirement: Quitar renglón
Cada renglón SHALL tener un botón "Quitar" operable con teclado que lo elimina del borrador y recalcula el total. Sin renglones, SHALL mostrarse `#venta-renglones-vacio` y el total `$ 0,00`.

#### Scenario: Quitar el único renglón
- **WHEN** se quita el único renglón del borrador
- **THEN** la tabla de renglones queda vacía, se muestra `#venta-renglones-vacio` y el total es `$ 0,00`

### Requirement: Subtotales y total en ARS
El subtotal de cada renglón SHALL ser cantidad × precio unitario y el total la suma de subtotales; todos SHALL mostrarse en formato ARS con dos decimales y separador de miles.

#### Scenario: Caso manual 5 (composición)
- **WHEN** se agregan 2 unidades de un libro de 1500 y 1 unidad de un libro de 2000
- **THEN** los subtotales son `$ 3.000,00` y `$ 2.000,00` y `#venta-total` muestra `$ 5.000,00`

### Requirement: Errores de venta en texto
Los errores de composición y confirmación SHALL mostrarse en `#venta-errores` como texto (prefijo "Error:"), sin ventanas `alert()`, y SHALL ocultarse al realizar una operación correcta.

#### Scenario: Sin alert
- **WHEN** se agrega un renglón con cantidad `0`
- **THEN** no aparece ninguna ventana emergente y el error se lee en `#venta-errores`

#### Scenario: Título con HTML en los renglones
- **WHEN** se agrega a la venta un libro cuyo título es `<img src=x onerror=alert(1)>`
- **THEN** el renglón muestra ese texto literal y no se ejecuta ningún código
