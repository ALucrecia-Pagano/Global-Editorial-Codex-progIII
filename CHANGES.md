# CHANGES — Secuencia de Implementación

> Índice canónico de todos los changes del proyecto **Editorial Codex** (TPI "Frontend de una librería", Programación III, UTN FRM).
> Cada change es atómico: una persona (o agente) puede implementarlo en una sesión (~4-6 horas).
> **Leer este archivo antes de ejecutar cualquier `/opsx:propose`.**

Reglas transversales (aplican a TODOS los changes):

- Solo HTML5 + CSS3 + JavaScript nativo + `localStorage`. **Prohibido**: librerías, frameworks, CDNs, npm, herramientas de build, `fetch` (RN-GL-02). Ningún change los introduce.
- **Sin tests automáticos ni TDD**. La verificación es **manual en el navegador** (320 px, 1280 px, teclado) y los resultados se registran en el README (DD-03, RN-GL-03).
- **Sin commits ni push dentro de los changes**: cada integrante commitea al cerrar su etapa (DD-05).
- Datos de usuario siempre al DOM con `textContent`, nunca `innerHTML` (RN-GL-01).
- Scripts clásicos con `<script src defer>` (no `type="module"`, SU-02).

---

## Cómo usar este documento

1. Identificá el próximo change con `[ ]` cuyas dependencias estén todas en `[x]` y que sea de tu etapa/responsable.
2. Leé los archivos de `knowledge-base/` listados en **Leer antes** del change.
3. Ejecutá `/opsx:propose <nombre-kebab-case>` (usá el nombre del change sin el prefijo `C-NN`) y luego `/opsx:apply`.
4. Verificá a mano los **casos manuales** del change en el navegador, registrá el resultado real y ejecutá `/opsx:archive`.
5. Marcá el checkbox del Estado (`[ ]` → `[x]`) en este archivo.

División por etapas y responsables:

| Etapa | Responsable(s) | Changes |
|-------|----------------|---------|
| **Etapa 1** | Pagano Amanda | C-01 a C-03 (Ej. 1 + Ej. 2 + filtro por título adelantado del Ej. 3) |
| **Etapa 2** | Mateo Liendo (C-04 y C-05); Lucas Avila (C-06 a C-10); Valentini Tiziano (TiziiV) y Garcia Juan (juanmagarciat) (C-11) | C-04 a C-11 (resto del Ej. 3, Ej. 4, Ej. 5 y Ej. 6) |
| **Opcional** | A definir | C-12 (extras del prototipo; no forma parte de los 11 changes obligatorios) |

Integrantes del grupo (para el README): Liendo Mateo, Avila Lucas, Pagano Amanda, Valentini Tiziano, Garcia Juan (DD-13).

---

## Árbol de dependencias

```
ETAPA 1
C-01 estructura-html-navegacion                 (Ej. 1; contrato id/name)
 └── C-02 estilos-responsive-accesibilidad      (Ej. 2)
      └── C-03 filtro-titulo-readme-avance      (Ej. 3 adelantado + entrega de avance)

ETAPA 2 — requiere contrato de C-01 y coincideTitulo de C-03
C-01 + C-03
 └── C-04 datos-locales-catalogo-dinamico
      └── C-05 persistencia-localstorage
           ├── C-06 alta-libros
           ├── C-07 alta-clientes
           └── C-08 composicion-venta
                └── C-09 confirmacion-venta
                     └── C-10 historial-ventas
C-06 + C-07 + C-10
 └── C-11 casos-manuales-readme-final
      └── C-12 extras-prototipo   (OPCIONAL, posterior a la Etapa 2)
```

### Paralelismo por fase

```
GATE 0: (inicio) — nada previo
  → C-01 estructura-html-navegacion               [Etapa 1 — Amanda]

GATE 1: C-01 ✓
  → C-02 estilos-responsive-accesibilidad         [Etapa 1 — Amanda]

GATE 2: C-02 ✓   (ENTREGA ETAPA 1 al cerrar C-03)
  → C-03 filtro-titulo-readme-avance              [Etapa 1 — Amanda]

GATE 3: C-01 ✓ + C-03 ✓   (Etapa 2 arranca tras la entrega de Etapa 1)
  → C-04 datos-locales-catalogo-dinamico          [Etapa 2 — Mateo Liendo]

GATE 4: C-04 ✓
  → C-05 persistencia-localstorage                [Etapa 2 — Mateo Liendo]

GATE 5: C-05 ✓                                    ← FORK (3 ramas paralelas)
  → C-06 alta-libros                              [Etapa 2 — Lucas Avila]
  → C-07 alta-clientes                            [Etapa 2 — Lucas Avila]
  → C-08 composicion-venta                        [Etapa 2 — Lucas Avila]

GATE 6: C-08 ✓
  → C-09 confirmacion-venta                       [Etapa 2 — Lucas Avila]

GATE 7: C-09 ✓
  → C-10 historial-ventas                         [Etapa 2 — Lucas Avila]

GATE 8: C-06 ✓ + C-07 ✓ + C-10 ✓
  → C-11 casos-manuales-readme-final              [Valentini Tiziano (TiziiV) y Garcia Juan (juanmagarciat)]

GATE 9 (opcional): C-11 ✓
  → C-12 extras-prototipo                         [opcional — responsable a definir]
```

### Camino crítico (9 changes — mínimo irreducible hasta el entregable final)

```
C-01 → C-02 → C-03 → C-04 → C-05 → C-08 → C-09 → C-10 → C-11
```

C-06 y C-07 corren en paralelo al tramo C-08 → C-09 → C-10, pero C-11 los espera.

### Plan recomendado por responsable

Los responsables de Etapa 2 están a definir; este es el orden recomendado y qué se puede hacer en paralelo.

**Etapa 1** (una sola persona, orden secuencial):

