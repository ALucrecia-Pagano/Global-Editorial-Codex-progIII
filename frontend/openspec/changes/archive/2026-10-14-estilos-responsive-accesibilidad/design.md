# Diseño: estilos-responsive-accesibilidad (C-02)

> **Alcance recortado el 2026-10-14.** Las decisiones D2 (navegación ampliada) y D9 a D13 (carrusel, estrellas, formularios de acceso, toasts y contenido estático nuevo) salieron de este change y se guardaron literales en `docs/extras-prototipo/decisiones-diseno.md`, como insumo del change opcional C-12 `extras-prototipo`. Se conserva la numeración original de las demás decisiones.

## Contexto

- Estado actual (C-01): `index.html` con `header > h1 + nav#nav-principal`, `main` sin id y 5 `section.vista`; `css/styles.css` mínimo (17 líneas: `[hidden]`, enlace activo, `:focus-visible`); `js/app.js` con `VISTAS`, `obtenerVistaDesdeHash`, `mostrarVista`, `alCambiarHash`, `iniciarNavegacion` y `prevenirEnvioMaqueta`. La navegación ya es JS + `hashchange` + atributo `hidden` (sin `:target`, decisión documentada en el README).
- Prototipo de referencia (`../../prueba_parcial_prog3`): renderiza todas las vistas desde JS sobre un `main` vacío, con libros reales y tapas `.jpg`. **Se toma solo la identidad visual** (paleta, tema claro, marca y título, fondo galáctico, sidebar). Lo demás (Inicio, carrusel, escritores, detalles, Ingresar/Registro, toasts, migas) quedó para C-12.
- Restricciones: ver `proposal.md` y las reglas duras de `CLAUDE.md` (sin librerías, `defer` clásico, sin inline, BEM, `textContent`, español, verificación manual).
- Recursos ya copiados al repo: `fonts/CinzelDecorative-Bold.ttf`, `fonts/OFL.txt`, `assets/img/favicon.svg`. Las `portada.jpg` y `portada-2.jpg` que figuraban acá se eliminaron el 2026-10-14: el fondo y las tapas no usan imágenes (ver D15; el banner decorativo agregado después está en D18 y su uso como fondo difuminado en D19).

## Objetivos / No objetivos

**Objetivos:**
- Las 5 vistas de C-01 siguen estáticas en el HTML (mismo patrón que C-01) y el JS de Etapa 1 solo agrega comportamiento de presentación (tema y sidebar).
- Mejora progresiva: sin JS la página sigue siendo usable (todas las vistas apiladas, menú visible).
- Cada grupo de tareas (A, B y E) se puede aplicar y verificar por separado.

**No objetivos:**
- No se crean arrays de dominio en JS ni render dinámico (C-04).
- No se divide `js/app.js` en varios archivos ni se cambia la navegación de C-01 (vistas, vista por defecto Catálogo, `aria-current="page"`).
- No se agregan vistas ni ids nuevos de contenido (van a C-12).
- No se resuelve IN-02 ni el regex de email de C-07.

## Decisiones

### D1. Estructura de la página
```
a.salto (href="#contenido")
header.marca  > h1.marca__titulo > a.marca__enlace (href="#catalogo") "Editorial Codex" + div.marca__ornamento (decorativo)
div.aplicacion
  aside#sidebar.sidebar  > emblema + botón cerrar + nav#nav-principal.navegacion + botón colapsar
  div.principal > div.barra (hamburguesa, botón tema) + main#contenido > section.vista × 5
```
- El `h1` sigue siendo único y su texto accesible es "Editorial Codex" (las partes "Editorial"/"Codex" son `span` dentro del enlace; las estrellas son `span` con `aria-hidden`). El enlace del título lleva a `#catalogo`, la vista por defecto.
- Las vistas siguen tituladas con `h2.vista__titulo[tabindex="-1"]`, así `mostrarVista` mueve el foco igual que en C-01.
- **Alternativa descartada**: copiar la doble marca del prototipo (cabecera + marca en la sidebar). Duplica el nombre del sitio para lectores de pantalla; se deja una sola marca arriba y la sidebar muestra solo un emblema decorativo.

