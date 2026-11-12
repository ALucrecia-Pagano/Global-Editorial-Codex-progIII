# Design

## Context

Ver `proposal.md` (Why). Estado actual que condiciona el enfoque:

- `js/app.js` es un único script clásico con `defer` (C-01 + C-02): navegación por hash, tema, sidebar y `registrarFormulariosMaqueta()`, que registra `prevenirEnvioMaqueta` (un `preventDefault()` genérico) en **todos** los `<form>`, incluido `#form-busqueda`.
- La sección Catálogo de `index.html` tiene `#form-busqueda` > `#catalogo-busqueda` (`type="search"`, `name="busqueda"`) + botón `type="submit"` "Buscar"; `#catalogo-sin-resultados` y `#catalogo-vacio` (ambos `p.mensaje.mensaje--vacio` con `hidden`); `#catalogo-lista` con 6 `article.tarjeta`. Cada tarjeta repite el título dos veces: en la tapa (`.tarjeta__tapa-titulo`, dentro de un `div` con `aria-hidden="true"`) y en `h3.tarjeta__titulo`.
- Un aviso interno `#aviso-maqueta-catalogo` ("el buscador por título se activa en la próxima entrega") está referenciado por `aria-describedby` en el campo y en el botón. No es parte del contrato (el README lo aclara para los `aviso-maqueta-*`).
- `css/styles.css` ya tiene `[hidden] { display: none !important; }` (gana sobre `.tarjeta { display: flex }`) y la utilidad `.solo-lectores`. Otro trabajo (C-02) está editando el CSS: C-03 no lo toca.
- Títulos del seed: "La casa del faro", "Estrellas de papel", "Cartas desde el sur", "Órbita lenta", "Manual de jardinería urbana", "El mapa invisible".

## Goals / Non-Goals

**Goals:**
- Una regla de coincidencia pura, sin DOM, que C-04 llame tal cual sobre `libros`.
- Separar "calcular" (puro) de "pintar" (DOM) para que C-04 solo reemplace la parte de DOM.
- Cero cambios de `id`/`name` del contrato; un único `id` nuevo, justificado.
- Ningún cambio de CSS.

**Non-Goals:**
- Debounce, resaltado de coincidencias, normalización de acentos, persistir la búsqueda.
- Lógica de `#catalogo-vacio` (es de C-04, cuando el catálogo sale del array).

## Decisions

### D1 — Separar la regla pura del acceso al DOM
Tres piezas en `js/app.js`, en una sección "Filtro del catálogo (C-03)":
- `coincideTitulo(titulo, busqueda)` (pura, global): `const texto = String(busqueda == null ? '' : busqueda).trim().toLowerCase(); if (texto === '') return true; return String(titulo == null ? '' : titulo).toLowerCase().includes(texto);`. Tolera `null`/`undefined` para que la Etapa 2 no tenga que defenderse.
- `textoResultadosCatalogo(visibles, total, busquedaVacia)` (pura): arma el mensaje de la zona de estado (ver D4).
- `filtrarCatalogo()` (DOM): lee `#catalogo-busqueda.value`, recorre `#catalogo-lista .tarjeta`, toma el título de `.tarjeta__titulo` (`textContent`), asigna `tarjeta.hidden = !coincideTitulo(...)`, cuenta visibles, alterna `#catalogo-sin-resultados` y escribe la zona de estado con `textContent`.
- `iniciarFiltroCatalogo()` registra los eventos y se llama junto a los demás `iniciar*()` al final del archivo; si falta algún elemento del contrato, retorna sin error.

**Alternativas**: filtrar todo dentro del handler (rompe DD-07: la Etapa 2 tendría que reescribir la regla); comparar contra `article.textContent` completo (encontraría por autor o ISBN, fuera de RN-CA-04). Se usa `.tarjeta__titulo` y no el título de la tapa, porque es el encabezado visible y accesible y C-04 lo replicará con el mismo markup.

### D2 — Escuchar `input` y `change`
Ambos eventos llaman a `filtrarCatalogo`. `input` cubre escribir, borrar, pegar y el botón de limpiar del `type="search"` (y Escape, que en Chromium vacía el campo y dispara `input`); `change` cubre autocompletado o cambios de valor que algunos navegadores no notifican con `input`. Volver a filtrar con el mismo valor es idempotente, así que el doble disparo no tiene efecto visible (la zona `aria-live` recibe el mismo texto y no se re-anuncia en lectores habituales). **Alternativa**: solo `input` (Flujo 1 de la KB) — se suma `change` por pedido explícito de Amanda.

