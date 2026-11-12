# Spec Delta

## MODIFIED Requirements

### Requirement: Visibilidad de las tarjetas
El catálogo SHALL renderizarse desde el array `libros` aplicando `coincideTitulo` sobre cada entrada, creando o quitando tarjetas dinámicamente en `#catalogo-lista` según coincidan o no con la búsqueda. El filtro SHALL comparar contra el título de cada libro del array; las tarjetas que no coinciden no se renderizan.

#### Scenario: Filtrar re-renderiza desde el array
- **WHEN** se busca `mapa`
- **THEN** se renderiza solo la tarjeta "El mapa invisible" y las demás no aparecen en `#catalogo-lista`

#### Scenario: Búsqueda vacía muestra todos los libros
- **WHEN** el buscador está vacío
- **THEN** se renderizan todos los libros del array `libros` en `#catalogo-lista`

#### Scenario: Texto inexistente no renderiza tarjetas
- **WHEN** se busca `xyz`
- **THEN** no se renderiza ninguna tarjeta en `#catalogo-lista`

#### Scenario: Tarjetas fuera del recorrido de teclado
- **WHEN** hay tarjetas no renderizadas por el filtro y se recorre la vista con Tab
- **THEN** el foco no entra en ninguna tarjeta que no existe en el DOM