| Paso | Pagano Amanda |
|------|---------------|
| 1 | C-01 estructura-html-navegacion |
| 2 | C-02 estilos-responsive-accesibilidad |
| 3 | C-03 filtro-titulo-readme-avance (commit de cierre de Etapa 1) |

**Etapa 2** (orden recomendado por responsable):

| Paso | Frente 1 | Frente 2 | Frente 3 |
|------|----------|----------|----------|
| 1 | C-04 datos-locales-catalogo-dinamico (Mateo Liendo) | — | — |
| 2 | C-05 persistencia-localstorage (Mateo Liendo) | — | — |
| 3 | C-08 composicion-venta (Lucas Avila) | C-06 alta-libros (Lucas Avila) | C-07 alta-clientes (Lucas Avila) |
| 4 | C-09 confirmacion-venta (Lucas Avila) | — | — |
| 5 | C-10 historial-ventas (Lucas Avila) | (apoyo: casos manuales 2 y 7) | (apoyo: casos manuales 3 y 7) |
| 6 | C-11 casos-manuales-readme-final (TiziiV y juanmagarciat) | C-11 | C-11 |

---

## ETAPA 1 — Pagano Amanda (Ej. 1 + Ej. 2 + filtro por título)

## FASE 1 — Estructura HTML y navegación

### [C-01] `estructura-html-navegacion`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-10-14-estructura-html-navegacion/`)
- **Ejercicio**: Ej. 1 — Estructura HTML y navegación
- **Owner**: Pagano Amanda (Etapa 1)
- **Scope**:
  - `index.html` único (DD-01) con `<header>`, `<nav id="nav-principal">`, `<main>` y 5 `<section>`: `#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial` (US-001, US-002)
  - Catálogo: título "Editorial Codex", `form#form-busqueda` con `input#catalogo-busqueda name="busqueda"`, `#catalogo-lista` con tarjetas estáticas (título, ISBN, editorial, género, autores, precio), al menos una tarjeta «Sin clasificar», `#catalogo-sin-resultados` y `#catalogo-vacio` con `hidden`
  - Libros: `form#form-libro` con `libro-titulo`, `libro-isbn`, `libro-precio`, `libro-editorial` (select), `libro-genero` (select con «Sin clasificar» `value=""`), `fieldset#libro-autores` con checkboxes `name="autorIds"`; `libro-errores`, `libro-mensaje`, tabla `libros-tabla`, `libros-vacio`
  - Clientes: `form#form-cliente` con `cliente-nombre` (`nombreCompleto`), `cliente-email` (`email`); `cliente-errores`, `cliente-mensaje`, `clientes-tabla`, `clientes-vacio`
  - Ventas: `form#form-venta` con `venta-cliente`, `venta-libro`, `venta-cantidad`, `venta-agregar`, tabla `venta-renglones` con precio unitario y subtotal, `venta-renglones-vacio`, `venta-total`, `venta-confirmar`, `venta-errores`, `venta-mensaje`
  - Historial: tabla `historial-tabla` (id, fecha, cliente, total, acción "Ver detalle"), `historial-vacio`, panel `historial-detalle`
  - Ejemplos estáticos con formatos finales: id `V-0001`, importes ARS estilo `Intl.NumberFormat('es-AR')` (ej. `$ 1.500,00`), fechas `dd/mm/aaaa hh:mm` (DD-09, DD-10, DD-11)
  - Mensajes de estado maquetados (vacío / sin resultados / éxito / rechazo) presentes y ocultos con `hidden` (US-002)
  - Todo `<label for>` asociado, `<th>` en tablas, `fieldset/legend` en autores (RN-UI-02, RN-UI-03)
  - Controles aún no funcionales rotulados como "maqueta" (RN-UI-11)
  - **Copiar la tabla de contrato `id`/`name` de `knowledge-base/08` a `README.md`** (DD-08) para que Etapa 2 la consulte
  - Navegación por anclas (`#catalogo`, `#libros`, ...) mostrando una vista a la vez (DD-01): `js/app.js` escucha `hashchange` y alterna el atributo `hidden` de cada vista (`mostrarVista(id)`); no se usa `:target`. Vista por defecto: Catálogo si no hay hash
  - Vista activa marcada con `aria-current="page"` además del estilo (US-001); nav operable por teclado (Tab/Enter), orden de foco lógico
  - `<script src="js/app.js" defer>` (clásico, no módulo)
  - **Decisión tomada**: JS con `hashchange` + `hidden` en lugar de `:target`; documentada en el README (§Navegación entre vistas)
- **Dependencias**: ninguna
- **Governance**: MEDIO
- **Criterios de verificación manual**:
  - Abrir `index.html` por doble clic (`file://`) y ver las 5 secciones sin errores en consola
  - Comparar cada `id`/`name` del HTML contra la tabla del README: coinciden 1 a 1
  - Todos los campos tienen label asociada (clic en la label enfoca el campo)
  - Cambiar de vista con clic y con teclado; la vista activa se distingue sin depender del color
  - Recargar con `#ventas` en la URL muestra Ventas; sin hash muestra Catálogo
  - Botón "atrás" del navegador vuelve a la vista previa
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-001, §US-002
  - `knowledge-base/08_arquitectura_propuesta.md` §Contrato de maqueta, §Tabla de contrato id/name, §Formato de datos mostrados, §Accesibilidad
  - `knowledge-base/05_reglas_de_negocio.md` §RN-UI, §RN-CA-01/02
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-01, §DD-08, §DD-13, §SU-02

---

## FASE 2 — Presentación, accesibilidad e interacción

