# Tasks

> **Restricciones de este change (leer antes de aplicar):**
> - Sin tests automáticos. Cada tarea se verifica a mano en el navegador, abriendo `index.html` por `file://`.
> - No renombrar ningún `id` ni `name` del contrato. No usar `innerHTML` para datos. No hacer `git commit` ni `git push`.
> - Si el código o el README ya cumplen la tarea, no reescribirlos: marcar la tarea al comprobar el comportamiento.
> - `#historial-vacio` no se toca: lo define `historial-ventas`.

## 1. Avisos de lista vacía

- [x] 1.1 En el render del catálogo, mostrar `#catalogo-vacio` solo cuando `libros` tiene longitud 0 y `#catalogo-sin-resultados` solo cuando hay libros y ninguno coincide — verificar: con el seed, buscar `xyz` muestra «No se encontraron libros que coincidan con la búsqueda.» y `#catalogo-vacio` sigue oculto; con `libreria.libros` en `[]` y recarga, se ve «Todavía no hay libros en el catálogo.» en `#catalogo-resultados`, se ve `#catalogo-vacio` y `#catalogo-sin-resultados` queda oculto
- [x] 1.2 Mostrar `#libros-vacio` y `#clientes-vacio` cuando su array está vacío, y ocultarlos cuando tiene elementos — verificar: con `libreria.libros` y `libreria.clientes` en `[]` y recarga, Libros y Clientes muestran su mensaje de lista vacía; al volver el seed, esos mensajes quedan ocultos

## 2. README final

- [x] 2.1 Dejar en «Estado del trabajo» que C-01 a C-11 están hechos, que C-12 queda fuera, quién cerró C-11 y las cuatro decisiones de Etapa 2 (libro repetido suma cantidad, JSON corrupto vuelve al seed y avisa, email `^[^\s@]+@[^\s@]+\.[^\s@]+$` en minúsculas, scripts `data.js` / `storage.js` / `app.js` con `defer`) — verificar leyendo esa sección: las cuatro decisiones están y C-11 no figura como pendiente
- [x] 2.2 Incluir el índice de los casos 1 a 8, cada uno apuntando a la sección con su resultado observado, y completar la columna Resultado de «Verificación manual — correcciones Etapa 2» con lo observado (o «Pendiente de ejecutar» si no se ejecutó) — verificar: las 8 filas del índice existen y ninguna fila se marca aprobada sin un resultado observado
- [x] 2.3 Retirar `docs/consigna-tpi.pdf` y dejar de citarlo como archivo del repo — verificar: el archivo no está y el README dice que se retiró al cerrar el trabajo

## 3. Verificación manual de integración

- [x] 3.1 **Verificación manual (320 px, 1280 px y teclado)** — con el seed, recorrer Catálogo, Libros, Clientes, Ventas e Historial con Tab en ambos anchos: el foco se ve, no hay error solo por color y la consola no muestra errores. Con las tres claves de dominio en `[]`, los tres mensajes de lista vacía se leen en los dos anchos. Registrar en el README el resultado observado de esta pasada; si algo falla, anotar el comportamiento real y no marcarlo aprobado

## Workflow follow-up

- Archivar el change con `/opsx:archive` cuando las tareas estén hechas y la verificación manual quede registrada.
- Recién al archivar, sincronizar las specs principales y marcar C-11 en `CHANGES.md` con la ruta del archivo.
