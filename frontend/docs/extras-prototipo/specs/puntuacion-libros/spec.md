## Purpose

Permite al usuario dejar su propia puntuación de 1 a 5 estrellas en el detalle de cada libro, recordada en el navegador, y muestra en las tarjetas del catálogo y del carrusel una puntuación ficticia de solo lectura, ambas accesibles sin depender de lo visual.

## ADDED Requirements

### Requirement: Puntuación propia en el detalle
Cada detalle de libro SHALL incluir un grupo (`fieldset` con `legend` que nombre el libro) de 5 opciones de selección única, con etiquetas accesibles "1 de 5 estrellas" … "5 de 5 estrellas", que se dibujan como estrellas. El grupo SHALL operarse con teclado: Tab entra al grupo y las flechas cambian la selección.

#### Scenario: Puntuar con teclado
- **WHEN** en `#libro-li-1` el operador entra con Tab al grupo de estrellas y presiona flecha derecha hasta la cuarta
- **THEN** quedan marcadas visualmente 4 estrellas y el lector de pantalla anuncia "4 de 5 estrellas, seleccionado"

#### Scenario: Puntuar con el mouse
- **WHEN** el operador hace clic en la segunda estrella
- **THEN** quedan marcadas 2 estrellas

### Requirement: Puntuación propia recordada
La puntuación elegida en un detalle SHALL guardarse por libro y restaurarse al recargar la página; un libro sin puntuación guardada SHALL mostrarse sin ninguna estrella seleccionada. Al guardar, SHALL anunciarse una confirmación.

#### Scenario: Recargar
- **WHEN** el operador pone 4 estrellas a "La casa del faro", 2 a "Estrellas de papel" y recarga
- **THEN** cada detalle muestra su puntuación y el almacenamiento contiene `{"li-1":4,"li-2":2}` bajo `libreria.preferencias.puntuaciones`

#### Scenario: Confirmación
- **WHEN** el operador elige una puntuación
- **THEN** aparece un aviso de confirmación que se anuncia sin mover el foco

### Requirement: Puntuación de solo lectura en tarjetas
Cada tarjeta de libro del Catálogo y del carrusel SHALL mostrar una puntuación ficticia fija de 1 a 5 escrita en el HTML, dibujada solo con CSS, no interactiva, con texto accesible "N de 5 estrellas". Esta puntuación NO SHALL cambiar al puntuar en el detalle.

#### Scenario: Texto accesible
- **WHEN** el lector de pantalla recorre una tarjeta del catálogo
- **THEN** anuncia la puntuación como "4 de 5 estrellas" (o el valor de esa tarjeta), y no como una lista de símbolos

#### Scenario: Sin JavaScript
- **WHEN** se abre la página con JavaScript deshabilitado
- **THEN** las estrellas de las tarjetas se ven igual

#### Scenario: Independiente del detalle
- **WHEN** el operador pone 1 estrella en el detalle de un libro cuya tarjeta muestra 4
- **THEN** la tarjeta sigue mostrando 4 de 5 estrellas
