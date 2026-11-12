## MODIFIED Requirements

### Requirement: Página única con estructura semántica
La aplicación SHALL ser un único `index.html` en español (`lang="es"`) con un skip-link como primer elemento enfocable que lleva a `main#contenido`, un `header` con un único `h1` "Editorial Codex", un `aside` que contiene el `nav` principal, una barra superior como región con nombre accesible y `main`. Dentro de `main` SHALL haber 5 `section` de vista con ids `catalogo`, `libros`, `clientes`, `ventas` e `historial`, cada una titulada por un `h2` sin saltar niveles de encabezado.

#### Scenario: Apertura por file://
- **WHEN** se abre `index.html` con doble clic
- **THEN** la página carga sin errores en la consola, sin pedir recursos externos y muestra "Editorial Codex" como título

#### Scenario: Landmarks
- **WHEN** se inspecciona la página con las herramientas de accesibilidad del navegador
- **THEN** aparecen los landmarks banner, complementary (con la navegación adentro), navigation, region "Barra superior" y main, y una sección con encabezado por cada una de las 5 vistas

#### Scenario: Barra superior dentro de un landmark
- **WHEN** se inspecciona la barra superior (hamburguesa, enlace Inicio, "Tu espacio de lectura" y botón de tema)
- **THEN** su contenedor tiene rol `region` con nombre accesible "Barra superior", conserva los `id` `menu-abrir` y `tema-alternar`, y ningún texto de la página queda fuera de un landmark

#### Scenario: Skip-link
- **WHEN** se carga la página y se presiona Tab una vez
- **THEN** aparece visible el enlace "Saltar al contenido" y al activarlo el foco pasa al contenido principal

### Requirement: Tablas con encabezados
Cada tabla SHALL tener encabezados de columna `th` y un título (`caption`) que la identifique. Cada tabla SHALL estar dentro de un contenedor desplazable que sea un elemento `section` nativo (sin `role` explícito), con nombre accesible propio y enfocable con Tab.

#### Scenario: Encabezados presentes
- **WHEN** se inspecciona cualquier tabla de la maqueta
- **THEN** tiene una fila de `th` con el nombre de cada columna

#### Scenario: Contenedor de tabla nativo
- **WHEN** se inspeccionan los 5 contenedores de tabla en el HTML y en el panel Accessibility de DevTools
- **THEN** cada uno es un `<section>` sin atributo `role`, con su `aria-label` (por ejemplo "Tabla de ventas registradas"), `tabindex="0"`, y se expone con rol `region` y ese nombre