### D3. Mejora progresiva con `html.js`
- Lo primero que hace `app.js` es `document.documentElement.classList.add('js')`.
- Sin `.js`: la sidebar se muestra como bloque de enlaces sobre el contenido (también a 320 px), y la hamburguesa, el botón de colapsar y el botón de tema quedan ocultos (`html:not(.js) .sidebar__colapsar { display: none }`, etc.). Las vistas no tienen `hidden` en el HTML, así que se ven todas (requisito de degradación).
- **Trade-off aceptado**: como el script es `defer`, hay un parpadeo breve antes de aplicar `.js`, el tema guardado y la sidebar colapsada. No se usa script inline (regla 11).

### D4. Tokens y temas
- Custom properties en `:root` con los nombres de CHANGES: `--color-bg`, `--color-surface`, `--color-surface-2`, `--color-borde`, `--color-text`, `--color-text-suave`, `--color-accent`, `--color-error`, `--color-exito`, `--color-foco`, más `--color-acento-rosa`, `--color-linea`, `--color-foco-marca`, los degradés de superficie (`--degrade-superficie`, `--degrade-sidebar`, `--degrade-tarjeta`, `--degrade-tabla`), el brillo (`--sombra-brillo`, `--sombra-brillo-suave`), `--espacio-1..6`, `--radio-s/m/l`, `--sombra`, `--fuente-marca`, `--fuente-base`.
- Tema oscuro: base negro azulado (`#05060f`), superficies en tonos rosa/morado/negro, texto `#f2f4fc`, acento violeta `#b6a6ff`. Tema claro: lavanda y rosa pálido, con su propio rosa más oscuro, **solo en los paneles** (D21); `--color-bg` no se redefine. Todo par se **calcula con la fórmula de contraste de WCAG** (no con DevTools) en el Grupo E: texto ≥ 4.5:1 y no texto ≥ 3:1; si alguno no llega, se oscurece/aclara el token o el degradé (nunca el texto).
- El tema se aplica con `data-tema="claro|oscuro"` en `<html>`. El encabezado `.marca` y el fondo de la página (foto difuminada, nebulosas, estrellas) son **los mismos en ambos temas** (D21); los pares del título se calculan contra el peor caso del fondo con velo (D20).
- **Orden de decisión del tema inicial**: valor válido en `libreria.preferencias.tema` → si no, `matchMedia('(prefers-color-scheme: light)')` → si no, oscuro. El botón `#tema-alternar` tiene `aria-pressed="true"` cuando el tema claro está activo y `aria-label` "Activar tema claro"/"Activar tema oscuro".

### D5. Una sola hoja de estilos organizada por secciones
`css/styles.css` se reescribe ordenado por bloques comentados: `@font-face` → tokens/temas → base y utilidades (`.solo-lectores`, `[hidden]`) → layout (`.aplicacion`, `.sidebar`, `.principal`) → componentes → vistas → media queries `min-width` (mobile-first: 640 px, 1024 px, 1280 px, 1440 px) → `prefers-reduced-motion`.
- **Alternativa descartada**: dividir en `base.css`/`layout.css`/`components.css`. Más `<link>` y riesgo de orden; para el tamaño del TP no compensa.
- Las reglas de C-01 (`[hidden]{display:none!important}`, `:focus-visible`, activo) se conservan dentro de las secciones nuevas.
- Con JS hay una sola vista visible (las demás llevan `hidden`), por eso el separador entre vistas (`.vista + .vista`) aplica solo sin JS (`html:not(.js)`): el selector de hermano adyacente también coincidiría con la vista visible porque su hermano anterior oculto sigue en el DOM.

