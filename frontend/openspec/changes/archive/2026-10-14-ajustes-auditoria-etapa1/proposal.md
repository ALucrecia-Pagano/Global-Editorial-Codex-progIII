# Proposal

## Why

Dos auditorías de la Etapa 1 encontraron tres defectos que afectan criterios evaluados de la consigna (diseño adaptable y accesibilidad): a 320 px las tablas comprimen sus celdas y parten "V-0001" y las fechas en vez de desplazarse dentro de `.tabla-contenedor`; la barra superior queda fuera de todo landmark (axe: `region`); y al cerrar el menú móvil tocando el velo el foco se pierde en `body`. Conviene corregirlos antes de arrancar la Etapa 2, que va a reutilizar las mismas tablas y la misma barra.

## What Changes

- Las celdas de todas las tablas (`.tabla th`, `.tabla td`) dejan de partir su texto (`white-space: nowrap`), de modo que a 320 px la tabla crece a lo ancho y se desplaza dentro de `.tabla-contenedor`, como pide el Ejercicio 2.
- La barra superior (`.barra`: hamburguesa, enlace Inicio, "Tu espacio de lectura" y `#tema-alternar`) pasa a ser una región con nombre accesible ("Barra superior"), sin cambiar ningún `id` ni `name` del contrato.
- Cerrar el menú móvil tocando `#sidebar-velo` devuelve el foco a `#menu-abrir`, igual que el botón cerrar y Escape.
- Opcional: se recomprime `assets/img/banner-biblioteca.jpg` (hoy ~1,9 MB) sin cambiar su nombre ni su uso.
- Opcional: los requisitos de la spec `estilos-tema` de más de 500 caracteres se reescriben como un enunciado corto más escenarios, sin cambiar su comportamiento.

**Ejercicios de la consigna**: Ejercicio 1 (estructura semántica / landmarks) y Ejercicio 2 (estilos responsive y accesibilidad). No agrega funcionalidad del Ejercicio 3 ni de la Etapa 2.

**Fuera de alcance**:
- Cualquier funcionalidad de la Etapa 2 (render dinámico de tablas, `localStorage` de datos, ventas).
- Renombrar `id`, `name` o clases existentes, o rediseñar la barra o las tablas.
- Cambiar el contenido visual del banner (solo peso del archivo).
- Commits y push (los hace la responsable de la etapa).

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `estilos-tema`: "Diseño adaptable a 320 px y 1280 px" exige que las celdas no partan su texto y que la tabla se desplace en su contenedor; opcionalmente, los requisitos largos (recursos locales, título, fondo galáctico, superficies, foco visible) se parten en escenarios sin cambiar comportamiento.
- `maqueta-vistas`: "Página única con estructura semántica" agrega la barra superior como región con nombre accesible, de modo que todo el contenido quede dentro de un landmark.
- `sidebar-colapsable`: "Menú hamburguesa en celular" exige que al cerrar tocando fuera (el velo) el foco también vuelva a la hamburguesa.

## Impact

- `css/styles.css`: reglas de `.tabla th, .tabla td`.
- `index.html`: el contenedor `.barra` (solo elemento/atributos; mismos `id` y clases).
- `js/app.js`: el listener de clic de `#sidebar-velo`.
- `assets/img/banner-biblioteca.jpg` (opcional, mismo nombre).
- `README.md`: registro de la verificación manual de este change.
- Specs principales `estilos-tema`, `maqueta-vistas` y `sidebar-colapsable` al archivar.
