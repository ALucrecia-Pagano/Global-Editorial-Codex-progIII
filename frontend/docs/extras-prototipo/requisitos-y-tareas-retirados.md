# Requisitos y tareas retirados de C-02 (insumo de C-12)

> Todo lo que se había decidido y escrito para C-02 y se retiró el 2026-10-14 al recortar el alcance. Se guarda literal para no perder nada. **No es spec ni lista de tareas vigente.**

## 1. `navegacion-vistas`: requisitos MODIFIED retirados

(El delta de C-02 conserva solo "Degradación sin JavaScript", reescrito para 5 vistas.)

### Requirement: Navegación principal con enlaces a las 5 vistas
La página SHALL ofrecer una navegación principal (landmark `nav`, `id="nav-principal"`) con un enlace por vista navegable —Inicio, Catálogo, Escritores, Libros, Clientes, Ventas, Historial, Ingresar— que apunta por ancla al `id` de su sección. Registro y los 6 detalles de libro NO SHALL tener enlace propio en el menú: se llega a ellos desde enlaces dentro de otras vistas. Los enlaces SHALL ser operables con teclado (Tab para llegar, Enter para activar) en el orden en que aparecen.

#### Scenario: Activar un enlace con teclado
- **WHEN** el operador llega con Tab al enlace "Ventas" y presiona Enter
- **THEN** la URL pasa a terminar en `#ventas` y se muestra la vista Ventas

#### Scenario: Activar un enlace con el mouse
- **WHEN** el operador hace clic en el enlace "Clientes"
- **THEN** la URL pasa a terminar en `#clientes` y se muestra la vista Clientes

#### Scenario: Enlaces de las vistas nuevas
- **WHEN** el operador activa los enlaces "Inicio", "Escritores" e "Ingresar"
- **THEN** la URL termina, respectivamente, en `#inicio`, `#escritores` e `#ingresar` y se muestra la vista correspondiente

#### Scenario: Registro y detalle fuera del menú
- **WHEN** se inspecciona la navegación principal
- **THEN** no contiene enlaces a `#registro` ni a `#libro-li-1` … `#libro-li-6`

### Requirement: Una sola vista visible a la vez
Con JavaScript disponible, la página SHALL mostrar exactamente una de sus vistas (Inicio, Catálogo, Escritores, Libros, Clientes, Ventas, Historial, Ingresar, Registro y los 6 detalles de libro) y mantener ocultas todas las demás mediante el atributo `hidden`, de modo que el ocultamiento funcione aunque la hoja de estilos no cargue.

#### Scenario: Cambio de vista oculta la anterior
- **WHEN** la vista Catálogo está visible y el operador navega a Libros
- **THEN** Libros queda visible y todas las demás vistas quedan con `hidden`

#### Scenario: Sin hoja de estilos
- **WHEN** la página se abre con el CSS deshabilitado
- **THEN** sigue viéndose una sola vista

#### Scenario: Detalle como vista
- **WHEN** el operador navega a `#libro-li-3`
- **THEN** solo se ve el detalle de "Cartas desde el sur" y el resto de las vistas quedan con `hidden`

### Requirement: Vista por defecto en la carga inicial
Al cargar la página, si la URL no tiene hash o su hash no corresponde a ninguna vista (ni a un elemento dentro de una vista), la página SHALL mostrar la vista Inicio.

#### Scenario: Carga sin hash
- **WHEN** se abre `index.html` por doble clic (`file://`) sin hash
- **THEN** se muestra la vista Inicio

#### Scenario: Carga con hash de vista
- **WHEN** se recarga la página con `#ventas` en la URL
- **THEN** se muestra la vista Ventas

#### Scenario: Carga con hash de detalle
- **WHEN** se recarga la página con `#libro-li-2` en la URL
- **THEN** se muestra el detalle de "Estrellas de papel"

#### Scenario: Carga con hash inválido
- **WHEN** se abre la página con `#inexistente` en la URL
- **THEN** se muestra la vista Inicio

### Requirement: Resolución del hash al cambiar
Cuando el hash cambia, la página SHALL resolver la vista así: si el hash es el `id` de una vista, muestra esa vista; si apunta a un elemento contenido en una vista, muestra la vista que lo contiene; si el hash queda vacío, muestra Inicio; en cualquier otro caso (id inexistente o elemento fuera de las vistas) conserva la vista actual.

