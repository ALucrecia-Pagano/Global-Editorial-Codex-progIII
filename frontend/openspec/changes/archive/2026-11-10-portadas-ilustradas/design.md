# Design — Portadas ilustradas del catálogo

## Context

Ver `proposal.md` para la motivación. El Catálogo se renderiza hoy en `js/app.js` (`renderCatalogo`) con `createElement`/`textContent`: cada tarjeta (`.tarjeta`) arma una tapa CSS (`.tarjeta__tapa.tapa.tapa--degrade-N`) con el título y el autor como texto, y luego el título (`h3`), el `dl` de datos y el precio. La tapa CSS tiene `min-height` y degradés definidos en `css/styles.css` (sección 8). Los 6 libros del seed viven en `js/data.js` con ids `li-1`…`li-6`; las 6 imágenes ya están en `assets/img/portadas/<id>.webp` (600×900, 2:3, con el título dibujado). Los datos se persisten en `localStorage` (`libreria.libros`) sin validar campos opcionales, y hay libros guardados de antes de este change que no tendrán el campo nuevo.

Restricciones duras (AGENTS.md): solo HTML/CSS/JS nativo, sin dependencias ni `fetch`; `textContent` para datos, nunca `innerHTML`; sin estilos ni handlers inline; clases BEM; scripts clásicos con `defer`; todo en español; verificación manual (sin tests/TDD); sin commits.

## Goals / Non-Goals

**Goals:**
- Mostrar la portada ilustrada cuando exista, sin degradar accesibilidad, filtro, responsividad ni los datos guardados.
- Garantizar un respaldo visual determinista (tapa CSS) ante ausencia o error de imagen, sin saltos de layout.
- Mantener el cambio mínimo y localizado en datos, render y estilos.

**Non-Goals:**
- No se agrega selector ni carga de portada al formulario de alta.
- No se procesan, recortan ni convierten imágenes en el navegador.
- No se cambia el contrato `id`/`name` ni la estructura del HTML del Catálogo.
- No se toca el historial de ventas ni el precio histórico de las ventas guardadas.

## Decisions

### 1. Nombre del campo: `portada`
Se usa `portada` (sustantivo español, coherente con `titulo`, `precio`, `editorialId`). Es opcional y guarda una **ruta relativa** (`assets/img/portadas/li-1.webp`), no un objeto ni una URL absoluta.

- Alternativas: `imagen`, `portadaUrl`, `cover`. Se descartan por mezclar idioma o acoplar el dato a una URL.
- Los 6 libros del seed declaran `portada: 'assets/img/portadas/li-N.webp'`. Los libros nuevos no lo declaran.

### 2. Comportamiento con datos guardados sin el campo: mapa de ids conocidos
Al renderizar, la ruta se resuelve así:
1. Si `libro.portada` es un texto no vacío → se usa esa ruta.
2. Si no hay `portada` y el `id` está en un mapa de ids conocidos (`li-1`…`li-6`) → se usa `assets/img/portadas/<id>.webp`.
3. En cualquier otro caso → tapa CSS.

Se descarta derivar la ruta para **cualquier** id (`assets/img/portadas/<id>.webp`): un libro nuevo (`lib-…`) pediría un archivo inexistente y generaría 404 en consola en cada render. El mapa acota la derivación a las imágenes que existen.

- Alternativas: migrar `localStorage` al arrancar (más invasivo y reescribe datos del usuario); dejar sin imagen a los datos viejos (pierde la mejora solo para quien ya usó la app).
- No se reescribe `libreria.libros`: el repositorio de persistencia sigue guardando el objeto tal cual.

### 3. Persistencia: campo opcional, sin cambios en el repositorio
`portada` no requiere lógica nueva de persistencia. Al guardar el seed en la primera apertura, `JSON.stringify` incluye el campo; los libros viejos sin el campo siguen pasando `esLibroGuardadoValido` (que no exige `portada`). Los libros nuevos se guardan sin `portada` y usan tapa CSS. Esto es lo menos invasivo y consistente con `persistencia-localstorage`.

- No se escribe una migración ni se agrega `portada` al validador como obligatorio.

### 4. Respaldo sin salto de layout: caja 2:3 con imagen y tapa superpuestas
La tarjeta envuelve la portada en una caja `.tarjeta__portada` con `aspect-ratio: 2 / 3`, `overflow: hidden` y el radio actual. Dentro:
- Si hay ruta: se crea un `<img class="tarjeta__portada-imagen">` con `alt="Portada de «<título>»"`, `loading="lazy"`, `decoding="async"`, `width="600"`, `height="900"` y `object-fit: cover`.
- Siempre se crea la tapa CSS de respaldo dentro de la caja; si hay imagen se marca `hidden`; si no hay imagen, queda visible.
- En el evento `error` del `<img>`: se oculta la imagen y se muestra la tapa CSS. Así nunca aparece el ícono de imagen rota y el alto no cambia porque la caja mantiene 2:3.

