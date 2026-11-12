# Diseño: estructura-html-navegacion (C-01)

## Contexto

`index.html`, `css/styles.css`, `js/app.js` y `README.md` existen pero están vacíos (greenfield). Motivación y alcance en `proposal.md`; comportamiento exigido en `specs/navegacion-vistas/spec.md` y `specs/maqueta-vistas/spec.md`.

Restricciones que moldean el enfoque: solo HTML/CSS/JS nativos; apertura por `file://` (SU-02), por lo que el JS es un script clásico `<script src="js/app.js" defer>` (sin módulos); sin estilos ni handlers inline; nombres de código, clases e interfaz en español; clases CSS en BEM; sin tests automáticos (verificación manual).

## Objetivos / No objetivos

**Objetivos**
- Dejar el HTML final de la Etapa 1 en cuanto a estructura y ganchos: C-02 solo agrega CSS y C-03 solo agrega JS del filtro, sin tocar ids ni names.
- Navegación robusta ante hashes arbitrarios, con foco gestionado y "atrás" funcional.

**No objetivos**
- Aspecto visual (C-02): el CSS de este change es solo funcional.
- Comportamiento de datos: ningún control, salvo la navegación, hace algo real todavía.
- Desplazamiento a elementos internos: al navegar a un hash interno (ej. `#catalogo-lista`) se muestra su vista y el foco va al `h2`; no se desplaza hasta el elemento.

## Decisiones

### D1 — Navegación con JS sobre `hashchange` + atributo `hidden` (desvío de CHANGES.md)
CHANGES.md proponía "`:target` en CSS con fallback JS mínimo". **Decisión de la usuaria**: JS escucha `hashchange` y alterna el atributo `hidden` en las 5 `<section class="vista">`.

- **Por qué**: `:target` no resuelve la vista por defecto sin hash, no sirve para hashes que apuntan a elementos internos (ej. `#catalogo-lista`) ni para anclas fuera de las vistas (un skip-link haría desaparecer todas las secciones), no permite mover el foco ni sincronizar `aria-current`. `hidden` funciona aunque no cargue el CSS y es el mismo mecanismo que la maqueta usa para los mensajes, así la Etapa 2 sigue un único criterio.
- **Alternativas**: `:target` puro (descartado por lo anterior); `:target` + JS de respaldo (dos mecanismos que pueden contradecirse); clases CSS `vista--activa` (dependen del CSS para ocultar).
- **Degradación**: sin JS las 5 secciones quedan visibles, una debajo de otra, y los enlaces funcionan como anclas. Aceptado por la usuaria.
- La decisión y su porqué se documentan en el `README.md` (tarea dedicada).

### D2 — Resolución del hash
Constante `VISTAS = ['catalogo', 'libros', 'clientes', 'ventas', 'historial']`. Función `obtenerVistaDesdeHash(hash)`:
1. Quita el `#` y decodifica (`decodeURIComponent` dentro de `try/catch`; si falla, devuelve `null`).
2. Si el id está en `VISTAS` → ese id.
3. Si existe un elemento con ese id → `elemento.closest('.vista')`; si encuentra una vista, su id; si no, `null`.
4. Si no existe → `null`.

Uso:
- **Carga inicial** (`iniciarNavegacion`, al ejecutarse el script con `defer`): `obtenerVistaDesdeHash(location.hash) || 'catalogo'` → `mostrarVista(id, { moverFoco: false })`.
- **`hashchange`** (`alCambiarHash`): si el hash está vacío → `'catalogo'`; si no, `obtenerVistaDesdeHash`. Si devuelve `null` → no hace nada (conserva la vista actual). Si devuelve una vista distinta de la actual → `mostrarVista(id, { moverFoco: true })`. Si es la misma → no hace nada.

**Hash vacío → Catálogo** (refinamiento): sin esto, el escenario "abrir sin hash → Libros → atrás" dejaría Libros visible, contradiciendo "atrás vuelve a la vista previa". La regla "hash inexistente → conservar vista" se interpreta como "id que no existe en el documento", no como "sin hash".

### D3 — `mostrarVista(id, opciones)`
- Recorre las secciones `.vista` y pone `hidden = (seccion.id !== id)`.
- Recorre los enlaces `.navegacion__enlace`: el que tiene `href === '#' + id` recibe `aria-current="page"`, los demás pierden el atributo (`removeAttribute`).
- Si `opciones.moverFoco`, enfoca el `h2` de la vista (`h2.focus()`).
- Guarda la vista actual en una variable de módulo (`vistaActual`).

