# Tasks

> **Restricciones de este change (leer antes de aplicar):**
> - Sin tests automáticos ni TDD: cada tarea se verifica a mano en el navegador abriendo `index.html` por `file://`.
> - No renombrar ningún `id` ni `name` del contrato; no tocar navegación, tema, sidebar ni `normalizarTexto`/`coincideTitulo` (salvo la tarea 2.1).
> - Sobre C-04/C-05 solo se corrigen los puntos 16, 17, 18, `cargar()` y el rótulo de géneros inexistentes (tarea 12.2, pedida por la usuaria). En `js/storage.js` el único cambio permitido es `cargar()` (tarea 1.4). No modificar `js/data.js` ni nada en `openspec/changes/archive/`.
> - Ningún dato del usuario con `innerHTML`: solo `createElement` + `textContent`.
> - **Ninguna tarea marca C-06 a C-10 como `[x]` en `CHANGES.md`**: eso lo hace la usuaria después de verificar.
> - No escribir resultados de verificación de C-04/C-05 en el README (se registran por separado).
> - Sin `git commit` ni `git push`.
> - Decisiones confirmadas por la usuaria: IN-02 suma la cantidad al renglón existente (design D6), historial de la más reciente a la más antigua (D1), ante fallo de escritura el registro queda en memoria y se muestra un error en texto (D9).
> - Las tareas rotuladas **«Verificación manual (la hace la usuaria)»** las ejecuta la usuaria en el navegador: el agente de apply las deja sin marcar.

## 1. Helpers comunes y persistencia robusta (C-05: punto 17 y `cargar()`)

- [x] 1.1 Agregar en `js/app.js` los helpers `vaciarElemento(el)`, `mostrarErrores(contenedor, errores)` y `ocultarMensaje(contenedor)` (solo `createElement`/`textContent`, prefijo «Error:») — verificar en consola que `mostrarErrores(document.getElementById('libro-errores'), [{mensaje: '<b>x</b>'}])` muestra el texto literal `<b>x</b>`
- [x] 1.2 Agregar los validadores de forma `esLibroGuardadoValido`, `esClienteGuardadoValido`, `esRenglonGuardadoValido` y `esVentaGuardadaValida` (design D3) — verificar en consola que `esVentaGuardadaValida({id: 'V-1', detalle: []})` da `false` y que `esLibroGuardadoValido(null)` da `false`
- [x] 1.3 Aplicar esos validadores con `filter` en `iniciarPersistencia` sin reescribir la clave al arrancar — verificar: con `libreria.libros = [null, <un libro válido>]` en DevTools y recarga, se ve solo el libro válido, la consola no muestra errores y el valor guardado sigue igual
- [x] 1.4 En `js/storage.js`, separar el `try/catch` de `cargar()` (design D15): `getItem` que lanza → `undefined`; `JSON.parse` que falla → `null`; sin otros cambios en el archivo — verificar en consola que `cargar('libreria.libros')` sigue devolviendo el array guardado y que, con `libreria.libros` = `{x`, devuelve `null`
- [x] 1.5 **Verificación manual (la hace la usuaria)** — ventas del formato viejo: guardar en `libreria.ventas` una venta `{"id":"V-1729000000","detalle":[]}` y recargar: la página no se rompe, no hay errores en consola y Historial no la muestra
- [x] 1.6 **Verificación manual (la hace la usuaria)** — `cargar()`: (a) abrir `index.html` por `file://` en una ventana privada o con los datos del sitio bloqueados en la configuración del navegador: **no** aparece el aviso de datos corruptos, se ven los libros iniciales y la consola no muestra errores; (b) en una ventana normal, poner `libreria.libros` en `{x` desde DevTools > Application > Local Storage y recargar: **sí** aparece el aviso y se ven los libros iniciales

## 2. Catálogo: filtro al volver y contador (C-04: puntos 16 y 18)