### D6. Componentes BEM
| Bloque | Elementos / modificadores principales |
|---|---|
| `.marca` | `__titulo`, `__enlace`, `__editorial`, `__codex`, `__estrella` (`--primera`, `--segunda`, `--tercera`), `__ornamento` |
| `.sidebar` | `__cabecera`, `__emblema`, `__colapsar`, `__cerrar`, `__velo`; `.aplicacion--sidebar-colapsada`, `.aplicacion--menu-abierto` |
| `.navegacion` | `__lista`, `__item`, `__enlace`, `__icono`, `__texto`, `__tooltip` |
| `.barra` | `__hamburguesa` |
| `.tema-alternar` | `__icono` |
| `.boton` | `--primario`, `--secundario`, `__icono` |
| `.tarjeta` (libro) | `__tapa`, `__tapa-titulo`, `__tapa-autor`, `__titulo`, `__datos`, `__precio` |
| `.tapa` | `--degrade-1` … `--degrade-6` (una por libro, sin inline) |
| `.formulario` | (C-01) `__campo`, `__etiqueta`, `__control`, `__acciones`, `__grupo`, `__leyenda`, `__opcion` |
| `.mensaje` | (C-01) `--error`, `--exito`, `--vacio` |
| `.aviso` | (C-01) `--maqueta` |
| `.tabla-contenedor`, `.tabla` | (C-01) `overflow-x: auto` en el contenedor |
| `.resumen-venta`, `.detalle-venta` | (C-01) bloques de Ventas e Historial |
| `.salto` | skip-link |

Las clases que ya existen en el HTML de C-01 se conservan; solo se agregan.

### D7. Preferencias en `localStorage`
- Dos funciones chicas: `leerPreferencia(clave, valorPorDefecto)` y `guardarPreferencia(clave, valor)`, ambas con `try/catch` y prefijo `'libreria.preferencias.'`.
- Lista blanca de valores: tema `claro|oscuro`; sidebar `colapsada|expandida`. Cualquier otro valor se descarta y se usa el valor por defecto.
- No se reutilizan las claves `codex-*` del prototipo.

### D8. Sidebar
- Escritorio (≥ 1024 px): `#sidebar-colapsar` alterna `.aplicacion--sidebar-colapsada`; `aria-expanded` y `aria-label` ("Colapsar menú"/"Expandir menú") se actualizan. Colapsada, `.navegacion__texto` se oculta visualmente con las mismas reglas de `.solo-lectores` (sigue en el árbol de accesibilidad) y `.navegacion__tooltip` (`aria-hidden="true"`) aparece en `:hover`/`:focus-visible`.
- Celular (< 1024 px): la sidebar queda fuera de pantalla con `visibility: hidden` (saca los enlaces del orden de Tab). `#menu-abrir` agrega `.aplicacion--menu-abierto`, muestra `#sidebar-velo` y lleva el foco al primer enlace; Escape, `#menu-cerrar`, clic en el velo o activar un enlace cierran y devuelven el foco a `#menu-abrir` (salvo al activar un enlace, donde el foco va al `h2` de la vista por la navegación de C-01).
- Un listener de `matchMedia('(min-width: 1024px)')` cierra el menú móvil al pasar a escritorio.

### D14. Contrato ampliado (DD-08)
Se agregan a la tabla de `knowledge-base/08` y del `README.md`:

| Vista | Elemento | `id` | `name` |
|---|---|---|---|
| Global | Contenido principal (destino del skip-link) | `contenido` | — |
| Global | Sidebar | `sidebar` | — |
| Global | Botón colapsar sidebar (escritorio) | `sidebar-colapsar` | — |
| Global | Botón abrir menú (celular) | `menu-abrir` | — |
| Global | Botón cerrar menú (celular) | `menu-cerrar` | — |
| Global | Velo del menú móvil | `sidebar-velo` | — |
| Global | Botón de tema | `tema-alternar` | — |

Los ids de vistas, Inicio, carrusel, escritores, detalle, formularios de acceso y toasts que figuraban acá pasaron a `docs/extras-prototipo/` (C-12).

### D15. Fondo galáctico solo con CSS (reemplaza el fondo con `portada-2.jpg`)
- **Decisión (2026-10-14, aprobada por Amanda dentro de C-02):** el fondo difuminado con imagen se reemplaza por un fondo "galáctico" dibujado solo con CSS y se eliminan `portada.jpg` y `portada-2.jpg`. En ese momento el proyecto no usaba ninguna imagen (el fondo sigue siendo CSS puro); el banner decorativo se agregó después, ver D18.
- `body::before` = nebulosas (varios `radial-gradient` rosa, morado y violeta sobre una base negro azulado); `body::after` = estrellas (capas de `radial-gradient` con `background-size` de mosaico, todos divisores de 600 px). Ambos `position: fixed`, `pointer-events: none`, `content: ""` (fuera del árbol de accesibilidad), detrás del contenido. `body::after` se agranda 600 px arriba y a la izquierda para poder desplazarlo sin dejar huecos; al ser `fixed` no genera scroll horizontal.
- **Movimiento:** solo dentro de `@media (prefers-reduced-motion: no-preference)`, animando únicamente `transform` y `opacity` (nebulosas 70 s, estrellas 400 s + un titilar suave de 11 s). Con `reduce` el fondo queda quieto. En `forced-colors` el fondo se oculta.
- **Tema claro:** *(superado por D21)* tenía un fondo lavanda estático y sin galaxia; ahora comparte el fondo galáctico con el tema oscuro.
- **Alternativa descartada:** mantener la imagen con `filter: blur`. Tiene procedencia de terceros (Pinterest, sin autoría), pesa en una entrega que se abre por `file://` y obligaba a medir el contraste "a mano" contra el peor píxel de una foto.

