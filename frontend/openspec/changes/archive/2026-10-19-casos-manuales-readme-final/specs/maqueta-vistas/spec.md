# Spec Delta

## MODIFIED Requirements

### Requirement: Mensajes de estado presentes y ocultos
Los mensajes de estado de cada vista (vacío, sin resultados, errores, resultado de operación) SHALL estar presentes en el HTML con su texto de ejemplo. En el HTML inicial SHALL llevar `hidden`. Los mensajes de error SHALL expresarse con texto (prefijo "Error:"), no solo con color. Después de renderizar, `#catalogo-vacio`, `#libros-vacio` y `#clientes-vacio` SHALL ocultarse solo cuando su colección tiene al menos un elemento, y SHALL mostrarse cuando esa colección tiene longitud 0.

#### Scenario: Mensajes ocultos al cargar
- **WHEN** se carga la página con el seed (hay libros y clientes)
- **THEN** `catalogo-sin-resultados`, `catalogo-vacio`, `libros-vacio`, `clientes-vacio` y los `*-errores`/`*-mensaje` existen en el DOM con `hidden`

#### Scenario: Mensaje revelado manualmente
- **WHEN** en DevTools se quita `hidden` a un contenedor de errores
- **THEN** su texto comunica el error sin depender del color

#### Scenario: Lista vacía
- **WHEN** la colección de libros, la de clientes o el catálogo queda en cero elementos
- **THEN** se muestra el mensaje vacío de esa lista (`#libros-vacio`, `#clientes-vacio` o `#catalogo-vacio`) y vuelve a ocultarse cuando la colección tiene elementos
