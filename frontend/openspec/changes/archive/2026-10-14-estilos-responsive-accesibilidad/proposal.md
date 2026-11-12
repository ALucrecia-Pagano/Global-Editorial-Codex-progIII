# Propuesta: estilos-responsive-accesibilidad (C-02)

## Por qué

C-01 dejó la maqueta semántica de las 5 vistas con su contrato `id`/`name`, pero sin estilos: la página todavía no tiene identidad visual, no está adaptada a 320 px / 1280 px y la accesibilidad visual (contraste, foco, errores sin color) no está trabajada. El grupo aprobó el 2026-10-14 el prototipo visual de Amanda (DD-14); este change aplica **su identidad visual** (paleta, tema claro/oscuro, título, fondo galáctico en CSS, sidebar) a la maqueta real y se limita a lo que pide el Ejercicio 2, respetando las restricciones de la Etapa 1. Es el paso siguiente del camino crítico (C-01 → **C-02** → C-03).

## Ejercicios de la consigna que cubre

- **Ejercicio 2 — Estilos, diseño adaptable y accesibilidad** (completo): US-003 (identidad visual propia) y US-004 (uso adaptable y accesible); reglas RN-UI-05 a RN-UI-10. Prepara el caso manual 8 (que se registra en C-03).

## Qué cambia

- **Base visual** (`css/styles.css`): custom properties en `:root` con paleta oscura violeta/índigo y tema claro reutilizado del prototipo (con ajustes de contraste ≥ 4.5:1 en ambos), fuente local Cinzel Decorative vía `@font-face`, título "Editorial Codex" con degradé, estrellas doradas, ornamento y efecto en hover/foco que respeta `prefers-reduced-motion`, fondo galáctico decorativo hecho solo con CSS (nebulosas rosa/morado/violeta y estrellas, igual en ambos temas: en el tema claro solo los paneles se aclaran), superficies con degradé rosa/morado/negro y brillo violeta-rosa, acento rosa, componentes BEM reutilizables, tapas de libro generadas solo con CSS, CSS mobile-first sin scroll horizontal de la página a 320 px y 1280 px, `:focus-visible` de alto contraste, skip-link al `<main id="contenido">`, regiones con scroll (tablas) enfocables por teclado.
- **Tema claro/oscuro**: botón con `aria-pressed`, recordado en `libreria.preferencias.tema`, respeta `prefers-color-scheme` si no hay preferencia guardada.
- **Sidebar colapsable**: `<aside>` que envuelve `nav-principal` (5 enlaces con ícono y tooltip); flechita para colapsar en escritorio (recordado en `libreria.preferencias.sidebar`) y hamburguesa en celular con velo, cerrable con Escape. Sin JavaScript el menú queda visible.
- **Sin cambios de navegación**: las 5 vistas, la vista por defecto Catálogo y `aria-current="page"` quedan como en C-01.
- **Documentación**: tabla de contrato `id`/`name` ampliada en `knowledge-base/08` y en el `README.md` (DD-08) con los ids de estructura (`contenido`, sidebar, botones de menú, tema); claves `libreria.preferencias.*` en `knowledge-base/04` y en el README; aclaración en el README de qué imágenes se usan (favicon SVG y el banner decorativo, con su procedencia a completar) y licencia de la fuente, tabla de contraste calculada con la fórmula WCAG; resultado observado de la verificación manual.

## Capacidades

### Capacidades nuevas
- `estilos-tema`: identidad visual (tokens, tipografía local, título animado, fondo galáctico CSS, degradés y acento rosa, tapas CSS, componentes BEM), diseño adaptable a 320/1280 px, contraste, foco visible y alternancia de tema claro/oscuro.
- `preferencias-locales`: almacenamiento de las preferencias de presentación de la Etapa 1 (tema y sidebar) en `localStorage` bajo `libreria.preferencias.*`, tolerante a fallos y sin datos personales.
- `sidebar-colapsable`: barra lateral que contiene la navegación, colapsable en escritorio y desplegable con hamburguesa en celular.

### Capacidades modificadas
- `navegacion-vistas`: degradación sin JS con la sidebar visible y sin botones que dependen de JS.
- `maqueta-vistas`: estructura semántica ampliada (skip-link, `aside`, `main#contenido`).

## Fuera de alcance

- **C-03**: filtro por título (`coincideTitulo`, handler `input` del buscador) y README de avance (casos manuales 1 y 8 registrados allí). El buscador de C-01 sigue sin filtrar.
- **Etapa 2 (C-04 a C-11)**: generar el catálogo desde arrays; persistencia de libros, clientes y ventas; validaciones reales de las altas.
- **C-12 `extras-prototipo`** (opcional, posterior a la Etapa 2): vista Inicio (banner, resumen, carrusel), Escritores, detalle de libro con estrellas, estrellas en las tarjetas, Ingresar y Registro, toasts, migas de pan, `aria-current="true"` en el menú y la puntuación `libreria.preferencias.puntuaciones`. Los documentos de insumo están en `docs/extras-prototipo/`.
- Funciones del prototipo que no entran: vista Géneros, detalle de escritor, chips de filtro por género, buscador de la barra superior, "Agregar al carrito", menú de usuario y sesión simulada.
- Imágenes de tapas (DD-12): las tapas `.jpg` del prototipo y sus libros reales no se usan. Las `portada*.jpg` se eliminaron (2026-10-14) y C-12 tampoco las recibe: el fondo y las tapas se resuelven solo con CSS. Tras el ajuste final de diseño (D18) existe una única foto decorativa, el banner del Catálogo (`assets/img/banner-biblioteca.jpg`), aplicada por CSS.
- Tests automáticos de cualquier tipo (prohibidos por las reglas duras del proyecto).

## Impacto

- **Archivos**: `index.html` (header, sidebar, barra y tapas), `css/styles.css` (reescritura completa sobre el mínimo de C-01), `js/app.js` (tema y sidebar), `README.md`, `knowledge-base/08_arquitectura_propuesta.md` (contrato), `knowledge-base/04_modelo_de_datos.md` (claves de preferencias).
- **Contrato**: se conservan todos los `id`/`name` de C-01; se agregan los de estructura (contenido, sidebar, menú, tema).
- **Comportamiento**: sin cambio de navegación respecto de C-01 (vista por defecto Catálogo).
- **`localStorage`**: se empieza a usar en la Etapa 1, solo para preferencias de presentación y con prefijo propio, sin chocar con `libreria.libros`, `libreria.clientes` ni `libreria.ventas`.
- **Recursos**: solo locales (CSS, JS, fuente TTF, favicon SVG y el banner decorativo `banner-biblioteca.jpg`; sin imágenes de tapas ni de fondo galáctico). Sin dependencias nuevas; se sigue abriendo por `file://`.
