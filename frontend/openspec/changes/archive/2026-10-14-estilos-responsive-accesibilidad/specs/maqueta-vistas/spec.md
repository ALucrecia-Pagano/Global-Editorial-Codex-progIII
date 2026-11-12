## MODIFIED Requirements

### Requirement: Página única con estructura semántica
La aplicación SHALL ser un único `index.html` en español (`lang="es"`) con un skip-link como primer elemento enfocable que lleva a `main#contenido`, un `header` con un único `h1` "Editorial Codex", un `aside` que contiene el `nav` principal, y `main`. Dentro de `main` SHALL haber 5 `section` con ids `catalogo`, `libros`, `clientes`, `ventas` e `historial`, cada una titulada por un `h2` sin saltar niveles de encabezado.

#### Scenario: Apertura por file://
- **WHEN** se abre `index.html` con doble clic
- **THEN** la página carga sin errores en la consola, sin pedir recursos externos y muestra "Editorial Codex" como título

#### Scenario: Landmarks
- **WHEN** se inspecciona la página con las herramientas de accesibilidad del navegador
- **THEN** aparecen los landmarks banner, complementary (con la navegación adentro), navigation y main, y una sección con encabezado por cada una de las 5 vistas

#### Scenario: Skip-link
- **WHEN** se carga la página y se presiona Tab una vez
- **THEN** aparece visible el enlace "Saltar al contenido" y al activarlo el foco pasa al contenido principal