### D16. Superficies con degradé, brillo y regla de contraste
- `main`, `.sidebar`, `.tarjeta` y `.tabla-contenedor` usan un degradé sutil (tokens `--degrade-*`; desde D20 ciruela profundo / azul noche, sin magenta) y un borde violeta apagado con un brillo suave (`border-color` + `box-shadow`, tokens `--color-borde` y `--sombra-brillo`). Hasta D19 `.marca` usaba su propio degradé opaco; desde D20 es transparente (y desde D21 también en el tema claro). En el tema claro los degradés son lavanda/rosa pálido. El `box-shadow` no suma al `scrollWidth`.
- **Regla de contraste contra el tramo crítico:** el texto se calcula contra el tramo **más claro** de cada degradé en el tema oscuro y contra el **más oscuro** en el tema claro. Si un par no llega al mínimo, **se oscurece el degradé, nunca el texto**. Los controles (campos, `th`, mensajes, tooltip) llevan color sólido `--color-surface-2`, para que su contraste sea simple de calcular.
- **Acento rosa:** `--color-acento-rosa` (desde D20 `#c9a6e8` oscuro y `#8a3d84` claro; antes `#ff7ac6` y `#a3125f`) pinta el borde del tooltip y el borde de campos y de la hamburguesa en `:hover` (tras D18, el enlace activo y su `:hover` usan el acento violeta). Es un elemento no textual (mínimo 3:1); se calculó también a 4.5:1 como margen.

### D17. Anillo de foco sobre zonas oscuras y sobre la barra
- Sobre la franja oscura del título (`.marca`) y sobre el enlace "Saltar al contenido" (que se muestra sobre esa franja) el contorno de foco usa `--color-foco-marca` (`#ffd166`) en ambos temas.
- *(Superado por D18: la barra ahora tiene fondo opaco propio `--color-surface`; el foco `--color-foco` sigue siendo el de las demás superficies.)* La barra superior (`.barra`, con hamburguesa y botón de tema) **no tenía fondo propio**: en el tema oscuro queda sobre la galaxia (ahí `#ffd166` cumple 3:1) y en el **tema claro queda sobre el fondo lavanda, que es claro**, donde `#ffd166` daría 1.25:1. Por eso la barra conserva `--color-foco` (`#1b4fd8`, 5.29:1) y no usa `#ffd166`. Se registra en el README.