#### Scenario: Hash a un elemento interno de otra vista
- **WHEN** la vista activa es Libros y el hash cambia a `#catalogo-lista`
- **THEN** se muestra la vista Catálogo

#### Scenario: Hash a un elemento fuera de las vistas
- **WHEN** la vista activa es Clientes y el hash cambia a un ancla fuera de las secciones de vista (por ejemplo, el skip-link a `#contenido`)
- **THEN** la vista Clientes sigue visible

#### Scenario: Hash inexistente
- **WHEN** la vista activa es Historial y el hash cambia a `#no-existe`
- **THEN** la vista Historial sigue visible y no aparece ningún error en la consola

#### Scenario: Hash vacío
- **WHEN** la vista activa es Libros y el hash pasa a estar vacío
- **THEN** se muestra la vista Inicio

#### Scenario: Campo del formulario de libros no confundido con un detalle
- **WHEN** el hash cambia a `#libro-titulo`
- **THEN** se muestra la vista Libros, que contiene ese campo, y no una vista de detalle

### Requirement: Botón "atrás" del navegador
La navegación entre vistas SHALL quedar registrada en el historial del navegador, de modo que "atrás" y "adelante" restauren la vista correspondiente a cada entrada.

#### Scenario: Volver a la vista previa
- **WHEN** el operador abre la página sin hash (Inicio), navega a Catálogo y luego al detalle `#libro-li-1`, y presiona "atrás" dos veces
- **THEN** primero se muestra Catálogo y después Inicio

### Requirement: Vista activa identificable sin depender del color
El enlace de la vista visible SHALL llevar `aria-current="page"` (y ningún otro enlace del menú lo SHALL llevar), y SHALL distinguirse visualmente por un rasgo que no sea solo el color. Si la vista visible es un detalle de libro, ningún enlace del menú SHALL llevar `aria-current="page"`; el enlace Catálogo SHALL llevar `aria-current="true"` y el mismo resaltado visual. Si la vista visible es Registro, el enlace Ingresar SHALL comportarse igual que Catálogo en el detalle.

#### Scenario: Enlace activo marcado
- **WHEN** se muestra la vista Clientes
- **THEN** solo el enlace "Clientes" tiene `aria-current="page"`

#### Scenario: Distinción en escala de grises
- **WHEN** se observa la navegación en escala de grises
- **THEN** el enlace activo se distingue de los demás

#### Scenario: Menú en el detalle de un libro
- **WHEN** se muestra el detalle `#libro-li-4`
- **THEN** ningún enlace del menú tiene `aria-current="page"`, el enlace "Catálogo" tiene `aria-current="true"` y se ve resaltado

#### Scenario: Menú en Registro
- **WHEN** se muestra la vista Registro
- **THEN** ningún enlace del menú tiene `aria-current="page"` y el enlace "Ingresar" tiene `aria-current="true"`

### Texto original (con 15 vistas) de "Degradación sin JavaScript"

### Requirement: Degradación sin JavaScript
Si JavaScript no está disponible, la página SHALL mostrar todas las vistas una debajo de la otra, la navegación principal SHALL quedar visible (sin depender de la sidebar colapsable ni del botón hamburguesa) y sus enlaces SHALL seguir funcionando como anclas que desplazan a cada sección.

#### Scenario: JavaScript deshabilitado
- **WHEN** se abre la página con JavaScript deshabilitado y se activa el enlace "Ventas"
- **THEN** todas las vistas son visibles y la página se desplaza hasta la sección Ventas

#### Scenario: Celular sin JavaScript
- **WHEN** se abre la página a 320 px con JavaScript deshabilitado
- **THEN** los enlaces del menú se ven y se pueden activar sin abrir ningún botón, y no aparecen los botones hamburguesa ni de colapsar

## 2. `maqueta-vistas`: requisito MODIFIED original ("Página única con estructura semántica", con 15 vistas)

### Requirement: Página única con estructura semántica
La aplicación SHALL ser un único `index.html` en español (`lang="es"`) con un skip-link como primer elemento enfocable que lleva a `main#contenido`, un `header` con un único `h1` "Editorial Codex", un `aside` que contiene el `nav` principal, y `main`. Dentro de `main` SHALL haber una `section` por vista con ids `inicio`, `catalogo`, `escritores`, `libros`, `clientes`, `ventas`, `historial`, `ingresar`, `registro` y `libro-li-1` … `libro-li-6`, cada una titulada por un `h2` sin saltar niveles de encabezado.