### D3 — Handler propio de `submit` y exclusión del genérico
`#form-busqueda` recibe su propio listener `alEnviarBusqueda(evento)`: `evento.preventDefault()` + `filtrarCatalogo()`. `registrarFormulariosMaqueta()` pasa a omitir ese formulario (`if (formulario.id === 'form-busqueda') return;`), de modo que `prevenirEnvioMaqueta` quede registrado solo en formularios que siguen siendo maqueta, como documenta el README para la Etapa 2. **Alternativa**: dejar ambos listeners (doble `preventDefault`, inofensivo pero confunde a quien lea "este handler es de maqueta").

### D4 — Zona de estado: nuevo `#catalogo-resultados` (único `id` nuevo)
Se agrega en la sección Catálogo, entre el formulario y `#catalogo-sin-resultados`:
`<p id="catalogo-resultados" class="solo-lectores" role="status" aria-live="polite"></p>`.

**Por qué no reutilizar `#catalogo-sin-resultados`**: se muestra/oculta con `hidden`; un elemento que pasa de oculto a visible no se anuncia de forma confiable como región viva (la región debe existir en el árbol de accesibilidad antes del cambio), y además solo cubre el caso de cero coincidencias, no "se muestran 4 de 6". Tampoco sirve `#catalogo-vacio` (otro significado, C-04). Envolver ambos mensajes en un contenedor `aria-live` sin `id` evitaría el `id` nuevo, pero seguiría sin anunciar cuántos libros quedan y dejaría un contenedor sin gancho para C-04.

**Por qué `solo-lectores`**: la información visual ya la dan las tarjetas que quedan y el mensaje visible de sin resultados; un segundo texto visible duplicaría el mensaje y exigiría estilos nuevos en un CSS que otro change está editando. La clase existe desde C-02.

**Textos** (`textoResultadosCatalogo(visibles, total, busquedaVacia)`):
- `busquedaVacia` → `Se muestran los ${total} libros.`
- `visibles === 0` → `No se encontraron libros que coincidan con la búsqueda.` (mismo texto que el mensaje visible)
- `visibles === 1` → `Se muestra 1 de ${total} libros.`
- otro → `Se muestran ${visibles} de ${total} libros.`

Al cargar la página la zona queda vacía (no se filtra ni anuncia nada hasta que el operador interactúa). El texto nunca incluye lo que escribió el usuario: no hay riesgo de inyección y no se usa `innerHTML` en ningún punto.

**DD-08**: la fila `| Catálogo | Zona de estado del filtro (anuncia resultados) | catalogo-resultados | — |` se agrega en la misma tarea a `knowledge-base/08` y al `README.md`.

### D5 — `#catalogo-sin-resultados` y `#catalogo-vacio`
`#catalogo-sin-resultados.hidden = !(total > 0 && visibles === 0)`. Si `#catalogo-lista` no tuviera tarjetas (caso de Etapa 2), el filtro no muestra "sin resultados" y no toca `#catalogo-vacio`: ese mensaje lo gobierna C-04 cuando el array está vacío.

### D6 — Quitar el aviso de maqueta del Catálogo
Se elimina `<p id="aviso-maqueta-catalogo">` y los `aria-describedby="aviso-maqueta-catalogo"` del campo y del botón (RN-UI-11 rotula solo controles no funcionales; ver delta de `maqueta-vistas`). No se agrega un texto de ayuda: la etiqueta "Buscar por título" alcanza. **Alternativa**: reescribir el aviso como ayuda conservando el `id` — se descarta porque el nombre `aviso-maqueta-*` quedaría mintiendo.

### D7 — Degradación sin JavaScript
No se agrega código para el caso sin JS. Sin JS: las 6 tarjetas se ven (no hay nada que les ponga `hidden`), los mensajes siguen con `hidden` del HTML, y enviar `#form-busqueda` (sin `action`, método GET) recarga `index.html?busqueda=...` mostrando el catálogo completo. No rompe la página y queda documentado en el README. **Alternativa**: ocultar el buscador sin JS con `html.js` — requiere CSS (fuera de alcance) y quitaría un control que igual es inofensivo.