Funciones pequeñas con nombre, declaradas en ámbito global (script clásico, legible para la cátedra), con nombres en español sin riesgo de colisión; sin `innerHTML`. C-03 y la Etapa 2 agregan sus funciones al mismo archivo o a otros scripts clásicos cargados en orden con `defer`.

### D4 — Foco al cambiar de vista
Cada `h2` de vista lleva `tabindex="-1"` e `id` propio (`titulo-catalogo`, `titulo-libros`, `titulo-clientes`, `titulo-ventas`, `titulo-historial`); cada `section` usa `aria-labelledby` hacia su `h2`. Al navegar, el foco va al `h2` (el lector anuncia la vista y el siguiente Tab sigue por su contenido). En la carga inicial no se mueve el foco, para no saltear el `header`/`nav`.

Los ids `titulo-*` no están en la tabla de contrato (son internos de la navegación); se eligió el prefijo `titulo-` para no confundirse con `libro-titulo`.

### D5 — CSS mínimo funcional en C-01
`css/styles.css` contiene solo:
- `[hidden] { display: none !important; }` — garantiza que ningún estilo de C-02 (ej. `display: grid` en `.vista`) anule el ocultamiento.
- `.navegacion__enlace[aria-current="page"]` con subrayado grueso y `font-weight: bold` — la vista activa se distingue sin color.
- `:focus-visible { outline: 3px solid currentColor; outline-offset: 2px; }` — foco visible en enlaces, campos, botones y en el `h2` enfocado por teclado.

Todo lo demás (paleta, tipografía, grilla, tapas, responsive) es C-02.

### D6 — Formularios de maqueta: botones `submit` + `preventDefault` genérico
Respetando la regla dura 12, cada formulario tiene su botón de envío `type="submit"` con texto de acción (`Buscar`, `Guardar libro`, `Guardar cliente`, `Confirmar venta`). `js/app.js` registra, con `addEventListener`, un handler `prevenirEnvioMaqueta` en el evento `submit` de cada `<form>` que llama a `preventDefault()`.

- Botones que no envían el formulario son `type="button"`: `venta-agregar` ("Agregar renglón"), "Quitar" en renglones de venta y "Ver detalle de V-000X" en el historial.
- Los formularios llevan `novalidate`: los tipos (`email`, `number`) quedan por semántica y teclado móvil, pero la validación con mensajes en texto es responsabilidad de la Etapa 2 (RN-FO-02), no de los globos nativos. No se usan `required`/`min` en C-01.
- **Alternativa descartada**: dejar todos los botones `type="button"` — evita la recarga, pero rompe la regla dura 12 y obliga a la Etapa 2 a cambiar el HTML.
- C-03 y la Etapa 2 agregan sus propios handlers de `submit`; el genérico puede convivir (llamar dos veces a `preventDefault` es inocuo) o retirarse cuando todos los formularios tengan el suyo.
- Sin JS el envío recargaría la página (GET a sí misma); está dentro de la degradación aceptada en D1.

### D7 — Rotulado de maqueta (RN-UI-11)
Cada vista con controles no funcionales tiene un aviso visible `<p class="aviso aviso--maqueta" id="aviso-maqueta-<vista>">Maqueta: …</p>` y los botones/campos no funcionales lo referencian con `aria-describedby`. En Catálogo el aviso indica que el buscador se activa en la próxima entrega; C-03 lo quita al implementar el filtro. Los ids `aviso-maqueta-*` tampoco son contrato (se eliminan a medida que la Etapa 2 conecta cada vista).

### D8 — Clases BEM en español
Regla dura 17 (todo en español) y 15 (BEM) prevalecen sobre los nombres en inglés que sugieren `knowledge-base/08` y CHANGES.md C-02 (`.card`, `.btn`, `.form-field`, `.table-wrap`, `.message`, `.badge-maqueta`). Bloques propuestos, que C-02 estilizará sin cambiar el HTML:

