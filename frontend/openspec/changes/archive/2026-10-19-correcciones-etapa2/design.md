# Design

## Context

Motivación: ver `proposal.md` (Why). Estado actual verificado contra el código (números de línea de `js/app.js` y `index.html` al momento de proponer, commit `3f3e2c4`):

- **C-04/C-05**: `mostrarVista` (app.js 104–138) llama a `renderCatalogo(libros)` en la línea 123 e ignora el texto de `#catalogo-busqueda`; `filtrarCatalogo` (485–509) ya filtra con `coincideTitulo` y actualiza `#catalogo-sin-resultados` y `#catalogo-resultados`. `renderCatalogo` (366–427) y `renderLibros` (430–457) muestran «Sin clasificar» solo cuando `generoId` es falsy (415 y 451); un id de género inexistente muestra vacío porque `obtenerNombreGenero` (348–353) devuelve `''`. `iniciarPersistencia` (533–569) acepta cualquier array guardado sin mirar sus elementos: con `libreria.libros = [null]`, `renderCatalogo` falla en `libro.titulo`. `.bienvenida__cantidad` es un «6» fijo (index.html 75).
- **C-06**: `poblarFormularioLibro` (581–623) rearma `#libro-autores` con `innerHTML` (610) y casillas dentro de `label` sin `div.formulario__opcion`, sin ids `libro-autor-N` y con `legend` sin clase. `validarLibro` (630–671) no verifica que **todos** los autores existan (RN-LI-05, línea 661). `registrarHandlerAltaLibro` (673–752) tiene el fallback `localStorage.setItem` sin `try/catch` (735–739) y refresca con `renderTablaLibros` (no existe) y `renderCatalogo()` sin argumento (749–750): ese segundo llamado lanza `Cannot read properties of undefined (reading 'forEach')` en la línea 376 y deja `#catalogo-lista` vacío. No refresca el selector de libros de Ventas.
- **C-07**: `registrarHandlerAltaCliente` (799–867): mismo fallback (850–854) y `renderTablaClientes` inexistente (864); sí llama a `poblarSelectoresVenta`.
- **C-08**: `poblarSelectoresVenta` (876–905) muestra el precio como `$1500` (901). `registrarHandlerAgregarDetalle` (907–959) usa `parseInt` (919, acepta `2.5` como 2) y `alert()` (923, 927). `renderTablaDetalleVenta` (962–1010) arma las filas con `innerHTML` y el título del libro sin escapar (985–991: XSS confirmado) y formatea con `toFixed(2).replace('.', ',')` (988–989, 1008: sin separador de miles). No hay edición de cantidad por renglón.
- **C-09**: `registrarHandlerConfirmarVenta` (1015–1096) muestra errores con `innerHTML` (1045), genera `'V-' + timestamp` (1056), guarda `detalle` en vez de `renglones` y sin `clienteNombre` (1058–1064), con fallback directo a `localStorage` (1074–1078).
- **C-10**: `renderHistorialVentas` (1101–1139) busca `#historial-renglones` (1104), que no existe (el real es `#historial-tabla`, index.html 319), así que sale en la línea 1107 y quedan las filas de ejemplo. Además usa `innerHTML` (1129), `toLocaleDateString` (1126), una columna extra `venta.detalle.length` (1133) que no coincide con los encabezados, y no hay "Ver detalle".
- **index.html**: avisos de maqueta en 104, 184, 226 y 305 con `aria-describedby` en los controles de las 4 vistas; filas de ejemplo en `#venta-renglones` (270–283), `#historial-tabla` (320–333) y en el detalle (339–369, panel visible con V-0001).
- `js/storage.js`: `cargar` (21–35) devuelve `undefined` si la clave no existe, el valor parseado si el JSON es válido y `null` desde un único `catch` (31–34) que envuelve tanto `getItem` como `JSON.parse`. Por eso, con `localStorage` bloqueado (`getItem` lanza), devuelve `null` en lugar del `undefined` que promete su comentario (línea 20), e `iniciarPersistencia` muestra el aviso de datos corruptos. `guardar` devuelve `true`/`false` y nunca lanza. `js/data.js`: `formatearImporteARS` y `formatearFecha` ya cumplen DD-10/DD-11.