Se descarta `background-image` en CSS: no permite `alt`, `loading="lazy"`, dimensiones explícitas ni el evento `error` de forma limpia. Se descarta mostrar la tapa solo si falla sin reservar espacio: produciría salto de layout.

- La tapa CSS conserva `aria-hidden="true"`; el `alt` de la imagen describe la portada y el título se sigue leyendo desde el `h3` y el `dl`.

### 5. Estilos y temas
Se agregan clases BEM en `css/styles.css`: `.tarjeta__portada`, `.tarjeta__portada-imagen` y el ajuste de `.tapa` para ocupar el 100 % de la caja 2:3 cuando se usa como respaldo. La imagen no lleva filtros dependientes del tema: se ve igual en claro y oscuro, con borde/radio coherente con la tarjeta. No se usan estilos inline.

- La caja 2:3 reemplaza el `min-height` como referencia de alto de la portada; la tapa CSS se adapta con `height: 100%`.

### 6. Operaciones de delta de specs
- `catalogo-dinamico`: **ADDED** de tres requisitos (portada opcional, respaldo CSS, compatibilidad con datos viejos).
- `estilos-tema`: **MODIFIED** de «Recursos solo locales» (incluye las 6 portadas) y «Tapas de libro generadas con CSS» (pasa a respaldo).
- `documentacion-readme`: **MODIFIED** de «Decisiones de la Etapa 1» (tapas CSS como respaldo) y **ADDED** de procedencia de portadas y plantilla de verificación manual.

No se modifica `persistencia-localstorage` (el campo es opcional y no cambia el contrato) ni `alta-libros` (el formulario no cambia; el respaldo CSS se especifica en `catalogo-dinamico`).

### 7. Documentación del dominio
En `knowledge-base/09_decisiones_y_supuestos.md` se marcará **DD-12** como «Reemplazada parcialmente» (la tapa CSS queda solo como respaldo) y se agregará **DD-16** con: campo `portada`, comportamiento con datos viejos, respaldo ante error, accesibilidad y procedencia de las imágenes. El README actualizará «Recursos y procedencia» y sumará la plantilla de verificación manual con la columna Resultado vacía. En `CHANGES.md` se agregará una sección **«Extras posteriores al roadmap»** (si no existe) con el nombre descriptivo `portadas-ilustradas` —sin número C, por convención del grupo—, una línea de qué hace y la ruta del archivo al archivarse; no se alteran la tabla resumen ni el árbol de dependencias del roadmap original.

## Risks / Trade-offs

- **Portadas más altas que la tapa actual** → Las tarjetas del Catálogo serán más altas al imponer 2:3. Mitigación: probar 320/1280 px y confirmar que no hay scroll horizontal; la grilla sigue con sus columnas actuales.
- **Imagen inexistente o ruta mal escrita** → Se dispara `error` y aparece la tapa CSS. Mitigación: cubrir con un paso manual que renombra temporalmente `li-1.webp`.
- **404 en consola por datos viejos o rutas inválidas** → El mapa de ids conocidos evita pedir archivos para ids desconocidos; una ruta inválida explícita igual produce un 404 al intentar cargar, pero la tarjeta se recupera con la tapa CSS. Mitigación: documentar en la verificación que el 404 de una imagen renombrada es esperado y no rompe la página.
- **Doble título (imagen + texto)** → Es intencional: el texto sostiene accesibilidad y filtro. Mitigación: el `alt` es breve y el texto no se oculta.
- **Datos viejos sin `portada`** → Se resuelven por id; si un usuario renombró ids, cae a tapa CSS. Mitigación: comportamiento documentado y sin reescritura de datos.
- **Imágenes generadas con IA** → Se documenta su origen (Gemini) y uso educativo en el README.

## Migration Plan

No hay migración de datos. Al desplegar: se agrega `portada` al seed, se actualiza el render y los estilos, y los datos existentes siguen funcionando por el mapa de ids. Rollback: quitar el campo y volver al render de tapa CSS; las imágenes pueden quedar en el repo sin uso.

## Open Questions

Ninguna bloqueante. Queda para la ejecución confirmar el alto visual final de las tarjetas a 320/1280 px y registrar el resultado real en la plantilla del README.
