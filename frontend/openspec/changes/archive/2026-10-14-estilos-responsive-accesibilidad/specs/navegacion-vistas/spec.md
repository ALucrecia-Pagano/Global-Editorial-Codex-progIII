## MODIFIED Requirements

### Requirement: Degradación sin JavaScript
Si JavaScript no está disponible, la página SHALL mostrar las 5 vistas una debajo de la otra, la navegación principal SHALL quedar visible (sin depender de la sidebar colapsable ni del botón hamburguesa) y sus enlaces SHALL seguir funcionando como anclas que desplazan a cada sección.

#### Scenario: JavaScript deshabilitado
- **WHEN** se abre la página con JavaScript deshabilitado y se activa el enlace "Ventas"
- **THEN** las 5 vistas son visibles y la página se desplaza hasta la sección Ventas

#### Scenario: Celular sin JavaScript
- **WHEN** se abre la página a 320 px con JavaScript deshabilitado
- **THEN** los enlaces del menú se ven y se pueden activar sin abrir ningún botón, y no aparecen los botones hamburguesa, de colapsar ni de tema