#### Scenario: Apertura por file://
- **WHEN** se abre `index.html` con doble clic
- **THEN** la página carga sin errores en la consola, sin pedir recursos externos y muestra "Editorial Codex" como título

#### Scenario: Landmarks
- **WHEN** se inspecciona la página con las herramientas de accesibilidad del navegador
- **THEN** aparecen los landmarks banner, complementary (con la navegación adentro), navigation y main, y una sección con encabezado por cada vista

#### Scenario: Skip-link
- **WHEN** se carga la página y se presiona Tab una vez
- **THEN** aparece visible el enlace "Saltar al contenido" y al activarlo el foco pasa al contenido principal

## 3. `maqueta-vistas`: requisitos ADDED retirados

## ADDED Requirements

### Requirement: Vista Inicio maquetada
La vista Inicio SHALL incluir un banner de bienvenida con un enlace al Catálogo, tarjetas de resumen con la cantidad de libros (6), de géneros (2) y de escritores (3) del catálogo de ejemplo, un libro destacado con enlace a su detalle, un carrusel "Recomendados" y una sección "Escritores destacados" con enlace a la vista Escritores.

#### Scenario: Conteos coherentes
- **WHEN** se observan las tarjetas de resumen de Inicio
- **THEN** muestran 6 libros, 2 géneros y 3 escritores, iguales a lo que muestran Catálogo y Escritores

#### Scenario: Libro destacado
- **WHEN** el operador activa el enlace del libro destacado
- **THEN** se muestra la vista de detalle de ese libro

### Requirement: Vista Escritores maquetada
La vista Escritores SHALL listar los 3 autores del catálogo de ejemplo (Lucía Ferreyra, Tomás Aguirre, Inés Montoya) en tarjetas con sus iniciales, nombre, cantidad de libros, géneros y un enlace al detalle de cada uno de sus libros.

#### Scenario: Datos de un escritor
- **WHEN** se observa la tarjeta de Tomás Aguirre
- **THEN** indica 3 libros, los géneros Ciencia ficción y Novela, y tiene enlaces a "Estrellas de papel", "Órbita lenta" y "El mapa invisible"

#### Scenario: Enlace a un libro
- **WHEN** el operador activa el enlace "Manual de jardinería urbana" en la tarjeta de Inés Montoya
- **THEN** se muestra el detalle `#libro-li-5`

### Requirement: Vistas de detalle de libro maquetadas
Por cada uno de los 6 libros del catálogo de ejemplo SHALL existir una vista de detalle con id `libro-<id del libro>` (`libro-li-1` … `libro-li-6`) que muestre la tapa generada con CSS, título, autores, editorial, género, ISBN, precio en formato `$ 1.500,00`, una descripción y la puntuación propia con estrellas, con datos idénticos a los del Catálogo.

#### Scenario: Detalle coherente con el catálogo
- **WHEN** se abre `#libro-li-5`
- **THEN** muestra "Manual de jardinería urbana", Inés Montoya, Ediciones del Faro, «Sin clasificar», 978-987-0001-05-9 y `$ 2.750,00`

#### Scenario: Descripción presente
- **WHEN** se abre cualquier detalle de libro
- **THEN** se lee una descripción del libro como texto

### Requirement: Tarjetas enlazadas al detalle
Cada tarjeta de libro del Catálogo y del carrusel de Inicio SHALL ofrecer un enlace enfocable al detalle de ese libro, con un texto que identifique el libro.

#### Scenario: De la tarjeta al detalle
- **WHEN** el operador llega con Tab al enlace de la tarjeta "Órbita lenta" en el Catálogo y presiona Enter
- **THEN** se muestra el detalle `#libro-li-4`

### Requirement: Migas de pan en las vistas internas
Toda vista distinta de Inicio SHALL mostrar al comienzo unas migas de pan (`nav` con nombre accesible "Migas de pan") que empiezan en un enlace a Inicio y terminan en el nombre de la vista actual, marcado con `aria-current="page"` y sin enlace. En el detalle de libro SHALL ser `Inicio › Catálogo › <título>` y en Registro `Inicio › Ingresar › Registro`.