### D18. Ajuste final de diseño con otro agente (Codex)
- **Contexto (2026-10-14):** el diseño final se ajustó con otro agente (Codex) editando `css/styles.css` (sección 12 «Pasada visual» y el bloque «Retoques de detalle») e `index.html`. Esta decisión registra qué cambió y el resultado de revisar que el contrato y el JS siguen intactos. El diseño se da por cerrado: la revisión no modifica CSS ni HTML de diseño.
- **Qué cambió (HTML y CSS):**
  - **Banner «Hola, lector»** (`.bienvenida__banner`) solo en Catálogo: foto local `assets/img/banner-biblioteca.jpg` como `background-image` por CSS (sin `<img>`, decorativa), con velo degradé y `background-color` de respaldo; el texto va sobre `.bienvenida__contenido`, una superficie local `rgba(14, 18, 39, .94)` (contraste calculado en el peor caso, README).
  - **Tarjeta «Historias por descubrir»** (`.bienvenida__resumen`): superficie `--color-surface` con el número «6» en acento, detalle, destello ✦ y línea decorativos (`aria-hidden`). Es contenido estático de maqueta; el número no se recalcula en esta etapa.
  - **Sidebar:** emblema + logo «Editorial CODEX» (`.sidebar__marca`, enlace a `#catalogo`) y rótulo «TU BIBLIOTECA» (`.sidebar__rotulo`); botón de colapsar redondo que sobresale del borde en escritorio; colapsada oculta logo y rótulo y deja solo íconos.
  - **Barra:** ahora con fondo opaco (`--color-surface`) y borde; contiene hamburguesa, enlace **«Inicio»** (`.barra__inicio`, `href="#catalogo"`, ícono de casa), el texto «Tu espacio de lectura» y el botón de tema. Sin JS la barra queda visible (solo muestra «Inicio» y el texto; los botones siguen ocultos).
  - **Botón de tema:** dos íconos SVG (`.tema-alternar__icono--sol` y `--luna`) en lugar de caracteres; se muestra el sol en tema oscuro y la luna en tema claro según `data-tema` del `<html>` (el estado sigue en `aria-pressed`/`aria-label` por JS). El borde ya no cambia de grosor al activarse.
  - **Buscador:** caja tipo «píldora» con lupa a la izquierda, `placeholder` «Buscá tu próxima historia…» y botón «Buscar» con ícono.
  - **Formularios de registro** (`.formulario--registro`): tarjeta con cabecera (`.formulario__cabecera`, título y ayuda), 2 columnas desde 640 px y elementos a ancho completo (cabecera, autores, acciones, tablas, mensajes).
  - **Autores como chips** (formulario de Libros): los `input[type=checkbox][name=autorIds]` reales se ocultan visualmente (1 px, `clip-path`; siguen enfocables con Tab y se marcan con Espacio) y su `label` se dibuja como chip con recuadro y ✓ al marcarse; el foco se dibuja en el chip (`input:focus-visible + label`).
  - **Panel central morado** (`main`): conserva el degradé morado `--degrade-superficie`, mientras sidebar, barra, tarjetas, formularios y tablas pasaron a azul noche (`--color-surface` `#0e1623`, `--color-surface-2` `#182133`).
  - **Tokens nuevos/ajustados:** `--degrade-boton` y `--degrade-boton-hover` (botón primario degradé violeta-azul con texto blanco), `--color-borde-boton`, `--color-banner-texto`, `--color-banner-suave`, `--color-banner-borde`, `--color-banner-limite`; se redefinen `--color-surface`, `--color-surface-2`, `--color-borde`, `--color-linea`, `--degrade-sidebar/-tarjeta/-tabla` y `--marca-fondo`/`--marca-degrade` (`--marca-fondo` se eliminó en D21).
- **Clases BEM nuevas:** `bienvenida` (`__banner`, `__contenido`, `__titulo`, `__texto`, `__resumen`, `__destello`, `__etiqueta`, `__cantidad`, `__detalle`, `__linea`), `sidebar__marca/__editorial/__codex/__estrella/__rotulo`, `barra__inicio`, `barra__texto`, `tema-alternar__icono--sol/--luna`, `formulario--busqueda`, `formulario--registro`, `formulario__buscador`, `formulario__lupa`, `formulario__cabecera/__titulo/__ayuda`, `boton--buscar`.
- **Resultado de la revisión del contrato y del JS:** (1) los 51 `id` del contrato y los 12 `name` siguen presentes y sin cambios (los 3 checkboxes conservan `name="autorIds"`); **no apareció ningún `id` nuevo**, por lo que las tablas de `knowledge-base/08` y del README no cambian; (2) todos los selectores de `js/app.js` (vistas, `.navegacion__enlace`, `h2.vista__titulo`, `#sidebar*`, `#menu-*`, `.aplicacion*`, `#tema-alternar`, `#form-busqueda`, `#catalogo-*`, `.tarjeta__titulo`) siguen existiendo con la misma estructura; (3) **«Inicio» no recibe `aria-current`**: `mostrarVista` solo marca los `.navegacion__enlace`, así que `aria-current="page"` queda únicamente en el enlace propio del menú; (4) el sol/luna depende de `data-tema` (no de `aria-pressed`), que `aplicarTema` mantiene sincronizado; (5) sin JS la sidebar y «Inicio» siguen visibles y los controles que dependen de JS siguen ocultos; (6) no hay `style=`, handlers `on…=` ni `innerHTML` con datos de usuario; (7) **único arreglo en JS:** el logo nuevo de la sidebar (`.sidebar__marca`, enlace a `#catalogo`) no cerraba el menú móvil al activarse; se agregó ese selector a la lista de enlaces que cierran el menú en `iniciarSidebar` (cambio mínimo, mismo comportamiento que los enlaces de `.navegacion__enlace`).
- **Contraste:** la tabla del README se recalculó completa con los valores efectivos (ambos temas, incluidos los componentes nuevos); no se encontró ningún par por debajo del mínimo. Detalle en el README.
- **Imágenes:** la foto del banner es la única imagen del proyecto (ver D15 y el README, «Recursos y procedencia»). Autor, fuente, enlace y licencia quedan como marcadores `[… — completar]` hasta que el equipo los complete.