- [x] 2.1 En `mostrarVista`, reemplazar `renderCatalogo(libros)` por `filtrarCatalogo()` — verificar: buscar `mapa`, ir a Libros y volver al Catálogo muestra solo «El mapa invisible» con el campo diciendo `mapa`
- [x] 2.2 Crear `actualizarContadorLibros()` que escribe `libros.length` en `.bienvenida__cantidad` y llamarla al iniciar — verificar que con los 6 libros iniciales se ve 6 y con `libreria.libros` de 2 libros se ve 2 tras recargar

## 3. Limpieza de la maqueta en `index.html`

- [x] 3.1 Quitar los párrafos `aviso-maqueta-libros`, `aviso-maqueta-clientes`, `aviso-maqueta-ventas` y `aviso-maqueta-historial` y todos los `aria-describedby="aviso-maqueta-*"` — verificar en consola que `document.querySelectorAll('[aria-describedby^="aviso-maqueta"], .aviso--maqueta').length` da `0`
- [x] 3.2 Quitar las filas de ejemplo de `#venta-renglones`, de `#historial-tabla` y del `tbody` del detalle; dejar `#historial-detalle` como esqueleto vacío con `hidden` y `tabindex="-1"` en su `h3`; `#venta-total` en `$ 0,00` — verificar que con `libreria.ventas = []` Historial muestra solo `#historial-vacio` y Ventas solo `#venta-renglones-vacio`
- [x] 3.3 Comprobar que ningún `id`/`name` del contrato cambió — verificar comparando la tabla de contrato del README con `index.html` (cada `id` y `name` sigue existiendo)

## 4. Alta de libros (C-06)

- [x] 4.1 Reescribir `poblarFormularioLibro` con `createElement`: opciones de editorial y género («Sin clasificar» con `value=""`) y `#libro-autores` con `legend.formulario__leyenda` y `div.formulario__opcion > input#libro-autor-N + label[for]` (design D11) — verificar que el fieldset se ve igual que en la maqueta y que clic en un nombre marca su casilla
- [x] 4.2 Ajustar `validarLibro` para devolver `[{campo, mensaje}]` y verificar que **todos** los autores existan (RN-LI-05) — verificar en consola con `validarLibro({titulo:'', isbn:'978-987-0001-01-1', precio:'0', editorialId:'ed-1', generoId:null, autorIds:['au-9']}, libros, editoriales, generos, autores)`: errores de título, ISBN repetido, precio y autor inexistente
- [x] 4.3 Corregir `registrarHandlerAltaLibro`: errores con `mostrarErrores`, `aria-invalid` y foco al primer campo con error; quitar el fallback `localStorage.setItem`; usar solo `guardar()` y, si devuelve `false`, el mensaje de design D9; conservar `generoId: null` para «Sin clasificar» — verificar con título vacío que el error se lee, el campo queda con `aria-invalid="true"` y recibe el foco
- [x] 4.4 Crear `refrescarVistasLibros()` (tabla de Libros, `filtrarCatalogo()`, contador y selector de libros de Ventas) y llamarla tras un alta correcta — verificar: alta de un libro válido con búsqueda `mapa` activa → aparece en Libros y en el selector de Ventas, el contador pasa a 7, el Catálogo sigue mostrando solo lo que coincide con `mapa` y la consola no muestra errores
- [x] 4.5 **Verificación manual (la hace la usuaria)** — alta sin género (punto 14, con la lógica existente de C-04): registrar un libro con «Sin clasificar»: en el Catálogo y en la tabla de Libros dice «Sin clasificar» y en `libreria.libros` tiene `generoId: null`

## 5. Alta de clientes (C-07)

