# Proposal

## Why

El ejercicio 6 pide el README final y el resultado observado de los 8 casos manuales, y ese cierre es C-11. Las specs vigentes todavía tratan C-11 como trabajo pendiente y dejan `#catalogo-vacio` fuera del filtro, siempre oculto. Sin este change el repo no tiene un change de OpenSpec para la parte de Valentini Tiziano (TiziiV) y Garcia Juan (juanmagarciat), a diferencia de C-01 a C-10.

## Ejercicios de la consigna que cubre

- **Ejercicio 6**: casos manuales y README final (US-012, RN-GL-03). Índice de los 8 casos con el resultado observado, decisiones de la Etapa 2, recursos y cómo abrir sin npm.

## What Changes

- `README.md`: el cierre deja de figurar como pendiente. «Estado del trabajo» indica que C-01 a C-11 están hechos, que C-12 queda fuera, quién cerró C-11 y dónde está el resultado observado de cada caso. Las decisiones de Etapa 2 (libro repetido, JSON corrupto, email, división de JS) quedan escritas. La consigna en PDF no se referencia como archivo del repo.
- `js/app.js`: con datos reales, `#catalogo-vacio` se muestra solo cuando `libros` tiene longitud 0; `#catalogo-sin-resultados` solo cuando hay libros y ninguno coincide. `#libros-vacio` y `#clientes-vacio` se muestran cuando su array está vacío. `#catalogo-resultados` dice «Todavía no hay libros en el catálogo.» cuando el total es 0.
- Specs: se actualizan `documentacion-readme`, `filtro-catalogo` y `maqueta-vistas` para que dejen de contradecir ese cierre.
- Supuesto: el código y el README ya tienen gran parte de este comportamiento, escrito fuera de OpenSpec. El apply comprueba cada tarea contra el producto y solo corrige lo que no coincida. No se reescribe C-01 a C-10.

## Capabilities

### New Capabilities

Ninguna. El cierre amplía capacidades que ya existen.

### Modified Capabilities

- `documentacion-readme`: el README final deja de citar C-11 como pendiente; los 8 casos tienen resultado observado (no una plantilla con la columna Resultado vacía); quedan escritas las decisiones de Etapa 2 y la retirada del PDF.
- `filtro-catalogo`: `#catalogo-vacio` forma parte del render del catálogo. Se muestra cuando no hay libros y permanece oculto cuando hay libros, aunque la búsqueda no coincida. El anuncio de `#catalogo-resultados` distingue «no hay libros» de «ninguno coincide».
- `maqueta-vistas`: los mensajes de lista vacía siguen presentes en el HTML. Después del render, `#catalogo-vacio`, `#libros-vacio` y `#clientes-vacio` se ocultan solo si su colección tiene elementos. Al cargar con el seed, siguen ocultos.

## Fuera de alcance

- C-12 (inicio, escritores, detalle con estrellas, ingresar y registro).
- Reimplementar altas, venta, historial, persistencia o el filtro de C-03 y C-04.
- Commits y push (los hace cada integrante al cerrar su parte).
- Tests automáticos.

## Impact

- **Código**: `js/app.js` (avisos de lista vacía y texto de `#catalogo-resultados`).
- **Documentación**: `README.md`. `CHANGES.md` y la base de conocimiento se alinean al archivar, sin cambiar el contrato `id`/`name`.
- **Specs**: `documentacion-readme`, `filtro-catalogo`, `maqueta-vistas`.
- **Dependencias**: C-06, C-07 y C-10, ya archivados en `correcciones-etapa2`.
- **Sin dependencias externas** nuevas. Sigue abriendo por `file://`.
