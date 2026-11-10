# Spec Delta — estilos-tema

## MODIFIED Requirements

### Requirement: Recursos solo locales
La página SHALL cargar únicamente recursos del propio proyecto: hojas de estilo, scripts, la fuente Cinzel Decorative desde `fonts/`, el favicon SVG, la foto decorativa del banner del Catálogo (`assets/img/banner-biblioteca.jpg`, aplicada solo por CSS, también como fondo difuminado en ambos temas) y las portadas ilustradas locales `assets/img/portadas/li-1.webp` a `li-6.webp`. NO SHALL pedir recursos externos ni usar imágenes de nebulosas/estrellas: la galaxia se dibuja solo con CSS.

#### Scenario: Pestaña Network
- **WHEN** se recarga la página con la pestaña Network de DevTools abierta y se recorren todas las vistas
- **THEN** solo aparecen archivos locales (CSS, JS, fuente, favicon, el banner `banner-biblioteca.jpg` y las portadas de `assets/img/portadas/` que correspondan) y ningún recurso externo ni imagen de nebulosas/estrellas

#### Scenario: Portadas locales
- **WHEN** el Catálogo muestra sus seis libros iniciales
- **THEN** las portadas se piden a `assets/img/portadas/` del propio proyecto, sin CDN ni pedidos a otros dominios

### Requirement: Tapas de libro generadas con CSS
La tapa CSS (degradé de fondo con el título y el autor como texto) SHALL ser el respaldo de la portada del catálogo: se muestra cuando un libro no tiene portada ilustrada o cuando su imagen no se puede cargar. Cuando el libro sí tiene portada, la tarjeta SHALL mostrar la imagen local con `object-fit: cover` en una caja de proporción 2:3 y la tapa CSS SHALL quedar oculta. La tapa CSS SHALL ser decorativa para lectores de pantalla porque el título ya se anuncia en el contenido.

#### Scenario: Portada ilustrada en la tarjeta
- **WHEN** se inspecciona la tarjeta de un libro con portada
- **THEN** muestra la imagen local recortada con `object-fit: cover` en una caja 2:3 y la tapa CSS no es visible

#### Scenario: Tapa CSS como respaldo
- **WHEN** un libro no tiene portada o su imagen no carga
- **THEN** se ve la tapa CSS con el título y el autor como texto, no se ve ningún `<img>` roto y la tarjeta conserva el mismo alto

#### Scenario: Tapa sin imagen
- **WHEN** se inspecciona una tapa CSS de respaldo
- **THEN** no es un `img` ni usa una imagen de fondo, y muestra el título y el autor como texto

#### Scenario: Portada en ambos temas
- **WHEN** se alterna entre tema oscuro y tema claro con el Catálogo visible
- **THEN** la portada conserva su color y se ve completa, sin filtros de tema, sin recortes fuera de la caja y sin generar scroll horizontal
