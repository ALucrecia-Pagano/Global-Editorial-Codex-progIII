## MODIFIED Requirements

### Requirement: Controles de maqueta rotulados
Los controles que todavía no funcionan SHALL estar identificados como maqueta mediante un aviso visible en su vista, asociado a esos controles para lectores de pantalla. Un control que ya funciona SHALL dejar de llevar ese aviso; desde la Etapa 1 el buscador del Catálogo funciona y no lleva aviso de maqueta, mientras que Libros, Clientes, Ventas e Historial conservan el suyo.

#### Scenario: Aviso visible
- **WHEN** se muestra la vista Libros
- **THEN** se lee un aviso que indica que el formulario es una maqueta y aún no guarda datos

#### Scenario: Buscador del Catálogo sin aviso de maqueta
- **WHEN** se muestra la vista Catálogo
- **THEN** no hay aviso de maqueta y el campo de búsqueda no está descripto como maqueta para lectores de pantalla