### [C-02] `estilos-responsive-accesibilidad`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-10-14-estilos-responsive-accesibilidad/`)
- **Ejercicio**: Ej. 2 — Estilos, diseño adaptable y accesibilidad
- **Owner**: Pagano Amanda (Etapa 1)
- **Alcance (DD-14, recortado el 2026-10-14)**: Ej. 2 con la **identidad visual** del prototipo aprobado por el grupo (`../../prueba_parcial_prog3`), la sidebar colapsable y el tema claro/oscuro. Las vistas y extras del prototipo (Inicio, carrusel, escritores, detalle de libro con estrellas, Ingresar/Registro, toasts, migas) pasaron al change opcional **C-12** `extras-prototipo`.
- **Scope**:
  - **Base de estilos (Ej. 2)**
    - `css/styles.css` con custom properties en `:root` (`--color-bg`, `--color-surface`, `--color-accent` violeta/índigo, `--color-text`, espaciados, radios): paleta oscura del prototipo y tema claro, inspirada en BookNest, no copiada (US-003, DD-04, DD-12, DD-14)
    - Componentes BEM reutilizables: `.tarjeta`, `.boton`, `.formulario__campo`, `.tabla-contenedor`, `.mensaje` (+ `--exito`/`--error`), `.aviso--maqueta` (RN-UI-05), más `.sidebar`, `.navegacion`, `.marca` y `.barra`
    - Tapas de libro generadas **solo con CSS** (degradé + título/autor como texto) en las tarjetas del catálogo; **sin imágenes de tapas** (DD-12; las tapas `.jpg` del prototipo no se copian)
    - Layout con Flexbox/Grid (RN-UI-06); estilos de tabla y formulario; vista activa en el menú que no dependa solo del color
    - Contraste de texto >= 4.5:1 (AA) en todos los pares texto/fondo, **en tema oscuro y en tema claro**
    - CSS mobile-first con media queries; todo adaptable a 320 px y 1280 px (US-004, RN-UI-07)
    - Tablas dentro de `.tabla-contenedor { overflow-x: auto }`, **enfocables por teclado** (`tabindex="0"`, `role="region"`, `aria-label`); sin scroll horizontal de la página
    - `:focus-visible` con contorno de alto contraste en menú, campos, botones y enlaces (RN-UI-08); no quitar `outline` sin reemplazo
    - Mensajes de error con texto/prefijo, no solo color (RN-UI-09); `aria-live` en zonas de resultado
    - `alt` correcto en imágenes informativas, `alt=""` / fondo CSS en decorativas (RN-UI-10); skip-link al `<main id="contenido">`
  - **Identidad visual del prototipo**
    - Fuente local Cinzel Decorative en `fonts/CinzelDecorative-Bold.ttf` vía `@font-face`, con su licencia `fonts/OFL.txt`; sin Google Fonts ni CDN
    - Título "Editorial Codex" con degradé violeta-azul (color sólido de respaldo y `forced-colors`), estrellas doradas y ornamento decorativos, y efecto "mágico" en hover/foco (respetando `prefers-reduced-motion`)
    - Fondo galáctico con CSS (base negro azulado, nebulosas rosa/morado/violeta con `radial-gradient` y estrellas con capas repetidas; decorativo; movimiento lento solo bajo `prefers-reduced-motion: no-preference`); el tema claro comparte el fondo y el encabezado del oscuro y solo aclara los paneles. **Tapas sin imágenes** (solo CSS) y las `portada*.jpg` se eliminaron; tras el ajuste final de diseño (D18–D21) hay **una única foto decorativa**, `assets/img/banner-biblioteca.jpg`, aplicada por CSS en el banner del Catálogo y, difuminada, como fondo de la página debajo del velo galáctico, en ambos temas (procedencia en el README: Valentin Antonini, Unsplash, Licencia Unsplash), además del favicon `assets/img/favicon.svg`
    - Superficies (`main`, sidebar, tarjetas, tablas) con degradé rosa/morado/negro y borde con brillo violeta-rosa; acento rosa (`--color-acento-rosa`) en hover, enlace activo y tooltip; contraste del texto calculado contra el tramo más claro de cada degradé (si no llega, se oscurece el degradé, no el texto)
  - **Sidebar colapsable** (`aside#sidebar` con `nav-principal` adentro, 5 enlaces con ícono y tooltip)
    - Escritorio: botón con flechita que colapsa/expande la sidebar (`aria-expanded`, `aria-controls`); estado recordado en `localStorage`
    - Celular: botón hamburguesa con velo; operable con teclado y cerrable con Escape, con el botón de cerrar, tocando el velo o al activar un enlace
  - **Tema claro/oscuro**: botón de alternancia en la barra superior (`aria-pressed`), tema recordado en `localStorage`; respeta `prefers-color-scheme` si no hay preferencia guardada
  - **Sin JavaScript**: el menú queda visible, las 5 vistas se ven apiladas y no aparecen los botones que dependen de JS
  - **JS de Etapa 1** (`js/app.js`, script clásico con `defer`): solo comportamiento de presentación (tema y sidebar). Sin datos de dominio en JS
- **Restricciones de Etapa 1**:
  - Se mantienen las **5 vistas de C-01** y la vista por defecto **Catálogo**; no se agregan vistas ni ids de contenido nuevos (así C-04 no tiene que regenerar HTML extra)
  - Datos ficticios: los **6 libros del TP** (seed de `knowledge-base/04`), no los libros reales del prototipo
  - Se **conservan todos los `id`/`name`** del contrato de C-01; los de estructura nuevos (`contenido`, `sidebar`, `sidebar-colapsar`, `menu-abrir`, `menu-cerrar`, `sidebar-velo`, `tema-alternar`) se agregan a la tabla de contrato de `knowledge-base/08` **y** del `README.md` en el mismo change (DD-08)
  - Claves de `localStorage` de Etapa 1 con prefijo `libreria.preferencias.*` (`libreria.preferencias.tema` y `libreria.preferencias.sidebar`) para no chocar con las de libros, clientes y ventas; se documentan en `knowledge-base/04`
  - Todo con `try/catch` al leer/escribir `localStorage`, con lista blanca de valores: si falla, la página funciona con valores por defecto
