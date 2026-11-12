# alta-libros Specification

## Purpose

Permite registrar libros nuevos desde la vista Libros con opciones generadas desde los datos locales, validación de las reglas RN-LI, mensajes en texto y actualización inmediata de las vistas que muestran libros.

## Requirements

### Requirement: Opciones del formulario generadas desde los datos locales
Las opciones de editorial y género SHALL generarse desde los datos locales; el selector de género SHALL incluir «Sin clasificar» con valor vacío. Los autores SHALL generarse como casillas dentro del `fieldset` `#libro-autores`, conservando la estructura de la maqueta: `legend` con clase `formulario__leyenda` y, por autor, un contenedor `formulario__opcion` con una casilla `name="autorIds"` de id `libro-autor-N` y su `label` asociada por `for`.

#### Scenario: Selector de género con «Sin clasificar»
- **WHEN** se abre el selector de género del formulario de libros
- **THEN** la primera opción es «Sin clasificar» con valor vacío y luego aparece un género por cada género de los datos locales

#### Scenario: Casillas de autores con la estructura original
- **WHEN** se inspecciona `#libro-autores` en DevTools
- **THEN** tiene una `legend.formulario__leyenda` y un `div.formulario__opcion` por autor, cada uno con `input#libro-autor-N` y un `label` cuyo `for` es ese id, y se ven con el mismo estilo que la maqueta

#### Scenario: Clic en el nombre del autor
- **WHEN** el operador hace clic en el nombre de un autor
- **THEN** se marca o desmarca su casilla

### Requirement: Validación del libro
Un libro SHALL aceptarse solo si: título e ISBN no están vacíos; el ISBN, comparado sin espacios ni guiones y sin distinguir mayúsculas, no existe en los libros cargados; el precio es numérico y mayor que cero; la editorial existe; hay al menos un autor seleccionado y todos existen; y el género, si se eligió, existe.

#### Scenario: ISBN repetido con otro formato
- **WHEN** se intenta registrar un libro con ISBN `9789870001011` y ya existe `978-987-0001-01-1`
- **THEN** el libro no se agrega y se muestra un error en texto que indica que el ISBN ya está registrado

#### Scenario: Campos inválidos
- **WHEN** se envía el formulario con título vacío, precio `0`, `-5` o vacío, o sin autores
- **THEN** el libro no se agrega y se muestra un error en texto por cada problema

#### Scenario: Libro válido
- **WHEN** se envía un libro con todos los datos válidos y un ISBN nuevo
- **THEN** el libro se agrega, se guarda y se muestra un mensaje de éxito en `#libro-mensaje`

### Requirement: Envío controlado y mensajes en texto
El envío de `#form-libro` SHALL controlarse sin recargar la página. Los errores SHALL mostrarse como texto en `#libro-errores` (prefijo "Error:", no solo color), insertados como texto; cada campo con error SHALL marcarse con `aria-invalid="true"` y el foco SHALL ir al primer campo con error. Un nuevo envío SHALL reemplazar los mensajes anteriores.

#### Scenario: Errores anunciados y foco
- **WHEN** se envía el formulario con el título vacío
- **THEN** la página no se recarga, `#libro-errores` se muestra con el error en texto, el campo título queda con `aria-invalid="true"` y recibe el foco

#### Scenario: Corrección posterior
- **WHEN** después de un error se envía el formulario con datos válidos
- **THEN** `#libro-errores` se oculta, ningún campo queda con `aria-invalid="true"` y se muestra el mensaje de éxito

### Requirement: Refresco de las vistas tras un alta de libro
Tras un alta correcta, sin recargar la página, SHALL actualizarse la tabla de Libros, el catálogo aplicando la búsqueda activa, el contador de libros del Catálogo y el selector de libros de Ventas, y el formulario SHALL quedar limpio. La página no SHALL dar errores en consola.

#### Scenario: Libro nuevo visible en todas las vistas
- **WHEN** se registra un libro válido
- **THEN** aparece en la tabla de Libros, en el Catálogo y en el selector de libros de Ventas, el contador del Catálogo suma uno y la consola no muestra errores

#### Scenario: Alta con búsqueda activa
- **WHEN** el Catálogo tiene escrita la búsqueda `mapa` y se registra un libro cuyo título no contiene `mapa`
- **THEN** al volver al Catálogo se sigue viendo solo lo que coincide con `mapa`

#### Scenario: Libro con título con HTML
- **WHEN** se registra un libro con título `<img src=x onerror=alert(1)>`
- **THEN** el título se ve como texto literal en el Catálogo, la tabla de Libros, el selector de Ventas, los renglones y el historial, y no se ejecuta ningún código

### Requirement: Libro dado de alta sin género
Un libro registrado con «Sin clasificar» SHALL guardarse sin género y mostrarse como «Sin clasificar» en el Catálogo y en la tabla de Libros.

#### Scenario: Alta sin género
- **WHEN** se registra un libro dejando el género en «Sin clasificar»
- **THEN** su tarjeta del Catálogo y su fila de la tabla de Libros muestran «Sin clasificar»

### Requirement: Fallo al guardar un libro
Si el libro no se puede guardar en el navegador, la aplicación SHALL avisarlo con un mensaje de texto y seguir funcionando sin errores en consola.

#### Scenario: Almacenamiento no disponible
- **WHEN** se registra un libro válido y la escritura en `localStorage` falla
- **THEN** se muestra un mensaje de texto que indica que no se pudo guardar en el navegador y la página no se rompe
