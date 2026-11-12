# Decisiones y Supuestos

## Decisiones documentadas

### DD-01 — Una sola página con secciones
**Decisión**: `index.html` con las 5 vistas como `<section>`, navegando por anclas (`#catalogo`, `#libros`, …) y mostrando una a la vez.
**Contexto**: la consigna permite varias páginas o secciones de una página.
**Alternativas**: multipágina (`libros.html`, `clientes.html`, …).
**Justificación**: en Etapa 2 las altas deben actualizar opciones relacionadas (ej. selector de venta) "sin recargar la página"; con una sola página el estado en memoria es compartido sin releer `localStorage` en cada navegación.
**Trade-offs**: `index.html` más largo; requiere JS para mostrar/ocultar vistas (o `:target` en CSS como fallback).
> **Confirmada** por Amanda (Etapa 1) el 2026-10-13.

### DD-07 — Comparación del filtro en función pura reutilizable
**Decisión**: la lógica de coincidencia del filtro por título (`trim()` + minúsculas + `includes`) vive en una función pura (ej. `coincideTitulo(titulo, busqueda)`) separada del acceso al DOM.
**Contexto**: en Etapa 1 el filtro opera sobre tarjetas estáticas; en Etapa 2 sobre el array de libros (ver [10 IN-01](10_preguntas_abiertas.md)).
**Justificación**: la Etapa 2 reutiliza la función sin reescribir la regla RN-CA-04.
**Trade-offs**: ninguno relevante. Confirmada por Amanda el 2026-10-13.