- **Delta de specs**:
  - `navegacion-vistas` (archivada en C-01): un requisito **MODIFIED**, "Degradación sin JavaScript" (la sidebar visible sin botones de JS)
  - `maqueta-vistas`: un requisito **MODIFIED**, "Página única con estructura semántica" (skip-link, `aside`, `main#contenido`)
  - Capabilities nuevas: `estilos-tema`, `preferencias-locales`, `sidebar-colapsable`
- **Dependencias**: `C-01`
- **Governance**: MEDIO
- **Criterios de verificación manual** (caso manual 8 + extras):
  - Todos los pares de color, **calculados con la fórmula de contraste de WCAG** (tabla en el README) en **ambos temas**: texto >= 4.5:1 y no texto >= 3:1
  - Todas las vistas usan las mismas clases para elementos equivalentes (inspección visual)
  - Network de DevTools: solo recursos locales (CSS, JS, fuente, favicon y el banner `banner-biblioteca.jpg`); ninguna imagen de tapas ni de fondo galáctico y ningún recurso externo
  - DevTools modo responsive a 320 px y 1280 px exactos: `document.documentElement.scrollWidth <= window.innerWidth` en las 5 vistas
  - Recorrer toda la app solo con Tab/Shift+Tab/Enter/Escape (incluye sidebar, hamburguesa, tema y tablas con scroll): el foco es siempre visible y el orden es lógico
  - La tabla del historial scrollea dentro de su contenedor, no la página
  - Un error maquetado se entiende en escala de grises
  - Sin hash abre Catálogo; `#catalogo` y el resto de los hashes de C-01 siguen funcionando
  - Colapsar la sidebar y cambiar de tema; recargar: las dos preferencias se mantienen, bajo claves `libreria.preferencias.*`
  - Con `prefers-reduced-motion` activo, el título y el fondo no se animan solos
  - Con JavaScript deshabilitado el menú se ve y funciona como anclas
  - El README indica qué imágenes se usan (fondo y tapas 100% CSS; el favicon SVG y el banner decorativo `banner-biblioteca.jpg` con su procedencia registrada: Valentin Antonini en Unsplash, Licencia Unsplash), la licencia de la fuente y la tabla de contrato actualizada
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-003, §US-004
  - `knowledge-base/05_reglas_de_negocio.md` §RN-UI-05..10
  - `knowledge-base/04_modelo_de_datos.md` §Seed mínimo, §Claves de `localStorage`
  - `knowledge-base/08_arquitectura_propuesta.md` §Patrones aplicados, §Tabla de contrato id/name, §Accesibilidad
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-04, §DD-08, §DD-12, §DD-14
  - `knowledge-base/07_flujos_principales.md` §Caso manual 8 (cómo verificar 320/1280 px)
  - `openspec/specs/navegacion-vistas/spec.md`, `openspec/specs/maqueta-vistas/spec.md`
  - Prototipo `../../prueba_parcial_prog3/` (`css/styles.css`, `fonts/`, `img/portada*.jpg`) solo como referencia visual; las imágenes del prototipo no se copian al proyecto
  - `docs/inspo/inspo-booknest.png`
  - Nota: esa imagen fue reemplazada por el prototipo propio (`docs/inspo/README.md`) en el change `inspo-prototipo-propio` (DD-15).

---

## FASE 3 — Filtro y entrega de avance de Etapa 1

### [C-03] `filtro-titulo-readme-avance`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-10-14-filtro-titulo-readme-avance/`; 18/21 tareas: 4.2, 4.3 y 4.4 son verificaciones manuales no ejecutadas, registradas en el README)
- **Ejercicio**: Ej. 3 (filtro por título, adelantado a Etapa 1) + entrega del avance de Etapa 1
- **Owner**: Pagano Amanda (Etapa 1)
- **Scope**:
  - `js/app.js`: función **pura** `coincideTitulo(titulo, busqueda)` = `trim()` + `toLowerCase()` + `includes`; búsqueda vacía devuelve `true` (DD-07, RN-CA-04/05)
  - Handler del evento `input` sobre `#catalogo-busqueda`: lee el título de cada tarjeta estática de `#catalogo-lista`, muestra/oculta con `hidden`, y alterna `#catalogo-sin-resultados` si hay cero coincidencias (RN-CA-06)
  - `submit` de `#form-busqueda` con `preventDefault` (sin recarga); mensaje de resultados en zona `aria-live="polite"`
  - La función no toca el DOM para que Etapa 2 la reutilice sobre el array (IN-01 resuelta)
  - `README.md` de avance de Etapa 1: nombre Editorial Codex, integrantes (DD-13), cómo abrir sin npm (doble clic en `index.html`)
  - Sección explícita **"Qué es maqueta y qué funciona"**: por vista, cuáles pantallas/controles son maqueta (altas, venta, historial) y qué interacción ya funciona (filtro por título + navegación)
  - Conservar la tabla de contrato `id`/`name` copiada en C-01 y confirmar que coincide con el HTML final
  - Decisiones de Etapa 1 (una página con secciones, tema oscuro, tapas en CSS, `coincideTitulo` reutilizable)
  - Registrar el **resultado observado** de los casos manuales 1 y 8 (RN-GL-03: no marcar aprobado sin ejecutar; si falla, anotar el comportamiento real)
  - Sin commits desde el change: Amanda commitea al cerrar la etapa (DD-05)
