# Design

## Context

Ver `proposal.md` (Why). El producto ya muestra `#catalogo-vacio`, `#libros-vacio` y `#clientes-vacio` según la longitud de cada array, y el README ya tiene «Estado del trabajo». Las specs de `openspec/specs/` no. `#historial-vacio` lo gobierna `historial-ventas`: con el seed no hay ventas y el render lo muestra. Este change no lo vuelve a ocultar al cargar.

## Goals / Non-Goals

**Goals:**

- Dejar el comportamiento de listas vacías y el README final como requisitos de las specs que ya existen.
- En el apply, comparar el producto con esos requisitos y tocar solo lo que no coincida.

**Non-Goals:**

- Un módulo nuevo o una capacidad nueva.
- Cambiar el contrato `id`/`name`, el seed o el formato de `localStorage`.

## Decisions

1. **Deltas sobre capacidades existentes.** `documentacion-readme`, `filtro-catalogo` y `maqueta-vistas` ya cubren el README, el filtro y los mensajes. Una capacidad nueva duplicaría el contrato.
   Alternativa descartada: `cierre-tpi` como spec propia. No nombra un comportamiento durable; nombra este change.

2. **Dos mensajes de catálogo, excluyentes.** Con libros y cero coincidencias se muestra `#catalogo-sin-resultados`. Con cero libros se muestra `#catalogo-vacio` y el anuncio «Todavía no hay libros en el catálogo.». No se muestran juntos.
   Alternativa descartada: dejar `#catalogo-vacio` siempre oculto, como dice hoy `filtro-catalogo`. Eso contradice el ejercicio 6 (las zonas de mensaje tienen que funcionar con datos reales).

3. **El apply no reescribe lo que ya cumple.** El código y el README se inspeccionan tarea por tarea. Si el texto, el `hidden` y el índice de casos ya coinciden, la tarea se marca hecha. Si una frase de spec no está, se corrige ese punto.
   Alternativa descartada: borrar el README y volver a redactarlo. Perdería los resultados observados de C-01 a C-10.

4. **`#historial-vacio` queda en su spec.** Al cargar con el seed el historial está vacío y el mensaje se muestra. Sacarlo del escenario «todo oculto al cargar» evita que C-11 contradiga `historial-ventas`.

## Risks / Trade-offs

- [El README ya afirma resultados que este change no reejecuta] → El apply no inventa un «Aprobado» nuevo. Si una fila no tiene resultado observado, queda «Pendiente de ejecutar».
- [El escenario de búsqueda vacía de la spec habla de 6 libros] → El delta acepta el total real cuando el array ya no es el seed de 6. Con el seed sigue siendo «Se muestran los 6 libros.».
- [Archivar pisa requisitos de `correcciones-etapa2`] → Los deltas copian el requisito entero y solo cambian el comportamiento de C-11 (columna Resultado con lo observado, C-11 fuera de lo pendiente).

## Migration Plan

No hay datos que migrar. Si el apply se revierte, se restauran `js/app.js`, `README.md` y las tres specs al estado anterior al change. `localStorage` no cambia de forma.

## Open Questions

Ninguna. El libro repetido, el JSON corrupto y el email ya están decididos en el código y se documentan, no se reabren.