- [x] 5.1 Ajustar `validarCliente` para devolver `[{campo, mensaje}]` — verificar en consola que `validarCliente({nombreCompleto:'', email:'abc'}, clientes)` devuelve errores de nombre y de formato de email
- [x] 5.2 Corregir `registrarHandlerAltaCliente`: `mostrarErrores`, `aria-invalid` y foco; solo `guardar()` con mensaje si falla; reemplazar `renderTablaClientes` por `refrescarVistasClientes()` (tabla + selector de clientes de Ventas, conservando el cliente elegido) — verificar: email `  CARLA.BENITEZ@EXAMPLE.COM ` rechazado; email nuevo aparece en la tabla y en el selector sin recargar y sin errores en consola

## 6. Composición de venta (C-08)

- [x] 6.1 Crear `renderSelectorClientesVenta()` y `renderSelectorLibrosVenta()` con `createElement` (opción vacía «Elegí un cliente» / «Elegí un libro», precio con `formatearImporteARS`, conservan la selección) y reemplazar `poblarSelectoresVenta` — verificar que el selector de libros muestra «La casa del faro — $ 1.500,00»
- [x] 6.2 Crear `esCantidadValida(texto)` (design D5) — verificar en consola: `'2'` → `true`; `'0'`, `'-1'`, `'2.5'`, `''`, `'1e3'` → `false`
- [x] 6.3 Reescribir "Agregar renglón" sobre `renglonesBorrador = [{libroId, cantidad}]`: sin `alert()`, errores en `#venta-errores` con `mostrarErrores`, libro repetido suma la cantidad al renglón existente (D6), Enter en `#venta-cantidad` agrega el renglón sin confirmar — verificar: cantidad `0`, `-1`, `2.5` y vacía rechazadas con texto; agregar dos veces el mismo libro deja un solo renglón con la cantidad sumada
- [x] 6.4 Reescribir el render de renglones con `createElement` (sin `innerHTML`): título como texto, input de cantidad con `label.solo-lectores` «Cantidad de <título>» y clases `formulario__control tabla__cantidad`, precio y subtotal con `formatearImporteARS`, botón «Quitar» con el título en `span.solo-lectores`; total en `#venta-total` con `formatearImporteARS`; `#venta-renglones-vacio` sin renglones — verificar: 2 × «La casa del faro» + 1 × «Estrellas de papel» muestra subtotales `$ 3.000,00` y `$ 2.000,00` y total `$ 5.000,00`
- [x] 6.5 Implementar la edición de cantidad por renglón (`change` y Enter): válida → actualizar en el lugar subtotal y total sin perder el foco; inválida → error en texto, `aria-invalid="true"`, estado sin cambios — verificar: cambiar 1 → 3 en «Estrellas de papel» da `$ 6.000,00`; escribir `1.5` muestra el error y el total no cambia
- [x] 6.6 Agregar la regla CSS BEM `.tabla__cantidad` en `css/styles.css` (ancho acotado, foco visible heredado) — verificar a 320 px que el input entra en su celda, la tabla se desplaza en su contenedor y el foco se ve
- [x] 6.7 **Verificación manual (la hace la usuaria)** — seguridad en renglones: con un libro de título `<img src=x onerror=alert(1)>` agregado a la venta, se ve el texto literal y no aparece ninguna ventana

## 7. Confirmación de venta (C-09)

- [x] 7.1 Crear `calcularSiguienteIdVenta(listaVentas)` (design D2) — verificar en consola: `calcularSiguienteIdVenta([])` → `'V-0001'`; con `[{id:'V-0002',...}, {id:'X-9',...}]` → `'V-0003'`
- [x] 7.2 Crear `validarVenta` y `construirVenta` puras (design D8) con el formato `{id, fecha, clienteId, clienteNombre, renglones: [{libroId, titulo, cantidad, precioUnitario, subtotal}], total}` — verificar en consola que `construirVenta('cl-1', [{libroId:'li-1', cantidad:2}, {libroId:'li-2', cantidad:1}], libros, clientes, [], new Date().toISOString())` da `total` 5000 y `clienteNombre` «Carla Benítez»
- [x] 7.3 Reescribir el `submit` de `#form-venta`: `sincronizarCantidadesBorrador()`, errores con `mostrarErrores` (sin cliente, sin renglones, cantidad inválida), solo `guardar('libreria.ventas', ventas)` con el mensaje de D9 si falla, mensaje «Venta V-000X registrada correctamente.» en `#venta-mensaje`, limpieza de borrador y formulario, re-render del historial — verificar: sin cliente / sin renglones / cantidad `0` en un renglón no registran nada; la venta válida del caso 5 queda en `libreria.ventas` con ese formato y el id `V-0001`, y la siguiente es `V-0002`