- **Dependencias**: `C-01, C-02`
- **Governance**: MEDIO (la regla RN-CA-04 se reutiliza en Etapa 2)
- **Criterios de verificación manual** (caso manual 1 y cierre de caso 8):
  - Buscar parte de un título en MAYÚSCULAS: aparecen las coincidencias
  - Buscar con espacios alrededor (`"  codigo  "`): funciona igual que sin espacios
  - Borrar el texto: vuelve el catálogo completo
  - Buscar un texto inexistente: aparece el mensaje "sin resultados"
  - Enter dentro del buscador no recarga la página
  - Releer el README como si fuera un compañero de Etapa 2: ¿sabe qué pantallas son maqueta y qué hooks usar?
  - Casos 1 y 8 ejecutados en el navegador y resultado real anotado en el README
  - Cada fila de la tabla de contrato existe en `index.html`
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-005, §US-012 (nota de Etapa 1)
  - `knowledge-base/07_flujos_principales.md` §Flujo 1, §Casos manuales de verificación
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CA-04/05/06
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-02, §DD-05, §DD-07, §DD-13
  - `knowledge-base/10_preguntas_abiertas.md` §IN-01

---

## ETAPA 2 — Mateo Liendo (C-04 y C-05), Lucas Avila (C-06 a C-10), Valentini Tiziano (TiziiV) y Garcia Juan (juanmagarciat) (C-11)

> Prerrequisito de toda la Etapa 2: leer el contrato `id`/`name` (README, copiado en C-01). **No renombrar ids ni names**; si hace falta cambiarlos, se actualizan HTML y README a la vez y se avisa al equipo.
> Si se divide `js/app.js` (`data.js`, `storage.js`, `render.js`, `validators.js`, `ventas.js`), cargar con `<script defer>` en orden y sin módulos ES (SU-02).

## FASE 4 — Datos y persistencia

### [C-04] `datos-locales-catalogo-dinamico`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-10-17-datos-locales-catalogo-dinamico/`)
- **Ejercicio**: Ej. 3 — Datos locales y catálogo dinámico
- **Owner**: Mateo Liendo (Etapa 2)
- **Scope**:
  - Arrays con ids estables: `libros` (>= 6, uno sin género), `editoriales` (>= 2), `generos` (>= 2), `autores` (>= 3), `clientes` (>= 3); incluir libros con precio 1500 y 2000 para el caso manual 5 (US-006)
  - Catálogo renderizado desde `libros` en `#catalogo-lista` con `createElement`/`textContent`; «Sin clasificar» si `generoId` es `null` (RN-CA-01/02/03, RN-GL-01)
  - Mismo markup/clases que las tarjetas estáticas de C-01; **quitar las tarjetas estáticas** para evitar duplicados (SU-03)
  - Reutilizar `coincideTitulo` de C-03 sobre el array (el filtro ahora re-renderiza desde `libros`)
  - Formateo de importes con `Intl.NumberFormat('es-AR', ARS)` y de fechas `dd/mm/aaaa hh:mm` en funciones de formato únicas (DD-10, DD-11)
  - Render inicial de listados de Libros y Clientes desde los arrays
- **Dependencias**: `C-01, C-03`
- **Governance**: ALTO (modelo core: todos los demás changes de Etapa 2 leen estos arrays e ids)
- **Criterios de verificación manual**:
  - El catálogo muestra los 6 libros con título, ISBN, editorial, género, autores, precio ARS
  - El libro sin género muestra «Sin clasificar»
  - Filtro (caso 1) sigue funcionando sobre el array: mayúsculas, vacío, inexistente
  - No hay tarjetas duplicadas (estática + dinámica)
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Entidades, §Seed data inicial
  - `knowledge-base/06_funcionalidades.md` §US-006
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CA, §RN-GL-01
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-07, §DD-10, §DD-11, §SU-03

### [C-05] `persistencia-localstorage`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-10-17-persistencia-localstorage/`)
- **Ejercicio**: Ej. 6 — Persistencia en `localStorage`
- **Owner**: Mateo Liendo (Etapa 2)
- **Scope**:
  - Repositorio de `localStorage` (`cargar(clave)` / `guardar(clave, datos)`) para `libreria.libros`, `libreria.clientes`, `libreria.ventas` (US-011, RN-PE-01)
  - Arranque (Flujo 6): claves ausentes → cargar seed y guardarlo; presentes → usar lo guardado sin mezclar con seed (RN-PE-02)
  - Todas las altas/ventas posteriores llaman al repositorio (único punto de acceso a `localStorage`)
  - **Decisión a tomar (no bloqueante)**: qué hacer si el JSON está corrupto — supuesto de la KB: volver al seed y avisar con mensaje; documentarlo en el README
  - Documentar claves y estructura para el README (RN-PE-03)
- **Dependencias**: `C-04`
- **Governance**: ALTO (persistencia de datos de usuario; riesgo de duplicar seed o perder datos)
- **Criterios de verificación manual** (adelanta caso 7):
  - Primera apertura (storage vacío en DevTools > Application): se cargan los ejemplos
  - Recargar: siguen los mismos datos, sin duplicados
  - Editar a mano `libreria.libros` con JSON inválido y recargar: la app no se rompe y aplica la decisión tomada
  - Borrar las claves y recargar: vuelve el seed
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Persistencia
  - `knowledge-base/05_reglas_de_negocio.md` §RN-PE
  - `knowledge-base/07_flujos_principales.md` §Flujo 6
  - `knowledge-base/10_preguntas_abiertas.md` (JSON corrupto)
  - `knowledge-base/09_decisiones_y_supuestos.md` §SU-02

---

## FASE 5 — Altas y composición de venta

> Tras C-05, C-06, C-07 y C-08 son independientes entre sí y pueden hacerse en paralelo. Las altas deben refrescar los selectores de Ventas (RN-FO-04): usar una función de render compartida (`renderSelectores()`), no duplicar lógica.

> **Nota (correcciones Etapa 2):** el código de C-06 a C-10 se corrigió y completó en el change `correcciones-etapa2`, archivado el 19/10/2026 tras la verificación manual (README, «Verificación manual — correcciones Etapa 2»).

