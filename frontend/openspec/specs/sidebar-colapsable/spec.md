# sidebar-colapsable Specification

## Purpose

Ubica la navegación principal en una barra lateral que en escritorio se puede colapsar a solo íconos y en celular se abre y cierra con un botón hamburguesa, siempre operable con teclado y anunciada correctamente a lectores de pantalla.

## Requirements

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

### Requirement: Cambio de ancho sin estados rotos
Al pasar de celular a escritorio o viceversa, la sidebar SHALL quedar en un estado coherente con el ancho (visible en escritorio según la preferencia guardada; cerrada en celular) sin scroll horizontal de la página.

#### Scenario: Agrandar la ventana con el menú abierto
- **WHEN** a 320 px se abre el menú y luego se cambia a 1280 px
- **THEN** la sidebar se ve en su lugar de escritorio y no queda ningún velo sobre la página

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
