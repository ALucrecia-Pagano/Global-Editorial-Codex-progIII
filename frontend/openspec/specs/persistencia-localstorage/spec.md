# persistencia-localstorage Specification

## Purpose

Persiste los datos de dominio (libros, clientes, ventas) en `localStorage` del navegador con un repositorio único de carga/guardado, comportamiento de arranque con seed y protección contra valores corruptos.

## Requirements

### Requirement: Repositorio único de localStorage
El sistema SHALL exponer funciones `cargar(clave)` y `guardar(clave, datos)` como único punto de acceso a `localStorage` para las claves `libreria.libros`, `libreria.clientes` y `libreria.ventas`.

#### Scenario: Cargar datos existentes
- **WHEN** se llama a `cargar('libreria.libros')` con datos válidos en localStorage
- **THEN** devuelve el array de libros parseado desde JSON

#### Scenario: Guardar datos
- **WHEN** se llama a `guardar('libreria.libros', arrayDeLibros)`
- **THEN** se escribe el JSON serializado en `localStorage` bajo la clave `libreria.libros`

### Requirement: Arranque con seed cuando faltan claves
La aplicación SHALL, al iniciarse, verificar si cada clave de dominio está presente en `localStorage`; si falta, cargar los seed iniciales y guardarlos; si está presente, usar lo guardado sin mezclar con seed.

#### Scenario: Primera apertura sin datos guardados
- **WHEN** se abre la aplicación y `localStorage` no tiene `libreria.libros`
- **THEN** se cargan los seed iniciales de libros y se guardan en `localStorage`

#### Scenario: Apertura con datos ya guardados
- **WHEN** se abre la aplicación y `libreria.libros` ya existe en `localStorage`
- **THEN** se usan los libros guardados, sin duplicar los seed iniciales

#### Scenario: Clientes y ventas arrancan igual
- **WHEN** se abre la aplicación y faltan `libreria.clientes` o `libreria.ventas`
- **THEN** se cargan sus respectivos seeds iniciales y se guardan

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

### Requirement: Claves de localStorage documentadas
Las claves `libreria.libros`, `libreria.clientes` y `libreria.ventas` SHALL documentarse en el README con su estructura y límites (navegador, perfil, ubicación de apertura, no compartido entre usuarios).

#### Scenario: Documentación en README
- **WHEN** se lee el README del proyecto
- **THEN** encuentra la sección que documenta las claves de `localStorage` y su propósito

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
