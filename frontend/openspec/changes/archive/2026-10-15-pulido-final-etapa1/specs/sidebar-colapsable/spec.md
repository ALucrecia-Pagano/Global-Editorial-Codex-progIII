## ADDED Requirements

### Requirement: Marca de la sidebar como texto
La marca "Editorial CODEX" de la cabecera de la sidebar SHALL ser solo texto con el mismo aspecto visual: NO SHALL ser un enlace, NO SHALL recibir foco con Tab ni mostrar efecto de hover o foco. Llevar al Catálogo SHALL seguir siendo posible con el título de la página, el enlace "Inicio" de la barra superior y el enlace Catálogo del menú.

#### Scenario: La marca no recibe foco
- **WHEN** a 1280 px el operador recorre la sidebar con Tab
- **THEN** el foco pasa del contenido anterior a los enlaces del menú sin detenerse en "Editorial CODEX"

#### Scenario: Caminos al Catálogo
- **WHEN** desde Clientes el operador activa el título "Editorial Codex", luego vuelve a Clientes y activa "Inicio", y luego vuelve a Clientes y activa el enlace Catálogo del menú
- **THEN** cada vez se muestra el Catálogo

#### Scenario: Marca sin enlace en el menú móvil
- **WHEN** a 320 px el operador abre el menú y hace clic sobre "Editorial CODEX"
- **THEN** no navega ni cierra el menú, y la consola no muestra errores
