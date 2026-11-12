## Purpose

Define la identidad visual de Editorial Codex (paleta, tipografía local, título, fondo galáctico en CSS, degradés, tapas en CSS y componentes reutilizables) y las garantías de presentación accesible y adaptable: contraste, foco visible, errores sin depender del color, 320/1280 px y tema claro/oscuro.

## ADDED Requirements

### Requirement: Estilos en archivos externos con clases reutilizables
Toda la presentación SHALL definirse en hojas de estilo externas, sin atributos `style` ni handlers inline, con clases BEM (`bloque__elemento--modificador`) reutilizadas para elementos equivalentes en todas las vistas, y con el layout resuelto con Flexbox y/o Grid.

#### Scenario: Sin estilos inline
- **WHEN** se busca `style=` y `on...=` en `index.html`
- **THEN** no aparece ninguna coincidencia

#### Scenario: Elementos equivalentes con la misma clase
- **WHEN** se inspeccionan los botones primarios de Catálogo, Libros, Clientes y Ventas
- **THEN** todos usan la misma clase de botón y se ven iguales

### Requirement: Recursos solo locales
La página SHALL cargar únicamente recursos del propio proyecto: hojas de estilo, scripts, la fuente Cinzel Decorative desde `fonts/`, el favicon SVG y la foto decorativa del banner del Catálogo (`assets/img/banner-biblioteca.jpg`, aplicada solo por CSS, también como fondo difuminado en el tema oscuro). NO SHALL pedir recursos externos ni usar imágenes de tapas ni de nebulosas/estrellas: la galaxia y las tapas se dibujan solo con CSS.

#### Scenario: Pestaña Network
- **WHEN** se recarga la página con la pestaña Network de DevTools abierta y se recorren todas las vistas
- **THEN** solo aparecen archivos locales (CSS, JS, fuente, favicon y el banner `banner-biblioteca.jpg`) y ninguna imagen de tapa ni de nebulosas/estrellas

### Requirement: Tapas de libro generadas con CSS
Cada tapa de libro (catálogo) SHALL dibujarse solo con CSS (degradé de fondo) con el título y el autor como texto, y SHALL ser decorativa para lectores de pantalla porque el título ya se anuncia en el contenido.

#### Scenario: Tapa sin imagen
- **WHEN** se inspecciona una tapa del catálogo
- **THEN** no es un `img` ni usa una imagen de fondo, y muestra el título y el autor como texto

### Requirement: Identidad visual del título
El título "Editorial Codex" SHALL usar la fuente local Cinzel Decorative, con texto en degradé blanco, lila, violeta y azul (con color sólido de respaldo), estrellas doradas y un ornamento decorativos (`aria-hidden`), y mostrar un efecto de brillo más intenso al pasar el cursor o recibir el foco. En el tema oscuro el encabezado SHALL ser transparente, sin franja opaca, y el título SHALL apoyarse en un resplandor violeta y en un velo oscuro radial difuso (sin generar desplazamiento horizontal a 320 px); en el tema claro SHALL ser idéntico al del tema oscuro. Con `prefers-reduced-motion: reduce` el título y los demás elementos NO SHALL animarse por sí solos, y con colores forzados (`forced-colors: active`) el texto SHALL seguir siendo visible con el color del sistema.

#### Scenario: Efecto en hover y foco
- **WHEN** el operador pasa el cursor o llega con Tab al título enlazado
- **THEN** se ve el efecto de brillo

#### Scenario: Movimiento reducido
- **WHEN** se emula `prefers-reduced-motion: reduce` en DevTools
- **THEN** ni el título ni el fondo se mueven solos

### Requirement: Fondo galáctico decorativo solo con CSS
En ambos temas, el fondo de la página fuera de los paneles SHALL ser un fondo "galáctico" dibujado solo con CSS (base negro azulado, nebulosas desaturadas ciruela, azul noche y violeta apagado, con un toque rosado muy tenue, con `radial-gradient` y estrellas chicas con capas de `radial-gradient` repetidas), decorativo (`pointer-events: none`, fuera del árbol de accesibilidad) y sin texto encima. Su movimiento lento SHALL existir solo con `prefers-reduced-motion: no-preference` y animar únicamente `transform` y `opacity`. En el tema claro SHALL ser el mismo (mismas capas, opacidades y animaciones), y solo los paneles SHALL ser claros. Además, en ambos temas una capa propia (`html::before`, fija, decorativa y por debajo de la galaxia) SHALL mostrar la foto local del banner (`assets/img/banner-biblioteca.jpg`) muy difuminada y oscurecida (`filter: blur` y `brightness`), sin animación, de modo que el velo galáctico siga siendo protagonista; esa capa SHALL ocultarse con `forced-colors`. Las reglas de `body::before` y `body::after` NO SHALL referenciar archivos de imagen.

#### Scenario: Fondo decorativo
- **WHEN** se inspecciona el árbol de accesibilidad
- **THEN** el fondo no aparece como imagen con nombre accesible ni se encuentra ninguna referencia a archivos de imagen en las reglas de `body::before` y `body::after` (la foto difuminada vive solo en `html::before`); el HTML no contiene ningún `<img>`

#### Scenario: Movimiento reducido en el fondo
- **WHEN** se emula `prefers-reduced-motion: reduce`
- **THEN** el fondo galáctico queda quieto