### [C-06] `alta-libros`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-10-19-correcciones-etapa2/`)
- **Ejercicio**: Ej. 4 — Altas con validación (libros)
- **Owner**: Lucas Avila (Etapa 2)
- **Scope**:
  - Opciones de `#libro-editorial`, `#libro-genero` (con «Sin clasificar» `value=""`) y checkboxes `libro-autores` generadas desde los arrays (RN-LI-07)
  - Validador puro `validarLibro(datos, libros, ...)` → lista de errores: título/ISBN no vacíos, ISBN único sin espacios ni guiones, precio numérico > 0, editorial existente, >= 1 autor existente, género opcional (RN-LI-01..06)
  - `submit` de `#form-libro` con `preventDefault`; errores como texto en `#libro-errores`; solo se agrega si todo pasa (RN-FO-01..03)
  - Alta correcta: push, persistir (C-05), re-render de `libros-tabla`, catálogo y selector `venta-libro`; mensaje en `#libro-mensaje`; reset del formulario (US-007, RN-FO-04)
  - Sin edición ni eliminación (RN-FO-05)
- **Dependencias**: `C-05`
- **Governance**: MEDIO
- **Criterios de verificación manual** (caso manual 2):
  - ISBN existente (también con guiones/espacios distintos): rechazado con mensaje
  - Título vacío, precio 0, negativo o texto, sin autores: rechazados con texto
  - ISBN nuevo válido: aparece en listado, catálogo y selector de venta; recargar y sigue ahí
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Libro
  - `knowledge-base/05_reglas_de_negocio.md` §RN-LI, §RN-FO
  - `knowledge-base/07_flujos_principales.md` §Flujo 2, §Caso manual 2
  - `knowledge-base/08_arquitectura_propuesta.md` §Tabla de contrato id/name (Libros)

### [C-07] `alta-clientes`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-10-19-correcciones-etapa2/`)
- **Ejercicio**: Ej. 4 — Altas con validación (clientes)
- **Owner**: Lucas Avila (Etapa 2)
- **Scope**:
  - Validador puro `validarCliente(datos, clientes)`: nombre y email no vacíos, formato de email, email único con `trim()` + minúsculas (RN-CL-01..03)
  - **Decisión a tomar (no bloqueante)**: regex de email; sugerida `^[^\s@]+@[^\s@]+\.[^\s@]+$`; documentarla en el README
  - `submit` de `#form-cliente` con `preventDefault`; errores como texto en `#cliente-errores`; mensaje en `#cliente-mensaje`
  - Alta correcta: push, persistir (C-05), re-render de `clientes-tabla` y del selector `venta-cliente`; reset del formulario (US-008)
- **Dependencias**: `C-05`
- **Governance**: MEDIO
- **Criterios de verificación manual** (caso manual 3):
  - Email inválido (`abc`, `a@b`): rechazado
  - Email existente escrito en MAYÚSCULAS o con espacios: rechazado
  - Email nuevo válido: aparece en listado y selector de venta; recargar y sigue
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Cliente
  - `knowledge-base/05_reglas_de_negocio.md` §RN-CL, §RN-FO
  - `knowledge-base/07_flujos_principales.md` §Flujo 3, §Caso manual 3
  - `knowledge-base/10_preguntas_abiertas.md` (regex de email)

### [C-08] `composicion-venta`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-10-19-correcciones-etapa2/`)
- **Ejercicio**: Ej. 5 — Ventas (composición)
- **Owner**: Lucas Avila (Etapa 2)
- **Scope**:
  - Selectores `venta-cliente` y `venta-libro` generados desde los arrays (RN-VE-01)
  - Estado en memoria del borrador de venta (renglones) y render de `venta-renglones`: libro, cantidad editable, precio unitario, subtotal, botón "quitar" (RN-VE-04)
  - Validación de cantidad: entera > 0 (rechaza 0, negativos y decimales) con mensaje de texto en `venta-errores` (RN-VE-02)
  - **Decisión a tomar (IN-02, no bloqueante)**: libro repetido → sumar a la cantidad del renglón existente **o** informar duplicado; nunca crear otro renglón (RN-VE-03). Documentar cuál se eligió para el caso 4
  - Subtotal = cantidad × precio y total = suma, con 2 decimales y formato ARS en `venta-total` (RN-VE-05)
  - `venta-renglones-vacio` visible cuando no hay renglones
- **Dependencias**: `C-05`
- **Governance**: MEDIO
- **Criterios de verificación manual** (casos 4 y 5, parte de composición):
  - Cantidad 0, -1 y 1.5: rechazadas con mensaje
  - Agregar dos veces el mismo libro: no aparece un segundo renglón (se suma o se informa, según decisión)
  - 2 u. a 1500 + 1 u. a 2000: subtotales 3000 y 2000, total 5000 (`$ 5.000,00`)
  - Cambiar cantidad y quitar renglón recalcula el total
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Venta, §Renglón
  - `knowledge-base/05_reglas_de_negocio.md` §RN-VE-01..05
  - `knowledge-base/07_flujos_principales.md` §Flujo 4, §Casos manuales 4 y 5
  - `knowledge-base/10_preguntas_abiertas.md` §IN-02
  - `knowledge-base/08_arquitectura_propuesta.md` §Tabla de contrato id/name (Ventas)

---

## FASE 6 — Confirmación e historial

### [C-09] `confirmacion-venta`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-10-19-correcciones-etapa2/`)
- **Ejercicio**: Ej. 5 — Ventas (confirmación)
- **Owner**: Lucas Avila (Etapa 2)
- **Scope**:
  - `submit`/clic en `#venta-confirmar` con `preventDefault`; rechaza sin cliente, sin renglones o con cantidades inválidas, con mensaje de texto (RN-VE-06)
  - Crea la venta `{id: 'V-0001'..., fecha: toISOString(), clienteId, clienteNombre, renglones[{libroId, titulo, cantidad, precioUnitario, subtotal}], total}` (RN-VE-07)
  - **Copia el `precioUnitario` del catálogo al renglón al confirmar** (precio histórico, RN-VE-08); ids correlativos calculados a partir de las ventas guardadas (DD-09)
  - Persiste en `libreria.ventas` (C-05), limpia el formulario y borrador, muestra mensaje de éxito en `venta-mensaje` (RN-VE-09)
  - La venta confirmada es inmutable: sin código de edición ni borrado (RN-HI-03)
