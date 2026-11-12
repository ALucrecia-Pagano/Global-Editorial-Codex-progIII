## REMOVED Requirements

### Requirement: Regla de coincidencia por título
**Reason**: Pedía comparar sin normalizar acentos (escenario «Acentos sin normalizar»: `orbita` no encontraba «Órbita lenta»), y la auditoría de la Etapa 1 pidió que el filtro ignore las tildes. Como el comportamiento se invierte, el requisito se reemplaza en lugar de modificarse.
**Migration**: La reemplaza «Regla de coincidencia por título sin mayúsculas ni tildes», que conserva los escenarios de mayúsculas, coincidencia parcial, espacios y búsqueda vacía. `coincideTitulo(titulo, busqueda)` mantiene la firma; quien la use (C-04 en adelante) no necesita cambios.

## ADDED Requirements

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