#### Scenario: Tema claro con el mismo fondo galáctico
- **WHEN** se activa el tema claro
- **THEN** el fondo de la página y el encabezado son idénticos a los del tema oscuro (foto difuminada, nebulosas y estrellas) y solo los paneles son claros, con todo el texto sobre superficies opacas

### Requirement: Superficies con degradé y acento rosa
`main`, la sidebar, las tarjetas y los contenedores de tabla SHALL usar un degradé sutil y sobrio (en el tema oscuro, ciruela profundo / azul noche sin magenta; en el tema claro, lavanda/rosa pálido) con borde violeta apagado y brillo suave de baja opacidad. SHALL existir un acento rosa apagado (`--color-acento-rosa`: lila rosado en el tema oscuro y una variante más oscura en el tema claro, nunca un rosa neón) usado en `:hover` de campos y de la hamburguesa y en el tooltip; el enlace activo de la sidebar usa el acento violeta (`--color-accent`). El contraste del texto SHALL calcularse contra el tramo más claro del degradé en el tema oscuro y contra el más oscuro en el tema claro; si un par no llega al mínimo, SHALL oscurecerse el degradé y no el texto.

#### Scenario: Degradé y acento visibles
- **WHEN** se observa la página en el tema oscuro
- **THEN** `main`, la sidebar, las tarjetas y las tablas muestran el degradé y el borde con brillo, el enlace activo de la sidebar muestra el borde en el acento violeta y el tooltip usa el acento rosa apagado

### Requirement: Contraste mínimo en ambos temas
Todo par texto/fondo SHALL tener contraste de al menos 4.5:1 (WCAG AA texto normal), tanto en el tema oscuro como en el tema claro, incluidos enlaces, textos secundarios, mensajes y el título de la marca.

#### Scenario: Cálculo con la fórmula WCAG
- **WHEN** se calcula con la fórmula de contraste de WCAG el texto secundario de una tarjeta contra el tramo crítico de su degradé en cada tema
- **THEN** el ratio es mayor o igual a 4.5:1 en los dos temas y queda registrado en la tabla del README

### Requirement: Foco visible
Todo elemento enfocable (enlaces, campos, botones, botones de sidebar y tema) SHALL mostrar al recibir foco por teclado un contorno de alto contraste (≥ 3:1 contra el fondo sobre el que se dibuja) con `:focus-visible`; NO SHALL quitarse el `outline` sin reemplazo. Sobre el título (velo oscuro sobre el fondo de la página, en ambos temas), el enlace de salto y el botón de colapsar de la sidebar (que sobresale sobre el fondo de la página, con foco rodeado de un halo oscuro en el tema claro) SHALL usarse `#ffd166` en ambos temas; sobre la barra superior en el tema claro (fondo claro) SHALL conservarse el color de foco del tema, porque `#ffd166` no cumple 3:1 sobre fondo claro.

#### Scenario: Recorrido con Tab
- **WHEN** el operador recorre con Tab cualquier vista en cada tema
- **THEN** el elemento enfocado siempre muestra un contorno visible

### Requirement: Errores y estados sin depender del color
Los mensajes de error SHALL comunicarse con texto (prefijo "Error:" o texto explícito) y los estados (activo, error, éxito) SHALL distinguirse por un rasgo además del color.

#### Scenario: Escala de grises
- **WHEN** se revela un mensaje de error y se observa la página en escala de grises
- **THEN** el error se entiende por su texto

### Requirement: Diseño adaptable a 320 px y 1280 px
Con estilos mobile-first, todas las vistas SHALL ser legibles a 320 px y a 1280 px de ancho sin scroll horizontal de la página; las tablas anchas SHALL desplazarse dentro de su propio contenedor.

#### Scenario: Sin scroll horizontal
- **WHEN** se emula 320 px y luego 1280 px en DevTools y se recorre cada vista
- **THEN** en consola `document.documentElement.scrollWidth <= window.innerWidth` da `true` en todas

#### Scenario: Tabla desplazable
- **WHEN** se muestra Historial a 320 px
- **THEN** la tabla se desplaza dentro de su contenedor y la página no

#### Scenario: Región con scroll enfocable
- **WHEN** a 320 px el operador llega con Tab a la tabla de Historial
- **THEN** el contenedor recibe foco visible y las flechas del teclado desplazan la tabla

### Requirement: Alternancia de tema claro y oscuro
La página SHALL ofrecer un botón para alternar entre tema oscuro y claro, con `aria-pressed` que refleje si el tema claro está activo y un nombre accesible que describa la acción. Sin preferencia guardada, el tema inicial SHALL seguir `prefers-color-scheme`; con preferencia guardada, SHALL usarse la guardada.

#### Scenario: Cambiar de tema
- **WHEN** el operador activa el botón de tema con Enter
- **THEN** cambian los colores de toda la página y `aria-pressed` cambia de valor

#### Scenario: Tema recordado
- **WHEN** el operador elige el tema claro y recarga la página
- **THEN** la página abre en tema claro

#### Scenario: Preferencia del sistema
- **WHEN** no hay tema guardado y se emula `prefers-color-scheme: light`
- **THEN** la página abre en tema claro
