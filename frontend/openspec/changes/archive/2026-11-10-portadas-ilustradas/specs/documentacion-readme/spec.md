# Spec Delta — documentacion-readme

## MODIFIED Requirements

### Requirement: Decisiones de la Etapa 1
El `README.md` SHALL resumir las decisiones de la Etapa 1: una página con secciones, tema oscuro con alternativa clara, tapas generadas con CSS (que ahora quedan como respaldo de las portadas ilustradas opcionales), contrato de `id`/`name` estable y la regla de filtro reutilizable con su firma y comportamiento, incluida la limitación de acentos.

#### Scenario: Reutilizar el filtro en la Etapa 2
- **WHEN** un integrante de la Etapa 2 busca cómo filtrar el array de libros
- **THEN** el README le indica la función `coincideTitulo(titulo, busqueda)`, que no toca el DOM, y qué devuelve con búsqueda vacía

## ADDED Requirements

### Requirement: Procedencia de las portadas ilustradas
El `README.md` SHALL documentar en «Recursos y procedencia» que las seis imágenes `assets/img/portadas/li-1.webp` a `li-6.webp` son ilustraciones generadas con IA (Gemini) para este proyecto, de uso educativo, guardadas localmente y sin pedidos externos. SHALL aclarar que la imagen ya contiene el título dibujado pero la tarjeta sigue mostrando el título, el autor y los datos como texto, y que la tapa CSS sigue existiendo como respaldo.

#### Scenario: Lectura de la procedencia
- **WHEN** se lee la sección «Recursos y procedencia» del README
- **THEN** indica que las seis portadas son generadas con IA (Gemini) para el proyecto, son locales y de uso educativo, y que la tapa CSS es el respaldo

### Requirement: Plantilla de verificación manual de portadas ilustradas
El `README.md` SHALL incluir una sección «Verificación manual — portadas ilustradas» con una tabla de pasos, resultado esperado y una columna Resultado inicialmente vacía. La tabla SHALL cubrir las seis portadas visibles, un libro nuevo con tapa CSS, una imagen renombrada con respaldo, 320 px, 1280 px, ambos temas y el filtro por título.

#### Scenario: Plantilla sin resultados inventados
- **WHEN** se abre la sección «Verificación manual — portadas ilustradas» antes de ejecutarla
- **THEN** cada fila tiene pasos y resultado esperado, y la columna Resultado está vacía o dice «Pendiente de ejecutar»

### Requirement: Registro honesto de la verificación de portadas
Al ejecutar la plantilla de portadas, cada fila SHALL registrar el resultado observado real. Una fila no ejecutada SHALL decir «Pendiente de ejecutar» y ninguna SHALL marcarse como aprobada sin haberse ejecutado.

#### Scenario: Registro de lo observado
- **WHEN** se ejecuta un paso de la plantilla
- **THEN** su fila registra el comportamiento real observado, aunque falle, sin marcarlo como aprobado si no se ejecutó
