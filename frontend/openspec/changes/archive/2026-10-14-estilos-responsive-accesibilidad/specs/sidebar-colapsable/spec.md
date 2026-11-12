## Purpose

Ubica la navegación principal en una barra lateral que en escritorio se puede colapsar a solo íconos y en celular se abre y cierra con un botón hamburguesa, siempre operable con teclado y anunciada correctamente a lectores de pantalla.

## ADDED Requirements

### Requirement: Colapsar la sidebar en escritorio
En anchos de escritorio la sidebar SHALL tener un botón con flecha que la colapsa y la expande, con `aria-controls` apuntando a la sidebar, `aria-expanded` que refleje su estado y un nombre accesible que describa la acción. Colapsada, cada enlace SHALL conservar su nombre accesible y mostrar su nombre como tooltip al recibir foco o cursor. El estado SHALL recordarse entre recargas.

#### Scenario: Colapsar con teclado
- **WHEN** a 1280 px el operador llega con Tab al botón de colapsar y presiona Enter
- **THEN** la sidebar se angosta mostrando solo íconos y `aria-expanded` pasa a `"false"`

#### Scenario: Enlaces colapsados accesibles
- **WHEN** la sidebar está colapsada y el operador enfoca el enlace de Ventas con Tab
- **THEN** se ve el tooltip "Ventas" y el lector de pantalla anuncia "Ventas"

#### Scenario: Estado recordado
- **WHEN** el operador colapsa la sidebar y recarga la página
- **THEN** la sidebar sigue colapsada

### Requirement: Menú hamburguesa en celular
En anchos de celular la sidebar SHALL estar oculta por defecto y abrirse con un botón hamburguesa (`aria-expanded`, `aria-controls`). Abierta, SHALL poder cerrarse con un botón de cerrar, con la tecla Escape, tocando fuera de ella o al activar un enlace; al cerrarse con botón o Escape el foco SHALL volver al botón hamburguesa. Cerrada, sus enlaces NO SHALL ser alcanzables con Tab.

#### Scenario: Abrir y cerrar con teclado
- **WHEN** a 320 px el operador activa la hamburguesa con Enter y luego presiona Escape
- **THEN** la sidebar se abre, luego se cierra, y el foco queda en el botón hamburguesa

#### Scenario: Navegar desde el menú abierto
- **WHEN** con el menú abierto el operador activa el enlace "Clientes"
- **THEN** se muestra Clientes y el menú se cierra

#### Scenario: Menú cerrado fuera del orden de foco
- **WHEN** a 320 px con el menú cerrado el operador recorre la página con Tab
- **THEN** el foco no pasa por los enlaces ocultos de la sidebar

### Requirement: Cambio de ancho sin estados rotos
Al pasar de celular a escritorio o viceversa, la sidebar SHALL quedar en un estado coherente con el ancho (visible en escritorio según la preferencia guardada; cerrada en celular) sin scroll horizontal de la página.

#### Scenario: Agrandar la ventana con el menú abierto
- **WHEN** a 320 px se abre el menú y luego se cambia a 1280 px
- **THEN** la sidebar se ve en su lugar de escritorio y no queda ningún velo sobre la página
