# Tasks — Portadas ilustradas del catálogo

> Verificación **manual** en el navegador (sin tests automáticos ni TDD). Cada tarea indica cómo comprobar su resultado. No hacer commits ni push.

## 1. Datos y resolución de la portada

- [x] 1.1 Agregar el campo opcional `portada` a los 6 libros del seed en `js/data.js`, con la ruta `assets/img/portadas/li-1.webp` … `li-6.webp`. Verificar en el navegador que `libros` en la consola muestra el campo en cada libro y que las 6 rutas corresponden a archivos existentes en `assets/img/portadas/`.
- [x] 1.2 Agregar el mapa de ids conocidos (`li-1`…`li-6` → ruta de su portada) y una función pura que resuelva la portada de un libro: usa `libro.portada` si es texto no vacío; si falta y el id está en el mapa, usa la ruta del mapa; en otro caso devuelve `null`. Verificar desde la consola de DevTools que `li-1` sin campo resuelve su imagen y un id desconocido devuelve `null`, sin tocar el DOM.

## 2. Render de la tarjeta con portada y respaldo

- [x] 2.1 En `renderCatalogo` (`js/app.js`), envolver la portada en una caja y crear el `<img>` solo cuando la función de resolución devuelva una ruta, con `alt="Portada de «<título>»"`, `loading="lazy"`, `decoding="async"`, `width="600"` y `height="900"`. Verificar en DevTools que la tarjeta de cada libro del seed tiene el `<img>` con esos atributos y el `alt` correcto.
- [x] 2.2 Crear siempre la tapa CSS de respaldo dentro de la caja de portada: visible cuando no hay ruta y oculta cuando hay imagen. Verificar que un libro del seed no muestra la tapa CSS superpuesta y que un libro sin `portada` (alta nueva) muestra solo la tapa CSS.
- [x] 2.3 Manejar el evento `error` de la imagen: ocultar el `<img>` y mostrar la tapa CSS, sin ícono de imagen rota. Verificar renombrando temporalmente `assets/img/portadas/li-1.webp` y recargando: la primera tarjeta muestra la tapa CSS y el alto no salta; restaurar el nombre al terminar.
- [x] 2.4 Conservar `createElement`/`textContent` para todos los textos de la tarjeta y el `aria-hidden` de la tapa CSS. Verificar que título, autor, ISBN, editorial, género y precio siguen visibles como texto y que un título con caracteres especiales se muestra literal, sin HTML interpretado.
- [x] 2.5 Confirmar que el filtro y el contador no cambian: buscar `mapa`, borrar la búsqueda, registrar un libro nuevo y verificar que las portadas no alteran la cantidad de resultados, los mensajes de estado ni el contador.

## 3. Estilos de la portada y los temas

- [x] 3.1 En `css/styles.css`, agregar las clases BEM `.tarjeta__portada` (caja con `aspect-ratio: 2 / 3`, `overflow: hidden` y radio) y `.tarjeta__portada-imagen` (`width`/`height` 100 %, `object-fit: cover`, `display: block`); ajustar la tapa CSS de respaldo para ocupar el 100 % de la caja. Verificar visualmente que la portada se recorta sin deformarse y que la tapa CSS llena la misma caja.
- [x] 3.2 Verificar que la imagen se ve bien en tema claro y oscuro, sin filtros de tema ni recortes fuera de la caja. Alternar el tema con el botón y comparar las 6 tarjetas.
- [x] 3.3 Verificar a 320 px y 1280 px que la grilla no genera scroll horizontal (`document.documentElement.scrollWidth <= window.innerWidth`) y que las portadas mantienen la proporción 2:3.

## 4. Documentación del proyecto

- [x] 4.1 En `knowledge-base/09_decisiones_y_supuestos.md`, marcar **DD-12** como «Reemplazada parcialmente» (la tapa CSS queda solo como respaldo) y agregar **DD-16** con: campo `portada`, resolución por ids conocidos para datos viejos, respaldo ante error, accesibilidad (alt y texto) y procedencia de las imágenes. Verificar que la decisión nueva esté enlazada desde DD-12.
- [x] 4.2 En `README.md` → «Recursos y procedencia», documentar las 6 portadas WebP como imágenes generadas con IA (Gemini) para este proyecto, locales y de uso educativo, y aclarar que la tapa CSS sigue como respaldo. Verificar que la sección ya no afirme que no hay imágenes de portadas.
- [x] 4.3 En `README.md`, agregar la sección «Verificación manual — portadas ilustradas» con una tabla de pasos, resultado esperado y columna Resultado **vacía**, que cubra: las 6 portadas visibles; un libro nuevo con tapa CSS; una imagen renombrada que muestra el respaldo; 320 y 1280 px; tema claro y oscuro; filtro por título. Verificar que todas las filas estén en «Pendiente de ejecutar» o con la columna vacía.
- [x] 4.4 Registrar el change en `CHANGES.md` dentro de la sección **«Extras posteriores al roadmap»** (crearla si no existe), con el nombre descriptivo `portadas-ilustradas` (sin número C, por convención del grupo), una línea de qué hace y la ruta del archivo cuando se archive (`openspec/changes/archive/AAAA-MM-DD-portadas-ilustradas/`). No modificar la tabla resumen ni el árbol de dependencias del roadmap original. Verificar que la sección exista y que el change figure solo ahí.

## 5. Verificación manual final

- [x] 5.1 Ejecutar la plantilla «Verificación manual — portadas ilustradas» en el navegador: las 6 portadas visibles, un libro nuevo con tapa CSS, una imagen renombrada con respaldo, 320 px y 1280 px, ambos temas y filtro por título. Registrar el resultado observado real en cada fila del README, con fecha y navegador.
- [x] 5.2 Recorrer el Catálogo solo con teclado (Tab/Shift+Tab) y confirmar que el foco es visible y que no hay controles nuevos innecesarios; revisar la consola y confirmar que no hay errores propios del cambio (el 404 de una imagen renombrada durante la prueba es esperado).
- [x] 5.3 Ejecutar `openspec validate portadas-ilustradas --strict` y confirmar que el change valida sin errores.

## Workflow follow-up

- Archivar el change después de la revisión y de que la verificación manual esté registrada.
- Sincronizar los deltas a las specs principales (`catalogo-dinamico`, `estilos-tema`, `documentacion-readme`) al archivar.
- Actualizar en `CHANGES.md` («Extras posteriores al roadmap») la ruta del archivo archivado del change al cerrar.
- El commit y el push los hace la persona responsable; el agente no commitea.
