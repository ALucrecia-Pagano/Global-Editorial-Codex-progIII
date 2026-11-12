## MODIFIED Requirements

### Requirement: Menú hamburguesa en celular
En anchos de celular la sidebar SHALL estar oculta por defecto y abrirse con un botón hamburguesa (`aria-expanded`, `aria-controls`). Abierta, SHALL poder cerrarse con un botón de cerrar, con la tecla Escape, tocando fuera de ella (el velo) o al activar un enlace; al cerrarse con el botón de cerrar, con Escape o tocando el velo el foco SHALL volver al botón hamburguesa (nunca quedar en `body`). Cerrada, sus enlaces NO SHALL ser alcanzables con Tab.

#### Scenario: Abrir y cerrar con teclado
- **WHEN** a 320 px el operador activa la hamburguesa con Enter y luego presiona Escape
- **THEN** la sidebar se abre, luego se cierra, y el foco queda en el botón hamburguesa

#### Scenario: Cerrar tocando el velo
- **WHEN** a 320 px el operador abre el menú y luego hace clic sobre el velo, fuera de la sidebar
- **THEN** la sidebar se cierra, `aria-expanded` de la hamburguesa pasa a `"false"` y `document.activeElement` es el botón hamburguesa

#### Scenario: Navegar desde el menú abierto
- **WHEN** con el menú abierto el operador activa el enlace "Clientes"
- **THEN** se muestra Clientes y el menú se cierra

#### Scenario: Menú cerrado fuera del orden de foco
- **WHEN** a 320 px con el menú cerrado el operador recorre la página con Tab
- **THEN** el foco no pasa por los enlaces ocultos de la sidebar