Restricciones: reglas duras de `CLAUDE.md` (sin librerías, `fetch`, módulos ni tests; `textContent`/`createElement`; BEM; español; sin renombrar `id`/`name` del contrato).

## Goals / Non-Goals

**Goals:**
- Corregir las funciones de C-06 a C-10 en el mismo `js/app.js`, con nombres en español y responsabilidades acotadas (validadores puros, render, handlers).
- Un único criterio de render seguro: helpers `vaciarElemento(el)` y creación de nodos con `textContent`, sin `innerHTML` en ningún punto que reciba datos (y, por coherencia, tampoco para opciones estáticas).
- Accesibilidad de formularios: errores en texto con `role="alert"` ya presente, `aria-invalid` + foco al primer campo con error, mensajes de éxito en las zonas `role="status"` existentes.

**Non-Goals:**
- Dividir `app.js` en varios archivos (posible en C-11; no cambia comportamiento).
- Modificar `js/data.js`, o `js/storage.js` más allá de `cargar()` (ver D3 y D15).
- Cambios en C-04/C-05 fuera de los puntos 16, 17, 18, `cargar()` y el rótulo de géneros inexistentes (D4, pedido luego por la usuaria): no se agregan mensajes de listados vacíos.
- Modificar `openspec/changes/archive/`.
- Tocar navegación, tema, sidebar, `normalizarTexto`, `coincideTitulo`, `textoResultadosCatalogo` o `registrarFormulariosMaqueta` (Etapa 1), salvo la línea de `mostrarVista` del punto 16.

## Decisions

### D1: Orden del historial — la más reciente primero
Se renderiza una **copia** de `ventas` ordenada por número de id descendente (`V-0002` antes que `V-0001`); el array guardado conserva el orden de confirmación. **Por qué**: el operador busca casi siempre la última venta; con ids correlativos, ordenar por número equivale a ordenar por fecha y no depende de relojes ni zonas horarias. **Alternativa**: orden de confirmación (más antigua primero, `forEach` directo); más simple pero obliga a desplazarse al final cuando hay muchas ventas. **Confirmada por la usuaria**; se documenta en el README.

### D2: Siguiente id de venta
`calcularSiguienteIdVenta(listaVentas)` (pura): recorre las ventas válidas, extrae el número con `/^V-(\d+)$/`, ignora las que no coinciden, toma el máximo (0 si no hay) y devuelve `'V-' + String(max + 1).padStart(4, '0')`. **Por qué**: cumple DD-09 aunque haya huecos y tolera ids malformados; las ventas del formato viejo (`V-<timestamp>`) ya quedan fuera por D3, así que no inflan el correlativo. **Alternativa**: `ventas.length + 1`; se descarta porque se rompe si se ignoran ventas inválidas o hay huecos.

### D3: Filtrado de elementos inválidos en `app.js`, sin tocar `storage.js`
Validadores de forma, puros, en `app.js`: `esLibroGuardadoValido`, `esClienteGuardadoValido`, `esVentaGuardadaValida` (y `esRenglonGuardadoValido`). `iniciarPersistencia` aplica `array.filter(validador)` después de `cargar()`. Mínimos: libro = objeto con `id`, `titulo`, `isbn`, `editorialId` string, `precio` número finito y `autorIds` array; cliente = objeto con `id`, `nombreCompleto` y `email` string; venta = objeto con `id`, `fecha`, `clienteId`, `clienteNombre` string, `total` número finito y `renglones` array no vacío de renglones válidos (`libroId`, `titulo` string, `cantidad` entero > 0, `precioUnitario` y `subtotal` números finitos). Una venta con `detalle` y sin `renglones` (formato de `3f3e2c4`) no pasa. **No se reescribe la clave al arrancar** (no se borran datos por leerlos); los descartados desaparecerán de `localStorage` en la siguiente escritura de esa clave (alta o venta), y el README lo avisa. No se muestra el banner `#error-persistencia` por elementos descartados (no es JSON corrupto). **Por qué no en `storage.js`**: el repositorio es genérico por clave (lista blanca, `try/catch`); las reglas de forma son del dominio y ya hay validadores en `app.js`. Para esto no hace falta tocarlo (el único cambio en `storage.js` es el de D15).

