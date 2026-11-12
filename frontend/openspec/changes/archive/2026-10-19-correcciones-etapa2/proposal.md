# Proposal

## Why

La primera implementación de C-06 a C-10 (commit `3f3e2c4`) se hizo directo en `js/app.js`, sin changes de OpenSpec; al probarla en el navegador se detectaron problemas que este change corrige y completa, y que impiden cumplir los ejercicios 4, 5 y 6: el historial no se renderiza (busca un `id` que no existe), hay XSS por `innerHTML` con datos del usuario, las altas llaman a funciones inexistentes y vacían el catálogo, la venta guardada no respeta el formato acordado (RN-VE-07/08, DD-09) y faltan "Ver detalle", la edición de cantidades y los mensajes de error en texto. También quedan detalles de C-04/C-05 (filtro ignorado al volver al Catálogo, elementos inválidos en `localStorage`, contador fijo). Este change completa la Etapa 2 hasta C-10 siguiendo SDD, antes de cerrar el TPI con C-11.

## What Changes

- **Alta de libros (C-06)**: opciones de editorial, género y autores generadas con `createElement` manteniendo la estructura original del `fieldset` (`div.formulario__opcion`, `input#libro-autor-N`, `label for`, `legend.formulario__leyenda`); tras un alta se refrescan la tabla de Libros, el catálogo respetando el filtro activo, el contador «Historias por descubrir» y el selector de libros de Ventas.
- **Alta de clientes (C-07)**: tras un alta se refrescan la tabla de Clientes y el selector de clientes de Ventas (sin funciones inexistentes).
- **Composición de venta (C-08)**: validación de cantidad entera > 0 que rechaza 0, negativos, decimales y vacío; cantidad editable por renglón (input con etiqueta accesible) con la misma validación y recálculo de subtotal y total; libro repetido suma la cantidad al renglón existente (IN-02, decisión confirmada); importes con `formatearImporteARS`; errores en `#venta-errores` como texto (sin `alert()`).
- **Confirmación de venta (C-09)**: la venta se guarda como `{id, fecha, clienteId, clienteNombre, renglones: [{libroId, titulo, cantidad, precioUnitario, subtotal}], total}` con id correlativo `V-0001`, `V-0002`… (siguiente al mayor existente); persistencia solo con `guardar()` y mensaje si falla.
- **Historial (C-10)**: filas en `#historial-tabla` (id, fecha `dd/mm/aaaa hh:mm`, cliente guardado, total ARS) y botón "Ver detalle de V-000X" que muestra en `#historial-detalle` los renglones guardados (precio histórico), con el id en `span.tabla__id`; sin edición ni borrado; orden: la más reciente primero.
- **Seguridad (RN-GL-01)**: ningún dato del usuario se inserta con `innerHTML`; todo con `createElement` + `textContent`.
- **Catálogo (C-04, alcance restringido a los puntos 16 y 18)**: al volver al Catálogo se aplica la búsqueda activa; el contador muestra `libros.length` y se actualiza tras un alta. Un libro dado de alta sin género se ve como «Sin clasificar» (punto 14) usando la lógica existente de C-04, sin cambiarla.
- **Persistencia (C-05, alcance restringido al punto 17 y a `cargar()`)**: se ignoran los elementos inválidos de los arrays guardados (por ejemplo `[null]`) y las ventas con el formato viejo (sin `renglones`), sin romper la página ni dar errores en consola; se quita el fallback `localStorage.setItem` sin `try/catch`; `cargar()` devuelve `undefined` cuando `localStorage` está bloqueado o no es accesible y `null` solo con JSON inválido, para que el aviso de datos corruptos no aparezca con el almacenamiento bloqueado.
- **Maqueta (`index.html`)**: se quitan los avisos "Maqueta" y sus `aria-describedby` en Libros, Clientes, Ventas e Historial, y las filas de ejemplo de los renglones de venta y del historial (y del detalle).
- **README**: altas, venta, historial y orden del historial; en «Datos de dominio guardados en el navegador (C-05)» solo se agrega la clave `libreria.ventas`; una sección nueva «Ventas guardadas (correcciones Etapa 2)» con el formato exacto de la venta guardada, ventas del formato viejo, elementos inválidos y aviso de escritura fallida; pasos para reproducir el caso del precio histórico (Ejercicio 6), sección «Qué es maqueta y qué funciona» al estado real, y plantilla «Verificación manual — correcciones Etapa 2» con la columna Resultado vacía.

