# navegacion-vistas Specification

## Purpose

Permite al operador moverse entre las 5 vistas de la página única de Editorial Codex (Catálogo, Libros, Clientes, Ventas, Historial) viendo una sola a la vez, con la vista activa identificable, el foco gestionado y el historial del navegador funcionando.

## Requirements

### Requirement: Navegación principal con enlaces a las 5 vistas
La página SHALL ofrecer una navegación principal (landmark `nav`) con un enlace por vista —Catálogo, Libros, Clientes, Ventas, Historial— que apunta por ancla al `id` de su sección (`#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`). Los enlaces SHALL ser operables con teclado (Tab para llegar, Enter para activar) en el orden en que aparecen.

#### Scenario: Activar un enlace con teclado
- **WHEN** el operador llega con Tab al enlace "Ventas" y presiona Enter
- **THEN** la URL pasa a terminar en `#ventas` y se muestra la vista Ventas

#### Scenario: Activar un enlace con el mouse
- **WHEN** el operador hace clic en el enlace "Clientes"
- **THEN** la URL pasa a terminar en `#clientes` y se muestra la vista Clientes

### Requirement: Una sola vista visible a la vez
Con JavaScript disponible, la página SHALL mostrar exactamente una de las 5 vistas y mantener ocultas las otras 4 mediante el atributo `hidden`, de modo que el ocultamiento funcione aunque la hoja de estilos no cargue.

#### Scenario: Cambio de vista oculta la anterior
- **WHEN** la vista Catálogo está visible y el operador navega a Libros
- **THEN** Libros queda visible y Catálogo, Clientes, Ventas e Historial quedan con `hidden`

#### Scenario: Sin hoja de estilos
- **WHEN** la página se abre con el CSS deshabilitado
- **THEN** sigue viéndose una sola vista

### Requirement: Vista por defecto en la carga inicial
Al cargar la página, si la URL no tiene hash o su hash no corresponde a ninguna vista (ni a un elemento dentro de una vista), la página SHALL mostrar la vista Catálogo.

#### Scenario: Carga sin hash
- **WHEN** se abre `index.html` por doble clic (`file://`) sin hash
- **THEN** se muestra la vista Catálogo

#### Scenario: Carga con hash de vista
- **WHEN** se recarga la página con `#ventas` en la URL
- **THEN** se muestra la vista Ventas

#### Scenario: Carga con hash inválido
- **WHEN** se abre la página con `#inexistente` en la URL
- **THEN** se muestra la vista Catálogo

### Requirement: Resolución del hash al cambiar
Cuando el hash cambia, la página SHALL resolver la vista así: si el hash es el `id` de una vista, muestra esa vista; si apunta a un elemento contenido en una vista, muestra la vista que lo contiene; si el hash queda vacío, muestra Catálogo; en cualquier otro caso (id inexistente o elemento fuera de las vistas) conserva la vista actual.

#### Scenario: Hash a un elemento interno de otra vista
- **WHEN** la vista activa es Libros y el hash cambia a `#catalogo-lista`
- **THEN** se muestra la vista Catálogo

#### Scenario: Hash a un elemento fuera de las vistas
- **WHEN** la vista activa es Clientes y el hash cambia a un ancla fuera de las secciones de vista (por ejemplo, un enlace al `main`)
- **THEN** la vista Clientes sigue visible

#### Scenario: Hash inexistente
- **WHEN** la vista activa es Historial y el hash cambia a `#no-existe`
- **THEN** la vista Historial sigue visible y no aparece ningún error en la consola

#### Scenario: Hash vacío
- **WHEN** la vista activa es Libros y el hash pasa a estar vacío
- **THEN** se muestra la vista Catálogo

### Requirement: Botón "atrás" del navegador
La navegación entre vistas SHALL quedar registrada en el historial del navegador, de modo que "atrás" y "adelante" restauren la vista correspondiente a cada entrada.

#### Scenario: Volver a la vista previa
- **WHEN** el operador abre la página sin hash (Catálogo), navega a Libros y luego a Ventas, y presiona "atrás" dos veces
- **THEN** primero se muestra Libros y después Catálogo

### Requirement: Vista activa identificable sin depender del color
El enlace de la vista visible SHALL llevar `aria-current="page"` (y ningún otro enlace lo SHALL llevar), y SHALL distinguirse visualmente por un rasgo que no sea solo el color (por ejemplo, subrayado o peso de fuente).

#### Scenario: Enlace activo marcado
- **WHEN** se muestra la vista Clientes
- **THEN** solo el enlace "Clientes" tiene `aria-current="page"`

#### Scenario: Distinción en escala de grises
- **WHEN** se observa la navegación en escala de grises
- **THEN** el enlace activo se distingue de los demás

### Requirement: Foco al cambiar de vista
Al cambiar de vista por navegación, el foco SHALL moverse al encabezado principal (`h2`) de la vista mostrada, que es enfocable por programa pero no forma parte del orden de tabulación. En la carga inicial de la página el foco NO SHALL moverse.

#### Scenario: Foco tras navegar
- **WHEN** el operador activa el enlace "Historial" con Enter
- **THEN** el foco queda en el encabezado "Historial" y el siguiente Tab avanza por el contenido de esa vista

#### Scenario: Sin movimiento de foco al cargar
- **WHEN** se abre la página con `#libros` en la URL
- **THEN** se muestra Libros y el foco no se mueve al encabezado

### Requirement: Foco visible en la navegación
Todo enlace de la navegación y todo control enfocable SHALL mostrar un indicador de foco visible al recibir foco por teclado; no se SHALL quitar el `outline` sin reemplazo.

#### Scenario: Recorrido con Tab
- **WHEN** el operador recorre la navegación con Tab
- **THEN** cada enlace muestra un contorno de foco visible

### Requirement: Degradación sin JavaScript
Si JavaScript no está disponible, la página SHALL mostrar las 5 vistas una debajo de la otra, la navegación principal SHALL quedar visible (sin depender de la sidebar colapsable ni del botón hamburguesa) y sus enlaces SHALL seguir funcionando como anclas que desplazan a cada sección.

#### Scenario: JavaScript deshabilitado
- **WHEN** se abre la página con JavaScript deshabilitado y se activa el enlace "Ventas"
- **THEN** las 5 vistas son visibles y la página se desplaza hasta la sección Ventas

#### Scenario: Celular sin JavaScript
- **WHEN** se abre la página a 320 px con JavaScript deshabilitado
- **THEN** los enlaces del menú se ven y se pueden activar sin abrir ningún botón, y no aparecen los botones hamburguesa, de colapsar ni de tema