### D8 — Acentos sin normalizar
No se usa `normalize('NFD')`: la KB (RN-CA-04, Flujo 1) no lo pide y la Etapa 2 hereda exactamente la regla documentada. Se documenta en el README como limitación conocida ("orbita" no encuentra "Órbita lenta").

### D9 — README de avance
Secciones nuevas o ajustadas (sin reescribir las de C-01/C-02, que otro change está editando): "Cómo abrir" (doble clic, sin npm), "Qué es maqueta y qué funciona" (tabla por vista: maqueta / funciona / ganchos para Etapa 2), "Decisiones de la Etapa 1", "Filtro por título" (firma de `coincideTitulo`, eventos, zona de estado, degradación, limitación de acentos), "Verificación del contrato" (fecha y método) y "Casos manuales de la Etapa 1" (casos 1 y 8). La mención "C-03 … el buscador todavía no filtra" de la sección de C-02 se actualiza a pasado. El caso 8 se toma de la verificación de C-02 si ya se ejecutó; si no, figura "Pendiente de ejecutar".

Pasos del **caso manual 1** tal como se registran:

| # | Paso | Resultado esperado |
|---|---|---|
| 1 | Abrir `index.html` con doble clic (vista Catálogo) | Se ven las 6 tarjetas; ningún mensaje |
| 2 | Escribir `MAPA` en "Buscar por título" | Solo "El mapa invisible" |
| 3 | Reemplazar por `DE` | 4 tarjetas: "La casa del faro", "Estrellas de papel", "Cartas desde el sur", "Manual de jardinería urbana" |
| 4 | Reemplazar por `  faro  ` (con espacios) | Solo "La casa del faro", igual que sin espacios |
| 5 | Borrar todo el texto | Vuelven las 6 tarjetas; sin mensaje |
| 6 | Escribir `xyz` | Ninguna tarjeta; mensaje "No se encontraron libros que coincidan con la búsqueda." |
| 7 | Con `xyz` escrito, presionar Enter y luego clic en "Buscar" | No recarga, la URL no cambia, el texto se conserva |
| 8 | Con el lector de pantalla del sistema (Narrador/NVDA) o el panel de Accesibilidad de DevTools, repetir 2 y 6 | Se anuncia/lee "Se muestra 1 de 6 libros." y "No se encontraron libros…" en `#catalogo-resultados` |

Columna "Resultado observado": `Pendiente de ejecutar` hasta que Amanda lo ejecute; estado `Pendiente`.

## Risks / Trade-offs

- [Doble evento `input` + `change` genera dos filtrados seguidos] → Idempotente y barato (6 tarjetas); el texto de la zona no cambia, así que no se duplica el anuncio.
- [Anuncios en cada tecla pueden resultar verbosos] → `polite` espera a que el lector termine; con 6 libros es aceptable. Si molesta, la Etapa 2 puede agregar un retardo sin cambiar la regla.
- [`#catalogo-resultados` es un `id` nuevo en el contrato] → Se suma a ambas tablas en la misma tarea (DD-08) y se avisa en el README; ningún `id` existente cambia.
- [C-02 sin archivar y editando README/CSS en paralelo] → C-03 no toca `css/styles.css`; en el README agrega secciones propias y solo ajusta la frase que nombra a C-03. El delta de `maqueta-vistas` modifica un requisito distinto del que modifica C-02 ("Página única…"); archivar C-02 antes que C-03.
- [Acentos sin normalizar sorprenden al operador] → Documentado como limitación; cambiarlo es una decisión de KB, no de implementación.
- [Sin JS, el envío recarga con `?busqueda=` en la URL] → Inofensivo (la vista por defecto es Catálogo) y documentado.

## Migration Plan

No aplica despliegue. Para C-04: reemplazar el cuerpo de `filtrarCatalogo` por un re-render desde `libros.filter(l => coincideTitulo(l.titulo, busqueda))`, conservando `coincideTitulo`, `textoResultadosCatalogo`, los listeners y `#catalogo-resultados`. Rollback: quitar la sección "Filtro del catálogo" de `js/app.js` y la línea de exclusión en `registrarFormulariosMaqueta`.
