# Proposal — Portadas ilustradas del catálogo

## Why

Hoy cada tapa del catálogo se dibuja solo con CSS (DD-12): un degradé con el título y el autor como texto. La cátedra habilitó modificar el proyecto y el grupo ya generó **seis portadas ilustradas** (`assets/img/portadas/li-1.webp` … `li-6.webp`, 600×900 px, 2:3) que muestran el título dibujado. Mostrarlas mejora la identidad visual del Catálogo sin romper la accesibilidad, la responsividad ni los datos guardados de versiones anteriores.

Es un change **extra fuera de la consigna obligatoria**: moderniza la presentación del Catálogo (Ej. 3 ya implementado) sin agregar funcionalidad de dominio nueva.

## What Changes

- Se agrega un campo **opcional** `portada` (ruta relativa) a la entidad Libro. Los 6 libros del seed apuntan a su imagen; los libros nuevos dados de alta no lo tienen.
- El render de la tarjeta del catálogo muestra un `<img>` cuando hay portada, con `alt="Portada de «<título>»"`, `loading="lazy"`, `decoding="async"` y `width`/`height` (600×900) para evitar saltos de layout; la imagen se recorta con `object-fit: cover` dentro de una caja 2:3.
- Si el libro no tiene portada (por ejemplo, un alta desde el formulario) **o la imagen falla al cargar** (`error`), se muestra la tapa CSS actual como respaldo. Nunca queda una caja vacía ni el ícono de imagen rota.
- **Compatibilidad con datos guardados**: si un libro guardado en `localStorage` no trae el campo `portada`, se resuelve la imagen por un mapa de ids conocidos (`li-1`…`li-6` → `assets/img/portadas/<id>.webp`); si el id no está en el mapa, se usa la tapa CSS.
- El título, el autor y el resto de los datos de la tarjeta siguen siendo **texto HTML** (con `textContent`): la imagen ya trae el título dibujado, pero el texto es lo que leen los lectores de pantalla y lo que usa el filtro.
- **No hay cambios** en el modelo de Ventas, Clientes, Historial, filtro, navegación ni en el contrato `id`/`name`.
- **BREAKING**: ninguno. El campo es opcional y hay respaldo para datos viejos.

## Ejercicios y alcance

- **Ejercicios de la consigna que toca**: Ej. 3 (Catálogo dinámico, ya implementado) y Ej. 2 (presentación y accesibilidad, ya implementado) se ven afectados de forma cosmética. El change **no cubre** ningún ejercicio pendiente de la consigna: es un extra.
- **Fuera de alcance**:
  - No se agrega un campo de portada al formulario de alta de libros (`#form-libro`); los libros nuevos siguen usando la tapa CSS.
  - No hay carga, recorte ni redimensionado de imágenes desde el navegador.
  - No se modifican las portadas existentes ni se agregan imágenes para libros fuera del seed.
  - No se toca el prototipo opcional C-12 (`extras-prototipo`) ni se suman estrellas, detalles ni otras vistas.
  - No se implementa código en este change: solo se planifica.

## Capabilities

### New Capabilities

- Ninguna.

### Modified Capabilities

- `catalogo-dinamico`: el render de la tarjeta incorpora la portada ilustrada opcional, su respaldo CSS ante ausencia o error de carga, y la resolución de portadas para datos guardados sin el campo.
- `estilos-tema`: se ajustan los requisitos de «Recursos solo locales» y «Tapas de libro generadas con CSS» para admitir las imágenes locales de portada y dejar la tapa CSS como respaldo (ya no exclusiva).
- `documentacion-readme`: se documentan la procedencia de las imágenes, la decisión de diseño y una plantilla de verificación manual «portadas ilustradas» con la columna Resultado vacía.

## Impact

- **Datos**: `js/data.js` suma el campo opcional `portada` a los 6 libros del seed. El repositorio de `localStorage` no cambia: serializa el objeto tal cual y los datos viejos sin `portada` siguen siendo válidos.
- **Render**: `js/app.js` (`renderCatalogo`) crea la caja de portada, el `<img>` y el respaldo CSS, y maneja el evento `error` de la imagen.
- **Estilos**: `css/styles.css` agrega la caja 2:3, la imagen con `object-fit: cover` y el respaldo de la tapa dentro de la caja.
- **Recursos**: seis archivos WebP locales ya presentes en `assets/img/portadas/` (sin pedidos externos, sin CDN, sin `fetch`).
- **Documentación**: `README.md` («Recursos y procedencia» y nueva plantilla de verificación), `knowledge-base/09_decisiones_y_supuestos.md` (DD-12 marcada como reemplazada parcialmente y nueva decisión de portadas) y `CHANGES.md` (sección «Extras posteriores al roadmap», con nombre descriptivo y sin número C).
- **Specs principales**: `catalogo-dinamico`, `estilos-tema` y `documentacion-readme` se actualizan al archivar con los deltas de este change.