## 8. Historial de ventas (C-10)

- [x] 8.1 Reescribir `renderHistorialVentas` sobre `#historial-tabla` con `createElement`: id, `time[datetime]` con `formatearFecha`, `clienteNombre`, total con `formatearImporteARS`, botón `type="button"` «Ver detalle de V-000X»; orden de la más reciente a la más antigua sin modificar `ventas` (D1); `#historial-vacio` sin ventas — verificar: con `V-0001` y `V-0002` la primera fila es `V-0002`, la fecha se ve `dd/mm/aaaa hh:mm` y el total `$ 5.000,00`
- [x] 8.2 Crear `mostrarDetalleVenta(id)` (design D13): título, `caption` con `span.tabla__id` creado con `createElement`/`textContent`, renglones y total **guardados**, panel visible y foco en su `h3` — verificar con Enter sobre «Ver detalle de V-0001»: se ven los renglones 2 × `$ 1.500,00` = `$ 3.000,00` y 1 × `$ 2.000,00` = `$ 2.000,00`, total `$ 5.000,00`, y el foco queda en el título
- [x] 8.3 **Verificación manual (la hace la usuaria)** — precio histórico: cambiar solo el `precio` de «La casa del faro» en `libreria.libros` desde DevTools, recargar y abrir el detalle: siguen los importes confirmados
- [x] 8.4 **Verificación manual (la hace la usuaria)** — seguridad e inmutabilidad: el detalle de una venta con el título `<img src=x onerror=alert(1)>` lo muestra como texto; no hay controles de editar ni borrar en Ventas ni en Historial

## 9. Revisión de seguridad y consola

- [x] 9.1 Buscar `innerHTML`, `alert(`, `localStorage.setItem` y `renderTabla` en `js/app.js` — verificar que solo queda `localStorage.setItem` dentro de `guardarPreferencia` (Etapa 1, con `try/catch`), que no hay `innerHTML` con datos ni `alert(`, y que no quedan llamadas a funciones inexistentes
- [x] 9.2 **Verificación manual (la hace la usuaria)** — recorrer las 5 vistas con la consola abierta después de altas, ventas y recargas: cero errores en consola

## 10. README y CHANGES.md

