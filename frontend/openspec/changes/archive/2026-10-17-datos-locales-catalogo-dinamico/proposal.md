# Proposal

## Why

El catálogo de Editorial Codex se renderiza con tarjetas HTML estáticas maquetadas en C-01. Eso impide que los libros y clientes dados de alta en Etapa 2 aparezcan en el catálogo ni en los listados de Libros y Clientes. Se necesita que el catálogo y los listados iniciales se generen dinámicamente desde arrays de datos locales en el navegador, reutilizando la función `coincideTitulo` de C-03 sobre el array en lugar de sobre tarjetas estáticas.

## What Changes

- Crear arrays con ids estables: `libros` (>= 6, uno sin género), `editoriales` (>= 2), `generos` (>= 2), `autores` (>= 3), `clientes` (>= 3).
- Renderizar el catálogo desde `libros` en `#catalogo-lista` usando `createElement`/`textContent`, con «Sin clasificar» cuando `generoId` es `null`.
- Quitar las tarjetas estáticas de C-01 para evitar duplicados entre estáticas y dinámicas.
- Reutilizar `coincideTitulo(titulo, busqueda)` de C-03 sobre el array `libros`: el filtro ahora re-renderiza desde el array en lugar de mostrar/ocultar tarjetas estáticas.
- Funciones de formato únicas: importes con `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })` y fechas como `dd/mm/aaaa hh:mm`.
- Render inicial de los listados de Libros y Clientes desde los arrays.

## Capabilities

### New Capabilities

- `catalogo-dinamico`: catálogo y listados iniciales de Libros y Clientes renderizados desde arrays de datos locales en el navegador, con formateo de importes y fechas.

### Modified Capabilities

- `filtro-catalogo`: el filtro ya no muestra/oculta tarjetas estáticas; ahora re-renderiza el catálogo desde el array `libros` aplicando `coincideTitulo` sobre cada entrada. Cambia el requisito de "visibilidad de las tarjetas" (ya no aplica "sin quitar ni crear tarjetas").

## Impact

- `js/app.js` (o archivo de datos dedicado): arrays de datos, funciones de render y formato.
- `index.html`: se quitan las tarjetas estáticas del catálogo; se conserva el markup de contenedores (`#catalogo-lista`, `#catalogo-sin-resultados`, `#catalogo-vacio`, `#libros-tabla`, `#clientes-tabla`).
- No se agregan ids ni names nuevos al contrato; no se modifica la tabla de contrato `id`/`name`.
- Afecta a la verificación manual del caso 1 (filtro) sobre datos dinámicos.

Fuera de alcance:
- Persistencia en `localStorage` (C-05).
- Altas de libros y clientes con validación (C-06, C-07).
- Composición y confirmación de ventas (C-08, C-09).
- Historial de ventas (C-10).
- Edición o eliminación de registros (RN-FO-05 lo prohíbe).

Ejercicio de la consigna cubierto: Ejercicio 3 — Datos locales y catálogo dinámico.