#### Scenario: Migas en el detalle
- **WHEN** se muestra el detalle `#libro-li-2`
- **THEN** las migas dicen "Inicio › Catálogo › Estrellas de papel", "Inicio" y "Catálogo" son enlaces y "Estrellas de papel" no

#### Scenario: Volver desde las migas
- **WHEN** en el detalle el operador activa el enlace "Catálogo" de las migas
- **THEN** se muestra la vista Catálogo

#### Scenario: Inicio sin migas
- **WHEN** se muestra la vista Inicio
- **THEN** no aparecen migas de pan

## 4. `preferencias-locales`: versión original completa (con `puntuaciones` y formularios de acceso)

## Purpose

Guarda en el navegador las preferencias de presentación de la Etapa 1 (tema, estado de la sidebar y puntuaciones propias) con claves propias que no chocan con los datos de la Etapa 2, sin guardar datos personales y sin romper la página si el almacenamiento falla.

## ADDED Requirements

### Requirement: Claves con prefijo propio
Las preferencias de la Etapa 1 SHALL guardarse en `localStorage` únicamente bajo las claves `libreria.preferencias.tema` (`"claro"` u `"oscuro"`), `libreria.preferencias.sidebar` (`"colapsada"` o `"expandida"`) y `libreria.preferencias.puntuaciones` (objeto JSON de id de libro a entero de 1 a 5, por ejemplo `{"li-1": 4}`). NO SHALL escribirse ninguna otra clave.

#### Scenario: Claves tras usar las preferencias
- **WHEN** el operador cambia el tema, colapsa la sidebar y puntúa un libro, y luego abre Application → Local Storage en DevTools
- **THEN** solo aparecen esas tres claves con el prefijo `libreria.preferencias.` y los valores descriptos

### Requirement: Tolerancia a fallos del almacenamiento
Toda lectura y escritura de `localStorage` SHALL estar protegida de modo que, si el almacenamiento no está disponible, lanza un error o contiene un valor inválido (por ejemplo JSON corrupto), la página siga funcionando con los valores por defecto y sin errores sin capturar en la consola.

#### Scenario: Valor corrupto
- **WHEN** se escribe a mano `libreria.preferencias.puntuaciones` = `{no es json` y se recarga
- **THEN** la página carga sin errores en la consola y los detalles muestran los libros sin puntuar

#### Scenario: Valor desconocido
- **WHEN** se escribe a mano `libreria.preferencias.tema` = `"violeta"` y se recarga
- **THEN** se aplica el tema según `prefers-color-scheme`

### Requirement: Sin datos personales
NO SHALL guardarse en `localStorage`, `sessionStorage` ni cookies ninguna contraseña, email, nombre ni otro dato ingresado en los formularios de Ingresar y Registro.

#### Scenario: Envío de Registro
- **WHEN** el operador envía Registro con datos válidos y revisa el almacenamiento del sitio en DevTools
- **THEN** no aparece ninguno de los datos ingresados

## 5. `estilos-tema`: textos recortados (referencias a carrusel, estrellas, toasts, Ingresar y Registro)

- "Estilos en archivos externos": el escenario "Elementos equivalentes con la misma clase" mencionaba los botones de Ingresar y Registro.
- "Tapas de libro generadas con CSS": decía "catálogo, carrusel, destacado y detalle".
- "Identidad visual del título", escenario "Movimiento reducido": decía "ni el título, ni el fondo, ni el carrusel se mueven solos".
- "Contraste mínimo en ambos temas": incluía "toasts y estrellas con texto".
- "Foco visible": incluía "carrusel, estrellas".

## 6. Tareas de `tasks.md` retiradas (Grupos C y D, texto literal)

## 3. C) Vistas nuevas