### DD-08 — Contrato de `id` / `name` de la maqueta
**Decisión**: se usa la convención de [08](08_arquitectura_propuesta.md#tabla-de-contrato-id--name), registrada como tabla. El change de maquetación la copia al `README.md`.
**Justificación**: la Etapa 2 conecta JS a la maqueta sin reescribir el HTML ni adivinar selectores.

### DD-09 — Id de venta correlativo
**Decisión**: formato `V-0001`, `V-0002`, … (4 dígitos con ceros a la izquierda).
**Alternativas**: timestamp. **Justificación**: legible en el historial y en los casos manuales.

### DD-10 — Moneda con `Intl.NumberFormat`
**Decisión**: `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })`, siempre 2 decimales. Los importes se guardan como `number` y se formatean solo al mostrarlos.
**Justificación**: separa el dato del formato; cumple "importes con dos decimales" (RN-VE-05).

### DD-11 — Fechas en ISO, mostradas `dd/mm/aaaa hh:mm`
**Decisión**: se guarda `toISOString()`; se muestra como `dd/mm/aaaa hh:mm` (hora local).

### DD-12 — Tema oscuro inspirado en BookNest, tapas en CSS
**Estado**: Reemplazada parcialmente por DD-15 — solo la parte "inspirado en BookNest" — y por DD-16 — las tapas en CSS pasan a ser solo respaldo de la portada ilustrada (ver [DD-16](#dd-16--portadas-ilustradas-opcionales-con-respaldo-css)); el contraste WCAG AA y la foto decorativa del banner siguen vigentes.
**Decisión**: tema oscuro con acentos violeta/índigo inspirado en BookNest, con **contraste suficiente** en todos los textos (objetivo WCAG AA: 4.5:1 en texto normal). **Sin imágenes de portadas**: cada tapa se genera con CSS (degradé + título y autor como texto). **Actualización (2026-10-14, DD-14):** tampoco hay imágenes de fondo; el fondo galáctico también es solo CSS. **Ajuste final de diseño (2026-10-14):** el proyecto suma **una única imagen decorativa**, la foto del banner «Hola, lector» del Catálogo (`assets/img/banner-biblioteca.jpg`), aplicada solo por CSS (sin `<img>`); las tapas siguen siendo solo CSS y su procedencia se registra en el README. **Uso adicional (mismo día):** esa misma foto, muy difuminada y oscurecida, se usa también como fondo de la página en el tema oscuro (detrás del velo galáctico, por CSS); en el tema claro el fondo es el mismo (foto incluida).
**Justificación**: identidad visual propia; sin recursos externos y con una sola imagen cuya procedencia se documenta en el README (el banner).
**Trade-offs**: el tema oscuro exige verificar contraste y foco visible.

### DD-13 — Nombre e integrantes
**Decisión**: la librería se llama **Editorial Codex**. Integrantes: Liendo Mateo, Avila Lucas, Pagano Amanda, Valentini Tiziano, Garcia Juan.

### DD-14 — C-02 adopta la identidad visual del prototipo; los extras pasan a C-12
**Decisión** (2026-10-14): C-02 (`estilos-responsive-accesibilidad`) adopta la **identidad visual** del prototipo aprobado `../../prueba_parcial_prog3`: paleta oscura con acento violeta/índigo y tema claro, fuente local Cinzel Decorative (`fonts/`, con `fonts/OFL.txt`), título con degradé, estrellas y ornamento, **fondo galáctico hecho solo con CSS** (nebulosas rosa/morado/violeta y estrellas, con movimiento lento solo si no hay `prefers-reduced-motion`; el tema claro comparte ese fondo y el encabezado, y solo aclara los paneles), más, tras el ajuste final de diseño (D18 de C-02), un banner «Hola, lector» con **una foto decorativa** aplicada por CSS (`assets/img/banner-biblioteca.jpg`), superficies con degradé rosa/morado/negro y brillo violeta-rosa, acento rosa, tarjetas, **sidebar colapsable** (flecha en escritorio, hamburguesa con velo y Escape en celular) y **botón de tema claro/oscuro**. Todo lo demás del prototipo (Inicio con carrusel y resumen, Escritores, detalle de libro con estrellas, estrellas en las tarjetas, Ingresar/Registro, toasts y migas de pan) se mueve al change **opcional C-12 `extras-prototipo`**, posterior a la Etapa 2 y dependiente de C-11. La primera ampliación de C-02 (que incluía todo el prototipo) se revisó y recortó el mismo día.
**Contexto**: Amanda armó un prototipo visual y el grupo lo aprobó (2026-10-14). Al revisar el alcance, se vio que C-02 crecía más allá de lo que pide el Ejercicio 2 de la Etapa 1.
**Alternativas**: (a) incorporar el prototipo completo en C-02 (primera versión de esta decisión); (b) mantener el C-02 original (solo estilos de las 5 vistas) y dejar el prototipo como referencia visual.
**Justificación**:
- Ceñir la Etapa 1 a lo que pide la consigna (Ej. 2) y entregar una identidad visual trabajada (criterio de presentación de [02](02_descripcion_general.md)) sin tocar la lógica de dominio.
- Evitar agrandar el trabajo de la Etapa 2: sin vistas ni ids estáticos extra, C-04 no tiene que regenerar ni mantener HTML adicional (carrusel, escritores, detalles, conteos).
- Lo recortado no se pierde: queda documentado en `docs/extras-prototipo/` (decisiones, specs y tareas retiradas) como insumo de C-12.
**Restricciones que se mantienen**:
- Se mantienen las 5 vistas de C-01 y la vista por defecto es **Catálogo**, tal como define la spec `navegacion-vistas` de C-01; C-02 no la modifica.
- Datos ficticios: los 6 libros del TP, no los libros reales del prototipo. Tapas solo con CSS (DD-12 sigue vigente para las tapas).
- Se conservan todos los `id`/`name` del contrato; los de estructura nuevos (`contenido`, sidebar, botones de menú, `tema-alternar`) se agregan a la tabla de [08](08_arquitectura_propuesta.md#tabla-de-contrato-id--name) y del README (DD-08).
- Las preferencias de Etapa 1 usan claves `libreria.preferencias.*` (`tema` y `sidebar`) para no chocar con libros, clientes y ventas, siempre con `try/catch` y lista blanca. La clave `libreria.preferencias.puntuaciones` queda para C-12.
**Ajusta a**: DD-12 — se mantiene y se extiende: las tapas y el fondo son CSS puro. Las dos `portada*.jpg` que se habían agregado al repo (descargadas de Pinterest) se **eliminaron el 2026-10-14** por decisión de Amanda y el fondo pasó a ser CSS puro. **Excepción posterior (ajuste final de diseño, mismo día):** se incorpora la foto decorativa `assets/img/banner-biblioteca.jpg` para el banner del Catálogo, aplicada por CSS; procedencia registrada en el README (foto de Valentin Antonini en Unsplash, Licencia Unsplash). El fondo de página del tema oscuro suma esa misma foto difuminada (`html::before`) bajo la galaxia, sin archivos nuevos. C-12 no debe sumar imágenes de tapas ni de fondo: cualquier otra idea basada en imágenes se resuelve con CSS o se documenta igual que el banner.
**Trade-offs**: C-02 sigue siendo más grande que el original (CSS más trabajado, JS de presentación y verificación en dos temas, con el contraste calculado contra el tramo más claro de cada degradé), y el `localStorage` se usa ya en Etapa 1, antes del C-05; a cambio, el alcance queda acotado a la consigna.

### DD-15 — La referencia visual es el prototipo propio
**Decisión** (2026-10-19): la referencia visual del proyecto es el prototipo propio de Editorial Codex, documentado en `docs/inspo/README.md` (capturas y enlace al repositorio https://github.com/ALucrecia-Pagano/Prototipos-Frontend). El prototipo tomó a BookNest como inspiración inicial; la imagen `docs/inspo/inspo-booknest.png` se eliminó del repo.
**Contexto**: el prototipo aprobado por el grupo (DD-14) ya es la identidad visual implementada; mantener la captura de otra aplicación como "inspo" confundía la referencia. El prototipo citado en DD-14 (`../../prueba_parcial_prog3`) es el mismo que está publicado en el repositorio Prototipos-Frontend (se subió sin la imagen de BookNest y sin la carpeta `.vscode`). DD-14 no se modifica.
**Alternativas**: (a) conservar la captura de BookNest como referencia (descartada: ya no representa el diseño); (b) marcar DD-12 entera como reemplazada (descartada: dejaría sin decisión vigente las tapas en CSS, que citan `CLAUDE.md`/`AGENTS.md` y DD-14); (c) editar DD-14 (descartada: es historia de C-02 archivado).
**Justificación**: un único punto de referencia (`docs/inspo/README.md`), trazabilidad conservada y sin tocar el código.
**Aclaración**: las capturas muestran portadas reales, pero el proyecto **sigue usando tapas generadas con CSS**; la nota de créditos de `docs/inspo/README.md` cubre solo las capturas y no habilita imágenes de portadas en la página.
**Reemplaza a**: DD-04 (total) y DD-12 (parcial: solo "inspirado en BookNest"; el resto de DD-12 sigue vigente).

### DD-16 — Portadas ilustradas opcionales con respaldo CSS
**Decisión** (change `portadas-ilustradas`): un libro puede declarar el campo **opcional** `portada` con la **ruta relativa** a una imagen local (`assets/img/portadas/li-N.webp`). Los 6 libros del seed lo declaran; los libros nuevos dados de alta no. La tarjeta muestra la imagen en una **caja 2:3** con `object-fit: cover` y usa la **tapa CSS solo como respaldo** cuando falta la portada o la imagen no carga (evento `error`, sin ícono de imagen rota ni salto de alto). Los datos guardados sin el campo se resuelven con un **mapa de ids conocidos** (`li-1`…`li-6` → su archivo); un id desconocido cae a la tapa CSS, sin reescribir `libreria.libros`.
**Contexto**: la cátedra habilitó modificar el proyecto y el grupo generó seis portadas ilustradas (600×900 px, 2:3, con el título dibujado) para mejorar la identidad visual del Catálogo sin agregar funcionalidad de dominio.
**Alternativas**: (a) derivar `assets/img/portadas/<id>.webp` para cualquier id (descartada: los libros nuevos pedirían archivos inexistentes y darían 404 en cada render); (b) migrar `localStorage` al arrancar para agregar el campo (descartada: reescribe datos del usuario); (c) seguir solo con la tapa CSS (descartada: desaprovecha las portadas ya generadas).
**Justificación**: mejora visual con recursos locales, sin dependencias ni `fetch`, y compatible con los datos ya guardados en versiones anteriores.
**Accesibilidad**: la imagen lleva `alt="Portada de «<título>»"`; el título, el autor, el ISBN, la editorial, el género y el precio siguen como **texto** (`textContent`), de modo que el filtro y los lectores de pantalla no dependen de la imagen. La tapa CSS de respaldo conserva `aria-hidden="true"` para no duplicar el título.
**Procedencia de las imágenes**: las seis portadas WebP son ilustraciones **generadas con IA (Gemini)** para este proyecto, guardadas localmente y de **uso educativo**; su procedencia se registra en el README («Recursos y procedencia»).
**Reemplaza parcialmente a**: DD-12 (la tapa CSS deja de ser la única presentación y pasa a ser respaldo).
**Trade-offs**: las tarjetas son más altas al imponer la proporción 2:3; una ruta inválida produce un 404 en consola (esperado) y la tarjeta se recupera con la tapa CSS.

### DD-02 — División en dos etapas por responsable
**Decisión**: Etapa 1 (Amanda): Ej. 1 + Ej. 2 + filtro por título. Etapa 2 (compañeros): Ej. 3 a 6.
**Contexto**: indicación del equipo, alineada con la organización de la consigna.
**Justificación**: la maqueta define los ganchos (`id`, `name`, contenedores) que la Etapa 2 consume.
**Trade-offs**: el filtro de Etapa 1 opera sobre DOM estático y deberá reescribirse sobre el array en Etapa 2.

### DD-03 — Verificación manual, sin TDD
**Decisión**: no hay tests automáticos; verificación manual (320 px, 1280 px, teclado) con resultados en el README.
**Justificación**: la consigna prohíbe npm/herramientas y evalúa casos manuales reproducibles.

### DD-04 — Identidad visual inspirada en BookNest
**Estado**: Reemplazada por DD-15 (la imagen `docs/inspo/inspo-booknest.png` es histórica: ya no está en el repo).
**Decisión**: tomar de `docs/inspo/inspo-booknest.png` el tono (oscuro, acentos violeta/índigo, tarjetas redondeadas, grilla de portadas, sidebar con ítem activo) adaptándolo a una identidad propia.
**Trade-offs**: un tema oscuro exige cuidar contraste de texto y foco visible.

### DD-05 — Sin commits automáticos
**Decisión**: los agentes no hacen commits ni push; cada integrante commitea al cerrar su etapa.

### DD-06 — CLAUDE.md, AGENTS.md y specs versionados
**Decisión**: no se ignoran en `.gitignore` (lo pide el profesor).

## Supuestos inferidos

### SU-01 — Navegador moderno
**Supuesto**: Chrome/Firefox/Edge actuales; ES2015+ sin transpilar.
**Riesgo si es falso**: errores de sintaxis. **Validar**: probar en el navegador del docente.

### SU-02 — Apertura por `file://`
**Supuesto**: el docente abre `index.html` con doble clic.
**Riesgo**: `type="module"` falla por CORS en `file://`; `localStorage` en `file://` varía por navegador. **Validar**: usar scripts clásicos con `defer`; documentar en README.

### SU-03 — Datos estáticos de Etapa 1 se reemplazan
**Supuesto**: los ejemplos en el HTML se quitan o sustituyen por render JS en Etapa 2.
**Riesgo**: duplicados visuales si quedan ambos. **Validar**: checklist de Etapa 2.

### SU-04 — Imágenes de portada opcionales
**Supuesto**: la consigna no exige portadas. ✅ Resuelto por DD-12: no se usan imágenes de tapas; las tapas se generan con CSS.
