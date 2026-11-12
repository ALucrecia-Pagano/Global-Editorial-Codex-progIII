# filtro-catalogo

## Purpose

Define cómo el operador filtra el catálogo de Editorial Codex por título: la regla de coincidencia (compartida entre la Etapa 1, que filtra las tarjetas estáticas, y la Etapa 2, que filtra el array de libros), la reacción del buscador, los mensajes visibles y anunciados, y el comportamiento sin JavaScript.

## ADDED Requirements

### Requirement: Regla de coincidencia por título
Un libro SHALL coincidir con la búsqueda cuando su título, en minúsculas, contiene como subcadena el texto buscado sin espacios al inicio ni al final y en minúsculas. Una búsqueda vacía o solo con espacios SHALL coincidir con todos los libros. No se aplica otra normalización (acentos ni signos).

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

#### Scenario: Acentos sin normalizar
- **WHEN** se busca `orbita` (sin tilde)
- **THEN** no coincide "Órbita lenta"; buscar `ÓRBITA` sí coincide

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
Cada tarjeta de `#catalogo-lista` SHALL mostrarse cuando su título coincide con la búsqueda y ocultarse con el atributo `hidden` cuando no coincide. El filtro SHALL comparar contra el título visible de la tarjeta, sin quitar ni crear tarjetas.

#### Scenario: Tarjetas ocultas siguen en el DOM
- **WHEN** se busca `mapa` y se inspecciona `#catalogo-lista`
- **THEN** siguen las 6 tarjetas en el DOM; 5 tienen `hidden` y "El mapa invisible" no

#### Scenario: Tarjetas ocultas fuera del recorrido de teclado
- **WHEN** hay tarjetas ocultas por el filtro y se recorre la vista con Tab
- **THEN** el foco no entra en ninguna tarjeta oculta

### Requirement: Mensaje sin resultados
Cuando el catálogo tiene tarjetas y ninguna coincide, `#catalogo-sin-resultados` SHALL mostrarse quitando su `hidden`; en cualquier otro caso SHALL quedar oculto. `#catalogo-vacio` no forma parte del filtro y conserva su estado.

#### Scenario: Texto inexistente
- **WHEN** se busca `xyz`
- **THEN** no se ve ninguna tarjeta y se ve el mensaje "No se encontraron libros que coincidan con la búsqueda."

#### Scenario: Vuelven las coincidencias
- **WHEN** después de buscar `xyz` el operador borra el texto
- **THEN** el mensaje sin resultados vuelve a ocultarse y se ven las 6 tarjetas

#### Scenario: Catálogo vacío no se confunde
- **WHEN** se filtra con cualquier texto
- **THEN** `#catalogo-vacio` sigue oculto

### Requirement: Resultado anunciado a lectores de pantalla
La vista Catálogo SHALL tener una zona de estado `#catalogo-resultados`, siempre presente, con `aria-live="polite"`, cuyo texto se actualiza solo con texto plano tras cada filtrado e informa cuántos libros se muestran; al cargar la página SHALL estar vacía.

#### Scenario: Cantidad de coincidencias
- **WHEN** se busca `de`
- **THEN** la zona `#catalogo-resultados` contiene "Se muestran 4 de 6 libros."

#### Scenario: Una sola coincidencia
- **WHEN** se busca `mapa`
- **THEN** la zona contiene "Se muestra 1 de 6 libros."

#### Scenario: Sin coincidencias
- **WHEN** se busca `xyz`
- **THEN** la zona contiene "No se encontraron libros que coincidan con la búsqueda."

#### Scenario: Búsqueda vacía
- **WHEN** el operador borra el texto del buscador
- **THEN** la zona contiene "Se muestran los 6 libros."

#### Scenario: Texto del usuario como texto
- **WHEN** se busca `<b>hola</b>`
- **THEN** no se crea ningún elemento nuevo en la página: la búsqueda se trata como texto y aparece el mensaje sin resultados

### Requirement: Degradación del filtro sin JavaScript
Sin JavaScript, el catálogo SHALL mostrar las 6 tarjetas y ningún mensaje de estado, y el buscador SHALL quedar visible y operable sin romper la página: enviarlo recarga `index.html` con el catálogo completo, sin filtrar.

#### Scenario: JavaScript deshabilitado
- **WHEN** se deshabilita JavaScript en DevTools, se recarga y se busca `mapa` con Enter
- **THEN** la página recarga mostrando las 6 tarjetas y ningún mensaje de sin resultados
