## Purpose

Muestra en Inicio una fila desplazable de libros recomendados que se recorre con mouse (acercando el cursor a los bordes), con toque, y con teclado mediante botones anterior/siguiente, sin animaciones automáticas cuando el usuario pide movimiento reducido.

## ADDED Requirements

### Requirement: Fila de recomendados
Inicio SHALL mostrar una región "Recomendados" con nombre accesible, que contenga los 6 libros del catálogo de ejemplo como tarjetas (tapa CSS, título, autor, precio, estrellas de solo lectura y enlace al detalle) en una fila con desplazamiento horizontal propio, sin provocar scroll horizontal de la página.

#### Scenario: Fila a 320 px
- **WHEN** se muestra Inicio a 320 px
- **THEN** el carrusel se desplaza dentro de su contenedor y la página no tiene scroll horizontal

### Requirement: Botones anterior y siguiente
El carrusel SHALL tener botones "Anterior" y "Siguiente" con nombre accesible que desplazan la fila aproximadamente un ancho visible; cuando no se puede desplazar más en una dirección, el botón de esa dirección SHALL quedar deshabilitado.

#### Scenario: Recorrer con teclado
- **WHEN** el operador llega con Tab al botón "Siguiente" y presiona Enter
- **THEN** la fila se desplaza mostrando libros que antes no se veían

#### Scenario: Extremo inicial
- **WHEN** la fila está al comienzo
- **THEN** el botón "Anterior" está deshabilitado

### Requirement: Desplazamiento al acercar el cursor a los bordes
Con un mouse, acercar el cursor a la zona del borde izquierdo o derecho de la fila SHALL desplazarla de forma continua en esa dirección hasta que el cursor salga de la zona o se llegue al extremo. Con `prefers-reduced-motion: reduce` este desplazamiento automático NO SHALL ocurrir; los botones SHALL seguir funcionando.

#### Scenario: Cursor en el borde derecho
- **WHEN** a 1280 px el operador deja el cursor sobre el borde derecho de la fila
- **THEN** la fila avanza sola y se detiene al sacar el cursor

#### Scenario: Movimiento reducido
- **WHEN** se emula `prefers-reduced-motion: reduce` y se deja el cursor sobre el borde
- **THEN** la fila no se mueve sola

### Requirement: Enlaces del carrusel enfocables
Al recorrer con Tab los enlaces de las tarjetas del carrusel, la tarjeta enfocada SHALL quedar visible dentro de la fila.

#### Scenario: Foco en una tarjeta oculta
- **WHEN** el operador avanza con Tab hasta la última tarjeta del carrusel
- **THEN** la fila se desplaza para mostrarla con su contorno de foco visible