- **Dependencias**: `C-08`
- **Governance**: ALTO (integridad del precio histórico y del correlativo de ids)
- **Criterios de verificación manual** (casos 4, 5 y 6):
  - Confirmar sin cliente, sin renglones o con cantidad inválida: no se registra nada
  - Venta válida (2 x 1500 + 1 x 2000): se guarda con total 5000 y id `V-0001`; la siguiente es `V-0002`
  - En `libreria.ventas` (DevTools) los renglones tienen `precioUnitario` propio
  - Formulario limpio y mensaje de éxito tras confirmar
- **Leer antes**:
  - `knowledge-base/04_modelo_de_datos.md` §Venta, §Renglón (copia histórica)
  - `knowledge-base/05_reglas_de_negocio.md` §RN-VE-06..09
  - `knowledge-base/07_flujos_principales.md` §Flujo 4 (paso 5), §Caso manual 6
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-09, §DD-10, §DD-11

### [C-10] `historial-ventas`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-10-19-correcciones-etapa2/`)
- **Ejercicio**: Ej. 5 — Historial de ventas
- **Owner**: Lucas Avila (Etapa 2)
- **Scope**:
  - Render de `historial-tabla` desde `ventas`: id, fecha `dd/mm/aaaa hh:mm`, cliente, total ARS (US-010, RN-HI-01)
  - Acción "Ver detalle" (botón accesible por teclado) que llena `historial-detalle` con los renglones **guardados** en la venta: título, cantidad, precio unitario histórico, subtotal (RN-HI-02, RN-HI-04)
  - `historial-vacio` cuando no hay ventas; el historial se actualiza al confirmar una venta sin recargar
  - Sin botones de editar/eliminar (RN-HI-03); datos de la venta insertados con `textContent`
- **Dependencias**: `C-09`
- **Governance**: MEDIO
- **Criterios de verificación manual** (casos 5, 6 y 7):
  - Tras confirmar, la venta aparece en el historial sin recargar
  - "Ver detalle" muestra renglones, precio unitario, subtotales y total correctos
  - Cambiar a mano el precio en `libreria.libros` y recargar: el detalle conserva el precio y total originales
  - Recargar: las ventas siguen y no se duplican
- **Leer antes**:
  - `knowledge-base/05_reglas_de_negocio.md` §RN-HI
  - `knowledge-base/07_flujos_principales.md` §Flujo 5, §Casos manuales 5, 6 y 7
  - `knowledge-base/04_modelo_de_datos.md` §Venta, §Renglón
  - `knowledge-base/08_arquitectura_propuesta.md` §Tabla de contrato id/name (Historial)

---

## FASE 7 — Cierre del TPI

### [C-11] `casos-manuales-readme-final`
- **Estado**: `[x]` completado por Valentini Tiziano (TiziiV) y Garcia Juan (juanmagarciat) (archivado en `openspec/changes/archive/2026-10-19-casos-manuales-readme-final/`). El README tiene «Estado del trabajo», el índice de los 8 casos y las decisiones de Etapa 2. El JS muestra `#catalogo-vacio`, `#libros-vacio` y `#clientes-vacio` cuando el array está vacío.
- **Ejercicio**: Ej. 6 — Casos manuales y README final
- **Owner**: Valentini Tiziano (TiziiV) y Garcia Juan (juanmagarciat)
- **Scope**:
  - Ejecutar a mano los casos 2 a 8 en el navegador (re-verificar el 8 a 320/1280 px y teclado con los datos dinámicos) y registrar el **resultado observado** de los 8 casos en el README; si uno falla, anotar el comportamiento real (RN-GL-03, US-012)
  - Revisar que no queden restos de datos estáticos duplicados y que todas las zonas de mensaje funcionen con datos reales
  - README final: integrantes, cómo abrir sin npm, navegación, qué está implementado y qué queda pendiente, datos iniciales, claves y estructura de `localStorage` y sus límites (navegador, perfil, ubicación de apertura, no compartido entre usuarios) (RN-PE-03)
  - Documentar las decisiones de Etapa 2: libro repetido en venta (IN-02), JSON corrupto, regex de email, división de archivos JS
  - Declarar las imágenes que se usan y su procedencia (tapas CSS; solo el banner decorativo es una foto) y que no hay librerías, CDNs, npm ni `fetch`
  - Sin commits desde el change: cada integrante commitea al cerrar su parte
  - `docs/consigna-tpi.pdf` se eliminó del repo al cerrar el TPI
- **Dependencias**: `C-06, C-07, C-10`
- **Governance**: BAJO
- **Criterios de verificación manual**:
  - Los 8 casos tienen resultado observado (no "esperado") en el README
  - Un tercero puede abrir `index.html` con doble clic y seguir el README sin ayuda
  - Cero errores en consola en las 5 vistas
- **Leer antes**:
  - `knowledge-base/06_funcionalidades.md` §US-012
  - `knowledge-base/07_flujos_principales.md` §Casos manuales de verificación
  - `knowledge-base/05_reglas_de_negocio.md` §RN-PE-03, §RN-GL-03
  - `knowledge-base/10_preguntas_abiertas.md`
  - `knowledge-base/01_vision_y_objetivos.md` §Métricas de éxito

---

## FASE 8 — Extras opcionales (posterior a la Etapa 2)

