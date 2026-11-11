# Spec Delta — catalogo-dinamico

## ADDED Requirements

### Requirement: Portada ilustrada opcional
Un libro SHALL poder declarar un campo opcional `portada` con la ruta relativa a una imagen local. Cuando la tarjeta del Catálogo tenga una portada disponible, SHALL mostrar un `<img>` con `alt="Portada de «<título>»"`, `loading="lazy"`, `decoding="async"` y atributos `width="600"` y `height="900"`, dentro de una caja de proporción 2:3 con recorte `object-fit: cover`. El título, el autor y los demás datos de la tarjeta SHALL seguir presentes como texto HTML insertado con `textContent`.

#### Scenario: Libro con portada
- **WHEN** se renderiza la tarjeta de un libro que tiene `portada`
- **THEN** la tarjeta muestra un `<img>` con `alt="Portada de «<título>»"`, `loading="lazy"`, `decoding="async"`, `width="600"` y `height="900"`, y la imagen se recorta con `object-fit: cover` en una caja 2:3

#### Scenario: Texto de la tarjeta se mantiene
- **WHEN** un libro con portada ilustrada aparece en el Catálogo
- **THEN** su título, autor, ISBN, editorial, género y precio siguen visibles como texto, el filtro por título lo encuentra igual y un lector de pantalla puede leerlos

#### Scenario: La portada no altera el filtro ni el contador
- **WHEN** se filtra el Catálogo o se registra un libro nuevo
- **THEN** las portadas no cambian la cantidad de resultados, el mensaje de estado ni el contador de libros

### Requirement: Respaldo con la tapa CSS
Cuando un libro no tenga portada disponible o su imagen no se pueda cargar, la tarjeta SHALL mostrar la tapa CSS existente (degradé con título y autor) dentro de la misma caja 2:3. No SHALL quedar una caja vacía ni el ícono de imagen rota. La imagen fallida SHALL ocultarse para que el navegador no muestre el ícono de error.

#### Scenario: Libro sin portada
- **WHEN** se renderiza la tarjeta de un libro sin campo `portada`, por ejemplo uno dado de alta desde el formulario
- **THEN** se muestra la tapa CSS con el título y el autor, sin elemento `<img>`

#### Scenario: Imagen que no carga
- **WHEN** la ruta de `portada` apunta a un archivo renombrado, eliminado o inaccesible
- **THEN** la tarjeta oculta la imagen rota y muestra la tapa CSS en la misma caja, sin cambiar el alto de la tarjeta

#### Scenario: La tapa CSS sigue siendo decorativa
- **WHEN** la tarjeta muestra la tapa CSS como respaldo
- **THEN** la tapa y su texto duplicado quedan fuera del árbol de accesibilidad y el título se anuncia una sola vez desde el encabezado de la tarjeta

### Requirement: Compatibilidad con libros guardados sin portada
Al renderizar un libro cargado de `localStorage` que no tenga el campo `portada`, el sistema SHALL resolver la imagen mediante un mapa de ids conocidos (`li-1` a `li-6` → `assets/img/portadas/<id>.webp`). Un libro sin `portada` cuyo id no esté en el mapa SHALL mostrar la tapa CSS. La aplicación NO SHALL reescribir `libreria.libros` al arrancar solo para agregar el campo.

#### Scenario: Libro viejo con id conocido
- **WHEN** `libreria.libros` contiene un libro guardado con id `li-1` y sin el campo `portada`
- **THEN** su tarjeta muestra la imagen `assets/img/portadas/li-1.webp`

#### Scenario: Libro viejo con id desconocido
- **WHEN** `libreria.libros` contiene un libro guardado con un id que no está en el mapa de ids conocidos y sin el campo `portada`
- **THEN** su tarjeta muestra la tapa CSS

#### Scenario: Datos viejos no se reescriben
- **WHEN** se abre la aplicación con libros guardados que no tienen el campo `portada`
- **THEN** el valor de `libreria.libros` conserva su forma original y no se le agrega el campo automáticamente