### D4: «Sin clasificar» al mostrar, no al guardar
El alta guarda `generoId: null` cuando se elige «Sin clasificar» (valor `""` → `null`, como hoy en la línea 699, y se conserva). `renderCatalogo` y `renderLibros` de C-04 ya mostraban «Sin clasificar» cuando `generoId` es falsy, pero un `generoId` que no existe en `generos` se veía vacío. **Actualización (pedido de la usuaria, tarea 12.2)**: se agrega `obtenerTextoGenero(libro)`, que devuelve el nombre del género o «Sin clasificar» si `generoId` es nulo o no existe, y la usan `renderCatalogo` y `renderLibros`. Es solo de presentación: lo guardado en `libreria.libros` no se modifica. El punto 14 fallaba en el navegador porque el refresco tras el alta rompía el catálogo (punto 3, D11).

### D5: Validación de cantidad única
`esCantidadValida(texto)` (pura): `const t = String(texto).trim(); return /^\d+$/.test(t) && Number(t) > 0 && Number.isSafeInteger(Number(t));`. Rechaza vacío, `0`, `-1`, `2.5`, `1,5`, `1e3` y espacios internos. Se reutiliza en "Agregar renglón", en el `change` de cada input de renglón y al confirmar. Con `input type="number"` el navegador entrega `""` para texto no numérico, que también se rechaza. **Alternativa**: `Number.isInteger(Number(v))`; se descarta porque acepta `"1e3"`, `"2.0"` y `" "` → 0.

### D6: Libro repetido (IN-02) — sumar al renglón existente
Agregar un libro ya presente suma la cantidad al renglón existente (comportamiento actual de las líneas 936–940, que se conserva). **Por qué**: es la opción más rápida para el operador y la consigna la admite. **Alternativa**: rechazar e informar el duplicado. **Confirmada por la usuaria**; se documenta en el README y en el caso manual 4.

### D7: Borrador de venta y cantidades editables
Estado en memoria `renglonesBorrador = [{ libroId, cantidad }]` (precio y título se leen de `libros` al mostrar y se **copian al confirmar**, RN-VE-08). `renderRenglonesVenta()` genera cada fila con `createElement`: título (texto), un `input type="number"` (`min="1"`, `step="1"`, `inputmode="numeric"`, id interno `venta-renglon-cantidad-N`, clases `formulario__control tabla__cantidad`) con un `label.solo-lectores` «Cantidad de <título>», precio unitario y subtotal con `formatearImporteARS`, y un botón `type="button"` «Quitar» con `span.solo-lectores` con el título. Al `change` del input: si es válida se actualizan en el lugar solo la celda de subtotal y `#venta-total` (sin re-render, para no perder el foco) y se quita `aria-invalid`; si no, se muestra el error en `#venta-errores`, `aria-invalid="true"` y el estado no cambia. Enter en ese input (`keydown`) hace `preventDefault` y aplica el cambio, para no confirmar la venta por envío implícito; lo mismo en `#venta-cantidad`, donde Enter agrega el renglón. Al confirmar, `sincronizarCantidadesBorrador()` relee los inputs y valida todos. Se agrega una regla CSS BEM `.tabla__cantidad` (ancho acotado) en `css/styles.css`.