### [C-12] `extras-prototipo`
- **Estado**: `[ ]` pendiente (**opcional**)
- **Ejercicio**: Extra fuera de la consigna — vistas y funciones del prototipo aprobado (DD-14)
- **Owner**: A definir
- **Scope** (decisiones ya tomadas por la usuaria; detalle en `docs/extras-prototipo/`):
  - **Inicio** (`#inicio`): vista por defecto sin hash, con banner, tarjetas de resumen (6 libros, 2 géneros, 3 escritores), libro destacado (`li-2` "Estrellas de papel") y carrusel "Recomendados" (botones anterior/siguiente y desplazamiento al acercar el cursor a los bordes); contados desde los datos reales de la Etapa 2
  - **Escritores** (`#escritores`): tarjetas con iniciales, cantidad de libros, géneros y enlaces al detalle de cada libro
  - **Detalle de libro** (`#libro-li-1` … `#libro-li-6`) con descripción y puntuación propia con estrellas (radios), recordada en `libreria.preferencias.puntuaciones`
  - **Estrellas de solo lectura** en las tarjetas del catálogo y del carrusel, dibujadas con CSS (valores fijos: li-1 = 4, li-2 = 5, li-3 = 3, li-4 = 4, li-5 = 3, li-6 = 5); limitación conocida: no se sincronizan con la puntuación del detalle
  - **Ingresar** (un solo ítem en el menú, sin sesión) y **Registro** (`#ingresar`, `#registro`): formularios con validación simulada; nunca se guardan contraseñas ni datos de usuario; fondo solo con CSS (el proyecto no usa imágenes; `portada.jpg` se eliminó)
  - **Toasts** de confirmación (`div#notificaciones`, `aria-live="polite"`) y **migas de pan** en las vistas internas
  - `aria-current="true"` en el enlace padre del menú (Catálogo en el detalle, Ingresar en Registro) con `VISTA_PADRE`
  - Adaptar todo a los datos dinámicos de la Etapa 2 y volver a verificar a 320/1280 px y con teclado
- **Dependencias**: `C-11`
- **Governance**: MEDIO
- **Criterios de verificación manual**:
  - Sin hash abre Inicio; los hashes de las 5 vistas originales siguen funcionando; cada `#libro-li-N` abre su detalle
  - Los conteos de Inicio coinciden con Catálogo y Escritores
  - Carrusel operable con mouse, táctil y teclado; con `prefers-reduced-motion` no se mueve solo
  - Puntuar un libro y recargar: se mantiene, solo bajo claves `libreria.preferencias.*`
  - Ingresar/Registro vacíos e inválidos: errores con texto, sin recarga; envío válido: toast y ningún dato en `localStorage`
  - Contraste >= 4.5:1 en ambos temas y sin scroll horizontal a 320/1280 px
- **Leer antes**:
  - `docs/extras-prototipo/README.md` (decisiones tomadas), `docs/extras-prototipo/decisiones-diseno.md` (D2, D9 a D13), `docs/extras-prototipo/requisitos-y-tareas-retirados.md` y `docs/extras-prototipo/specs/`
  - `knowledge-base/09_decisiones_y_supuestos.md` §DD-14, §DD-12
  - `knowledge-base/08_arquitectura_propuesta.md` §Tabla de contrato id/name
  - Prototipo `../../prueba_parcial_prog3/`

---

## Extras posteriores al roadmap

Changes fuera del roadmap original, registrados por **nombre descriptivo** (sin número `C-NN`, por convención del grupo). No alteran la tabla resumen ni el árbol de dependencias de arriba.

### `portadas-ilustradas`
- **Estado**: `[x]` completado (archivado en `openspec/changes/archive/2026-11-10-portadas-ilustradas/`)
- **Qué hace**: muestra las seis portadas ilustradas locales del seed en las tarjetas del Catálogo (`assets/img/portadas/li-1.webp` … `li-6.webp`), con la tapa CSS como respaldo ante ausencia o error de imagen y compatibilidad con libros guardados sin el campo `portada`.
- **Ubicación al archivarse**: `openspec/changes/archive/AAAA-MM-DD-portadas-ilustradas/` (la fecha se fija al archivar).

---

## Tabla resumen

| ID | Change | Etapa | Ejercicio | Owner | Governance | Dependencias |
|----|--------|-------|-----------|-------|------------|--------------|
| C-01 | `estructura-html-navegacion` | 1 | Ej. 1 | Pagano Amanda | MEDIO | — |
| C-02 | `estilos-responsive-accesibilidad` | 1 | Ej. 2 + identidad visual del prototipo (DD-14) | Pagano Amanda | MEDIO | C-01 |
| C-03 | `filtro-titulo-readme-avance` | 1 | Ej. 3 (filtro adelantado) + avance | Pagano Amanda | MEDIO | C-01, C-02 |
| C-04 | `datos-locales-catalogo-dinamico` | 2 | Ej. 3 | Mateo Liendo | ALTO | C-01, C-03 |
| C-05 | `persistencia-localstorage` | 2 | Ej. 6 | Mateo Liendo | ALTO | C-04 |
| C-06 | `alta-libros` | 2 | Ej. 4 | Lucas Avila | MEDIO | C-05 |
| C-07 | `alta-clientes` | 2 | Ej. 4 | Lucas Avila | MEDIO | C-05 |
| C-08 | `composicion-venta` | 2 | Ej. 5 | Lucas Avila | MEDIO | C-05 |
| C-09 | `confirmacion-venta` | 2 | Ej. 5 | Lucas Avila | ALTO | C-08 |
| C-10 | `historial-ventas` | 2 | Ej. 5 | Lucas Avila | MEDIO | C-09 |
| C-11 | `casos-manuales-readme-final` | 2 | Ej. 6 | TiziiV y juanmagarciat | BAJO | C-06, C-07, C-10 |
| C-12 | `extras-prototipo` (opcional) | Extra | Extras del prototipo (DD-14) | A definir | MEDIO | C-11 |

Primer change recomendado: `C-01` (`estructura-html-navegacion`) — para arrancar: `/opsx:propose estructura-html-navegacion`.