### D19. Retoques finales: título al 80 %, fondo con foto difuminada y `scroll-margin-top`
- **Título al 80 %:** `.marca` y sus partes se reducen a 0.8 de su tamaño: libro 2.2 rem, `CODEX` `clamp(1.8rem, 4.8vw, 3.8rem)`, «Editorial» 0.75 rem, lema 0.8 rem, estrellas 0.7 y 0.85 rem, ornamento (ancho, hueco y estrella) y paddings. Los `clamp()` conservan mínimo, preferido y máximo ×0.8, así que sigue funcionando a 320 px. Hover/foco (brillo, estrellas, `marca-titilar`) y el respaldo `forced-colors` no cambian. `CODEX` sigue siendo texto grande (mínimo 28.8 px en negrita); los colores no cambian.
- **Fondo con foto difuminada (solo tema oscuro; refina D15 sin volver a un fondo de imagen "a secas"):** `html::before` (fijo, `inset: 0`, `z-index: -4`, `pointer-events: none`, decorativo) pinta `assets/img/banner-biblioteca.jpg` con `filter: blur(12px) brightness(0.5)` y `transform: scale(1.1)` (los bordes desenfocados quedan fuera), más un tinte cálido suave para que la luz de las estrellas se lea como resplandor. Se eligió `html::before` porque `body::before/::after` ya los usan las nebulosas y las estrellas, y no hace falta tocar el HTML. Apilado en el contexto raíz: `html::before` (-4) < `body::before` (-3, nebulosas, ahora con `opacity` 0.65 y animación 0.6–0.7, y más alfa en cada nebulosa para seguir siendo protagonistas) < `body::after` (-2, estrellas) < contenido; el `background` de `body` se pinta en el canvas, debajo de todo. Sin animación propia (estático), oculto solo en `forced-colors` (desde D21 también se ve en el tema claro). Al ser `fixed` no agrega scroll horizontal. No hay texto sobre el fondo; el único cambio de contraste es el botón de colapsar, que recibe un halo sólido (`box-shadow: 0 0 0 3px var(--color-bg)`) para no depender de la foto (README, «Contraste de color»).
- **Alternativa descartada en D15 (foto con `blur`) retomada:** el motivo de entonces (peor píxel de una foto) se resuelve evaluando el peor caso (píxel blanco tras `brightness`) y que nada de texto va directo sobre el fondo; la procedencia es la de la foto del banner (README, «Recursos y procedencia», con los marcadores `[completar]`).
- **`scroll-margin-top: 100rem` en `#catalogo` y `#titulo-catalogo`: se conserva.** Es un truco intencional: el logo, «Inicio» y el menú llevan a `#catalogo`; con un margen mayor que todo lo que hay sobre la vista (marca + barra, o marca + sidebar sin JS) el navegador no puede alinear su borde superior y la deja en el tope de la página, así «Inicio» vuelve a mostrar la marca y la barra en lugar de dejarlas fuera de pantalla. Análisis (sin navegador): con JS, al cambiar de vista el salto de fragmento cae sobre una sección aún `hidden` (sin caja, no scrollea) y luego `mostrarVista` la muestra y enfoca el `h2` (`focus()` sin `preventScroll`), cuyo scroll de foco con el margen también termina en el tope; con el mismo hash (ya en Catálogo) no hay `hashchange` y el salto de fragmento solo sube. Sin JS (vistas apiladas, Catálogo primera) el salto a `#catalogo` sube al tope y los demás enlaces siguen yendo a su sección; el skip-link `#contenido` no se afecta. Ninguna otra vista define `scroll-margin`. Riesgo aceptado: las demás vistas conservan el scroll normal (puede quedar la marca fuera de pantalla), una asimetría menor; no hay saltos más allá del tope porque el scroll se limita al inicio. Se agregó un comentario en `css/styles.css`.