### D8: Confirmación y formato guardado
`construirVenta(clienteId, renglonesBorrador, listaLibros, listaClientes, listaVentas, fechaISO)` (pura) arma `{id, fecha, clienteId, clienteNombre, renglones: [{libroId, titulo, cantidad, precioUnitario, subtotal}], total}` con importes `number` (subtotal = cantidad × precio; total = suma; redondeo a 2 decimales con `Math.round(x * 100) / 100`). `validarVenta` (pura) devuelve los errores (sin cliente o cliente inexistente, sin renglones, cantidades inválidas). Tras `guardar('libreria.ventas', ventas)` se limpia el borrador, se hace `reset` del formulario, se re-renderiza historial y renglones y se muestra «Venta V-000X registrada correctamente.» en `#venta-mensaje`.

### D9: Fallo de escritura — se mantiene en memoria y se avisa
Se elimina todo fallback `localStorage.setItem`; solo se usa `guardar()`. Si devuelve `false`, el registro queda en memoria (la sesión sigue usable, igual que las preferencias de C-02) y se muestra en la zona de errores de la vista: «Error: se registró en esta sesión, pero no se pudo guardar en el navegador. Se perderá al recargar la página.» en lugar del mensaje de éxito. **Alternativa**: deshacer el alta (`pop`) y pedir reintentar; más estricta, pero deja la app inutilizable si el almacenamiento está bloqueado. **Confirmada por la usuaria.**

### D10: Mensajes de error y accesibilidad de formularios
Helper `mostrarErrores(contenedor, errores)`: vacía el contenedor, agrega `p` «Error: revisá estos datos.» y un `ul` con un `li` por mensaje (todo `textContent`), y lo muestra. Los validadores de alta devuelven `[{ campo, mensaje }]` (`campo` = id del control, por ejemplo `libro-titulo` o `libro-autores`): el handler marca `aria-invalid="true"` en esos controles, enfoca el primero (para autores, la primera casilla) y limpia `aria-invalid` en el siguiente envío. `ocultarMensaje(contenedor)` vacía y oculta. Los textos de ejemplo del HTML en `#*-errores` y `#*-mensaje` se reemplazan siempre antes de mostrarse.

### D11: Refresco tras altas y selectores
`refrescarVistasLibros()` = `renderLibros()` + `filtrarCatalogo()` + `actualizarContadorLibros()` + `renderSelectorLibrosVenta()`; `refrescarVistasClientes()` = `renderClientes()` + `renderSelectorClientesVenta()`. Los selectores se generan con `createElement` (primera opción vacía «Elegí un cliente» / «Elegí un libro»; libro con `título — $ 1.500,00`) y **conservan el valor elegido** si sigue existiendo. `poblarFormularioLibro` usa el mismo patrón para editorial y género y rearma `#libro-autores` con `legend.formulario__leyenda` «Autores» y `div.formulario__opcion > input#libro-autor-N + label[for]` (N = posición 1..n, como la maqueta).

### D12: Catálogo — filtro al volver y contador (C-04, puntos 16 y 18)
En `mostrarVista`, la línea `renderCatalogo(libros)` pasa a `filtrarCatalogo()` (reusa la búsqueda activa). `actualizarContadorLibros()` escribe `String(libros.length)` en `.bienvenida__cantidad`; se llama al iniciar y en `refrescarVistasLibros`. No se agregan mensajes de listados vacíos (fuera de alcance de este change).

### D13: Historial y detalle
`renderHistorialVentas()` vacía `#historial-tabla` y genera por venta: `td` id, `td > time[datetime=fecha]` con `formatearFecha`, `td` `clienteNombre`, `td` `formatearImporteARS(total)` y `td > button.boton.boton--secundario[type=button]` «Ver detalle de V-000X». `#historial-vacio` se muestra si no hay ventas. `mostrarDetalleVenta(id)` busca la venta en `ventas` y, sobre el esqueleto que queda en el HTML (`h3.detalle-venta__titulo` con `tabindex="-1"`, `caption`, `tbody` vacío, `p.detalle-venta__total`), escribe el título «Detalle de la venta V-000X», el `caption` como texto «Renglones de la venta » + `span.tabla__id` creado con `createElement`/`textContent`, una fila por renglón **guardado** (`titulo`, `cantidad`, `precioUnitario`, `subtotal`) y el total guardado; quita `hidden` al panel y mueve el foco al `h3`. Nunca consulta `libros` (RN-HI-04). Sin botones de editar ni borrar.

