/**
 * Módulo de Ventas e Historial para Editorial Codex (CH-05).
 * Conecta el formulario de registro de venta con POST /ventas/ y el historial con
 * GET /ventas/ y GET /ventas/{id} (sin barra final), usando el cliente centralizado Api.
 */
(function () {
  'use strict';

  // Referencias a elementos del DOM
  let formVenta;
  let selectCliente;
  let selectLibro;
  let inputCantidad;
  let botonAgregar;
  let tbodyRenglones;
  let pBorradorVacio;
  let spanTotalRotulo;
  let strongTotal;
  let botonConfirmar;
  let divVentaCargaError;
  let divVentaErrores;
  let pVentaMensaje;
  let divVentaResumen;
  let divHistorialEstado;
  let tbodyHistorial;
  let pHistorialVacio;
  let divHistorialPaginacion;
  let botonHistorialAnterior;
  let spanHistorialInfo;
  let botonHistorialSiguiente;
  let panelHistorialDetalle;
  let divHistorialDetalleMeta;

  // Estado en memoria
  let clientes = [];
  let libros = [];
  const clientesMap = new Map();
  const librosMap = new Map();
  let borrador = []; // [{ libro_id: number, cantidad: number }]
  let historialOffset = 0;
  const HISTORIAL_LIMIT = 10;
  let promesaOpciones = null;
  let ultimasVentasHistorial = [];

  /**
   * Valida si un valor corresponde a un entero positivo mayor que cero.
   */
  function esCantidadValida(texto) {
    const limpio = String(texto).trim();
    return /^\d+$/.test(limpio) && Number(limpio) > 0 && Number.isSafeInteger(Number(limpio));
  }

  /**
   * Formatea un importe numérico utilizando formatearImporteARS de data.js si existe.
   */
  function formatearMoneda(valor) {
    const num = Number(valor);
    const seguro = isNaN(num) ? 0 : num;
    if (typeof formatearImporteARS === 'function') {
      return formatearImporteARS(seguro);
    }
    return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(seguro);
  }

  /**
   * Formatea una fecha ISO a cadena es-AR con fecha y hora.
   */
  function formatearFechaHora(iso) {
    if (!iso) {
      return '';
    }
    try {
      const fecha = new Date(iso);
      if (isNaN(fecha.getTime())) {
        return String(iso);
      }
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const anio = fecha.getFullYear();
      const horas = String(fecha.getHours()).padStart(2, '0');
      const minutos = String(fecha.getMinutes()).padStart(2, '0');
      return dia + '/' + mes + '/' + anio + ' ' + horas + ':' + minutos;
    } catch {
      return String(iso);
    }
  }

  /**
   * Carga clientes y libros desde la API para poblar los selectores.
   */
  async function cargarOpciones() {
    if (divVentaCargaError) {
      divVentaCargaError.hidden = true;
      if (typeof vaciarElemento === 'function') {
        vaciarElemento(divVentaCargaError);
      } else {
        divVentaCargaError.textContent = '';
      }
    }

    if (selectCliente) {
      selectCliente.disabled = true;
      if (selectCliente.options[0]) {
        selectCliente.options[0].textContent = 'Cargando clientes…';
      }
    }
    if (selectLibro) {
      selectLibro.disabled = true;
      if (selectLibro.options[0]) {
        selectLibro.options[0].textContent = 'Cargando libros…';
      }
    }

    try {
      const [listaClientes, listaLibros] = await Promise.all([
        Api.get('/clientes/', { limit: 100 }),
        Api.get('/libros/', { limit: 100 })
      ]);

      clientes = Array.isArray(listaClientes) ? listaClientes : [];
      libros = Array.isArray(listaLibros) ? listaLibros : [];

      clientesMap.clear();
      clientes.forEach(function (c) {
        clientesMap.set(c.id, c);
      });

      librosMap.clear();
      libros.forEach(function (l) {
        librosMap.set(l.id, l);
      });

      poblarSelectCliente();
      poblarSelectLibro();

      if (ultimasVentasHistorial.length > 0) {
        renderHistorial(ultimasVentasHistorial);
      }
    } catch (error) {
      mostrarErrorCargaOpciones(error);
    }
  }

  function mostrarErrorCargaOpciones(error) {
    if (!divVentaCargaError) {
      return;
    }
    if (typeof vaciarElemento === 'function') {
      vaciarElemento(divVentaCargaError);
    } else {
      divVentaCargaError.textContent = '';
    }

    const mensaje = error && error.esConexion
      ? 'No se pudo conectar con el servidor.'
      : (error && error.message ? error.message : 'Error al cargar opciones de clientes y libros.');

    const p = document.createElement('p');
    p.textContent = mensaje;
    divVentaCargaError.appendChild(p);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'boton boton--secundario boton--reintentar';
    btn.textContent = 'Reintentar';
    btn.addEventListener('click', function () {
      cargarOpciones();
    });
    divVentaCargaError.appendChild(btn);
    divVentaCargaError.hidden = false;

    if (selectCliente) {
      selectCliente.disabled = true;
      if (selectCliente.options[0]) {
        selectCliente.options[0].textContent = 'Error al cargar clientes';
      }
    }
    if (selectLibro) {
      selectLibro.disabled = true;
      if (selectLibro.options[0]) {
        selectLibro.options[0].textContent = 'Error al cargar libros';
      }
    }
  }

  function poblarSelectCliente() {
    if (!selectCliente) {
      return;
    }
    const valorPrevio = selectCliente.value;
    if (typeof vaciarElemento === 'function') {
      vaciarElemento(selectCliente);
    } else {
      selectCliente.textContent = '';
    }

    const vacia = document.createElement('option');
    vacia.value = '';
    vacia.textContent = 'Elegí un cliente';
    selectCliente.appendChild(vacia);

    clientes.forEach(function (c) {
      const opt = document.createElement('option');
      opt.value = String(c.id);
      opt.textContent = c.nombre + (c.email ? ' (' + c.email + ')' : '');
      selectCliente.appendChild(opt);
    });

    selectCliente.disabled = false;
    if (clientesMap.has(Number(valorPrevio))) {
      selectCliente.value = valorPrevio;
    }
  }

  function poblarSelectLibro() {
    if (!selectLibro) {
      return;
    }
    const valorPrevio = selectLibro.value;
    if (typeof vaciarElemento === 'function') {
      vaciarElemento(selectLibro);
    } else {
      selectLibro.textContent = '';
    }

    const vacia = document.createElement('option');
    vacia.value = '';
    vacia.textContent = 'Elegí un libro';
    selectLibro.appendChild(vacia);

    libros.forEach(function (l) {
      const opt = document.createElement('option');
      opt.value = String(l.id);
      opt.textContent = l.titulo + ' — ' + formatearMoneda(l.precio);
      selectLibro.appendChild(opt);
    });

    selectLibro.disabled = false;
    if (librosMap.has(Number(valorPrevio))) {
      selectLibro.value = valorPrevio;
    }
  }

  /**
   * Cálculo de importes estimados del borrador a partir de los datos en memoria.
   */
  function calcularTotalEstimadoBorrador() {
    const total = borrador.reduce(function (acum, renglon) {
      const libro = librosMap.get(renglon.libro_id);
      const precio = libro ? Number(libro.precio) : 0;
      return acum + (precio * renglon.cantidad);
    }, 0);
    return Math.round(total * 100) / 100;
  }

  function actualizarTotalBorrador() {
    const total = calcularTotalEstimadoBorrador();
    if (spanTotalRotulo) {
      spanTotalRotulo.textContent = 'Total estimado:';
    }
    if (strongTotal) {
      strongTotal.textContent = formatearMoneda(total);
    }
  }

  /**
   * Renderiza la tabla del borrador de la venta.
   */
  function renderBorrador() {
    if (!tbodyRenglones) {
      return;
    }
    if (typeof vaciarElemento === 'function') {
      vaciarElemento(tbodyRenglones);
    } else {
      tbodyRenglones.textContent = '';
    }

    if (pBorradorVacio) {
      pBorradorVacio.hidden = borrador.length > 0;
    }

    borrador.forEach(function (renglon, indice) {
      const libro = librosMap.get(renglon.libro_id);
      const titulo = libro ? libro.titulo : 'Libro #' + renglon.libro_id;
      const precioUnitario = libro ? Number(libro.precio) : 0;
      const subtotal = Math.round(precioUnitario * renglon.cantidad * 100) / 100;

      const tr = document.createElement('tr');

      const tdLibro = document.createElement('td');
      tdLibro.textContent = titulo;
      tr.appendChild(tdLibro);

      const tdCantidad = document.createElement('td');
      const inputCant = document.createElement('input');
      inputCant.type = 'number';
      inputCant.className = 'formulario__control tabla__cantidad';
      inputCant.min = '1';
      inputCant.step = '1';
      inputCant.inputMode = 'numeric';
      inputCant.value = String(renglon.cantidad);
      inputCant.setAttribute('aria-label', 'Cantidad de ' + titulo);

      inputCant.addEventListener('change', function () {
        if (esCantidadValida(inputCant.value)) {
          renglon.cantidad = Number(inputCant.value);
          if (divVentaErrores && typeof ocultarMensaje === 'function') {
            ocultarMensaje(divVentaErrores);
          }
          renderBorrador();
        } else {
          if (divVentaErrores && typeof mostrarErrores === 'function') {
            mostrarErrores(divVentaErrores, ['La cantidad de "' + titulo + '" debe ser un número entero mayor que cero.']);
          }
        }
      });

      tdCantidad.appendChild(inputCant);
      tr.appendChild(tdCantidad);

      const tdPrecio = document.createElement('td');
      tdPrecio.textContent = formatearMoneda(precioUnitario);
      tr.appendChild(tdPrecio);

      const tdSubtotal = document.createElement('td');
      tdSubtotal.textContent = formatearMoneda(subtotal);
      tr.appendChild(tdSubtotal);

      const tdAccion = document.createElement('td');
      const btnQuitar = document.createElement('button');
      btnQuitar.type = 'button';
      btnQuitar.className = 'boton boton--secundario';
      btnQuitar.textContent = 'Quitar';
      btnQuitar.setAttribute('aria-label', 'Quitar ' + titulo + ' de la venta');
      btnQuitar.addEventListener('click', function () {
        borrador.splice(indice, 1);
        if (divVentaErrores && typeof ocultarMensaje === 'function') {
          ocultarMensaje(divVentaErrores);
        }
        renderBorrador();
        if (selectLibro) {
          selectLibro.focus();
        }
      });
      tdAccion.appendChild(btnQuitar);
      tr.appendChild(tdAccion);

      tbodyRenglones.appendChild(tr);
    });

    actualizarTotalBorrador();
  }

  /**
   * Agrega un libro al borrador o suma la cantidad si ya existe.
   */
  function agregarRenglon() {
    if (divVentaErrores && typeof ocultarMensaje === 'function') {
      ocultarMensaje(divVentaErrores);
    }
    if (pVentaMensaje && typeof ocultarMensaje === 'function') {
      ocultarMensaje(pVentaMensaje);
    }
    if (divVentaResumen) {
      divVentaResumen.hidden = true;
    }

    const errores = [];
    const libroIdStr = selectLibro ? selectLibro.value : '';
    const cantStr = inputCantidad ? inputCantidad.value : '';

    if (!libroIdStr) {
      errores.push('Elegí un libro.');
    }
    if (!esCantidadValida(cantStr)) {
      errores.push('La cantidad debe ser un número entero mayor que cero.');
    }

    if (errores.length > 0) {
      if (divVentaErrores && typeof mostrarErrores === 'function') {
        mostrarErrores(divVentaErrores, errores);
      }
      return;
    }

    const libroId = Number(libroIdStr);
    const cantidad = Number(cantStr);

    const existente = borrador.find(function (r) {
      return r.libro_id === libroId;
    });

    if (existente) {
      existente.cantidad += cantidad;
    } else {
      borrador.push({ libro_id: libroId, cantidad: cantidad });
    }

    if (selectLibro) {
      selectLibro.value = '';
    }
    if (inputCantidad) {
      inputCantidad.value = '1';
    }

    renderBorrador();
  }

  /**
   * Valida y confirma la venta enviándola a la API con POST /ventas/.
   */
  async function confirmarVenta(evento) {
    if (evento) {
      evento.preventDefault();
    }

    if (divVentaErrores && typeof ocultarMensaje === 'function') {
      ocultarMensaje(divVentaErrores);
    }
    if (pVentaMensaje && typeof ocultarMensaje === 'function') {
      ocultarMensaje(pVentaMensaje);
    }
    if (divVentaResumen) {
      divVentaResumen.hidden = true;
    }

    const clienteIdStr = selectCliente ? selectCliente.value : '';
    const errores = [];

    if (!clienteIdStr) {
      errores.push('Elegí un cliente para la venta.');
    }
    if (borrador.length === 0) {
      errores.push('Agregá al menos un libro a la venta.');
    }

    borrador.forEach(function (r) {
      if (!esCantidadValida(r.cantidad)) {
        const libro = librosMap.get(r.libro_id);
        const tit = libro ? libro.titulo : '#' + r.libro_id;
        errores.push('La cantidad de "' + tit + '" debe ser un número entero mayor que cero.');
      }
    });

    // Validar libros repetidos en el borrador
    const idsVistos = new Set();
    for (let i = 0; i < borrador.length; i++) {
      if (idsVistos.has(borrador[i].libro_id)) {
        errores.push('No se puede repetir un libro en la venta.');
        break;
      }
      idsVistos.add(borrador[i].libro_id);
    }

    if (errores.length > 0) {
      if (divVentaErrores && typeof mostrarErrores === 'function') {
        mostrarErrores(divVentaErrores, errores);
      }
      return;
    }

    const clienteId = Number(clienteIdStr);
    const payload = {
      cliente_id: clienteId,
      renglones: borrador.map(function (r) {
        return { libro_id: r.libro_id, cantidad: r.cantidad };
      })
    };

    if (botonConfirmar) {
      botonConfirmar.disabled = true;
      botonConfirmar.setAttribute('aria-busy', 'true');
    }

    try {
      const respuesta = await Api.post('/ventas/', payload);

      if (botonConfirmar) {
        botonConfirmar.disabled = false;
        botonConfirmar.removeAttribute('aria-busy');
      }

      // Éxito 201: mostrar mensaje y resumen confirmado
      if (pVentaMensaje && typeof mostrarMensajeExito === 'function') {
        mostrarMensajeExito(pVentaMensaje, 'Venta N.º ' + respuesta.id + ' registrada correctamente.');
      }
      if (window.Destellos && typeof window.Destellos.lanzar === 'function' && pVentaMensaje) {
        window.Destellos.lanzar(pVentaMensaje, { cantidad: 50 });
      }
      mostrarResumenConfirmado(respuesta);

      // Limpiar borrador y formulario
      borrador = [];
      renderBorrador();
      if (formVenta) {
        formVenta.reset();
      }
      if (selectCliente) {
        selectCliente.value = '';
      }
      if (selectLibro) {
        selectLibro.value = '';
      }
      if (inputCantidad) {
        inputCantidad.value = '1';
      }

      // Refrescar historial desde la primera página
      cargarHistorial(0);
    } catch (error) {
      if (botonConfirmar) {
        botonConfirmar.disabled = false;
        botonConfirmar.removeAttribute('aria-busy');
      }

      const mensajeError = error && error.message
        ? error.message
        : 'Error al registrar la venta.';

      if (divVentaErrores && typeof mostrarAvisoError === 'function') {
        mostrarAvisoError(divVentaErrores, mensajeError);
      }
      // Conservar el borrador en memoria y en pantalla (no limpiar nada)
    }
  }

  /**
   * Despliega el resumen de la venta confirmada con los valores exactos devueltos por la API.
   */
  function mostrarResumenConfirmado(venta) {
    if (!divVentaResumen) {
      return;
    }
    if (typeof vaciarElemento === 'function') {
      vaciarElemento(divVentaResumen);
    } else {
      divVentaResumen.textContent = '';
    }

    const h4 = document.createElement('h4');
    h4.className = 'resumen-confirmado__titulo';
    h4.textContent = 'Resumen de la venta confirmada (N.º ' + venta.id + ')';
    divVentaResumen.appendChild(h4);

    const pMeta = document.createElement('p');
    pMeta.className = 'resumen-confirmado__meta';
    const nombreCliente = venta.cliente ? venta.cliente.nombre : 'Cliente #' + venta.cliente_id;
    const emailCliente = venta.cliente && venta.cliente.email ? ' (' + venta.cliente.email + ')' : '';
    pMeta.textContent = 'Fecha: ' + formatearFechaHora(venta.fecha) + ' | Cliente: ' + nombreCliente + emailCliente;
    divVentaResumen.appendChild(pMeta);

    const secTabla = document.createElement('section');
    secTabla.className = 'tabla-contenedor';
    secTabla.tabIndex = 0;
    secTabla.setAttribute('aria-label', 'Renglones confirmados de la venta ' + venta.id);

    const tabla = document.createElement('table');
    tabla.className = 'tabla';

    const thead = document.createElement('thead');
    const trHead = document.createElement('tr');
    ['Libro', 'Cantidad', 'Precio unitario', 'Subtotal'].forEach(function (col) {
      const th = document.createElement('th');
      th.scope = 'col';
      th.textContent = col;
      trHead.appendChild(th);
    });
    thead.appendChild(trHead);
    tabla.appendChild(thead);

    const tbody = document.createElement('tbody');
    const renglonesOrdenados = (venta.renglones || []).slice().sort(function (a, b) {
      const titA = a.titulo || '';
      const titB = b.titulo || '';
      return titA.localeCompare(titB, 'es', { sensitivity: 'base' });
    });

    renglonesOrdenados.forEach(function (r) {
      const tr = document.createElement('tr');

      const tdLibro = document.createElement('td');
      tdLibro.textContent = r.titulo || ('Libro #' + r.libro_id);
      tr.appendChild(tdLibro);

      const tdCantidad = document.createElement('td');
      tdCantidad.textContent = String(r.cantidad);
      tr.appendChild(tdCantidad);

      const tdPrecio = document.createElement('td');
      tdPrecio.textContent = formatearMoneda(r.precio_unitario);
      tr.appendChild(tdPrecio);

      const tdSubtotal = document.createElement('td');
      tdSubtotal.textContent = formatearMoneda(r.subtotal);
      tr.appendChild(tdSubtotal);

      tbody.appendChild(tr);
    });
    tabla.appendChild(tbody);
    secTabla.appendChild(tabla);
    divVentaResumen.appendChild(secTabla);

    const pTotal = document.createElement('p');
    pTotal.className = 'resumen-confirmado__total';
    pTotal.appendChild(document.createTextNode('Total confirmado: '));
    const strong = document.createElement('strong');
    strong.textContent = formatearMoneda(venta.total);
    pTotal.appendChild(strong);
    divVentaResumen.appendChild(pTotal);

    divVentaResumen.hidden = false;
  }

  /**
   * Carga el historial de ventas paginado con GET /ventas/.
   */
  async function cargarHistorial(offset) {
    historialOffset = typeof offset === 'number' && offset >= 0 ? offset : 0;

    if (divHistorialEstado) {
      divHistorialEstado.hidden = false;
      divHistorialEstado.className = 'mensaje';
      if (typeof vaciarElemento === 'function') {
        vaciarElemento(divHistorialEstado);
      } else {
        divHistorialEstado.textContent = '';
      }
      const p = document.createElement('p');
      p.textContent = 'Cargando ventas…';
      divHistorialEstado.appendChild(p);
    }

    try {
      if (promesaOpciones) {
        try {
          await promesaOpciones;
        } catch (_) {
          // Si la carga de opciones falla, se continúa igual mostrando "Cliente #id"
        }
      }

      const ventas = await Api.get('/ventas/', { limit: HISTORIAL_LIMIT, offset: historialOffset });
      const lista = Array.isArray(ventas) ? ventas : [];
      ultimasVentasHistorial = lista;

      if (divHistorialEstado) {
        divHistorialEstado.hidden = true;
      }

      renderHistorial(lista);
    } catch (error) {
      mostrarErrorHistorial(error);
    }
  }

  function mostrarErrorHistorial(error) {
    if (!divHistorialEstado) {
      return;
    }
    divHistorialEstado.className = 'mensaje mensaje--error';
    divHistorialEstado.setAttribute('role', 'alert');
    if (typeof vaciarElemento === 'function') {
      vaciarElemento(divHistorialEstado);
    } else {
      divHistorialEstado.textContent = '';
    }

    const mensaje = error && error.esConexion
      ? 'No se pudo conectar con el servidor.'
      : (error && error.message ? error.message : 'Error al cargar el historial de ventas.');

    const p = document.createElement('p');
    p.textContent = mensaje;
    divHistorialEstado.appendChild(p);

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'boton boton--secundario boton--reintentar';
    btn.textContent = 'Reintentar';
    btn.addEventListener('click', function () {
      cargarHistorial(historialOffset);
    });
    divHistorialEstado.appendChild(btn);
    divHistorialEstado.hidden = false;

    if (tbodyHistorial && typeof vaciarElemento === 'function') {
      vaciarElemento(tbodyHistorial);
    }
    if (pHistorialVacio) {
      pHistorialVacio.hidden = true;
    }
    if (divHistorialPaginacion) {
      divHistorialPaginacion.hidden = true;
    }
  }

  function renderHistorial(lista) {
    if (!tbodyHistorial) {
      return;
    }
    if (typeof vaciarElemento === 'function') {
      vaciarElemento(tbodyHistorial);
    } else {
      tbodyHistorial.textContent = '';
    }

    if (lista.length === 0 && historialOffset === 0) {
      if (pHistorialVacio) {
        pHistorialVacio.hidden = false;
      }
      if (divHistorialPaginacion) {
        divHistorialPaginacion.hidden = true;
      }
      return;
    }

    if (pHistorialVacio) {
      pHistorialVacio.hidden = true;
    }

    lista.forEach(function (venta) {
      const tr = document.createElement('tr');

      const tdId = document.createElement('td');
      tdId.textContent = String(venta.id);
      tr.appendChild(tdId);

      const tdFecha = document.createElement('td');
      const time = document.createElement('time');
      time.setAttribute('datetime', venta.fecha);
      time.textContent = formatearFechaHora(venta.fecha);
      tdFecha.appendChild(time);
      tr.appendChild(tdFecha);

      const tdCliente = document.createElement('td');
      const cliente = clientesMap.get(venta.cliente_id);
      tdCliente.textContent = cliente ? cliente.nombre : 'Cliente #' + venta.cliente_id;
      tr.appendChild(tdCliente);

      const tdTotal = document.createElement('td');
      tdTotal.textContent = formatearMoneda(venta.total);
      tr.appendChild(tdTotal);

      const tdAccion = document.createElement('td');
      const btnDetalle = document.createElement('button');
      btnDetalle.type = 'button';
      btnDetalle.className = 'boton boton--secundario';
      btnDetalle.textContent = 'Ver detalle';
      btnDetalle.setAttribute('aria-label', 'Ver detalle de la venta ' + venta.id);
      btnDetalle.addEventListener('click', function () {
        cargarDetalleVenta(venta.id);
      });
      tdAccion.appendChild(btnDetalle);
      tr.appendChild(tdAccion);

      tbodyHistorial.appendChild(tr);
    });

    if (divHistorialPaginacion) {
      divHistorialPaginacion.hidden = false;
      if (botonHistorialAnterior) {
        botonHistorialAnterior.disabled = (historialOffset === 0);
      }
      if (botonHistorialSiguiente) {
        botonHistorialSiguiente.disabled = (lista.length < HISTORIAL_LIMIT);
      }
      if (spanHistorialInfo) {
        const numPagina = Math.floor(historialOffset / HISTORIAL_LIMIT) + 1;
        spanHistorialInfo.textContent = 'Página ' + numPagina;
      }
    }
  }

  /**
   * Consulta el detalle por ID (GET /ventas/{id} sin barra final).
   */
  async function cargarDetalleVenta(id) {
    if (!panelHistorialDetalle) {
      return;
    }

    try {
      const venta = await Api.get('/ventas/' + id);
      renderDetalleVenta(venta);
    } catch (error) {
      if (divHistorialEstado) {
        mostrarErrorHistorial(error);
      }
    }
  }

  function renderDetalleVenta(venta) {
    if (!panelHistorialDetalle || !venta) {
      return;
    }

    const titulo = panelHistorialDetalle.querySelector('.detalle-venta__titulo');
    const caption = panelHistorialDetalle.querySelector('caption');
    const cuerpo = panelHistorialDetalle.querySelector('tbody');
    const strongTotalDetalle = panelHistorialDetalle.querySelector('.detalle-venta__total strong');

    if (titulo) {
      if (typeof vaciarElemento === 'function') {
        vaciarElemento(titulo);
      } else {
        titulo.textContent = '';
      }
      titulo.appendChild(document.createTextNode('Detalle de la venta '));
      const spanId = document.createElement('span');
      spanId.className = 'tabla__id';
      spanId.textContent = '#' + venta.id;
      titulo.appendChild(spanId);
    }

    if (caption) {
      caption.textContent = 'Renglones de la venta #' + venta.id;
    }

    if (divHistorialDetalleMeta) {
      if (typeof vaciarElemento === 'function') {
        vaciarElemento(divHistorialDetalleMeta);
      } else {
        divHistorialDetalleMeta.textContent = '';
      }
      const nombreCliente = venta.cliente ? venta.cliente.nombre : 'Cliente #' + venta.cliente_id;
      const emailCliente = venta.cliente && venta.cliente.email ? ' (' + venta.cliente.email + ')' : '';
      divHistorialDetalleMeta.textContent = 'Fecha: ' + formatearFechaHora(venta.fecha) + ' | Cliente: ' + nombreCliente + emailCliente;
    }

    if (cuerpo) {
      if (typeof vaciarElemento === 'function') {
        vaciarElemento(cuerpo);
      } else {
        cuerpo.textContent = '';
      }

      const renglonesOrdenados = (venta.renglones || []).slice().sort(function (a, b) {
        const titA = a.titulo || '';
        const titB = b.titulo || '';
        return titA.localeCompare(titB, 'es', { sensitivity: 'base' });
      });

      renglonesOrdenados.forEach(function (r) {
        const tr = document.createElement('tr');

        const tdLibro = document.createElement('td');
        tdLibro.textContent = r.titulo || ('Libro #' + r.libro_id);
        tr.appendChild(tdLibro);

        const tdCantidad = document.createElement('td');
        tdCantidad.textContent = String(r.cantidad);
        tr.appendChild(tdCantidad);

        const tdPrecio = document.createElement('td');
        tdPrecio.textContent = formatearMoneda(r.precio_unitario);
        tr.appendChild(tdPrecio);

        const tdSubtotal = document.createElement('td');
        tdSubtotal.textContent = formatearMoneda(r.subtotal);
        tr.appendChild(tdSubtotal);

        cuerpo.appendChild(tr);
      });
    }

    if (strongTotalDetalle) {
      strongTotalDetalle.textContent = formatearMoneda(venta.total);
    }

    panelHistorialDetalle.hidden = false;
    if (titulo) {
      titulo.focus();
    }
  }

  /**
   * Inicialización del módulo cuando el DOM está completamente cargado.
   */
  document.addEventListener('DOMContentLoaded', function () {
    formVenta = document.getElementById('form-venta');
    selectCliente = document.getElementById('venta-cliente');
    selectLibro = document.getElementById('venta-libro');
    inputCantidad = document.getElementById('venta-cantidad');
    botonAgregar = document.getElementById('venta-agregar');
    tbodyRenglones = document.getElementById('venta-renglones');
    pBorradorVacio = document.getElementById('venta-renglones-vacio');
    spanTotalRotulo = document.getElementById('venta-total-rotulo');
    strongTotal = document.getElementById('venta-total');
    botonConfirmar = document.getElementById('venta-confirmar');
    divVentaCargaError = document.getElementById('venta-carga-error');
    divVentaErrores = document.getElementById('venta-errores');
    pVentaMensaje = document.getElementById('venta-mensaje');
    divVentaResumen = document.getElementById('venta-resumen-confirmado');

    divHistorialEstado = document.getElementById('historial-estado');
    tbodyHistorial = document.getElementById('historial-tabla');
    pHistorialVacio = document.getElementById('historial-vacio');
    divHistorialPaginacion = document.getElementById('historial-paginacion');
    botonHistorialAnterior = document.getElementById('historial-anterior');
    spanHistorialInfo = document.getElementById('historial-pagina-info');
    botonHistorialSiguiente = document.getElementById('historial-siguiente');
    panelHistorialDetalle = document.getElementById('historial-detalle');
    divHistorialDetalleMeta = document.getElementById('historial-detalle-meta');

    if (botonAgregar) {
      botonAgregar.addEventListener('click', function (evento) {
        evento.preventDefault();
        agregarRenglon();
      });
    }

    if (inputCantidad) {
      inputCantidad.addEventListener('keydown', function (evento) {
        if (evento.key === 'Enter') {
          evento.preventDefault();
          agregarRenglon();
        }
      });
    }

    if (formVenta) {
      formVenta.addEventListener('submit', confirmarVenta);
    }

    if (botonHistorialAnterior) {
      botonHistorialAnterior.addEventListener('click', function () {
        cargarHistorial(Math.max(0, historialOffset - HISTORIAL_LIMIT));
      });
    }

    if (botonHistorialSiguiente) {
      botonHistorialSiguiente.addEventListener('click', function () {
        cargarHistorial(historialOffset + HISTORIAL_LIMIT);
      });
    }

    // Actualización reactiva ante altas de libros o clientes (CH-04)
    document.addEventListener('libros:cambiaron', function () {
      cargarOpciones();
    });
    document.addEventListener('clientes:cambiaron', function () {
      cargarOpciones();
    });

    // Inicializaciones
    actualizarTotalBorrador();
    promesaOpciones = cargarOpciones();
    cargarHistorial(0);
  });
})();
