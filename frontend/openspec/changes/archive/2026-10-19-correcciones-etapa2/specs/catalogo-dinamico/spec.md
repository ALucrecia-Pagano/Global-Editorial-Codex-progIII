# Spec Delta

## ADDED Requirements

### Requirement: Búsqueda activa al volver al Catálogo
Cada vez que se muestra la vista Catálogo SHALL aplicarse la búsqueda que tenga escrita `#catalogo-busqueda`, con la misma regla de coincidencia y los mismos mensajes que al escribir.

#### Scenario: Volver desde otra vista
- **WHEN** se escribe `mapa` en el buscador, se navega a Libros y se vuelve al Catálogo
- **THEN** se ve solo «El mapa invisible» y el campo sigue diciendo `mapa`

#### Scenario: Búsqueda vacía al volver
- **WHEN** el buscador está vacío y se vuelve al Catálogo
- **THEN** se ven todos los libros

### Requirement: Género inexistente se muestra como «Sin clasificar»
Un libro cuyo `generoId` es nulo o no corresponde a ningún género cargado SHALL mostrarse como «Sin clasificar» en el Catálogo y en la tabla de Libros, sin modificar el `generoId` guardado.

#### Scenario: Id de género inexistente
- **WHEN** un libro de `libreria.libros` tiene `generoId` `"ge-99"` y se recarga la página
- **THEN** el Catálogo y la tabla de Libros muestran «Sin clasificar» para ese libro y `libreria.libros` sigue guardando `"ge-99"`

#### Scenario: Libro sin género
- **WHEN** un libro tiene `generoId` `null`
- **THEN** el Catálogo y la tabla de Libros muestran «Sin clasificar»

### Requirement: Contador de libros del Catálogo
El número de la tarjeta «Historias por descubrir» (`.bienvenida__cantidad`) SHALL mostrar la cantidad total de libros cargados (no los filtrados) y actualizarse tras cada alta de libro sin recargar.

#### Scenario: Contador inicial
- **WHEN** se abre la aplicación con los 6 libros iniciales
- **THEN** el contador muestra 6

#### Scenario: Contador tras un alta
- **WHEN** se registra un libro nuevo
- **THEN** el contador muestra 7 sin recargar la página, aunque haya una búsqueda activa