### D14: Limpieza de `index.html`
Se quitan los 4 `p.aviso--maqueta` y todos los `aria-describedby="aviso-maqueta-*"`; las filas de ejemplo de `#venta-renglones`, `#historial-tabla` y del `tbody` del detalle; el contenido de ejemplo del detalle se deja como esqueleto vacío y `#historial-detalle` arranca con `hidden`; `#venta-total` arranca en `$ 0,00`. Las reglas CSS `.aviso` quedan sin uso (no se borran en este change). Ningún `id`/`name` del contrato cambia; en la nota del README sobre ids internos se reemplaza `aviso-maqueta-*` por `venta-renglon-cantidad-N`.

### D15: `cargar()` distingue almacenamiento bloqueado de JSON inválido (único cambio en `storage.js`)
Se separa el `try/catch` de `cargar` en dos: (1) `window.localStorage.getItem(clave)` dentro de su propio `try/catch`, que devuelve `undefined` si lanza (almacenamiento bloqueado, `localStorage` inaccesible o ausente); (2) `JSON.parse(texto)` en otro `try/catch`, que devuelve `null` solo si el JSON es inválido. La firma, la lista blanca, el comentario de contrato (que ya promete esto) y `guardar` no cambian. `iniciarPersistencia` no necesita cambios por esto: `undefined` ya lleva al seed sin aviso y `null` al seed con `#error-persistencia`. **Por qué tocar `storage.js`**: el defecto está en el repositorio (no cumple su propio contrato); corregirlo en `app.js` obligaría a duplicar el acceso a `localStorage` fuera del único punto de acceso (RN-PE, C-05) o a reinterpretar `null`, que perdería la distinción. Es imprescindible y acotado a una función. **Alternativa**: detectar en `app.js` si `localStorage` es accesible antes de llamar a `cargar`; se descarta por esa duplicación. Con el almacenamiento bloqueado, la página arranca con los datos iniciales y cada alta o venta muestra el aviso de D9.

## Risks / Trade-offs

- [Ventas viejas descartadas se pierden en la próxima escritura de `libreria.ventas`] → Eran datos de prueba de un formato inválido; se documenta en el README. La usuaria puede pedir conservarlas (alternativa: guardar los descartados aparte), pero no lo pide la consigna.
- [Re-render de renglones pierde el foco] → Edición en el lugar (D7): solo se actualizan subtotal y total; el re-render completo solo ocurre al agregar o quitar, y tras quitar el foco pasa a `#venta-libro`.
- [Enter dentro del formulario de venta confirma por envío implícito] → `keydown` Enter en `#venta-cantidad` y en los inputs de renglón (D7); el botón `type="submit"` sigue confirmando.
- [`#catalogo-resultados` se actualiza también al volver al Catálogo] → Es una zona `aria-live="polite"`; si el texto no cambia no se re-anuncia. Aceptado.
- [`registrarFormulariosMaqueta` sigue agregando `prevenirEnvioMaqueta` a los formularios con handler real] → Es redundante pero inofensivo (solo `preventDefault`); no se toca por la restricción de Etapa 1. Se anota en el README.
- [Con el almacenamiento bloqueado, `guardar` también falla] → Cada alta o venta muestra el aviso de D9; la sesión sigue usable y nada se conserva al recargar, sin aviso de datos corruptos (D15).
- [En algunos navegadores una ventana privada sí permite `localStorage`] → Para la verificación manual de D15 se usa además el bloqueo de datos del sitio en la configuración del navegador.

## Migration Plan

Sin migración de datos automática: al arrancar, las ventas del formato viejo y los elementos inválidos se ignoran en memoria (D3). Para empezar limpio, el README indica borrar `libreria.ventas` desde DevTools. Rollback: revertir los cambios de `js/app.js`, `js/storage.js`, `index.html`, `css/styles.css` y `README.md` del working tree (no hay commits del agente).