| Bloque | Uso | Equivalente en la KB |
|---|---|---|
| `encabezado` | `header` | — |
| `navegacion` (`__lista`, `__item`, `__enlace`) | nav principal | — |
| `vista` (`__titulo`) | cada `section` y su `h2` | — |
| `tarjeta` (`__tapa`, `__titulo`, `__datos`, `__precio`) | libro del catálogo | `.card` |
| `formulario` (`__campo`, `__etiqueta`, `__control`, `__grupo`, `__acciones`) | formularios | `.form-field` |
| `boton` (`--primario`, `--secundario`) | botones | `.btn` |
| `tabla-contenedor`, `tabla` (`__titulo`) | tablas con scroll propio | `.table-wrap` |
| `mensaje` (`--vacio`, `--exito`, `--error`, `--info`) | mensajes de estado | `.message` |
| `aviso` (`--maqueta`) | rotulado de maqueta | `.badge-maqueta` |
| `resumen-venta` (`__total`) | total de la venta | — |
| `detalle-venta` | panel de detalle del historial | — |

`tarjeta__tapa` es un contenedor decorativo (`aria-hidden="true"`) con título y autor como texto, para que C-02 genere la tapa con CSS (DD-12) sin tocar el HTML.

### D9 — Accesibilidad de mensajes
- `*-errores`: `role="alert"`, texto con prefijo "Error:".
- `*-mensaje`: `role="status"` (anuncio cortés).
- `*-vacio` y `catalogo-sin-resultados`: párrafos `mensaje mensaje--vacio`; C-03 coloca `aria-live` donde lo necesite el filtro.
- Todos con `hidden` en el HTML.

### D10 — Datos estáticos de ejemplo
Coherentes entre vistas y alineados con el seed mínimo (KB-04), para que la Etapa 2 pueda reemplazarlos 1 a 1:
- Editoriales: `ed-1` Ediciones del Faro, `ed-2` Prisma Editorial. Géneros: `ge-1` Novela, `ge-2` Ciencia ficción. Autores: `au-1` Lucía Ferreyra, `au-2` Tomás Aguirre, `au-3` Inés Montoya.
- Libros (6): incluyen precios `1500` y `2000` (caso manual de venta) y al menos uno sin género («Sin clasificar»); uno con 2 autores.
- Clientes (3) con nombre completo y email.
- Venta de ejemplo en Ventas: 2 × `$ 1.500,00` = `$ 3.000,00` y 1 × `$ 2.000,00` = `$ 2.000,00` → total `$ 5.000,00`.
- Historial: `V-0001` y `V-0002` con fechas `13/10/2026 14:30` (en `<time datetime="2026-10-13T14:30">`) y totales coherentes; el panel `historial-detalle` muestra los renglones de `V-0001` (visible, como ejemplo; es maqueta).
- Los valores de `option`/checkbox usan esos ids (`value="ed-1"`, etc.). Los checkboxes de autores tienen ids `libro-autor-1..3` (no son contrato; la Etapa 2 los genera).
- Los importes se escriben a mano con el formato exacto que produce `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })` (incluido el espacio duro tras `$`, que el navegador muestra como espacio).

## Riesgos / Trade-offs

- [Sin JS se ven las 5 vistas y los formularios recargan] → degradación aceptada; documentada en el README.
- [El foco programático en el `h2` puede no mostrar contorno tras un clic con mouse] → es el comportamiento esperado de `:focus-visible`; con teclado sí se ve.
- [Hash interno de otra vista no desplaza hasta el elemento] → fuera de alcance; el foco en el `h2` deja al operador al inicio de la vista correcta.
- [Clases en español difieren de los nombres de la KB/CHANGES C-02] → la tabla de D8 da la equivalencia; C-02 debe usarla. No afecta al contrato `id`/`name`.
- [Enter en `venta-cantidad` dispara el `submit` del formulario de venta (= confirmar)] → en C-01 es inocuo por el `preventDefault`; la Etapa 2 (C-08/C-09) decide si separa "agregar renglón" en otro formulario o intercepta Enter. No se cambian ids.
- [El handler genérico de `submit` podría ocultar un formulario olvidado en la Etapa 2] → se documenta en el README que es un handler de maqueta.

## Plan de despliegue

No aplica: archivos estáticos. Reversión: vaciar o restaurar los 4 archivos (no hay datos persistidos en este change).

## Preguntas abiertas

Ninguna que cambie specs o tareas. Los textos exactos de ejemplo (títulos de libros, nombres de clientes) se eligen al implementar respetando D10.
