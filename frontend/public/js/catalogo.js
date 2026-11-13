/**
 * Módulo de Catálogo y Detalle para Editorial Codex (CH-03).
 * Conecta la vista #catalogo con GET /libros/ y GET /libros/{id} (sin barra final),
 * usando el cliente centralizado Api y manipulación segura del DOM con createElement y textContent.
 */
(function () {
  'use strict';

  // Referencias a elementos del DOM
  let formBusqueda;
  let inputBusqueda;
  let zonaResultados;
  let pCargando;
  let divError;
  let pErrorTexto;
  let botonReintentar;
  let pSinResultados;
  let pVacio;
  let divLista;
  let divPaginacion;
  let botonAnterior;
  let spanPaginaInfo;
  let botonSiguiente;

  // Referencias del modal de detalle
  let dialogModal;
  let modalTitulo;
  let modalCerrar;
  let modalPortada;
  let modalIsbn;
  let modalEditorial;
  let modalGenero;
  let modalPrecio;
  let modalStock;
  let modalAutores;

  // Estado local en memoria
  let offset = 0;
  const LIMIT = 20;
  let busqueda = '';
  let cargando = false;
  let elementoOrigenModal = null;
  let catalogoIniciado = false;

  // Mapa de portadas conocidas del primer parcial
  const PORTADAS_CONOCIDAS = {
    1: 'assets/img/portadas/li-1.webp',
    2: 'assets/img/portadas/li-2.webp',
    3: 'assets/img/portadas/li-3.webp',
    4: 'assets/img/portadas/li-4.webp',
    5: 'assets/img/portadas/li-5.webp',
    6: 'assets/img/portadas/li-6.webp'
  };

  const RUTA_FALLBACK = 'assets/img/portada-fallback.svg';

  /**
   * Resuelve la ruta inicial para la portada de un libro.
   */
  function resolverRutaPortada(libro) {
    if (!libro) {
      return RUTA_FALLBACK;
    }
    if (typeof libro.portada === 'string' && libro.portada.trim() !== '') {
      return libro.portada.trim();
    }
    const numId = Number(libro.id);
    if (!isNaN(numId) && Object.prototype.hasOwnProperty.call(PORTADAS_CONOCIDAS, numId)) {
      return PORTADAS_CONOCIDAS[numId];
    }
    return RUTA_FALLBACK;
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
    return '$ ' + seguro.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  /**
   * Vacía un elemento del DOM nodo a nodo (sin innerHTML).
   */
  function vaciarNodo(el) {
    if (!el) {
      return;
    }
    while (el.firstChild) {
      el.removeChild(el.firstChild);
    }
  }

  /**
   * Actualiza la visibilidad de los cuatro estados de interfaz.
   * Estados posibles: 'cargando' | 'datos' | 'vacio' | 'error'
   */
  function mostrarEstado(estado, mensajeError) {
    if (pCargando) {
      pCargando.hidden = (estado !== 'cargando');
    }
    if (divError) {
      divError.hidden = (estado !== 'error');
    }
    if (pErrorTexto && mensajeError) {
      pErrorTexto.textContent = mensajeError;
    }
    if (pSinResultados) {
      pSinResultados.hidden = !(estado === 'vacio' && busqueda.trim() !== '');
    }
    if (pVacio) {
      pVacio.hidden = !(estado === 'vacio' && busqueda.trim() === '');
    }
    if (divLista) {
      divLista.hidden = (estado !== 'datos');
    }
    if (divPaginacion && estado !== 'datos') {
      divPaginacion.hidden = true;
    }
  }

  /**
   * Realiza la consulta paginada a la API y renderiza el catálogo.
   */
  async function cargarCatalogo() {
    if (cargando) {
      return;
    }
    cargando = true;
    mostrarEstado('cargando');

    // Pedimos LIMIT + 1 para saber con certeza si existe una página siguiente
    const params = {
      limit: LIMIT + 1,
      offset: offset
    };
    const terminoLimpio = busqueda.trim();
    if (terminoLimpio !== '') {
      params.titulo = terminoLimpio;
    }

    try {
      // Colección con barra final obligatoria
      const resp = await Api.get('/libros/', params);
      const listaCompleta = Array.isArray(resp) ? resp : [];
      const hayMas = listaCompleta.length > LIMIT;
      const libros = hayMas ? listaCompleta.slice(0, LIMIT) : listaCompleta;

      if (libros.length === 0) {
        if (offset > 0) {
          offset = Math.max(0, offset - LIMIT);
          cargando = false;
          cargarCatalogo();
          return;
        }
        mostrarEstado('vacio');
        if (zonaResultados) {
          zonaResultados.textContent = terminoLimpio !== ''
            ? 'No se encontraron libros que coincidan con la búsqueda.'
            : 'Todavía no hay libros en el catálogo.';
        }
      } else {
        mostrarEstado('datos');
        renderizarTarjetas(libros);
        actualizarPaginacion(libros.length, hayMas);
        if (zonaResultados) {
          const paginaActual = Math.floor(offset / LIMIT) + 1;
          zonaResultados.textContent = 'Página ' + paginaActual + ' · Se muestran ' + libros.length + ' libros.';
        }
      }
    } catch (err) {
      const msg = (err && err.message) ? err.message : 'Error al conectar con el servidor de la API.';
      mostrarEstado('error', msg);
      if (zonaResultados) {
        zonaResultados.textContent = 'Error al cargar el catálogo de libros.';
      }
    } finally {
      cargando = false;
    }
  }

  /**
   * Renderiza las tarjetas de libro de forma 100% segura con createElement y textContent.
   */
  function renderizarTarjetas(libros) {
    if (!divLista) {
      return;
    }
    vaciarNodo(divLista);

    libros.forEach(function (libro, index) {
      const tarjeta = document.createElement('article');
      tarjeta.className = 'tarjeta';
      tarjeta.setAttribute('role', 'button');
      tarjeta.setAttribute('tabindex', '0');
      tarjeta.setAttribute('aria-label', 'Ver detalle y autores de ' + (libro.titulo || 'libro'));

      // Contenedor de portada tipo libro
      const cajaPortada = document.createElement('div');
      cajaPortada.className = 'tarjeta__portada';

      const img = document.createElement('img');
      img.className = 'tarjeta__portada-imagen';
      img.alt = 'Portada de «' + (libro.titulo || '') + '»';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = resolverRutaPortada(libro);

      // Fallback seguro ante error de carga
      img.onerror = function () {
        this.onerror = null;
        this.src = RUTA_FALLBACK;
      };

      cajaPortada.appendChild(img);
      tarjeta.appendChild(cajaPortada);

      // Título
      const h3 = document.createElement('h3');
      h3.className = 'tarjeta__titulo';
      h3.textContent = libro.titulo || 'Sin título';
      tarjeta.appendChild(h3);

      // Metadatos en lista de definición
      const dl = document.createElement('dl');
      dl.className = 'tarjeta__datos';

      function agregarCampo(etiqueta, valor) {
        const dt = document.createElement('dt');
        dt.textContent = etiqueta;
        const dd = document.createElement('dd');
        dd.textContent = valor;
        dl.appendChild(dt);
        dl.appendChild(dd);
      }

      agregarCampo('Editorial', libro.editorial ? libro.editorial.nombre : 'Sin editorial');
      agregarCampo('Género', libro.genero ? libro.genero.nombre : 'Sin clasificar');
      tarjeta.appendChild(dl);

      // Precio en ARS
      const pPrecio = document.createElement('p');
      pPrecio.className = 'tarjeta__precio';
      pPrecio.textContent = formatearMoneda(libro.precio);
      tarjeta.appendChild(pPrecio);

      // Interacción accesible: clic o Enter abre el detalle del libro
      tarjeta.addEventListener('click', function () {
        abrirDetalle(libro.id, tarjeta);
      });
      tarjeta.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          abrirDetalle(libro.id, tarjeta);
        }
      });

      divLista.appendChild(tarjeta);
    });
  }

  /**
   * Actualiza el estado y los rótulos de los controles de paginación.
   */
  function actualizarPaginacion(cantidadEnPagina, hayMas) {
    if (!divPaginacion) {
      return;
    }
    divPaginacion.hidden = false;

    if (botonAnterior) {
      botonAnterior.disabled = (offset === 0);
    }
    if (botonSiguiente) {
      botonSiguiente.disabled = !hayMas;
    }
    if (spanPaginaInfo) {
      const paginaActual = Math.floor(offset / LIMIT) + 1;
      const primerItem = offset + 1;
      const ultimoItem = offset + cantidadEnPagina;
      spanPaginaInfo.textContent = 'Página ' + paginaActual + ' (libros ' + primerItem + ' a ' + ultimoItem + ')';
    }
  }

  /**
   * Abre la ficha de detalle de un libro consultando GET /libros/{id} (sin barra final).
   */
  async function abrirDetalle(id, elementoDisparador) {
    if (!id || !dialogModal) {
      return;
    }
    elementoOrigenModal = elementoDisparador || null;

    try {
      // Regla estricta: rutas con ID van SIN barra final para evitar redirect 307
      const detalle = await Api.get('/libros/' + id);

      if (modalTitulo) {
        modalTitulo.textContent = detalle.titulo || 'Detalle del libro';
      }
      if (modalPortada) {
        modalPortada.src = resolverRutaPortada(detalle);
        modalPortada.alt = 'Portada de «' + (detalle.titulo || '') + '»';
        modalPortada.onerror = function () {
          this.onerror = null;
          this.src = RUTA_FALLBACK;
        };
      }
      if (modalIsbn) {
        modalIsbn.textContent = detalle.isbn || '—';
      }
      if (modalEditorial) {
        modalEditorial.textContent = detalle.editorial ? detalle.editorial.nombre : 'Sin editorial';
      }
      if (modalGenero) {
        modalGenero.textContent = detalle.genero ? detalle.genero.nombre : 'Sin clasificar';
      }
      if (modalPrecio) {
        modalPrecio.textContent = formatearMoneda(detalle.precio);
      }
      if (modalStock) {
        modalStock.textContent = String(detalle.stock != null ? detalle.stock : '—');
      }

      // Autores con rol
      if (modalAutores) {
        vaciarNodo(modalAutores);
        if (Array.isArray(detalle.autores) && detalle.autores.length > 0) {
          detalle.autores.forEach(function (asoc) {
            const li = document.createElement('li');
            const autor = asoc.autor;
            const nombreCompleto = autor
              ? ((autor.nombre || '') + ' ' + (autor.apellido || '')).trim()
              : 'Autor #' + (asoc.autor_id || '');
            const rolTexto = asoc.rol ? ' (' + asoc.rol + ')' : '';
            li.textContent = nombreCompleto + rolTexto;
            modalAutores.appendChild(li);
          });
        } else {
          const li = document.createElement('li');
          li.textContent = 'Sin autores asignados';
          modalAutores.appendChild(li);
        }
      }

      // Apertura de modal accesible
      if (typeof dialogModal.showModal === 'function') {
        dialogModal.showModal();
      } else {
        dialogModal.setAttribute('open', '');
      }

      if (modalCerrar) {
        modalCerrar.focus();
      }
    } catch (err) {
      alert('No se pudo cargar el detalle del libro: ' + ((err && err.message) ? err.message : 'Error de comunicación'));
    }
  }

  /**
   * Cierra el modal de detalle y restaura el foco en el disparador.
   */
  function cerrarDetalle() {
    if (!dialogModal) {
      return;
    }
    if (typeof dialogModal.close === 'function') {
      dialogModal.close();
    } else {
      dialogModal.removeAttribute('open');
    }
    if (elementoOrigenModal && typeof elementoOrigenModal.focus === 'function') {
      elementoOrigenModal.focus();
    }
  }

  /**
   * Inicialización de eventos y enlace con la vista #catalogo.
   */
  function iniciar() {
    formBusqueda = document.getElementById('form-busqueda');
    inputBusqueda = document.getElementById('catalogo-busqueda');
    zonaResultados = document.getElementById('catalogo-resultados');
    pCargando = document.getElementById('catalogo-cargando');
    divError = document.getElementById('catalogo-error');
    pErrorTexto = document.getElementById('catalogo-error-texto');
    botonReintentar = document.getElementById('catalogo-reintentar');
    pSinResultados = document.getElementById('catalogo-sin-resultados');
    pVacio = document.getElementById('catalogo-vacio');
    divLista = document.getElementById('catalogo-lista');
    divPaginacion = document.getElementById('catalogo-paginacion');
    botonAnterior = document.getElementById('catalogo-anterior');
    spanPaginaInfo = document.getElementById('catalogo-pagina-info');
    botonSiguiente = document.getElementById('catalogo-siguiente');

    dialogModal = document.getElementById('catalogo-modal');
    modalTitulo = document.getElementById('catalogo-modal-titulo');
    modalCerrar = document.getElementById('catalogo-modal-cerrar');
    modalPortada = document.getElementById('catalogo-modal-portada');
    modalIsbn = document.getElementById('catalogo-modal-isbn');
    modalEditorial = document.getElementById('catalogo-modal-editorial');
    modalGenero = document.getElementById('catalogo-modal-genero');
    modalPrecio = document.getElementById('catalogo-modal-precio');
    modalStock = document.getElementById('catalogo-modal-stock');
    modalAutores = document.getElementById('catalogo-modal-autores');

    if (!divLista) {
      return;
    }

    // Eventos de búsqueda
    if (formBusqueda) {
      formBusqueda.addEventListener('submit', function (e) {
        e.preventDefault();
        busqueda = inputBusqueda ? inputBusqueda.value : '';
        offset = 0;
        cargarCatalogo();
      });
    }

    if (inputBusqueda) {
      inputBusqueda.addEventListener('search', function () {
        if (this.value === '') {
          busqueda = '';
          offset = 0;
          cargarCatalogo();
        }
      });
    }

    // Eventos de paginación
    if (botonAnterior) {
      botonAnterior.addEventListener('click', function () {
        if (offset >= LIMIT) {
          offset -= LIMIT;
          cargarCatalogo();
        }
      });
    }

    if (botonSiguiente) {
      botonSiguiente.addEventListener('click', function () {
        offset += LIMIT;
        cargarCatalogo();
      });
    }

    // Reintento tras error
    if (botonReintentar) {
      botonReintentar.addEventListener('click', function () {
        cargarCatalogo();
      });
    }

    // Eventos del modal
    if (modalCerrar) {
      modalCerrar.addEventListener('click', function () {
        cerrarDetalle();
      });
    }

    if (dialogModal) {
      dialogModal.addEventListener('click', function (e) {
        if (e.target === dialogModal) {
          cerrarDetalle();
        }
      });
      dialogModal.addEventListener('cancel', function () {
        cerrarDetalle();
      });
    }

    // Carga inicial al ingresar a la vista #catalogo
    function verificarVistaCatalogo() {
      const hash = window.location.hash || '#catalogo';
      if (hash === '#catalogo' || hash === '') {
        if (!catalogoIniciado) {
          catalogoIniciado = true;
          cargarCatalogo();
        }
      }
    }

    window.addEventListener('hashchange', function () {
      const hash = window.location.hash;
      if (hash === '#catalogo' || hash === '') {
        cargarCatalogo();
      }
    });

    verificarVistaCatalogo();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();