## Capabilities

### New Capabilities

- `alta-libros`: formulario de alta de libros con opciones generadas desde los datos locales, validación (RN-LI), mensajes en texto y refresco de las vistas relacionadas.
- `alta-clientes`: formulario de alta de clientes con validación (RN-CL), mensajes en texto y refresco de la tabla y del selector de Ventas.
- `composicion-venta`: borrador de venta en memoria (renglones, cantidades editables, libro repetido, subtotales y total en ARS) con errores en texto.
- `confirmacion-venta`: confirmación de la venta, formato guardado, id correlativo, precio histórico y persistencia.
- `historial-ventas`: listado de ventas confirmadas, orden, "Ver detalle" con valores guardados e inmutabilidad.

### Modified Capabilities

- `catalogo-dinamico`: el Catálogo respeta la búsqueda activa al volver a la vista; contador de libros dinámico.
- `persistencia-localstorage`: arranque tolerante a elementos inválidos y a ventas con formato viejo; almacenamiento bloqueado distinguido de JSON corrupto; aviso cuando una escritura falla.
- `maqueta-vistas`: Libros, Clientes, Ventas e Historial dejan de ser maqueta (sin avisos ni filas de ejemplo en renglones, historial y detalle).
- `documentacion-readme`: «Qué es maqueta y qué funciona» al estado real de la Etapa 2; documentación de la venta guardada y del caso de precio histórico; plantilla de verificación de los casos 2 a 7.

## Impact

- `js/app.js`: corrección de las funciones de C-06 a C-10 (`poblarFormularioLibro`, `registrarHandlerAltaLibro`, `registrarHandlerAltaCliente`, `poblarSelectoresVenta`, `registrarHandlerAgregarDetalle`, `renderTablaDetalleVenta`, `registrarHandlerConfirmarVenta`, `renderHistorialVentas`), ajuste puntual de `mostrarVista` (punto 16) y de `iniciarPersistencia` (validación de elementos), y nuevas funciones auxiliares en español.
- `index.html`: se quitan avisos de maqueta, `aria-describedby` asociados y filas de ejemplo; `#historial-detalle` arranca oculto. **No se renombra ningún `id` ni `name` del contrato.**
- `css/styles.css`: posible clase BEM nueva para el campo de cantidad dentro de la tabla de renglones (sin estilos inline).
- `README.md`: secciones nuevas y actualizadas; en la sección de C-05 solo se agrega la clave `libreria.ventas` (no se tocan los resultados de verificación de C-04/C-05).
- `js/storage.js`: único cambio, en `cargar()`, para devolver `undefined` con almacenamiento bloqueado (ver design.md D15).
- `js/data.js`: sin cambios.
- `openspec/changes/archive/`: sin cambios.
- `CHANGES.md`: solo notas si hacen falta; **C-06 a C-10 no se marcan `[x]`** hasta que la usuaria verifique.

**Ejercicios de la consigna cubiertos**: Ejercicio 4 (alta de libros y clientes), Ejercicio 5 (venta simulada e historial) y la parte de Ejercicio 6 referida a persistencia de ventas, documentación de la venta guardada y del caso de precio histórico; también corrige detalles del Ejercicio 3 (catálogo y filtro).

**Fuera de alcance**:
- C-11 (`casos-manuales-readme-final`): ejecución y registro final de los 8 casos; acá solo se deja la plantilla vacía.
- C-12 (`extras-prototipo`).
- Edición o borrado de libros, clientes o ventas (RN-FO-05, RN-HI-03); pantalla para editar precios.
- Cambios en navegación, tema, sidebar, `normalizarTexto`/`coincideTitulo` (Etapa 1), salvo el punto 16.
- Resultados de verificación de C-04/C-05 (se registran por separado) y cualquier otro cambio sobre C-04/C-05 fuera de los puntos 16, 17, 18 y `cargar()`: por ejemplo, mensajes de listados vacíos (`#catalogo-vacio`, `#libros-vacio`, `#clientes-vacio`). (El rótulo «Sin clasificar» para géneros con id inexistente se sumó después a pedido de la usuaria: tarea 12.2.)
- Tests automáticos (no aplican en este proyecto).
- Commits y push.
