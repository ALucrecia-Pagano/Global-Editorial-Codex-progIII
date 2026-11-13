/**
 * Módulo de Altas de Libros y Clientes para Editorial Codex (CH-04).
 * Conecta los formularios de registro con POST /libros/ y POST /clientes/ usando el cliente centralizado Api.
 * Carga opciones relacionales desde la API (GET /editoriales/?limit=100, /generos/?limit=100, /autores/?limit=100),
 * valida en cliente con mensajes directos en cada campo y banner accesible, y despacha eventos CustomEvent
 * ('libros:cambiaron' y 'clientes:cambiaron') para mantener las vistas sincronizadas sin recargar la página.
 */
(function () {
  'use strict';

  // Referencias a elementos del DOM de libros
  let formLibro;
  let inputTitulo;
  let inputIsbn;
  let inputPrecio;
  let inputStock;
  let selectEditorial;
  let selectGenero;
  let selectAutor;
  let selectRol;
  let botonAgregarAutor;
  let listaAutores;
  let pAutoresVacio;
  let btnGuardarLibro;
  let divLibroErrores;
  let pLibroMensaje;
  let tbodyLibros;
  let pLibrosVacio;

  // Referencias a elementos del DOM de clientes
  let formCliente;
  let inputNombre;
  let inputEmail;
  let btnGuardarCliente;
  let divClienteErrores;
  let pClienteMensaje;
  let tbodyClientes;
  let pClientesVacio;

  // Estado en memoria
  let editoriales = [];
  let generos = [];
  let autores = [];
  let autoresSeleccionados = []; // [{ autor_id, nombre, rol, orden }]

  /**
   * Vacía de forma segura los nodos hijos de un elemento del DOM.
   */
  function limpiarNodo(el) {
    if (!el) {
      return;
    }
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  /**
   * Formatea un valor numérico como moneda ARS.
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
   * Muestra un mensaje de error global dentro de un contenedor con role="alert".
   */
  function mostrarAviso(contenedor, texto) {
    if (!contenedor) {
      return;
    }
    limpiarNodo(contenedor);
    const p = document.createElement('p');
    p.textContent = texto;
    contenedor.appendChild(p);
    contenedor.hidden = false;
  }

  /**
   * Muestra una lista de errores dentro de un contenedor role="alert".
   */
  function mostrarListaErrores(contenedor, errores) {
    if (!contenedor) {
      return;
    }
    limpiarNodo(contenedor);
    const p = document.createElement('p');
    p.textContent = 'Error: revisá estos datos.';
    const ul = document.createElement('ul');
    errores.forEach(function (err) {
      const li = document.createElement('li');
      li.textContent = typeof err === 'string' ? err : err.mensaje;
      ul.appendChild(li);
    });
    contenedor.appendChild(p);
    contenedor.appendChild(ul);
    contenedor.hidden = false;
  }

  /**
   * Muestra un mensaje de éxito en un contenedor role="status".
   */
  function mostrarExito(contenedor, texto) {
    if (!contenedor) {
      return;
    }
    contenedor.textContent = texto;
    contenedor.hidden = false;
  }

  /**
   * Oculta y limpia un contenedor de mensajes.
   */
  function ocultarAviso(contenedor) {
    if (!contenedor) {
      return;
    }
    limpiarNodo(contenedor);
    contenedor.hidden = true;
  }

  /**
   * Asigna el mensaje de error junto al campo específico y lo marca como inválido.
   */
  function marcarErrorCampo(campoId, mensaje) {
    const spanError = document.getElementById('error-' + campoId);
    if (spanError) {
      spanError.textContent = mensaje;
    }
    const campo = document.getElementById(campoId);
    if (campo) {
      campo.setAttribute('aria-invalid', 'true');
      campo.classList.add('formulario__control--invalido');
    }
  }

  /**
   * Limpia los errores de un campo específico.
   */
  function limpiarErrorCampo(campoId) {
    const spanError = document.getElementById('error-' + campoId);
    if (spanError) {
      spanError.textContent = '';
    }
    const campo = document.getElementById(campoId);
    if (campo) {
      campo.removeAttribute('aria-invalid');
      campo.classList.remove('formulario__control--invalido');
    }
  }

  /**
   * Limpia todos los avisos y errores de un formulario.
   */
  function limpiarTodosLosErrores(form, divErrores, pMensaje) {
    ocultarAviso(divErrores);
    ocultarAviso(pMensaje);
    if (form) {
      form.querySelectorAll('.formulario__error-campo').forEach(function (span) {
        span.textContent = '';
      });
      form.querySelectorAll('[aria-invalid]').forEach(function (ctrl) {
        ctrl.removeAttribute('aria-invalid');
        ctrl.classList.remove('formulario__control--invalido');
      });
    }
  }

  /**
   * Carga editoriales, géneros y autores desde la API para poblar los selectores del formulario de libros.
   */
  async function cargarOpcionesLibro() {
    if (selectEditorial) {
      selectEditorial.disabled = true;
      if (selectEditorial.options[0]) {
        selectEditorial.options[0].textContent = 'Cargando editoriales…';
      }
    }
    if (selectGenero) {
      selectGenero.disabled = true;
      if (selectGenero.options[0]) {
        selectGenero.options[0].textContent = 'Cargando géneros…';
      }
    }
    if (selectAutor) {
      selectAutor.disabled = true;
      if (selectAutor.options[0]) {
        selectAutor.options[0].textContent = 'Cargando autores…';
      }
    }

    try {
      const [listaEditoriales, listaGeneros, listaAutores] = await Promise.all([
        Api.get('/editoriales/', { limit: 100 }),
        Api.get('/generos/', { limit: 100 }),
        Api.get('/autores/', { limit: 100 })
      ]);

      editoriales = Array.isArray(listaEditoriales) ? listaEditoriales : [];
      generos = Array.isArray(listaGeneros) ? listaGeneros : [];
      autores = Array.isArray(listaAutores) ? listaAutores : [];

      poblarSelectEditorial();
      poblarSelectGenero();
      poblarSelectAutor();
    } catch (error) {
      const msg = error && error.esConexion
        ? 'No se pudo conectar con el servidor para cargar editoriales y autores.'
        : 'Error al cargar las opciones del catálogo.';
      if (divLibroErrores) {
        mostrarAviso(divLibroErrores, msg);
      }
      if (selectEditorial && selectEditorial.options[0]) {
        selectEditorial.options[0].textContent = 'Error al cargar editoriales';
      }
      if (selectGenero && selectGenero.options[0]) {
        selectGenero.options[0].textContent = 'Error al cargar géneros';
      }
      if (selectAutor && selectAutor.options[0]) {
        selectAutor.options[0].textContent = 'Error al cargar autores';
      }
    }
  }

  /**
   * Puebla el selector de editorial.
   */
  function poblarSelectEditorial() {
    if (!selectEditorial) {
      return;
    }
    limpiarNodo(selectEditorial);
    const opDefecto = document.createElement('option');
    opDefecto.value = '';
    opDefecto.textContent = 'Elegí una editorial';
    selectEditorial.appendChild(opDefecto);

    editoriales.forEach(function (ed) {
      const opt = document.createElement('option');
      opt.value = String(ed.id);
      opt.textContent = ed.nombre + (ed.pais ? ' (' + ed.pais + ')' : '');
      selectEditorial.appendChild(opt);
    });
    selectEditorial.disabled = false;
  }

  /**
   * Puebla el selector de género.
   */
  function poblarSelectGenero() {
    if (!selectGenero) {
      return;
    }
    limpiarNodo(selectGenero);
    const opSin = document.createElement('option');
    opSin.value = '';
    opSin.textContent = 'Sin clasificar';
    selectGenero.appendChild(opSin);

    generos.forEach(function (g) {
      const opt = document.createElement('option');
      opt.value = String(g.id);
      opt.textContent = g.nombre;
      selectGenero.appendChild(opt);
    });
    selectGenero.disabled = false;
  }

  /**
   * Puebla el selector de autores disponibles.
   */
  function poblarSelectAutor() {
    if (!selectAutor) {
      return;
    }
    limpiarNodo(selectAutor);
    const opDefecto = document.createElement('option');
    opDefecto.value = '';
    opDefecto.textContent = 'Elegí un autor';
    selectAutor.appendChild(opDefecto);

    autores.forEach(function (a) {
      const opt = document.createElement('option');
      opt.value = String(a.id);
      opt.textContent = a.nombre + (a.nacionalidad ? ' (' + a.nacionalidad + ')' : '');
      selectAutor.appendChild(opt);
    });
    selectAutor.disabled = false;
  }

  /**
   * Renderiza la lista visual de autores asociados al libro que se está creando.
   */
  function renderAutoresSeleccionados() {
    if (!listaAutores) {
      return;
    }
    limpiarNodo(listaAutores);

    if (autoresSeleccionados.length === 0) {
      if (pAutoresVacio) {
        pAutoresVacio.hidden = false;
      }
      return;
    }

    if (pAutoresVacio) {
      pAutoresVacio.hidden = true;
    }

    autoresSeleccionados.forEach(function (item, index) {
      const li = document.createElement('li');
      li.className = 'altas-autor-item';

      const info = document.createElement('div');
      info.className = 'altas-autor-item__info';

      const nombre = document.createElement('span');
      nombre.className = 'altas-autor-item__nombre';
      nombre.textContent = item.nombre;

      const badge = document.createElement('span');
      badge.className = 'altas-autor-item__badge';
      badge.textContent = item.rol;

      const orden = document.createElement('span');
      orden.className = 'altas-autor-item__orden';
      orden.textContent = '#' + item.orden;

      info.appendChild(nombre);
      info.appendChild(badge);
      info.appendChild(orden);

      const btnQuitar = document.createElement('button');
      btnQuitar.type = 'button';
      btnQuitar.className = 'altas-autor-item__quitar';
      btnQuitar.textContent = 'Quitar';
      btnQuitar.setAttribute('aria-label', 'Quitar ' + item.nombre);
      btnQuitar.addEventListener('click', function () {
        autoresSeleccionados.splice(index, 1);
        // Reordenar índices secuenciales
        autoresSeleccionados.forEach(function (a, i) {
          a.orden = i + 1;
        });
        renderAutoresSeleccionados();
        if (autoresSeleccionados.length > 0) {
          limpiarErrorCampo('libro-autores');
        }
      });

      li.appendChild(info);
      li.appendChild(btnQuitar);
      listaAutores.appendChild(li);
    });
  }

  /**
   * Agrega un autor desde los selectores a la lista en memoria.
   */
  function agregarAutor() {
    if (!selectAutor || !selectRol) {
      return;
    }
    const autorIdStr = selectAutor.value;
    if (!autorIdStr) {
      marcarErrorCampo('libro-autores', 'Seleccioná un autor de la lista antes de agregarlo.');
      selectAutor.focus();
      return;
    }

    const autorId = Number(autorIdStr);
    const yaExiste = autoresSeleccionados.some(function (a) {
      return a.autor_id === autorId;
    });

    if (yaExiste) {
      marcarErrorCampo('libro-autores', 'Ese autor ya fue agregado al libro.');
      selectAutor.focus();
      return;
    }

    const autorObj = autores.find(function (a) {
      return a.id === autorId;
    });
    const nombreAutor = autorObj ? autorObj.nombre : 'Autor #' + autorId;
    const rol = selectRol.value || 'autor';
    const nuevoOrden = autoresSeleccionados.length + 1;

    autoresSeleccionados.push({
      autor_id: autorId,
      nombre: nombreAutor,
      rol: rol,
      orden: nuevoOrden
    });

    limpiarErrorCampo('libro-autores');
    selectAutor.value = '';
    selectRol.value = 'autor';
    renderAutoresSeleccionados();
  }

  /**
   * Carga y renderiza el listado de libros cargados en la tabla de la vista #libros.
   */
  async function cargarTablaLibros() {
    if (!tbodyLibros) {
      return;
    }
    try {
      const libros = await Api.get('/libros/', { limit: 20 });
      limpiarNodo(tbodyLibros);

      const lista = Array.isArray(libros) ? libros : [];
      if (lista.length === 0) {
        if (pLibrosVacio) {
          pLibrosVacio.hidden = false;
        }
        return;
      }

      if (pLibrosVacio) {
        pLibrosVacio.hidden = true;
      }

      lista.forEach(function (libro) {
        const tr = document.createElement('tr');

        function agregarCelda(texto) {
          const td = document.createElement('td');
          td.textContent = texto;
          tr.appendChild(td);
        }

        agregarCelda(libro.titulo || '—');
        agregarCelda(libro.isbn || '—');
        agregarCelda(libro.editorial ? libro.editorial.nombre : '—');
        agregarCelda(libro.genero ? libro.genero.nombre : 'Sin clasificar');
        agregarCelda(String(libro.stock ?? 0));
        agregarCelda(formatearMoneda(libro.precio));

        tbodyLibros.appendChild(tr);
      });
    } catch {
      // Si falla la consulta inicial de la tabla, no interfiere con el alta
    }
  }

  /**
   * Carga y renderiza el listado de clientes cargados en la tabla de la vista #clientes.
   */
  async function cargarTablaClientes() {
    if (!tbodyClientes) {
      return;
    }
    try {
      const clientes = await Api.get('/clientes/', { limit: 100 });
      limpiarNodo(tbodyClientes);

      const lista = Array.isArray(clientes) ? clientes : [];
      if (lista.length === 0) {
        if (pClientesVacio) {
          pClientesVacio.hidden = false;
        }
        return;
      }

      if (pClientesVacio) {
        pClientesVacio.hidden = true;
      }

      lista.forEach(function (cli) {
        const tr = document.createElement('tr');

        const tdNombre = document.createElement('td');
        tdNombre.textContent = cli.nombre;
        const tdEmail = document.createElement('td');
        tdEmail.textContent = cli.email;

        tr.appendChild(tdNombre);
        tr.appendChild(tdEmail);
        tbodyClientes.appendChild(tr);
      });
    } catch {
      // Si falla la consulta inicial de la tabla, no interfiere con el alta
    }
  }

  /**
   * Valida localmente los datos del formulario de libro.
   * Devuelve un array de objetos { campo, mensaje }.
   */
  function validarLibroLocal() {
    const errores = [];

    // Título obligatorio
    const titulo = inputTitulo ? inputTitulo.value.trim() : '';
    if (!titulo) {
      errores.push({ campo: 'libro-titulo', mensaje: 'El título es obligatorio.' });
    }

    // ISBN obligatorio
    const isbn = inputIsbn ? inputIsbn.value.trim() : '';
    if (!isbn) {
      errores.push({ campo: 'libro-isbn', mensaje: 'El ISBN es obligatorio.' });
    }

    // Precio numérico positivo
    const precioStr = inputPrecio ? inputPrecio.value.trim() : '';
    const precioNum = Number(precioStr);
    if (!precioStr || isNaN(precioNum) || precioNum <= 0) {
      errores.push({ campo: 'libro-precio', mensaje: 'El precio debe ser un número mayor a cero.' });
    }

    // Stock entero mayor o igual a cero
    const stockStr = inputStock ? inputStock.value.trim() : '';
    const stockNum = Number(stockStr);
    if (!stockStr || !/^\d+$/.test(stockStr) || isNaN(stockNum) || stockNum < 0) {
      errores.push({ campo: 'libro-stock', mensaje: 'El stock debe ser un número entero mayor o igual a cero.' });
    }

    // Editorial obligatoria
    const editorialId = selectEditorial ? selectEditorial.value : '';
    if (!editorialId) {
      errores.push({ campo: 'libro-editorial', mensaje: 'Debés seleccionar una editorial.' });
    }

    // Si la lista de autores está vacía pero hay un autor seleccionado en el dropdown, lo agregamos automáticamente
    if (autoresSeleccionados.length === 0 && selectAutor && selectAutor.value) {
      const aId = Number(selectAutor.value);
      const aObj = autores.find(function (a) { return a.id === aId; });
      autoresSeleccionados.push({
        autor_id: aId,
        nombre: aObj ? aObj.nombre : 'Autor #' + aId,
        rol: selectRol ? (selectRol.value || 'autor') : 'autor',
        orden: 1
      });
      renderAutoresSeleccionados();
    }

    // Al menos un autor obligatorio
    if (autoresSeleccionados.length === 0) {
      errores.push({ campo: 'libro-autores', mensaje: 'Debés seleccionar al menos un autor para el libro.' });
    }

    return errores;
  }

  /**
   * Valida localmente los datos del formulario de cliente.
   * Devuelve un array de objetos { campo, mensaje }.
   */
  function validarClienteLocal() {
    const errores = [];

    // Nombre completo obligatorio
    const nombre = inputNombre ? inputNombre.value.trim() : '';
    if (!nombre) {
      errores.push({ campo: 'cliente-nombre', mensaje: 'El nombre completo es obligatorio.' });
    }

    // Email obligatorio y con formato válido
    const email = inputEmail ? inputEmail.value.trim() : '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      errores.push({ campo: 'cliente-email', mensaje: 'El correo electrónico es obligatorio.' });
    } else if (!emailRegex.test(email)) {
      errores.push({ campo: 'cliente-email', mensaje: 'El formato del correo electrónico no es válido.' });
    }

    return errores;
  }

  /**
   * Manejador de envío del formulario de alta de libro.
   */
  async function registrarLibro(evento) {
    evento.preventDefault();
    limpiarTodosLosErrores(formLibro, divLibroErrores, pLibroMensaje);

    const errores = validarLibroLocal();
    if (errores.length > 0) {
      errores.forEach(function (err) {
        marcarErrorCampo(err.campo, err.mensaje);
      });
      mostrarListaErrores(divLibroErrores, errores);
      const primerError = document.getElementById(errores[0].campo);
      if (primerError) {
        primerError.focus();
      }
      return;
    }

    const payload = {
      titulo: inputTitulo.value.trim(),
      isbn: inputIsbn.value.trim(),
      precio: Number(Number(inputPrecio.value).toFixed(2)),
      stock: Number(inputStock.value),
      editorial_id: Number(selectEditorial.value),
      genero_id: selectGenero.value ? Number(selectGenero.value) : null,
      autores: autoresSeleccionados.map(function (a) {
        return {
          autor_id: a.autor_id,
          rol: a.rol,
          orden: a.orden
        };
      })
    };

    if (btnGuardarLibro) {
      btnGuardarLibro.disabled = true;
      btnGuardarLibro.setAttribute('aria-busy', 'true');
    }

    try {
      const libroCreado = await Api.post('/libros/', payload);

      if (btnGuardarLibro) {
        btnGuardarLibro.disabled = false;
        btnGuardarLibro.removeAttribute('aria-busy');
      }

      const mensaje = 'Libro «' + libroCreado.titulo + '» registrado correctamente.';
      mostrarExito(pLibroMensaje, mensaje);

      if (window.Destellos && typeof window.Destellos.lanzar === 'function' && pLibroMensaje) {
        window.Destellos.lanzar(pLibroMensaje, { cantidad: 50 });
      }

      formLibro.reset();
      if (inputStock) {
        inputStock.value = '0';
      }
      autoresSeleccionados = [];
      renderAutoresSeleccionados();
      cargarTablaLibros();

      // Notificar a las demás vistas (catálogo y ventas) sin recargar
      document.dispatchEvent(new CustomEvent('libros:cambiaron', { detail: libroCreado }));
    } catch (error) {
      if (btnGuardarLibro) {
        btnGuardarLibro.disabled = false;
        btnGuardarLibro.removeAttribute('aria-busy');
      }

      if (error && error.esConexion) {
        mostrarAviso(divLibroErrores, 'No se pudo conectar con el servidor. Verificá que la API esté funcionando.');
        return;
      }

      const mensaje = (error && error.message) ? error.message : 'Error al registrar el libro.';
      mostrarAviso(divLibroErrores, mensaje);

      // Si es error 409 por ISBN duplicado o conflicto, marcar también el campo ISBN
      if (error && error.status === 409) {
        marcarErrorCampo('libro-isbn', mensaje);
        if (inputIsbn) {
          inputIsbn.focus();
        }
      } else if (error && error.status === 422) {
        // En 422, asociar al campo si el mensaje lo menciona
        if (mensaje.includes('isbn')) {
          marcarErrorCampo('libro-isbn', mensaje);
        }
        if (mensaje.includes('titulo')) {
          marcarErrorCampo('libro-titulo', mensaje);
        }
        if (mensaje.includes('precio')) {
          marcarErrorCampo('libro-precio', mensaje);
        }
        if (mensaje.includes('stock')) {
          marcarErrorCampo('libro-stock', mensaje);
        }
      }
    }
  }

  /**
   * Manejador de envío del formulario de alta de cliente.
   */
  async function registrarCliente(evento) {
    evento.preventDefault();
    limpiarTodosLosErrores(formCliente, divClienteErrores, pClienteMensaje);

    const errores = validarClienteLocal();
    if (errores.length > 0) {
      errores.forEach(function (err) {
        marcarErrorCampo(err.campo, err.mensaje);
      });
      mostrarListaErrores(divClienteErrores, errores);
      const primerError = document.getElementById(errores[0].campo);
      if (primerError) {
        primerError.focus();
      }
      return;
    }

    const payload = {
      nombre: inputNombre.value.trim(),
      email: inputEmail.value.trim().toLowerCase()
    };

    if (btnGuardarCliente) {
      btnGuardarCliente.disabled = true;
      btnGuardarCliente.setAttribute('aria-busy', 'true');
    }

    try {
      const clienteCreado = await Api.post('/clientes/', payload);

      if (btnGuardarCliente) {
        btnGuardarCliente.disabled = false;
        btnGuardarCliente.removeAttribute('aria-busy');
      }

      const mensaje = 'Cliente «' + clienteCreado.nombre + '» registrado correctamente.';
      mostrarExito(pClienteMensaje, mensaje);

      if (window.Destellos && typeof window.Destellos.lanzar === 'function' && pClienteMensaje) {
        window.Destellos.lanzar(pClienteMensaje, { cantidad: 50 });
      }

      formCliente.reset();
      cargarTablaClientes();

      // Notificar a las demás vistas (ventas) sin recargar
      document.dispatchEvent(new CustomEvent('clientes:cambiaron', { detail: clienteCreado }));
    } catch (error) {
      if (btnGuardarCliente) {
        btnGuardarCliente.disabled = false;
        btnGuardarCliente.removeAttribute('aria-busy');
      }

      if (error && error.esConexion) {
        mostrarAviso(divClienteErrores, 'No se pudo conectar con el servidor. Verificá que la API esté funcionando.');
        return;
      }

      const mensaje = (error && error.message) ? error.message : 'Error al registrar el cliente.';
      mostrarAviso(divClienteErrores, mensaje);

      // Si es error 409 por email duplicado, marcar también el campo email
      if (error && error.status === 409) {
        marcarErrorCampo('cliente-email', mensaje);
        if (inputEmail) {
          inputEmail.focus();
        }
      } else if (error && error.status === 422) {
        if (mensaje.includes('email')) {
          marcarErrorCampo('cliente-email', mensaje);
        }
        if (mensaje.includes('nombre')) {
          marcarErrorCampo('cliente-nombre', mensaje);
        }
      }
    }
  }

  /**
   * Configura la limpieza reactiva de errores al escribir en los controles.
   */
  function registrarLimpiezaEnTiempoReal() {
    const mapeo = [
      { control: inputTitulo, campoId: 'libro-titulo' },
      { control: inputIsbn, campoId: 'libro-isbn' },
      { control: inputPrecio, campoId: 'libro-precio' },
      { control: inputStock, campoId: 'libro-stock' },
      { control: selectEditorial, campoId: 'libro-editorial', evento: 'change' },
      { control: selectGenero, campoId: 'libro-genero', evento: 'change' },
      { control: inputNombre, campoId: 'cliente-nombre' },
      { control: inputEmail, campoId: 'cliente-email' }
    ];

    mapeo.forEach(function (item) {
      if (item.control) {
        item.control.addEventListener(item.evento || 'input', function () {
          limpiarErrorCampo(item.campoId);
        });
      }
    });
  }

  /**
   * Inicialización del módulo de altas.
   */
  function iniciar() {
    // Referencias DOM libros
    formLibro = document.getElementById('form-libro');
    inputTitulo = document.getElementById('libro-titulo');
    inputIsbn = document.getElementById('libro-isbn');
    inputPrecio = document.getElementById('libro-precio');
    inputStock = document.getElementById('libro-stock');
    selectEditorial = document.getElementById('libro-editorial');
    selectGenero = document.getElementById('libro-genero');
    selectAutor = document.getElementById('libro-autor-select');
    selectRol = document.getElementById('libro-autor-rol');
    botonAgregarAutor = document.getElementById('libro-agregar-autor');
    listaAutores = document.getElementById('libro-autores-lista');
    pAutoresVacio = document.getElementById('libro-autores-vacio');
    btnGuardarLibro = document.getElementById('btn-guardar-libro');
    divLibroErrores = document.getElementById('libro-errores');
    pLibroMensaje = document.getElementById('libro-mensaje');
    tbodyLibros = document.getElementById('libros-tabla');
    pLibrosVacio = document.getElementById('libros-vacio');

    // Referencias DOM clientes
    formCliente = document.getElementById('form-cliente');
    inputNombre = document.getElementById('cliente-nombre');
    inputEmail = document.getElementById('cliente-email');
    btnGuardarCliente = document.getElementById('btn-guardar-cliente');
    divClienteErrores = document.getElementById('cliente-errores');
    pClienteMensaje = document.getElementById('cliente-mensaje');
    tbodyClientes = document.getElementById('clientes-tabla');
    pClientesVacio = document.getElementById('clientes-vacio');

    // Eventos
    if (formLibro) {
      formLibro.addEventListener('submit', registrarLibro);
    }
    if (botonAgregarAutor) {
      botonAgregarAutor.addEventListener('click', agregarAutor);
    }
    if (formCliente) {
      formCliente.addEventListener('submit', registrarCliente);
    }

    registrarLimpiezaEnTiempoReal();

    // Exposición de refresco para compatibilidad con mostrarVista
    window.renderLibros = cargarTablaLibros;
    window.renderClientes = cargarTablaClientes;

    // Carga de opciones de la API
    cargarOpcionesLibro();
    cargarTablaLibros();
    cargarTablaClientes();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
