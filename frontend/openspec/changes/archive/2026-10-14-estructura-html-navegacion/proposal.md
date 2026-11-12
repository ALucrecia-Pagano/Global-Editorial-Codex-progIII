# Propuesta: estructura-html-navegacion (C-01)

## Por qué

El proyecto parte de archivos vacíos (`index.html`, `css/styles.css`, `js/app.js`, `README.md`). Antes de dar estilo (C-02), filtrar (C-03) o conectar datos (Etapa 2), hace falta la maqueta semántica de las 5 vistas de **Editorial Codex** con una navegación que muestre una vista a la vez y con ganchos `id`/`name` estables: es el contrato del que depende toda la Etapa 2 (DD-08), y por eso es el primer change del camino crítico.

## Ejercicios de la consigna que cubre

- **Ejercicio 1 — Estructura HTML y navegación** (completo): US-001 (navegar entre vistas) y US-002 (maquetar las vistas con datos estáticos).
- Toca de forma mínima el **Ejercicio 2** solo en lo indispensable para que la navegación sea accesible: vista activa distinguible sin color y foco visible (RN-UI-08). El resto del Ej. 2 queda en C-02.

## Qué cambia

- `index.html` único (DD-01) con `<header>`, `<nav id="nav-principal">`, `<main>` y 5 `<section>`: `#catalogo`, `#libros`, `#clientes`, `#ventas`, `#historial`, cada una con su `<h2>`.
- Maqueta estática de las 5 vistas con todos los `id`/`name` de la tabla de contrato de `knowledge-base/08` (formularios, campos, contenedores, tablas y mensajes de estado ocultos con `hidden`).
- Ejemplos estáticos con los formatos finales: importes `$ 1.500,00`, fechas `dd/mm/aaaa hh:mm`, ids de venta `V-0001`; al menos un libro «Sin clasificar».
- Controles todavía no funcionales rotulados como **maqueta** (RN-UI-11); ningún formulario recarga la página.
- Navegación por anclas resuelta con **JavaScript escuchando `hashchange`** (`js/app.js`, script clásico con `defer`): alterna el atributo `hidden` de las secciones, marca el enlace activo con `aria-current="page"` y mueve el foco al `<h2>` de la vista al navegar (no en la carga inicial). Vista por defecto: Catálogo.
- `css/styles.css` mínimo funcional: enlace activo distinguible sin depender del color (vía `[aria-current="page"]`) y `:focus-visible` visible.
- `README.md`: tabla de contrato `id`/`name` copiada de la KB y documentación de la decisión de navegación (por qué JS + `hashchange` y no `:target`).

## Capacidades

### Capacidades nuevas
- `navegacion-vistas`: navegación entre las 5 vistas de la página única — resolución del hash, vista por defecto, vista activa (`aria-current`), manejo del foco, historial del navegador y degradación sin JS.
- `maqueta-vistas`: estructura semántica y contenido estático de las 5 vistas, contrato `id`/`name` estable para la Etapa 2, mensajes de estado ocultos, rotulado de maqueta y formularios que no recargan la página.

### Capacidades modificadas
- Ninguna (no hay specs previas en `openspec/specs/`).

## Fuera de alcance

- **C-02**: estilos visuales completos (tema oscuro, paleta, tipografía, tapas en CSS, grilla, componentes reutilizables con su aspecto final), diseño responsive, verificación de contraste, skip-link y zonas `aria-live` estilizadas.
- **C-03**: filtro por título (`coincideTitulo`, handler `input` del buscador) y README de avance de Etapa 1 (sección "Qué es maqueta y qué funciona", casos manuales 1 y 8).
- **Etapa 2 (C-04 a C-11)**: arrays de datos, render dinámico, `localStorage`, validaciones y comportamiento real de altas, ventas e historial.
- Tests automáticos de cualquier tipo (prohibidos por las reglas duras del proyecto).

## Impacto

- **Archivos**: `index.html`, `js/app.js`, `css/styles.css` (mínimo), `README.md` (tabla de contrato + decisión de navegación). Todos parten vacíos.
- **Contrato**: fija los `id`/`name` que consumirá la Etapa 2; cualquier cambio posterior exige actualizar a la vez `knowledge-base/08` y el `README.md` (DD-08).
- **Desvío respecto de CHANGES.md**: el roadmap proponía ":target con fallback JS"; la usuaria decidió **JS con `hashchange` + atributo `hidden`** (ver `design.md`).
- **Dependencias**: ninguna nueva (solo HTML/CSS/JS nativos, apertura por `file://`).
