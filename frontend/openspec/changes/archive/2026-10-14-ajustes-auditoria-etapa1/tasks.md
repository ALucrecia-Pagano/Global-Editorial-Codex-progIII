# Tasks

## 1. Tablas sin cortes a 320 px

- [x] 1.1 En `css/styles.css`, agregar `white-space: nowrap` a la regla `.tabla th, .tabla td` de la sección "Tablas" (D1). Verificar: DevTools a 320 px, vista Historial → "V-0001", "13/10/2026 14:30" y "$ 5.000,00" se ven en una sola línea y la tabla se desplaza dentro de `.tabla-contenedor`. (Código aplicado; la comprobación en el navegador es el ítem V1 de la plantilla de 5.1.)
- [x] 1.2 Recorrer a 320 px las tablas de Libros, Clientes, Ventas e Historial (incluido el detalle). Verificar: ninguna celda se parte, cada tabla scrollea en su contenedor y `document.documentElement.scrollWidth <= window.innerWidth` da `true` en las cuatro vistas. Solo si alguna columna de texto largo vuelve la tabla inmanejable, crear el modificador `tabla__celda--texto` (D1) y anotarlo en el design. (Ítem V2 de la plantilla de 5.1.)

## 2. Barra superior como región

- [x] 2.1 En `index.html`, cambiar `<div class="barra">` por `<section class="barra" aria-label="Barra superior">` (y su cierre), sin tocar hijos, clases ni `id` (D2). Verificar: el panel Accessibility de DevTools muestra la barra como `region` "Barra superior"; la barra se ve igual a 320 y 1280 px; `#menu-abrir` y `#tema-alternar` siguen funcionando. (Código aplicado; comprobación: ítem V3 de la plantilla de 5.1.)
- [x] 2.2 Si el `README.md` enumera los landmarks de la página, agregar la región "Barra superior". Verificar: búsqueda de "landmark" en el README coherente con el HTML (la tabla de contrato `id`/`name` no cambia). (El README no enumera landmarks: no hizo falta cambiarlo.)

## 3. Foco al cerrar con el velo

- [x] 3.1 En `js/app.js`, cambiar el listener de `#sidebar-velo` a `cerrarMenuMovil(true)` y actualizar el comentario de `cerrarMenuMovil` (D3). Verificar: a 320 px abrir el menú, hacer clic en el velo → el menú se cierra y `document.activeElement.id` en consola es `"menu-abrir"`; Escape y el botón cerrar siguen devolviendo el foco igual. (Código aplicado; comprobación: ítems V4 y V5 de la plantilla de 5.1.)
- [x] 3.2 Actualizar la subsección "Sidebar y menú móvil" del `README.md` indicando que también el velo devuelve el foco a la hamburguesa. Verificar: el texto del README coincide con el comportamiento observado en 3.1.

## 4. Opcionales

- [x] 4.1 (Opcional, D4) Generar en el scratchpad una copia de `assets/img/banner-biblioteca.jpg` a 1280×1920 y JPEG calidad 80 con PowerShell + `System.Drawing`; comparar el banner del Catálogo y el fondo difuminado con la copia. **Pedir confirmación a la usuaria antes de reemplazar el original**; con el OK, reemplazarlo con el mismo nombre. Verificar: peso nuevo < 400 KB, la pestaña Network sigue mostrando solo recursos locales y el banner se ve bien en ambos temas. Si no hay OK, dejar la tarea sin marcar y anotarlo. (Con OK de la usuaria se reemplazó: 1.959.804 → 276.306 bytes, sin orientación EXIF. La usuaria verificó que el banner se ve bien en el Catálogo y como fondo difuminado, en ambos temas; la pestaña Network no se comprobó, es el ítem A2 de C-02, que sigue sin ejecutar. Como se conservaron el nombre y la ruta, no hay pedidos nuevos.)
- [x] 4.2 (Opcional, D5) Confirmar que la delta `specs/estilos-tema/spec.md` conserva todos los detalles de los requisitos largos y que cada descripción queda en ≤ 500 caracteres. Verificar: `openspec validate ajustes-auditoria-etapa1 --strict` sin errores.

## 5. Verificación manual final

- [x] 5.1 Completar en el navegador por `file://` la plantilla "Verificación manual — ajustes de auditoría" del `README.md` (V1–V12): Historial a 320 px (la tabla scrollea y "V-0001" no se corta), tablas de las 4 vistas a 320 px, región "Barra superior", cerrar el menú con el velo y con el botón (foco a la hamburguesa), y los ítems pendientes de C-02/C-03: B5 (5 vistas a 1280 px en tema claro), C8 (flechas desplazan las tablas a 320 px), C1 (Tab no entra al menú cerrado), C3 (cerrar con botón y velo), C5 (320 → 1280 con el menú abierto) y caso 1 paso 8 (anuncio de `#catalogo-resultados`); recorrido con teclado a 320 y 1280 px en ambos temas y consola sin errores. Registrar el resultado real observado (aunque falle). Sin commits.