### D20. Encabezado transparente con velo radial, degradé CODEX del prototipo y paleta desaturada
- **Contexto (2026-10-14):** la franja opaca de `.marca` cortaba la atmósfera del fondo (foto de la biblioteca difuminada + nebulosa) y el rosa/magenta de nebulosas, bordes y acento resultaba más estridente que el prototipo (`prueba_parcial_prog3`).
- **Encabezado transparente (tema oscuro):** `.marca` pasa a `background: transparent` y se ve el fondo de la página detrás. Para el contraste, `.marca::before` (pseudo-elemento libre, sin cambiar el HTML) dibuja dos `radial-gradient` elípticos: un resplandor violeta `rgba(120, 84, 210, .25 → 0)` y un velo oscuro difuso `rgb(8, 5, 18)` con opacidad 0.85 en el centro, 0.82 hasta el 55 % del radio, 0.61 al 75 %, 0.28 al 90 % y 0 al 100 %. No es una franja: el ancho es `min(34rem, 100%)` (la elipse crece hasta un tope en escritorio) y el alto 9.5 rem, centrado en el texto. `z-index: -1` sin crear contexto de apilado en `.marca`: queda sobre la galaxia y por debajo de todo el contenido y de los paneles opacos, así el borde inferior del velo (que sobresale 1.5 rem) se esconde debajo de ellos; el borde superior queda fuera de la ventana. `.marca` lleva `overflow-x: clip` y el pseudo-elemento mantiene `left/right: 0`, por lo que no hay scroll horizontal a 320 px.
- **Contraste:** el peor caso detrás del velo es el del fondo con foto (píxel blanco con tinte cálido y `brightness(.5)` = (128,119,110), cuatro nebulosas apiladas y velo galáctico al 0.6: `#605378`). Con el velo al centro «Editorial», el lema y todo tramo del degradé de «CODEX» dan ≥ 5.23:1; en `t` = 0.75 del radio, ≥ 5.15:1 (se exigió 4.5:1 incluso a «CODEX»). El texto más alejado queda en `t` ≈ 0.62–0.68. El anillo de foco amarillo da 11.41:1 sobre el velo y 4.85:1 aun sin velo. Tabla completa en el README («Marca»).
- **`forced-colors`:** el velo se oculta y `.marca` usa `Canvas` (en el tema claro el encabezado es idéntico al oscuro, ver D21). Hover/foco y `prefers-reduced-motion` no cambian (el velo es estático).
- **Degradé de «CODEX» (del prototipo):** `linear-gradient(100deg, #ffffff 0%, #e4d0ff 24%, #bc92f8 48%, #9a8cff 72%, #78a2ff 100%)` con `background-size: 100% 100%` (todo el recorrido blanco → lila → violeta → azul es visible); se conservan el brillo suave (`drop-shadow`), el color sólido de respaldo y el cambio a `CanvasText` en `forced-colors`.
- **Paleta desaturada:** nebulosas ciruela `rgba(112, 66, 160, .36)`, azul noche `rgba(48, 92, 180, .38)`, violeta apagado `rgba(94, 62, 150, .34)` y un toque rosado apenas perceptible `rgba(150, 70, 130, .14)`; `--degrade-superficie` de `main` pasa a `#251a3a → #161a33 → #0a0d19` (antes `#2a1238 → #1a0f30 → #0c0914`); sombras de brillo de las superficies en violeta apagado con menor opacidad; estrellas rosadas pasan a lila. `--color-acento-rosa`: `#c9a6e8` (oscuro) y `#8a3d84` (claro), no neón. Sin cambios de HTML ni de `id`/`name`.
- **Regla de contraste intacta:** texto ≥ 4.5:1 contra el tramo más claro de cada degradé oscuro (`main` `#251a3a`: 14.85 principal y 9.17 suave); si algo fallara, se oscurece el degradé, no el texto.

