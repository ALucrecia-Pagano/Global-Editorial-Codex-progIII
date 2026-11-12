# Spec Delta

## MODIFIED Requirements

### Requirement: Protección contra JSON corrupto
Si un valor de `localStorage` tiene JSON corrupto o inválido, la aplicación SHALL no romperse: volver al seed inicial para esa clave y mostrar un mensaje de error con texto. Si `localStorage` está bloqueado o no es accesible, la clave SHALL tratarse como ausente: la aplicación usa los datos iniciales y no SHALL mostrar el aviso de datos corruptos.

#### Scenario: JSON corrupto en libreria.libros
- **WHEN** `libreria.libros` contiene JSON inválido y se recarga la página
- **THEN** la aplicación no lanza excepción, usa el seed de libros y muestra un mensaje de error al usuario

#### Scenario: JSON inválido escrito a mano
- **WHEN** en DevTools > Application > Local Storage se cambia `libreria.libros` a `{x` y se recarga
- **THEN** se muestra el aviso de datos corruptos (`#error-persistencia`) y el Catálogo muestra los libros iniciales

#### Scenario: Almacenamiento bloqueado al arrancar
- **WHEN** la página se abre por `file://` en una ventana privada o con los datos del sitio bloqueados, de modo que leer `localStorage` falla
- **THEN** no aparece el aviso de datos corruptos, la página funciona con los datos iniciales y la consola no muestra errores

## ADDED Requirements

### Requirement: Elementos inválidos ignorados al arrancar
Al arrancar, de cada array guardado en `libreria.libros`, `libreria.clientes` y `libreria.ventas` SHALL usarse solo los elementos que son objetos con los datos mínimos de su entidad; los demás (por ejemplo `null`, números, textos u objetos incompletos) SHALL ignorarse sin romper el render ni dar errores en consola. El arranque no SHALL reescribir una clave existente solo para quitar esos elementos.

#### Scenario: Libro nulo guardado
- **WHEN** `libreria.libros` contiene `[null]` o mezcla `null` con libros válidos y se recarga
- **THEN** la página se muestra sin errores en consola, el Catálogo y la tabla de Libros muestran solo los libros válidos y el valor guardado no cambia

#### Scenario: Cliente inválido guardado
- **WHEN** `libreria.clientes` contiene `[1, {"nombreCompleto": "Sin email"}]` y se recarga
- **THEN** esos elementos no aparecen en la tabla ni en el selector de Ventas y la consola no muestra errores

### Requirement: Ventas con formato viejo ignoradas
Las ventas guardadas que no tienen el formato actual (por ejemplo, con `detalle` en lugar de `renglones`, sin `clienteNombre` o con renglones incompletos) SHALL ignorarse: no se muestran en el historial, no cuentan para el id correlativo y no generan errores en consola.

#### Scenario: Venta del formato anterior
- **WHEN** `libreria.ventas` contiene una venta `{id: "V-1729000000", detalle: [...]}` sin `renglones` y se recarga
- **THEN** el historial no la muestra, la página no se rompe y la próxima venta confirmada recibe `V-0001` si no hay otras válidas

### Requirement: Escrituras solo a través del repositorio
Toda escritura de libros, clientes y ventas SHALL hacerse con la función de guardado del repositorio, sin accesos directos a `localStorage`. Si la escritura falla, la vista que la pidió SHALL mostrar un mensaje de texto que lo indique.

#### Scenario: Almacenamiento bloqueado
- **WHEN** el almacenamiento del navegador rechaza la escritura durante un alta o una venta
- **THEN** no hay excepción en consola y se lee un mensaje que indica que no se pudo guardar en el navegador