- [x] 10.1 Documentar en el README cómo funcionan las altas de libros y clientes (validaciones, mensajes, refrescos, «Sin clasificar») — verificar que la sección menciona el ISBN sin espacios ni guiones, la regex de email y qué se actualiza tras cada alta
- [x] 10.2 Documentar la venta y el historial: cantidades enteras > 0 y editables por renglón, libro repetido que suma la cantidad (IN-02), id correlativo `V-0001`, orden del historial de la más reciente a la más antigua y "Ver detalle" con importes guardados — verificar que la decisión IN-02 y el orden figuran explícitos
- [x] 10.3 En «Datos de dominio guardados en el navegador (C-05)», la **única** edición permitida es agregar la clave `libreria.ventas` si no figura (hoy ya tiene una fila: en ese caso no se toca la sección) — verificar con `git diff README.md` que esa sección no tiene otros cambios
- [x] 10.4 Crear la sección nueva «Ventas guardadas (correcciones Etapa 2)» con la estructura exacta de la venta (campos, tipos, ISO 8601, importes `number`), qué pasa con ventas del formato viejo y con elementos inválidos, y el aviso cuando falla la escritura (D9) — verificar comparando con una venta real en DevTools
- [x] 10.5 Agregar los pasos para reproducir el caso del precio histórico (confirmar, anotar importes, cambiar solo el precio en `libreria.libros` en DevTools > Application > Local Storage sin tocar `libreria.ventas`, recargar, abrir el detalle en Historial) — verificar siguiendo los pasos tal como están escritos
- [x] 10.6 Actualizar «Qué es maqueta y qué funciona» al estado real de la Etapa 2 (y la nota de ids internos: quitar `aviso-maqueta-*`, agregar `venta-renglon-cantidad-N`), y la nota de «Handler de formularios de maqueta» — verificar que ninguna fila dice que Libros, Clientes, Ventas o Historial son maqueta
- [x] 10.7 Crear la sección «Verificación manual — correcciones Etapa 2» con una plantilla (columnas: Caso, Pasos, Resultado esperado, Resultado) con los casos manuales 2 a 7 tal como están en la consigna (caso 5: dos unidades a 1500 y una a 2000; subtotales 3000 y 2000; total 5000), un caso de seguridad con título con HTML, uno de «Sin clasificar», uno de filtro al volver al Catálogo, uno del contador y uno de `cargar()` con almacenamiento bloqueado y con JSON inválido, y la columna Resultado **vacía** — verificar que ninguna fila tiene resultado cargado
- [x] 10.8 En `CHANGES.md`, agregar solo notas si hacen falta (por ejemplo, que C-06 a C-10 se corrigen en `correcciones-etapa2`), **sin marcar C-06 a C-10 como `[x]`** — verificar que sus estados siguen en `[ ]`

## 11. Verificación final

- [x] 11.1 **Verificación manual (la hace la usuaria)** — a 320 px y 1280 px y solo con teclado, las vistas Libros, Clientes, Ventas e Historial: Tab llega a cada campo, a los inputs de cantidad, a «Quitar» y a «Ver detalle»; foco visible; `document.documentElement.scrollWidth <= window.innerWidth` da `true`; las tablas se desplazan en su contenedor. El resultado observado se registra en la plantilla de 10.7 (ningún caso se marca aprobado sin ejecutarlo)

## 12. Ajustes previos a la verificación manual (pedidos por la usuaria)

- [x] 12.1 Agregar `position: relative` a `.tabla-contenedor` en `css/styles.css`, para que los `span.solo-lectores` (`position: absolute`) de la tabla de renglones tomen como referencia el contenedor y no la página (con renglones cargados, `scrollWidth` daba 642 con `innerWidth` 320) — verificar que el `caption` sticky de la tabla sigue fijo al desplazar
- [x] 12.2 Crear `obtenerTextoGenero(libro)` (design D4) y usarla en `renderCatalogo` y `renderLibros`: un `generoId` nulo o inexistente se muestra como «Sin clasificar»; lo guardado no cambia — verificar con `generoId: "ge-99"` en `libreria.libros`
- [x] 12.3 En la plantilla del README, reemplazar los pasos del caso «`cargar()` con almacenamiento bloqueado» («o en ventana privada») por el bloqueo desde `edge://settings/content/cookies`, con la aclaración de que InPrivate no bloquea `localStorage` y de anotar lo observado si el navegador no bloquea el almacenamiento para `file://`; agregar las filas «Género inexistente» y «Sin scroll horizontal en Ventas a 320 px» con Resultado vacío
- [x] 12.4 **Verificación manual (la hace la usuaria)** — a 320 px, en Ventas con dos renglones cargados: `document.documentElement.scrollWidth <= window.innerWidth` da `true` y el título de la tabla queda fijo al desplazarla; con `generoId: "ge-99"` en un libro de `libreria.libros`, tras recargar, el Catálogo y la tabla de Libros dicen «Sin clasificar» y lo guardado sigue en `"ge-99"`