- [ ] 3.1 Inicio — banner y resumen: banner con `h3` de bienvenida, texto y enlace `.boton` a `#catalogo`; tarjetas `.resumen__tarjeta` con `#inicio-total-libros` (6), `#inicio-total-generos` (2) y `#inicio-total-escritores` (3) más su texto; libro destacado `#inicio-destacado` (li-2 "Estrellas de papel": tapa CSS, autor, descripción corta, enlace a `#libro-li-2`); verificar que los números coinciden con Catálogo/Escritores y que el enlace abre el detalle.
- [ ] 3.2 Inicio — carrusel "Recomendados" (marcado de D9): `section.carrusel` con `h3`, `ul#carrusel-recomendados.carrusel__fila` con las 6 tarjetas `.tarjeta--recomendada` (tapa CSS, título, autor, precio `$ 1.500,00`, enlace al detalle) y botones `#carrusel-anterior`/`#carrusel-siguiente`; CSS de fila con `overflow-x: auto`, degradés en los bordes y `scroll-padding-inline`; verificar a 320 px que la fila scrollea dentro de su contenedor sin scroll de página.
- [ ] 3.3 Carrusel — JS: botones con `scrollBy` ± 80 % del ancho visible y habilitado/deshabilitado según `scrollLeft`; auto-desplazamiento al acercar el mouse al 15 % de cada borde con `requestAnimationFrame`, solo con `pointerType === 'mouse'` y desactivado si `prefers-reduced-motion: reduce` (re-evaluado en `change`); verificar con Enter en "Siguiente", con el cursor en el borde derecho a 1280 px (avanza y se detiene al salir), con movimiento reducido (no se mueve solo) y con Tab hasta la última tarjeta (queda visible con foco).
- [ ] 3.4 Inicio — "Escritores destacados" (`#inicio-escritores`): versión compacta de `.escritor` para los 3 autores y enlace "Ver todos" a `#escritores`; verificar que el enlace abre Escritores.
- [ ] 3.5 Vista Escritores: `#escritores-lista` con 3 tarjetas `.escritor` según D13 (avatar con iniciales `aria-hidden`, `h3` con el nombre, cantidad de libros, géneros, lista de enlaces a sus `#libro-li-N`); verificar que Tomás Aguirre muestra 3 libros con enlaces a li-2, li-4 y li-6, y que "Manual de jardinería urbana" en la tarjeta de Inés Montoya abre `#libro-li-5`.
- [ ] 3.6 Vistas de detalle `#libro-li-1` … `#libro-li-6`: `.detalle` con tapa CSS, título, autores, editorial, género, ISBN, precio y descripción inventada (2–3 oraciones), con datos idénticos a la tarjeta del catálogo; verificar comparando cada detalle con su tarjeta (en especial li-5 «Sin clasificar» y li-4 con dos autores).
- [ ] 3.7 Enlace al detalle en cada tarjeta del catálogo (`.tarjeta__enlace` con texto que nombra el libro, p. ej. "Ver detalle de Órbita lenta"); verificar con Tab + Enter desde la tarjeta "Órbita lenta" que se abre `#libro-li-4`.
- [ ] 3.8 Estrellas de solo lectura en las tarjetas del catálogo y del carrusel (D10): `p.estrellas.estrellas--lectura.estrellas--valor-N` con texto `.solo-lectores` "N de 5 estrellas" (y rótulo "Puntuación de lectores"), valores fijos li-1=4, li-2=5, li-3=3, li-4=4, li-5=3, li-6=5, dibujadas solo con CSS (`::before` con texto alternativo vacío); verificar con JS deshabilitado que se ven, y con el árbol de accesibilidad que se anuncia "4 de 5 estrellas" y no los símbolos.
- [ ] 3.9 Puntuación propia en cada detalle (D10): `fieldset#puntuacion-li-N.estrellas.estrellas--entrada` con `legend` "Tu puntuación de «<título>»" y 5 radios `name="puntuacion-li-N"` `value` 1–5 visualmente ocultos pero enfocables, `label` con "★" + texto oculto "N de 5 estrellas", relleno acumulado con `:has()` y foco visible en la `label`; verificar que Tab entra al grupo, las flechas cambian la selección y el clic marca la cantidad correcta.
- [ ] 3.10 Persistencia de la puntuación: al `change` guardar en `libreria.preferencias.puntuaciones` como objeto (`{"li-1":4}`) con `try/catch` y validación de D7, y restaurar al cargar; verificar puntuando li-1 con 4 y li-2 con 2, recargando (se mantienen), revisando Application → Local Storage, escribiendo `{no es json` a mano y recargando (sin errores, sin puntuación), y comprobando que las estrellas de la tarjeta no cambian. (El toast de confirmación se suma en 4.5.)
- [ ] 3.11 Agregar al contrato de `knowledge-base/08` y del `README.md` las filas de Inicio (`inicio-total-libros`, `inicio-total-generos`, `inicio-total-escritores`, `inicio-destacado`, `carrusel-recomendados`, `carrusel-anterior`, `carrusel-siguiente`, `inicio-escritores`), `escritores-lista` y `puntuacion-li-1..6` con `name="puntuacion-li-N"`, más la nota de estructura de `.estrellas--lectura`; agregar `libreria.preferencias.puntuaciones` a `knowledge-base/04`; documentar en el README la relación tarjeta (ficticia) vs. detalle (personal) como limitación conocida para C-04; verificar que las tablas siguen idénticas.

