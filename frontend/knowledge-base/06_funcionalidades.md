# Funcionalidades

Organizadas por épica (≈ ejercicio de la consigna). Cada historia indica la etapa.

## Épica 1: Estructura y navegación (Ej. 1) — Etapa 1

### US-001 — Navegar entre vistas
**Como** operador **quiero** una navegación clara entre Catálogo, Libros, Clientes, Ventas e Historial **para** acceder a cada operación.
- [x] `index.html` es la entrada; header + nav + main semánticos.
- [x] La vista activa se distingue visualmente y no solo por color.
- [x] Navegación operable con teclado.
**Reglas**: RN-UI-01, RN-UI-08

### US-002 — Maquetar las vistas con datos estáticos
**Como** equipo **quiero** las 5 vistas maquetadas con ejemplos estáticos **para** definir su aspecto antes de conectar datos.
- [x] Catálogo: título de la librería, buscador por título, listado de libros (título, ISBN, editorial, género, autores, precio), al menos un «Sin clasificar».
- [x] Libros: formulario de alta (título, ISBN, precio, editorial, género con «Sin clasificar», autores múltiple) + listado.
- [x] Clientes: formulario (nombre completo, email) + listado.
- [x] Ventas: selector de cliente, agregado de renglones (libro, cantidad), tabla de renglones con precio unitario y subtotal, resumen con total, botón confirmar.
- [x] Historial: tabla con id, fecha, cliente, total y acceso al detalle de renglones.
- [x] Mensajes de estado maquetados: lista vacía, sin resultados, operación correcta, operación rechazada.
- [x] En la Etapa 1 los controles pendientes iban rotulados como maqueta. Esos avisos se quitaron cuando las vistas pasaron a funcionar.
**Reglas**: RN-CA-01/02, RN-UI-02/03/04/11

## Épica 2: Presentación y accesibilidad (Ej. 2) — Etapa 1

### US-003 — Identidad visual propia
- [x] Paleta, tipografía, espaciado, tarjetas, formularios y botones coherentes (inspirados en el prototipo propio, ver `docs/inspo/README.md` y DD-15; no copiados).
- [x] CSS externo con clases reutilizables.
**Reglas**: RN-UI-05/06

### US-004 — Uso adaptable y accesible
- [x] Sin scroll horizontal a 320 px y 1280 px; tablas con scroll propio.
- [x] Foco visible; errores con texto; `alt` correcto.
**Reglas**: RN-UI-07/08/09/10

## Épica 3: Catálogo y filtro (Ej. 3)

### US-005 — Filtrar el catálogo por título — **Etapa 1**
**Como** operador **quiero** escribir parte de un título **para** encontrar libros rápido.
- [x] Insensible a mayúsculas, parcial, con `trim()`.
- [x] Búsqueda vacía → todo; sin coincidencias → mensaje.
- [x] En Etapa 1 opera sobre las tarjetas estáticas; en Etapa 2 sobre el array.
**Reglas**: RN-CA-04/05/06

### US-006 — Datos locales y catálogo dinámico — Etapa 2
- [x] Arrays con ids estables y seed mínimo (6/2/2/3/3).
- [x] Catálogo renderizado desde el array con `textContent`.
**Reglas**: RN-CA-03, RN-GL-01

## Épica 4: Altas (Ej. 4) — Etapa 2

### US-007 — Alta de libro
- [x] Selectores generados desde datos; validaciones RN-LI-01..06; ISBN duplicado rechazado.
- [x] Tras alta: aparece en listado, catálogo y selector de venta.

### US-008 — Alta de cliente
- [x] Validaciones RN-CL-01..03; email duplicado en mayúsculas rechazado.
- [x] Tras alta: aparece en listado y selector de venta.
**Reglas**: RN-FO-01..05

## Épica 5: Ventas e historial (Ej. 5) — Etapa 2

### US-009 — Componer y confirmar venta
- [x] Cliente + renglones; sin duplicados; cantidades enteras > 0; editar/quitar renglones.
- [x] Subtotal/total con 2 decimales; confirmación bloqueada si inválida.
- [x] Al confirmar: guarda venta con precio histórico, limpia formulario, muestra mensaje.
**Reglas**: RN-VE-01..09

### US-010 — Consultar historial
- [x] Lista id, fecha, cliente, total; detalle de renglones; sin editar/eliminar.
**Reglas**: RN-HI-01..04

## Épica 6: Persistencia y documentación (Ej. 6) — Etapa 2

### US-011 — Persistir en localStorage
- [x] Guardar/recuperar libros, clientes, ventas sin duplicar seed.
**Reglas**: RN-PE-01/02

### US-012 — README final con casos manuales
- [x] Integrantes, cómo abrir sin npm, navegación, implementado/pendiente, datos iniciales, `localStorage` y límites, procedencia de imágenes.
- [x] Resultado **observado** de los 8 casos manuales (ver [07](07_flujos_principales.md#casos-manuales-de-verificación)).
**Reglas**: RN-PE-03, RN-GL-03

> En el **avance de Etapa 1**, el README debe identificar expresamente qué pantallas son maquetas y qué interacciones ya funcionan (filtro por título).
