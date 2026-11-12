# Spec Delta

## MODIFIED Requirements

### Requirement: Mensaje sin resultados
Cuando el catálogo tiene libros y ninguno coincide, `#catalogo-sin-resultados` SHALL mostrarse quitando su `hidden`; en cualquier otro caso SHALL quedar oculto. `#catalogo-vacio` SHALL mostrarse solo cuando no hay libros y SHALL quedar oculto cuando hay al menos uno, aunque la búsqueda no coincida con ninguno.

#### Scenario: Texto inexistente
- **WHEN** hay libros y se busca `xyz`
- **THEN** no se ve ninguna tarjeta, se ve el mensaje "No se encontraron libros que coincidan con la búsqueda." y `#catalogo-vacio` sigue oculto

#### Scenario: Vuelven las coincidencias
- **WHEN** después de buscar `xyz` el operador borra el texto y hay libros
- **THEN** el mensaje sin resultados vuelve a ocultarse y se ven las tarjetas de esos libros

#### Scenario: Catálogo vacío no se confunde
- **WHEN** no hay libros y se filtra con cualquier texto, incluido el vacío
- **THEN** se ve `#catalogo-vacio` y `#catalogo-sin-resultados` permanece oculto

### Requirement: Resultado anunciado a lectores de pantalla
La vista Catálogo SHALL tener una zona de estado `#catalogo-resultados`, siempre presente, con `aria-live="polite"`, cuyo texto se actualiza solo con texto plano tras cada filtrado e informa cuántos libros se muestran. Cuando no hay libros, el texto SHALL ser "Todavía no hay libros en el catálogo."

#### Scenario: Cantidad de coincidencias
- **WHEN** hay 6 libros y se busca `de`
- **THEN** la zona `#catalogo-resultados` contiene "Se muestran 4 de 6 libros."

#### Scenario: Una sola coincidencia
- **WHEN** hay 6 libros y se busca `mapa`
- **THEN** la zona contiene "Se muestra 1 de 6 libros."

#### Scenario: Sin coincidencias
- **WHEN** hay libros y se busca `xyz`
- **THEN** la zona contiene "No se encontraron libros que coincidan con la búsqueda."

#### Scenario: Búsqueda vacía
- **WHEN** hay libros y el operador borra el texto del buscador
- **THEN** la zona contiene "Se muestran los 6 libros." si hay 6, o el total real de libros si es otro

#### Scenario: Texto del usuario como texto
- **WHEN** se busca `<b>hola</b>` y hay libros
- **THEN** no se crea ningún elemento nuevo en la página: la búsqueda se trata como texto y aparece el mensaje sin resultados

#### Scenario: Catálogo sin libros
- **WHEN** no hay libros
- **THEN** la zona contiene "Todavía no hay libros en el catálogo."