**Verificación manual del grupo C**
- [ ] 3.12 Checklist C ejecutado y resultado real anotado: (1) Inicio muestra banner, conteos 6/2/3, destacado, carrusel y escritores; (2) carrusel operable con botones (teclado), borde (mouse) y táctil (emulación), quieto con movimiento reducido; (3) Escritores con los 3 autores y enlaces correctos; (4) los 6 detalles coinciden con el catálogo; (5) estrellas de tarjetas visibles sin JS y anunciadas como texto; (6) puntuación propia con teclado, recordada al recargar, tolerante a JSON corrupto; (7) 320/1280 px sin scroll horizontal en Inicio, Escritores y un detalle; (8) foco visible en carrusel y estrellas en ambos temas.

## 4. D) Ingresar/Registro y toasts

- [ ] 4.1 Zona de toasts `div#notificaciones.notificaciones[role="status"][aria-live="polite"]` en el HTML y función `notificar(texto, tipo)` (D12) con `createElement`/`textContent`, título "Listo"/"Error", botón `.toast__cerrar` "Cerrar aviso", cierre automático a los 5 s y un solo toast a la vez; estilos `.toast--exito`/`--error` con contraste ≥ 4.5:1 en ambos temas; verificar llamando `notificar('Prueba', 'exito')` desde la consola: se lee, se cierra solo y con el botón, y a 320 px no tapa la navegación de forma permanente.
- [ ] 4.1b Fondo de Ingresar/Registro **solo con CSS, sin imágenes** (`assets/img/portada.jpg` se eliminó el 2026-10-14; el proyecto no usa imágenes de fondo; la única foto es el banner del Catálogo, ver D18 de C-02) (decorativo, vía CSS sobre `#ingresar` y `#registro`, con velo para que el texto quede sobre superficie opaca y contraste ≥ 4.5:1; sin animación con movimiento reducido); verificar que se ve en ambas vistas, no en las demás, y que no aparece en el árbol de accesibilidad.
- [ ] 4.2 Maquetar Ingresar en `#ingresar`: `form#form-ingresar[novalidate]` con `ingresar-email` (`type="email"`, `name="email"`, `autocomplete="email"`) e `ingresar-clave` (`type="password"`, `name="clave"`, `autocomplete="current-password"`), `label` asociado, `p.formulario__error` vacío por campo enlazado con `aria-describedby`, botón submit "Ingresar", enlace "Creá tu cuenta" a `#registro` y `.aviso--maqueta` "Maqueta: no se guarda ni se envía ningún dato"; verificar clic en cada label (enfoca el campo) y el enlace a Registro.
- [ ] 4.3 Maquetar Registro en `#registro`: `form#form-registro[novalidate]` con `registro-nombre` (`nombreCompleto`), `registro-email` (`email`), `registro-clave` (`clave`, `new-password`), `registro-repetir` (`repetirClave`, `new-password`), mismos patrones que 4.2, botón "Crear cuenta" y enlace "Ingresá" a `#ingresar`; verificar labels y enlace de vuelta.
- [ ] 4.4 Validación simulada (D11): `validarAcceso(valores, esRegistro)` pura que devuelve `{ campo: mensaje }` (obligatorios con `trim`, email con `checkValidity()` del `type="email"`, contraseña ≥ 8, coincidencia en Registro); en `submit`: `preventDefault`, mostrar errores con `textContent` y `aria-invalid="true"`, foco al primer campo con error; limpiar el error del campo al escribir; verificar envío vacío (errores en texto, foco en el email, sin recarga), email inválido, contraseña corta, contraseñas distintas y que el error se borra al corregir.
- [ ] 4.5 Envío válido sin persistencia: toast de éxito que aclara que es demostración, vaciar contraseñas, sin sesión ni cambios en la navegación; sumar el toast "Puntuación guardada: N de 5 estrellas" al guardar una puntuación (3.10); verificar con datos válidos en ambos formularios y revisando Application → Local Storage / Session Storage / Cookies que no aparece ningún dato ingresado; verificar que enviar el formulario de Clientes no muestra toast.
- [ ] 4.6 Agregar al contrato de `knowledge-base/08` y del `README.md` las filas `notificaciones`, `form-ingresar`, `ingresar-email`/`email`, `ingresar-clave`/`clave`, `form-registro`, `registro-nombre`/`nombreCompleto`, `registro-email`/`email`, `registro-clave`/`clave`, `registro-repetir`/`repetirClave`; dejar en el README que Ingresar/Registro son maqueta y nunca guardan datos; verificar que las tablas siguen idénticas.

