# filtro-catalogo Specification

## Purpose
Define cómo el operador filtra el catálogo de Editorial Codex por título: la regla de coincidencia (compartida entre la Etapa 1, que filtra las tarjetas estáticas, y la Etapa 2, que filtra el array de libros), la reacción del buscador, los mensajes visibles y anunciados, y el comportamiento sin JavaScript.

## Requirements

### Requirement: Regla de coincidencia por título sin mayúsculas ni tildes
Un libro SHALL coincidir con la búsqueda cuando su título contiene como subcadena el texto buscado, comparando ambos en minúsculas y sin tildes ni otros diacríticos, y quitando los espacios al inicio y al final de la búsqueda. Una búsqueda vacía o solo con espacios SHALL coincidir con todos los libros. No se aplica otra normalización (signos de puntuación ni espacios internos).

#### Scenario: Sin distinguir mayúsculas
- **WHEN** se busca `MAPA`
- **THEN** coincide el libro "El mapa invisible"

#### Scenario: Coincidencia parcial con varios resultados
- **WHEN** se busca `de`
- **THEN** coinciden "La casa del faro", "Estrellas de papel", "Cartas desde el sur" y "Manual de jardinería urbana", y no coinciden "Órbita lenta" ni "El mapa invisible"

#### Scenario: Espacios alrededor
- **WHEN** se busca `  faro  `
- **THEN** el resultado es el mismo que al buscar `faro`: coincide solo "La casa del faro"

#### Scenario: Búsqueda vacía
- **WHEN** la búsqueda es `""` o `"   "`
- **THEN** coinciden los 6 libros del catálogo

#### Scenario: Sin distinguir tildes
- **WHEN** se busca `orbita` y luego `ÓRBITA`
- **THEN** en los dos casos coincide "Órbita lenta"

#### Scenario: Tilde en la búsqueda y no en el título
- **WHEN** se busca `jardineria` y luego `jardinería`
- **THEN** en los dos casos coincide "Manual de jardinería urbana"

### Requirement: Regla reutilizable sin acceso al DOM
La regla de coincidencia SHALL estar disponible como una función global pura `coincideTitulo(titulo, busqueda)` que devuelve un booleano, no lee ni modifica el DOM y no depende de las tarjetas, para que la Etapa 2 la aplique sobre el array de libros sin reescribir la regla.

#### Scenario: Uso desde la consola
- **WHEN** en la consola de DevTools se evalúa `coincideTitulo('El mapa invisible', '  MAPA ')`
- **THEN** devuelve `true`, y `coincideTitulo('El mapa invisible', 'faro')` devuelve `false`, sin cambios visibles en la página

### Requirement: Filtro mientras se escribe
El catálogo SHALL filtrarse cada vez que cambia el contenido del campo `#catalogo-busqueda`, tanto al escribir o borrar (incluido el botón de limpiar del campo de búsqueda) como cuando el valor cambia sin teclear (pegar, autocompletar), sin necesidad de enviar el formulario.

#### Scenario: Escribir filtra al instante
- **WHEN** el operador escribe `papel` en el buscador
- **THEN** sin presionar Enter queda visible solo la tarjeta "Estrellas de papel"

#### Scenario: Borrar restaura el catálogo
- **WHEN** el operador borra todo el texto del buscador
- **THEN** vuelven a verse las 6 tarjetas

### Requirement: Envío del buscador sin recarga
El envío de `#form-busqueda` (Enter en el campo o clic en "Buscar") SHALL aplicar el filtro con el valor actual sin recargar la página, sin cambiar la URL y conservando el texto escrito.

#### Scenario: Enter en el buscador
- **WHEN** el operador escribe `cartas` y presiona Enter
- **THEN** la página no se recarga, la URL no cambia, el texto sigue en el campo y se ve solo "Cartas desde el sur"

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

### Requirement: Degradación del filtro sin JavaScript
Sin JavaScript, el catálogo SHALL mostrar las 6 tarjetas y ningún mensaje de estado, y el buscador SHALL quedar visible y operable sin romper la página: enviarlo recarga `index.html` con el catálogo completo, sin filtrar.

#### Scenario: JavaScript deshabilitado
- **WHEN** se deshabilita JavaScript en DevTools, se recarga y se busca `mapa` con Enter
- **THEN** la página recarga mostrando las 6 tarjetas y ningún mensaje de sin resultados