### D21. Tema claro: fondo galáctico y encabezado compartidos con el tema oscuro
- **Decisión (2026-10-14, pedido de Amanda; reemplaza lo dicho en D4, D15 y D20 sobre «tema claro sin galaxia», fondo lavanda y encabezado opaco):** en `:root[data-tema="claro"]` el fondo de la página fuera de los paneles y el encabezado con el título son **idénticos** al tema oscuro: foto difuminada (`html::before`), nebulosas (`body::before`, opacity 0.65 y animación 0.6–0.7 solo con `prefers-reduced-motion: no-preference`), estrellas (`body::after`) y `.marca` transparente con el mismo resplandor y velo radial. Solo los paneles (sidebar, barra superior, `main` y sus tarjetas, tablas y formularios) son claros. Se eliminaron las reglas del tema claro sobre `html::before`, `body::before/::after`, `.marca`, `.marca::before` y la animación; sin cambios de HTML ni de `id`/`name`. Con `forced-colors` y `reduce` el comportamiento es el mismo de antes.
- **Tokens:** se quitó `--color-bg` y `--fondo-pagina` del tema claro. `--color-bg` (`#05060f`) pasa a ser el «fondo de la página» en ambos temas (solo lo usan `body` y el halo del botón de colapsar). `--marca-fondo` se eliminó (ya no hay encabezado opaco).
- **Elementos que quedan sobre el fondo de la página (auditados):** (a) botón de colapsar (mitad fuera de la sidebar): en el tema claro recibe localmente, con propiedades personalizadas, los valores del oscuro (`--color-borde-campo`, `--color-surface`, `--color-text`, `--color-acento-rosa`, `--color-foco`), y con foco un halo de 9 px del color de la página para que el anillo amarillo quede rodeado de oscuro por dentro y por fuera (si no, la mitad del anillo caería sobre la sidebar clara: 1.22:1); (b) enlace «Saltar al contenido»: tiene superficie propia y su foco pasa a `--color-foco-marca` (`#ffd166`) en ambos temas, porque el azul del tema claro no se ve sobre el fondo oscuro; (c) tooltip del menú colapsado: tiene su propio relleno `--color-surface-2`; (d) banner «Hola, lector»: ya usa tokens propios (`--color-banner-*` y `#131a31`) y es oscuro en ambos temas. El texto del título usa colores fijos de `.marca`, que no cambian con el tema.
- **Contraste:** los pares del título y del fondo son los de «Marca» y «Fondo de la página con foto» (valen para ambos temas); los del botón de colapsar en claro son los mismos que en oscuro (README, «Contraste de color»).

## Riesgos / Trade-offs

- [Contraste del texto sobre degradés y sobre `background-clip: text`] → El texto de contenido siempre va sobre superficies opacas (degradés o `--color-surface-2`) y se calcula contra el tramo crítico de cada degradé (D16); en ambos temas (D20, D21) el texto del título se apoya en un velo oscuro radial calculado contra el peor caso del fondo con foto. El fondo galáctico no queda detrás de ningún otro texto. El título tiene color sólido de respaldo y `forced-colors`.
- [`localStorage` en `file://` puede variar por navegador (SU-02)] → `try/catch` y valores por defecto; se registra en el README qué navegador se usó.
- [Parpadeo de tema/sidebar al cargar por `defer`] → Aceptado por la usuaria; documentado.
- [Regiones con scroll (tablas) no enfocables por teclado] → Tarea 5.4b (`tabindex="0"`, `role="region"`, `aria-label`).

## Plan de migración

- Sin datos que migrar. No hay cambio visible de comportamiento respecto de C-01: la vista por defecto sigue siendo Catálogo y el hash vacío vuelve a Catálogo.
- Rollback: el repo todavía no tiene commits (los hace Amanda al cerrar la etapa), así que conviene que exista un commit con el estado de C-01 antes de aplicar; no hay datos que revertir.
- Si alguien ya tenía claves `libreria.preferencias.*` con valores inválidos, D7 las ignora y usa los valores por defecto.