**Verificación manual del grupo D**
- [ ] 4.7 Checklist D ejecutado y resultado real anotado: (1) Ingresar y Registro vacíos e inválidos: errores en texto junto a cada campo, sin recarga; (2) envío válido: toast anunciado sin mover el foco; (3) en el almacenamiento del sitio no aparece ninguna contraseña ni dato ingresado; (4) toast cerrable con teclado y que desaparece solo; (5) error entendible en escala de grises; (6) 320/1280 px sin scroll horizontal en ambas vistas y en ambos temas.

## 7. Tareas del Grupo B retiradas o reducidas (texto original)

- [x] 2.2 Crear el esqueleto estático de las vistas nuevas dentro de `main#contenido`: `section.vista` con `id` `inicio`, `escritores`, `ingresar`, `registro`, `libro-li-1` … `libro-li-6`, cada una con `h2.vista__titulo[tabindex="-1"]` y `aria-labelledby` (el contenido lo completan los grupos C y D); verificar que sin JS se ven todas apiladas y cada una tiene su encabezado.
- [x] 2.3 Ampliar `VISTAS` en `js/app.js` con las 10 vistas nuevas y cambiar la vista por defecto a `'inicio'` en `iniciarNavegacion` y `alCambiarHash` (D2); verificar: sin hash → Inicio; `#inexistente` → Inicio; hash vacío → Inicio; `#ventas` recargado → Ventas; `#libro-li-2` recargado → detalle de "Estrellas de papel"; `#libro-titulo` → Libros; `#contenido` → conserva la vista actual.
- [x] 2.4 Implementar las reglas de `aria-current` de D2 con `VISTA_PADRE` (detalle → Catálogo con `aria-current="true"`, Registro → Ingresar con `aria-current="true"`, resto `aria-current="page"` solo en el enlace propio) y resaltar `[aria-current]` en CSS con un rasgo no cromático (fondo + borde izquierdo + peso); verificar en DevTools en Clientes, `#libro-li-4` y `#registro`, y en escala de grises.
- [x] 2.8 Migas de pan estáticas (`nav.migas[aria-label="Migas de pan"] > ol.migas__lista`) en cada vista menos Inicio: `Inicio › <vista>`, en detalle `Inicio › Catálogo › <título>`, en Registro `Inicio › Ingresar › Registro`; el paso actual es `span.migas__actual[aria-current="page"]`, el separador `›` es `aria-hidden`; verificar en `#libro-li-2` que "Catálogo" de las migas lleva al Catálogo y que Inicio no tiene migas.
- [x] 2.9 Actualizar el README §Navegación entre vistas (vista por defecto Inicio, hashes nuevos, reglas de `aria-current`, migas, sidebar y degradación sin JS) y agregar al contrato de `knowledge-base/08` y del `README.md` las filas `sidebar`, `sidebar-colapsar`, `menu-abrir`, `menu-cerrar`, `sidebar-velo` y las secciones nuevas; agregar `libreria.preferencias.sidebar` a `knowledge-base/04`; verificar que las tablas siguen idénticas.
- [ ] 2.10 Checklist B ejecutado y resultado real anotado: (1) sin hash abre Inicio y todos los hashes de C-01 siguen funcionando; (2) `#libro-li-1` … `#libro-li-6` abren su vista; (3) "atrás" dos veces desde Inicio → Catálogo → `#libro-li-1` vuelve a Catálogo y a Inicio; (4) `aria-current` correcto en una vista común, un detalle y Registro; (5) colapsar recordado al recargar; (6) hamburguesa operable solo con teclado y Escape a 320 px; (7) foco al `h2` al navegar y no en la carga; (8) sin JS el menú se ve y funciona; (9) sin scroll horizontal a 320/1280 px.
