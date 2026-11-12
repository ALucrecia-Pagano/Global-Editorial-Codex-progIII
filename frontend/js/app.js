// Editorial Codex - navegación entre vistas (C-01), preferencias de presentación y sidebar (C-02), filtro del catálogo (C-03).
// Script clásico (se carga con defer). Sin librerías ni módulos.

// Mejora progresiva (D3): el CSS usa html.js para mostrar los controles que necesitan JS.
document.documentElement.classList.add('js');

// ---------------------------------------------------------------------------
// Preferencias en localStorage (D7). Todo acceso va en try/catch: si el
// almacenamiento falla, está bloqueado o tiene un valor inválido, se usa el
// valor por defecto y la página sigue funcionando.
// ---------------------------------------------------------------------------
const PREFIJO_PREFERENCIAS = 'libreria.preferencias.';
const TEMAS_VALIDOS = ['claro', 'oscuro'];
const ESTADOS_SIDEBAR_VALIDOS = ['colapsada', 'expandida'];

function leerPreferencia(clave, valorPorDefecto) {
  try {
    const valor = window.localStorage.getItem(PREFIJO_PREFERENCIAS + clave);
    return valor === null ? valorPorDefecto : valor;
  } catch (error) {
    return valorPorDefecto;
  }
}

function guardarPreferencia(clave, valor) {
  try {
    window.localStorage.setItem(PREFIJO_PREFERENCIAS + clave, valor);
    return true;
  } catch (error) {
    return false;
  }
}

// Orden de decisión (D4): preferencia guardada válida -> prefers-color-scheme -> oscuro.
function obtenerTemaInicial() {
  const guardado = leerPreferencia('tema', null);
  if (TEMAS_VALIDOS.includes(guardado)) {
    return guardado;
  }
  try {
    if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'claro';
    }
  } catch (error) {
    // Sin matchMedia: se usa el tema oscuro.
  }
  return 'oscuro';
}

// Aplica el tema en <html> y sincroniza el botón (aria-pressed y nombre accesible).
function aplicarTema(tema) {
  document.documentElement.setAttribute('data-tema', tema);
  const boton = document.getElementById('tema-alternar');
  if (boton) {
    const esClaro = tema === 'claro';
    boton.setAttribute('aria-pressed', String(esClaro));
    boton.setAttribute('aria-label', esClaro ? 'Activar tema oscuro' : 'Activar tema claro');
  }
}

function alternarTema() {
  const nuevo = document.documentElement.getAttribute('data-tema') === 'claro' ? 'oscuro' : 'claro';
  aplicarTema(nuevo);
  guardarPreferencia('tema', nuevo);
}

function iniciarTema() {
  aplicarTema(obtenerTemaInicial());
  const boton = document.getElementById('tema-alternar');
  if (boton) {
    boton.addEventListener('click', alternarTema);
  }
}

const VISTA_POR_DEFECTO = 'catalogo';

const VISTAS = ['catalogo', 'libros', 'clientes', 'ventas', 'historial'];

let vistaActual = null;

// Devuelve el id de la vista que corresponde al hash, o null si no hay ninguna.
function obtenerVistaDesdeHash(hash) {
  let id = String(hash || '').replace(/^#/, '');
  if (id === '') {
    return null;
  }
  try {
    id = decodeURIComponent(id);
  } catch (error) {
    return null;
  }
  if (VISTAS.includes(id)) {
    return id;
  }
  const elemento = document.getElementById(id);
  if (!elemento) {
    return null;
  }
  const vista = elemento.closest('.vista');
  return vista ? vista.id : null;
}

// Muestra solo la vista indicada y marca su enlace como página actual.
function mostrarVista(id, opciones) {
  const moverFoco = Boolean(opciones && opciones.moverFoco);

  document.querySelectorAll('.vista').forEach(function (seccion) {
    seccion.hidden = seccion.id !== id;
  });

  document.querySelectorAll('.navegacion__enlace').forEach(function (enlace) {
    if (enlace.getAttribute('href') === '#' + id) {
      enlace.setAttribute('aria-current', 'page');
    } else {
      enlace.removeAttribute('aria-current');
    }
  });

  vistaActual = id;

  // Render inicial de listados desde los arrays (C-04).
  if (id === 'catalogo') {
    filtrarCatalogo();
  }
  if (id === 'libros') {
    renderLibros();
  }
  if (id === 'clientes') {
    renderClientes();
  }

  if (moverFoco) {
    const titulo = document.querySelector('#' + id + ' .vista__titulo');
    if (titulo) {
      titulo.focus();
    }
  }
}

function alCambiarHash() {
  const hashVacio = location.hash === '' || location.hash === '#';
  const id = hashVacio ? VISTA_POR_DEFECTO : obtenerVistaDesdeHash(location.hash);
  if (id === null || id === vistaActual) {
    return;
  }
  mostrarVista(id, { moverFoco: true });
}

function iniciarNavegacion() {
  const id = obtenerVistaDesdeHash(location.hash) || VISTA_POR_DEFECTO;
  mostrarVista(id, { moverFoco: false });
  window.addEventListener('hashchange', alCambiarHash);
}

// ---------------------------------------------------------------------------
// Sidebar (D8): colapsar en escritorio (>= 1024 px) y menú hamburguesa en celular.
// ---------------------------------------------------------------------------
const CONSULTA_ESCRITORIO = '(min-width: 1024px)';

function obtenerElementosSidebar() {
  return {
    aplicacion: document.querySelector('.aplicacion'),
    sidebar: document.getElementById('sidebar'),
    botonColapsar: document.getElementById('sidebar-colapsar'),
    botonAbrir: document.getElementById('menu-abrir'),
    botonCerrar: document.getElementById('menu-cerrar'),
    velo: document.getElementById('sidebar-velo')
  };
}

function aplicarEstadoSidebar(colapsada) {
  const el = obtenerElementosSidebar();
  if (!el.aplicacion) {
    return;
  }
  el.aplicacion.classList.toggle('aplicacion--sidebar-colapsada', colapsada);
  if (el.botonColapsar) {
    el.botonColapsar.setAttribute('aria-expanded', String(!colapsada));
    el.botonColapsar.setAttribute('aria-label', colapsada ? 'Expandir menú' : 'Colapsar menú');
  }
}

function alternarSidebarColapsada() {
  const colapsar = !document.querySelector('.aplicacion').classList.contains('aplicacion--sidebar-colapsada');
  aplicarEstadoSidebar(colapsar);
  guardarPreferencia('sidebar', colapsar ? 'colapsada' : 'expandida');
}

function menuMovilAbierto() {
  const aplicacion = document.querySelector('.aplicacion');
  return Boolean(aplicacion && aplicacion.classList.contains('aplicacion--menu-abierto'));
}

function abrirMenuMovil() {
  const el = obtenerElementosSidebar();
  el.aplicacion.classList.add('aplicacion--menu-abierto');
  el.botonAbrir.setAttribute('aria-expanded', 'true');
  const primerEnlace = el.sidebar.querySelector('.navegacion__enlace');
  if (primerEnlace) {
    primerEnlace.focus();
  }
}

// devolverFoco: true al cerrar con botón, Escape o velo (el foco vuelve a la hamburguesa).
function cerrarMenuMovil(devolverFoco) {
  const el = obtenerElementosSidebar();
  if (!menuMovilAbierto()) {
    return;
  }
  el.aplicacion.classList.remove('aplicacion--menu-abierto');
  el.botonAbrir.setAttribute('aria-expanded', 'false');
  if (devolverFoco) {
    el.botonAbrir.focus();
  }
}

function iniciarSidebar() {
  const el = obtenerElementosSidebar();
  if (!el.aplicacion || !el.sidebar) {
    return;
  }

  // Estado de escritorio recordado (lista blanca; cualquier otro valor = expandida).
  const guardado = leerPreferencia('sidebar', 'expandida');
  aplicarEstadoSidebar(ESTADOS_SIDEBAR_VALIDOS.includes(guardado) && guardado === 'colapsada');

  if (el.botonColapsar) {
    el.botonColapsar.addEventListener('click', alternarSidebarColapsada);
  }
  if (el.botonAbrir) {
    el.botonAbrir.addEventListener('click', abrirMenuMovil);
  }
  if (el.botonCerrar) {
    el.botonCerrar.addEventListener('click', function () {
      cerrarMenuMovil(true);
    });
  }
  if (el.velo) {
    el.velo.addEventListener('click', function () {
      cerrarMenuMovil(true);
    });
  }

  // Activar un enlace del menú lo cierra; el foco lo mueve la navegación al h2 de la vista.
  // (La marca de la sidebar es solo texto: no navega ni cierra el menú.)
  el.sidebar.querySelectorAll('.navegacion__enlace').forEach(function (enlace) {
    enlace.addEventListener('click', function () {
      if (!menuMovilAbierto()) {
        return;
      }
      cerrarMenuMovil(false);
      // Mismo destino: no habrá hashchange, así que el foco va al título de la vista actual.
      if (enlace.getAttribute('href') === '#' + vistaActual) {
        const titulo = document.querySelector('#' + vistaActual + ' .vista__titulo');
        if (titulo) {
          titulo.focus();
        }
      }
    });
  });

  document.addEventListener('keydown', function (evento) {
    if (evento.key === 'Escape' && menuMovilAbierto()) {
      cerrarMenuMovil(true);
    }
  });

  // Al pasar a escritorio el menú móvil se cierra, sin velo ni estados rotos.
  const consulta = window.matchMedia(CONSULTA_ESCRITORIO);
  const alCambiarAncho = function (evento) {
    if (evento.matches) {
      cerrarMenuMovil(false);
    }
  };
  if (consulta.addEventListener) {
    consulta.addEventListener('change', alCambiarAncho);
  } else if (consulta.addListener) {
    consulta.addListener(alCambiarAncho);
  }
}

// Handler de maqueta: evita que los formularios recarguen la página (D6).
function prevenirEnvioMaqueta(evento) {
  evento.preventDefault();
}

function registrarFormulariosMaqueta() {
  document.querySelectorAll('form').forEach(function (formulario) {
    // El buscador del catálogo ya no es maqueta: tiene su propio handler (C-03).
    if (formulario.id === 'form-busqueda') {
      return;
    }
    formulario.addEventListener('submit', prevenirEnvioMaqueta);
  });
}

// ---------------------------------------------------------------------------
// Filtro del catálogo (C-03). La regla es pura (sin DOM) para que la Etapa 2
// la reutilice tal cual sobre el array de libros (DD-07).
// ---------------------------------------------------------------------------

// Texto comparable: en minúsculas y sin tildes ni otros diacríticos (NFD separa la
// letra de su marca y el rango U+0300–U+036F quita las marcas). Pura; tolera null/undefined.
// Efecto aceptado: la ñ queda como n ("nino" encuentra "niño").
function normalizarTexto(texto) {
  return String(texto == null ? '' : texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

// Coincidencia por título: sin distinguir mayúsculas, tildes ni espacios en los bordes
// de la búsqueda ("orbita" encuentra "Órbita lenta"). Búsqueda vacía o solo espacios -> true.
// Tolera null/undefined.
function coincideTitulo(titulo, busqueda) {
  const texto = normalizarTexto(String(busqueda == null ? '' : busqueda).trim());
  if (texto === '') {
    return true;
  }
  return normalizarTexto(titulo).includes(texto);
}

// Texto que anuncia la zona de estado #catalogo-resultados (pura, sin DOM).
function textoResultadosCatalogo(visibles, total, busquedaVacia) {
  if (total === 0) {
    return 'Todavía no hay libros en el catálogo.';
  }
  if (busquedaVacia) {
    return 'Se muestran los ' + total + ' libros.';
  }
  if (visibles === 0) {
    return 'No se encontraron libros que coincidan con la búsqueda.';
  }
  if (visibles === 1) {
    return 'Se muestra 1 de ' + total + ' libros.';
  }
  return 'Se muestran ' + visibles + ' de ' + total + ' libros.';
}

// ---------------------------------------------------------------------------
// Helpers de datos (C-04): resuelven nombres de editorial, género y autores
// a partir de los ids estables del array.
// ---------------------------------------------------------------------------
function obtenerNombreEditorial(id) {
  const editorial = editoriales.find(function (e) {
    return e.id === id;
  });
  return editorial ? editorial.nombre : '';
}

function obtenerNombreGenero(id) {
  const genero = generos.find(function (g) {
    return g.id === id;
  });
  return genero ? genero.nombre : '';
}

// Rótulo de género para mostrar: sin género o con un id que no existe → «Sin clasificar».
// No cambia lo que se guarda (generoId sigue tal cual en libreria.libros).
function obtenerTextoGenero(libro) {
  return obtenerNombreGenero(libro.generoId) || 'Sin clasificar';
}

function obtenerNombresAutores(ids) {
  if (!Array.isArray(ids)) {
    return '';
  }
  return ids.map(function (id) {
    const autor = autores.find(function (a) {
      return a.id === id;
    });
    return autor ? autor.nombre : '';
  }).filter(function (nombre) {
    return nombre !== '';
  }).join(', ');
}

// ---------------------------------------------------------------------------
// Portadas ilustradas (change portadas-ilustradas). El mapa acota la derivación
// de rutas a las imágenes que existen: los libros nuevos (ids `lib-…`) no piden
// un archivo inexistente y caen a la tapa CSS.
// ---------------------------------------------------------------------------
const PORTADAS_IDS_CONOCIDOS = {
  'li-1': 'assets/img/portadas/li-1.webp',
  'li-2': 'assets/img/portadas/li-2.webp',
  'li-3': 'assets/img/portadas/li-3.webp',
  'li-4': 'assets/img/portadas/li-4.webp',
  'li-5': 'assets/img/portadas/li-5.webp',
  'li-6': 'assets/img/portadas/li-6.webp'
};

// Ruta de la portada de un libro (pura, sin DOM). Orden: campo `portada` con
// texto no vacío -> ruta del mapa para ids conocidos -> null (tapa CSS).
function resolverPortada(libro) {
  if (!libro) {
    return null;
  }
  if (typeof libro.portada === 'string' && libro.portada.trim() !== '') {
    return libro.portada.trim();
  }
  if (Object.prototype.hasOwnProperty.call(PORTADAS_IDS_CONOCIDOS, libro.id)) {
    return PORTADAS_IDS_CONOCIDOS[libro.id];
  }
  return null;
}

// Renderiza el catálogo desde un array de libros (C-04).
// Usa createElement para la estructura y textContent para todo el texto (RN-GL-01).
function renderCatalogo(librosAMostrar) {
  const lista = document.getElementById('catalogo-lista');
  if (!lista) {
    return;
  }
  // Vaciar contenedor nodo a nodo (sin innerHTML).
  while (lista.firstChild) {
    lista.removeChild(lista.firstChild);
  }

  librosAMostrar.forEach(function (libro, index) {
    const articulo = document.createElement('article');
    articulo.className = 'tarjeta';

    // Portada: caja 2:3 con la imagen ilustrada (si hay) y la tapa CSS de
    // respaldo (siempre creada; visible solo si falta la imagen o falla).
    const cajaPortada = document.createElement('div');
    cajaPortada.className = 'tarjeta__portada';

    const tapa = document.createElement('div');
    tapa.className = 'tarjeta__tapa tapa tapa--degrade-' + ((index % 6) + 1);
    tapa.setAttribute('aria-hidden', 'true');
    const tapaTitulo = document.createElement('span');
    tapaTitulo.className = 'tarjeta__tapa-titulo';
    tapaTitulo.textContent = libro.titulo;
    const tapaAutor = document.createElement('span');
    tapaAutor.className = 'tarjeta__tapa-autor';
    tapaAutor.textContent = obtenerNombresAutores(libro.autorIds);
    tapa.appendChild(tapaTitulo);
    tapa.appendChild(tapaAutor);

    const rutaPortada = resolverPortada(libro);
    if (rutaPortada) {
      const imagen = document.createElement('img');
      imagen.className = 'tarjeta__portada-imagen';
      imagen.src = rutaPortada;
      imagen.alt = 'Portada de «' + libro.titulo + '»';
      imagen.loading = 'lazy';
      imagen.decoding = 'async';
      imagen.width = 600;
      imagen.height = 900;
      imagen.addEventListener('error', function () {
        imagen.hidden = true;
        tapa.hidden = false;
      });
      tapa.hidden = true;
      cajaPortada.appendChild(tapa);
      cajaPortada.appendChild(imagen);
    } else {
      cajaPortada.appendChild(tapa);
    }
    articulo.appendChild(cajaPortada);

    // Título.
    const tituloEl = document.createElement('h3');
    tituloEl.className = 'tarjeta__titulo';
    tituloEl.textContent = libro.titulo;
    articulo.appendChild(tituloEl);

    // Datos.
    const dl = document.createElement('dl');
    dl.className = 'tarjeta__datos';

    function agregarDato(etiqueta, valor) {
      const dt = document.createElement('dt');
      dt.textContent = etiqueta;
      const dd = document.createElement('dd');
      dd.textContent = valor;
      dl.appendChild(dt);
      dl.appendChild(dd);
    }

    agregarDato('ISBN', libro.isbn);
    agregarDato('Editorial', obtenerNombreEditorial(libro.editorialId));
    agregarDato('Género', obtenerTextoGenero(libro));
    agregarDato('Autores', obtenerNombresAutores(libro.autorIds));
    articulo.appendChild(dl);

    // Precio formateado en ARS.
    const precio = document.createElement('p');
    precio.className = 'tarjeta__precio';
    precio.textContent = formatearImporteARS(libro.precio);
    articulo.appendChild(precio);

    lista.appendChild(articulo);
  });
}

// Renderiza el listado de Libros desde el array libros (C-04).
function renderLibros() {
  const tabla = document.getElementById('libros-tabla');
  if (!tabla) {
    return;
  }
  while (tabla.firstChild) {
    tabla.removeChild(tabla.firstChild);
  }

  libros.forEach(function (libro) {
    const fila = document.createElement('tr');

    function agregarCelda(texto) {
      const celda = document.createElement('td');
      celda.textContent = texto;
      fila.appendChild(celda);
    }

    agregarCelda(libro.titulo);
    agregarCelda(libro.isbn);
    agregarCelda(obtenerNombreEditorial(libro.editorialId));
    agregarCelda(obtenerTextoGenero(libro));
    agregarCelda(obtenerNombresAutores(libro.autorIds));
    agregarCelda(formatearImporteARS(libro.precio));

    tabla.appendChild(fila);
  });

  const vacio = document.getElementById('libros-vacio');
  if (vacio) {
    vacio.hidden = libros.length > 0;
  }
}

// Renderiza el listado de Clientes desde el array clientes (C-04).
function renderClientes() {
  const tabla = document.getElementById('clientes-tabla');
  if (!tabla) {
    return;
  }
  while (tabla.firstChild) {
    tabla.removeChild(tabla.firstChild);
  }

  clientes.forEach(function (cliente) {
    const fila = document.createElement('tr');

    const celdaNombre = document.createElement('td');
    celdaNombre.textContent = cliente.nombreCompleto;
    const celdaEmail = document.createElement('td');
    celdaEmail.textContent = cliente.email;
    fila.appendChild(celdaNombre);
    fila.appendChild(celdaEmail);

    tabla.appendChild(fila);
  });

  const vacio = document.getElementById('clientes-vacio');
  if (vacio) {
    vacio.hidden = clientes.length > 0;
  }
}

// Parte DOM: re-renderiza el catálogo desde el array libros aplicando
// coincideTitulo sobre cada entrada. Crea o quita tarjetas dinámicamente.
function filtrarCatalogo() {
  const campo = document.getElementById('catalogo-busqueda');
  const lista = document.getElementById('catalogo-lista');
  const sinResultados = document.getElementById('catalogo-sin-resultados');
  const zonaEstado = document.getElementById('catalogo-resultados');
  if (!campo || !lista) {
    return;
  }
  const busqueda = campo.value;
  const librosFiltrados = libros.filter(function (libro) {
    return coincideTitulo(libro.titulo, busqueda);
  });
  renderCatalogo(librosFiltrados);

  const visibles = librosFiltrados.length;
  const total = libros.length;
  const vacio = document.getElementById('catalogo-vacio');
  if (vacio) {
    vacio.hidden = total > 0;
  }
  if (sinResultados) {
    sinResultados.hidden = !(total > 0 && visibles === 0);
  }

  if (zonaEstado) {
    const busquedaVacia = String(busqueda).trim() === '';
    zonaEstado.textContent = textoResultadosCatalogo(visibles, total, busquedaVacia);
  }
}

// Enter o clic en "Buscar": no recarga la página y vuelve a filtrar.
function alEnviarBusqueda(evento) {
  evento.preventDefault();
  filtrarCatalogo();
}

function iniciarFiltroCatalogo() {
  const formulario = document.getElementById('form-busqueda');
  const campo = document.getElementById('catalogo-busqueda');
  if (!formulario || !campo) {
    return;
  }
  campo.addEventListener('input', filtrarCatalogo);
  campo.addEventListener('change', filtrarCatalogo);
  formulario.addEventListener('submit', alEnviarBusqueda);
}

// ---------------------------------------------------------------------------
// Persistencia de datos de dominio (C-05): al arrancar, verifica si cada clave
// de dominio existe en localStorage. Si falta, carga el seed y lo guarda; si
// existe, usa lo guardado sin mezclar con seed.
// ---------------------------------------------------------------------------
function mostrarErrorPersistencia() {
  const aviso = document.getElementById('error-persistencia');
  if (aviso) {
    aviso.hidden = false;
  }
}

function iniciarPersistencia() {
  // Libros: usar seed si no hay nada guardado.
  const librosGuardados = cargar('libreria.libros');
  if (librosGuardados === null) {
    // JSON corrupto: usar seed y mostrar error.
    mostrarErrorPersistencia();
    guardar('libreria.libros', libros);
  } else if (librosGuardados !== undefined && Array.isArray(librosGuardados)) {
    // Se ignoran los elementos con forma inválida (no se reescribe la clave al arrancar).
    libros = librosGuardados.filter(esLibroGuardadoValido);
  } else {
    guardar('libreria.libros', libros);
  }

  // Clientes: usar seed si no hay nada guardado.
  const clientesGuardados = cargar('libreria.clientes');
  if (clientesGuardados === null) {
    mostrarErrorPersistencia();
    guardar('libreria.clientes', clientes);
  } else if (clientesGuardados !== undefined && Array.isArray(clientesGuardados)) {
    clientes = clientesGuardados.filter(esClienteGuardadoValido);
  } else {
    guardar('libreria.clientes', clientes);
  }

  // Ventas: iniciar vacío si no hay nada guardado.
  const ventasGuardadas = cargar('libreria.ventas');
  if (ventasGuardadas === null) {
    mostrarErrorPersistencia();
    guardar('libreria.ventas', ventas);
  } else if (ventasGuardadas !== undefined && Array.isArray(ventasGuardadas)) {
    ventas = ventasGuardadas.filter(esVentaGuardadaValida);
  } else {
    guardar('libreria.ventas', ventas);
  }
}

iniciarPersistencia();
iniciarNavegacion();
registrarFormulariosMaqueta();
iniciarTema();
iniciarSidebar();
iniciarFiltroCatalogo();

// ==========================================
// Helpers comunes de mensajes (correcciones Etapa 2)
// Todo texto de usuario entra al DOM con textContent (RN-GL-01).
// ==========================================

// Quita todos los hijos de un elemento (sin innerHTML).
function vaciarElemento(el) {
  while (el.firstChild) {
    el.removeChild(el.firstChild);
  }
}

// Muestra una lista de errores [{ campo, mensaje }] (o textos) en un contenedor role="alert".
function mostrarErrores(contenedor, errores) {
  if (!contenedor) {
    return;
  }
  vaciarElemento(contenedor);
  const intro = document.createElement('p');
  intro.textContent = 'Error: revisá estos datos.';
  const lista = document.createElement('ul');
  errores.forEach(function (error) {
    const item = document.createElement('li');
    item.textContent = typeof error === 'string' ? error : error.mensaje;
    lista.appendChild(item);
  });
  contenedor.appendChild(intro);
  contenedor.appendChild(lista);
  contenedor.hidden = false;
}

// Muestra un único texto de error (prefijo «Error:») en un contenedor role="alert".
function mostrarAvisoError(contenedor, texto) {
  if (!contenedor) {
    return;
  }
  vaciarElemento(contenedor);
  const parrafo = document.createElement('p');
  parrafo.textContent = texto;
  contenedor.appendChild(parrafo);
  contenedor.hidden = false;
}

// Muestra un mensaje de éxito en una zona role="status".
function mostrarMensajeExito(contenedor, texto) {
  if (!contenedor) {
    return;
  }
  contenedor.textContent = texto;
  contenedor.hidden = false;
}

// Vacía y oculta un contenedor de mensajes.
function ocultarMensaje(contenedor) {
  if (!contenedor) {
    return;
  }
  vaciarElemento(contenedor);
  contenedor.hidden = true;
}

// Aviso cuando el registro quedó en memoria pero no se pudo escribir en el navegador (D9).
const TEXTO_ERROR_GUARDADO =
  'Error: se registró en esta sesión, pero no se pudo guardar en el navegador. Se perderá al recargar la página.';

// Marca los controles con error (aria-invalid) y enfoca el primero.
// Para el grupo de autores se enfoca la primera casilla.
function marcarCamposInvalidos(errores) {
  let primero = null;
  errores.forEach(function (error) {
    const campo = document.getElementById(error.campo);
    if (!campo) {
      return;
    }
    campo.setAttribute('aria-invalid', 'true');
    if (primero === null) {
      primero = campo;
    }
  });
  if (primero) {
    const enfocable = primero.id === 'libro-autores' ? primero.querySelector('input') : primero;
    if (enfocable) {
      enfocable.focus();
    }
  }
}

// Quita aria-invalid de todos los controles de un formulario (y del fieldset de autores).
function limpiarCamposInvalidos(contenedor) {
  contenedor.querySelectorAll('[aria-invalid]').forEach(function (campo) {
    campo.removeAttribute('aria-invalid');
  });
}

// ---------------------------------------------------------------------------
// Validadores de forma de lo guardado en localStorage (puros).
// ---------------------------------------------------------------------------
function esObjetoPlano(valor) {
  return valor !== null && typeof valor === 'object' && !Array.isArray(valor);
}

function esNumeroFinito(valor) {
  return typeof valor === 'number' && Number.isFinite(valor);
}

function esLibroGuardadoValido(libro) {
  return esObjetoPlano(libro) &&
    typeof libro.id === 'string' &&
    typeof libro.titulo === 'string' &&
    typeof libro.isbn === 'string' &&
    typeof libro.editorialId === 'string' &&
    esNumeroFinito(libro.precio) &&
    Array.isArray(libro.autorIds);
}

function esClienteGuardadoValido(cliente) {
  return esObjetoPlano(cliente) &&
    typeof cliente.id === 'string' &&
    typeof cliente.nombreCompleto === 'string' &&
    typeof cliente.email === 'string';
}

function esRenglonGuardadoValido(renglon) {
  return esObjetoPlano(renglon) &&
    typeof renglon.libroId === 'string' &&
    typeof renglon.titulo === 'string' &&
    Number.isSafeInteger(renglon.cantidad) && renglon.cantidad > 0 &&
    esNumeroFinito(renglon.precioUnitario) &&
    esNumeroFinito(renglon.subtotal);
}

function esVentaGuardadaValida(venta) {
  return esObjetoPlano(venta) &&
    typeof venta.id === 'string' &&
    typeof venta.fecha === 'string' &&
    typeof venta.clienteId === 'string' &&
    typeof venta.clienteNombre === 'string' &&
    esNumeroFinito(venta.total) &&
    Array.isArray(venta.renglones) &&
    venta.renglones.length > 0 &&
    venta.renglones.every(esRenglonGuardadoValido);
}

// Escribe en .bienvenida__cantidad la cantidad real de libros (punto 18).
function actualizarContadorLibros() {
  const contador = document.querySelector('.bienvenida__cantidad');
  if (contador) {
    contador.textContent = String(libros.length);
  }
}

// ==========================================
// C-06: ALTA DE LIBROS
// ==========================================

// Reemplaza las opciones de un select con createElement; conserva la primera opción indicada.
function llenarOpciones(select, textoVacio, items) {
  vaciarElemento(select);
  const vacia = document.createElement('option');
  vacia.value = '';
  vacia.textContent = textoVacio;
  select.appendChild(vacia);
  items.forEach(function (item) {
    const opcion = document.createElement('option');
    opcion.value = item.id;
    opcion.textContent = item.nombre;
    select.appendChild(opcion);
  });
}

function poblarFormularioLibro() {
  const selectEditorial = document.getElementById('libro-editorial');
  const selectGenero = document.getElementById('libro-genero');
  const fieldsetAutores = document.getElementById('libro-autores');

  if (selectEditorial) {
    llenarOpciones(selectEditorial, 'Elegí una editorial', editoriales);
  }
  if (selectGenero) {
    llenarOpciones(selectGenero, 'Sin clasificar', generos);
  }

  if (fieldsetAutores) {
    vaciarElemento(fieldsetAutores);
    const leyenda = document.createElement('legend');
    leyenda.className = 'formulario__leyenda';
    leyenda.textContent = 'Autores';
    fieldsetAutores.appendChild(leyenda);

    autores.forEach(function (autor, indice) {
      const idCasilla = 'libro-autor-' + (indice + 1);
      const opcion = document.createElement('div');
      opcion.className = 'formulario__opcion';

      const casilla = document.createElement('input');
      casilla.type = 'checkbox';
      casilla.id = idCasilla;
      casilla.name = 'autorIds';
      casilla.value = autor.id;

      const etiqueta = document.createElement('label');
      etiqueta.setAttribute('for', idCasilla);
      etiqueta.textContent = autor.nombre;

      opcion.appendChild(casilla);
      opcion.appendChild(etiqueta);
      fieldsetAutores.appendChild(opcion);
    });
  }
}

// Función auxiliar para sacarle espacios y guiones al ISBN
function normalizarIsbn(isbn) {
  return String(isbn || '').replace(/[\s-]/g, '').toLowerCase();
}

// Función pura de validación. Devuelve [{ campo, mensaje }] (vacío si es válido).
function validarLibro(datos, listaLibros, listaEditoriales, listaGeneros, listaAutores) {
  const errores = [];

  // 1. Título obligatorio
  if (!datos.titulo || String(datos.titulo).trim() === '') {
    errores.push({ campo: 'libro-titulo', mensaje: 'El título es obligatorio.' });
  }

  // 2. ISBN obligatorio y único (sin espacios ni guiones, sin distinguir mayúsculas)
  const isbnLimpio = normalizarIsbn(datos.isbn);
  if (!isbnLimpio) {
    errores.push({ campo: 'libro-isbn', mensaje: 'El ISBN es obligatorio.' });
  } else if (listaLibros.some(function (l) { return normalizarIsbn(l.isbn) === isbnLimpio; })) {
    errores.push({ campo: 'libro-isbn', mensaje: 'El ISBN ya se encuentra registrado.' });
  }

  // 3. Precio numérico mayor a cero
  const precioNum = Number(datos.precio);
  if (String(datos.precio).trim() === '' || !Number.isFinite(precioNum) || precioNum <= 0) {
    errores.push({ campo: 'libro-precio', mensaje: 'El precio debe ser un número mayor a cero.' });
  }

  // 4. Editorial existente
  if (!datos.editorialId || !listaEditoriales.some(function (e) { return e.id === datos.editorialId; })) {
    errores.push({ campo: 'libro-editorial', mensaje: 'Debe seleccionar una editorial válida.' });
  }

  // 5. Al menos 1 autor y todos existentes (RN-LI-05)
  if (!Array.isArray(datos.autorIds) || datos.autorIds.length === 0) {
    errores.push({ campo: 'libro-autores', mensaje: 'Debe seleccionar al menos un autor.' });
  } else if (!datos.autorIds.every(function (id) { return listaAutores.some(function (a) { return a.id === id; }); })) {
    errores.push({ campo: 'libro-autores', mensaje: 'Alguno de los autores seleccionados no existe.' });
  }

  // 6. Género opcional (pero si se eligió uno, debe existir)
  if (datos.generoId && !listaGeneros.some(function (g) { return g.id === datos.generoId; })) {
    errores.push({ campo: 'libro-genero', mensaje: 'El género seleccionado no es válido.' });
  }

  return errores;
}

// Refresca todo lo que muestra libros tras un alta.
function refrescarVistasLibros() {
  renderLibros();
  filtrarCatalogo();
  actualizarContadorLibros();
  renderSelectorLibrosVenta();
}

function registrarHandlerAltaLibro() {
  const form = document.getElementById('form-libro');
  if (!form) {
    return;
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const divErrores = document.getElementById('libro-errores');
    const divMensaje = document.getElementById('libro-mensaje');

    // Un nuevo envío reemplaza los mensajes anteriores.
    ocultarMensaje(divErrores);
    ocultarMensaje(divMensaje);
    limpiarCamposInvalidos(form);

    const titulo = document.getElementById('libro-titulo').value;
    const isbn = document.getElementById('libro-isbn').value;
    const precio = document.getElementById('libro-precio').value;
    const editorialId = document.getElementById('libro-editorial').value;
    const generoId = document.getElementById('libro-genero').value || null;
    const autorIds = Array.from(form.querySelectorAll('input[name="autorIds"]:checked')).map(function (casilla) {
      return casilla.value;
    });

    const errores = validarLibro(
      { titulo: titulo, isbn: isbn, precio: precio, editorialId: editorialId, generoId: generoId, autorIds: autorIds },
      libros, editoriales, generos, autores
    );

    if (errores.length > 0) {
      mostrarErrores(divErrores, errores);
      marcarCamposInvalidos(errores);
      return;
    }

    const nuevoLibro = {
      id: 'lib-' + Date.now(),
      titulo: titulo.trim(),
      isbn: isbn.trim(),
      precio: Number(precio),
      editorialId: editorialId,
      generoId: generoId, // null = «Sin clasificar»
      autorIds: autorIds
    };

    libros.push(nuevoLibro);
    const guardado = guardar('libreria.libros', libros);

    form.reset();
    refrescarVistasLibros();

    if (guardado) {
      mostrarMensajeExito(divMensaje, 'Libro registrado con éxito.');
    } else {
      mostrarAvisoError(divErrores, TEXTO_ERROR_GUARDADO);
    }
  });
}

// ==========================================
// C-07: ALTA DE CLIENTES
// ==========================================

// Función pura de validación de clientes. Devuelve [{ campo, mensaje }].
function validarCliente(datos, listaClientes) {
  const errores = [];

  if (!datos.nombreCompleto || String(datos.nombreCompleto).trim() === '') {
    errores.push({ campo: 'cliente-nombre', mensaje: 'El nombre completo es obligatorio.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailLimpio = String(datos.email || '').trim().toLowerCase();

  if (!emailLimpio) {
    errores.push({ campo: 'cliente-email', mensaje: 'El email es obligatorio.' });
  } else if (!emailRegex.test(emailLimpio)) {
    errores.push({ campo: 'cliente-email', mensaje: 'El formato del email no es válido.' });
  } else if (listaClientes.some(function (c) { return c.email.trim().toLowerCase() === emailLimpio; })) {
    errores.push({ campo: 'cliente-email', mensaje: 'El email ya se encuentra registrado.' });
  }

  return errores;
}

// Refresca todo lo que muestra clientes tras un alta.
function refrescarVistasClientes() {
  renderClientes();
  renderSelectorClientesVenta();
}

function registrarHandlerAltaCliente() {
  const form = document.getElementById('form-cliente');
  if (!form) {
    return;
  }

  form.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const divErrores = document.getElementById('cliente-errores');
    const divMensaje = document.getElementById('cliente-mensaje');

    ocultarMensaje(divErrores);
    ocultarMensaje(divMensaje);
    limpiarCamposInvalidos(form);

    const nombreCompleto = document.getElementById('cliente-nombre').value;
    const email = document.getElementById('cliente-email').value;

    const errores = validarCliente({ nombreCompleto: nombreCompleto, email: email }, clientes);
    if (errores.length > 0) {
      mostrarErrores(divErrores, errores);
      marcarCamposInvalidos(errores);
      return;
    }

    clientes.push({
      id: 'cli-' + Date.now(),
      nombreCompleto: nombreCompleto.trim(),
      email: email.trim().toLowerCase()
    });
    const guardado = guardar('libreria.clientes', clientes);

    form.reset();
    refrescarVistasClientes();

    if (guardado) {
      mostrarMensajeExito(divMensaje, 'Cliente registrado con éxito.');
    } else {
      mostrarAvisoError(divErrores, TEXTO_ERROR_GUARDADO);
    }
  });
}

// ==========================================
// C-08: COMPOSICIÓN DE VENTA
// ==========================================

// Borrador de la venta en memoria: [{ libroId, cantidad }]. Precio y título se leen de `libros`.
let renglonesBorrador = [];

const TEXTO_ERROR_CANTIDAD = 'La cantidad debe ser un número entero mayor que cero.';

// Cantidad válida: solo dígitos, entero seguro y mayor que cero (rechaza 0, -1, 2.5, 1,5, 1e3 y vacío).
function esCantidadValida(texto) {
  const limpio = String(texto).trim();
  return /^\d+$/.test(limpio) && Number(limpio) > 0 && Number.isSafeInteger(Number(limpio));
}

function buscarLibroPorId(id) {
  return libros.find(function (libro) {
    return libro.id === id;
  });
}

// Reconstruye un select de Ventas con createElement conservando la selección si aún existe.
function renderSelectorVenta(select, textoVacio, items, textoOpcion) {
  if (!select) {
    return;
  }
  const seleccionado = select.value;
  vaciarElemento(select);
  const vacia = document.createElement('option');
  vacia.value = '';
  vacia.textContent = textoVacio;
  select.appendChild(vacia);
  items.forEach(function (item) {
    const opcion = document.createElement('option');
    opcion.value = item.id;
    opcion.textContent = textoOpcion(item);
    select.appendChild(opcion);
  });
  if (items.some(function (item) { return item.id === seleccionado; })) {
    select.value = seleccionado;
  }
}

function renderSelectorClientesVenta() {
  renderSelectorVenta(document.getElementById('venta-cliente'), 'Elegí un cliente', clientes, function (cliente) {
    return cliente.nombreCompleto + ' (' + cliente.email + ')';
  });
}

function renderSelectorLibrosVenta() {
  renderSelectorVenta(document.getElementById('venta-libro'), 'Elegí un libro', libros, function (libro) {
    return libro.titulo + ' — ' + formatearImporteARS(libro.precio);
  });
}

// Calcula el total del borrador (redondeado a 2 decimales) a partir de los precios actuales.
function calcularTotalBorrador() {
  const total = renglonesBorrador.reduce(function (suma, renglon) {
    const libro = buscarLibroPorId(renglon.libroId);
    return suma + (libro ? libro.precio * renglon.cantidad : 0);
  }, 0);
  return Math.round(total * 100) / 100;
}

function actualizarTotalVenta() {
  const total = document.getElementById('venta-total');
  if (total) {
    total.textContent = formatearImporteARS(calcularTotalBorrador());
  }
}

// Agrega un renglón al borrador o suma la cantidad si el libro ya está (IN-02, D6).
function agregarRenglonBorrador() {
  const selectLibro = document.getElementById('venta-libro');
  const inputCantidad = document.getElementById('venta-cantidad');
  const divErrores = document.getElementById('venta-errores');
  const divMensaje = document.getElementById('venta-mensaje');

  ocultarMensaje(divErrores);
  ocultarMensaje(divMensaje);
  selectLibro.removeAttribute('aria-invalid');
  inputCantidad.removeAttribute('aria-invalid');

  const errores = [];
  const libro = selectLibro.value ? buscarLibroPorId(selectLibro.value) : undefined;
  if (!libro) {
    errores.push({ campo: 'venta-libro', mensaje: 'Elegí un libro.' });
  }
  if (!esCantidadValida(inputCantidad.value)) {
    errores.push({ campo: 'venta-cantidad', mensaje: TEXTO_ERROR_CANTIDAD });
  }
  if (errores.length > 0) {
    mostrarErrores(divErrores, errores);
    marcarCamposInvalidos(errores);
    return;
  }

  const cantidad = Number(String(inputCantidad.value).trim());
  const existente = renglonesBorrador.find(function (renglon) {
    return renglon.libroId === libro.id;
  });
  if (existente) {
    existente.cantidad += cantidad;
  } else {
    renglonesBorrador.push({ libroId: libro.id, cantidad: cantidad });
  }

  selectLibro.value = '';
  inputCantidad.value = '1';
  renderRenglonesVenta();
}

function registrarHandlerAgregarDetalle() {
  const botonAgregar = document.getElementById('venta-agregar');
  const inputCantidad = document.getElementById('venta-cantidad');
  if (botonAgregar) {
    botonAgregar.addEventListener('click', function (evento) {
      evento.preventDefault();
      agregarRenglonBorrador();
    });
  }
  // Enter en la cantidad agrega el renglón y no confirma la venta.
  if (inputCantidad) {
    inputCantidad.addEventListener('keydown', function (evento) {
      if (evento.key === 'Enter') {
        evento.preventDefault();
        agregarRenglonBorrador();
      }
    });
  }
}

// Aplica la cantidad escrita en el input de un renglón: válida -> recalcula en el lugar; inválida -> error.
function aplicarCantidadRenglon(renglon, libro, input, celdaSubtotal) {
  const divErrores = document.getElementById('venta-errores');
  if (esCantidadValida(input.value)) {
    renglon.cantidad = Number(String(input.value).trim());
    input.removeAttribute('aria-invalid');
    celdaSubtotal.textContent = formatearImporteARS(Math.round(libro.precio * renglon.cantidad * 100) / 100);
    actualizarTotalVenta();
    ocultarMensaje(divErrores);
  } else {
    input.setAttribute('aria-invalid', 'true');
    mostrarErrores(divErrores, [{
      campo: input.id,
      mensaje: 'La cantidad de "' + libro.titulo + '" debe ser un número entero mayor que cero.'
    }]);
  }
}

// Dibuja el borrador de la venta con createElement/textContent (sin innerHTML).
function renderRenglonesVenta() {
  const cuerpo = document.getElementById('venta-renglones');
  const vacio = document.getElementById('venta-renglones-vacio');
  if (!cuerpo) {
    return;
  }
  vaciarElemento(cuerpo);

  renglonesBorrador = renglonesBorrador.filter(function (renglon) {
    return buscarLibroPorId(renglon.libroId) !== undefined;
  });
  if (vacio) {
    vacio.hidden = renglonesBorrador.length > 0;
  }

  renglonesBorrador.forEach(function (renglon, indice) {
    const libro = buscarLibroPorId(renglon.libroId);
    const fila = document.createElement('tr');

    const celdaTitulo = document.createElement('td');
    celdaTitulo.textContent = libro.titulo;

    const celdaCantidad = document.createElement('td');
    const idInput = 'venta-renglon-cantidad-' + (indice + 1);
    const etiqueta = document.createElement('label');
    etiqueta.className = 'solo-lectores';
    etiqueta.setAttribute('for', idInput);
    etiqueta.textContent = 'Cantidad de ' + libro.titulo;
    const input = document.createElement('input');
    input.type = 'number';
    input.id = idInput;
    input.className = 'formulario__control tabla__cantidad';
    input.min = '1';
    input.step = '1';
    input.setAttribute('inputmode', 'numeric');
    input.value = String(renglon.cantidad);
    celdaCantidad.appendChild(etiqueta);
    celdaCantidad.appendChild(input);

    const celdaPrecio = document.createElement('td');
    celdaPrecio.textContent = formatearImporteARS(libro.precio);

    const celdaSubtotal = document.createElement('td');
    celdaSubtotal.textContent = formatearImporteARS(Math.round(libro.precio * renglon.cantidad * 100) / 100);

    const celdaAccion = document.createElement('td');
    const botonQuitar = document.createElement('button');
    botonQuitar.type = 'button';
    botonQuitar.className = 'boton boton--secundario';
    botonQuitar.appendChild(document.createTextNode('Quitar'));
    const textoLector = document.createElement('span');
    textoLector.className = 'solo-lectores';
    textoLector.textContent = ' ' + libro.titulo;
    botonQuitar.appendChild(textoLector);
    celdaAccion.appendChild(botonQuitar);

    input.addEventListener('change', function () {
      aplicarCantidadRenglon(renglon, libro, input, celdaSubtotal);
    });
    // Enter aplica el cambio y no confirma la venta (envío implícito).
    input.addEventListener('keydown', function (evento) {
      if (evento.key === 'Enter') {
        evento.preventDefault();
        aplicarCantidadRenglon(renglon, libro, input, celdaSubtotal);
      }
    });
    botonQuitar.addEventListener('click', function () {
      renglonesBorrador.splice(renglonesBorrador.indexOf(renglon), 1);
      ocultarMensaje(document.getElementById('venta-errores'));
      renderRenglonesVenta();
      const selectLibro = document.getElementById('venta-libro');
      if (selectLibro) {
        selectLibro.focus();
      }
    });

    fila.appendChild(celdaTitulo);
    fila.appendChild(celdaCantidad);
    fila.appendChild(celdaPrecio);
    fila.appendChild(celdaSubtotal);
    fila.appendChild(celdaAccion);
    cuerpo.appendChild(fila);
  });

  actualizarTotalVenta();
}

// Relee los inputs de cantidad de los renglones y valida todos. Devuelve [{ campo, mensaje }].
function sincronizarCantidadesBorrador() {
  const errores = [];
  const inputs = document.querySelectorAll('#venta-renglones input');
  renglonesBorrador.forEach(function (renglon, indice) {
    const input = inputs[indice];
    if (!input) {
      return;
    }
    if (esCantidadValida(input.value)) {
      renglon.cantidad = Number(String(input.value).trim());
      input.removeAttribute('aria-invalid');
    } else {
      const libro = buscarLibroPorId(renglon.libroId);
      input.setAttribute('aria-invalid', 'true');
      errores.push({
        campo: input.id,
        mensaje: 'La cantidad de "' + (libro ? libro.titulo : renglon.libroId) + '" debe ser un número entero mayor que cero.'
      });
    }
  });
  return errores;
}

// ==========================================
// C-09: CONFIRMACIÓN DE VENTA
// ==========================================

// Siguiente id correlativo: V-0001, V-0002... (el mayor número existente + 1). Ignora ids con otra forma.
function calcularSiguienteIdVenta(listaVentas) {
  let maximo = 0;
  listaVentas.forEach(function (venta) {
    const coincidencia = /^V-(\d+)$/.exec(venta && venta.id);
    if (coincidencia) {
      maximo = Math.max(maximo, Number(coincidencia[1]));
    }
  });
  return 'V-' + String(maximo + 1).padStart(4, '0');
}

// Valida una venta antes de confirmarla. Devuelve [{ campo, mensaje }].
function validarVenta(clienteId, renglones, listaClientes, listaLibros) {
  const errores = [];
  if (!clienteId) {
    errores.push({ campo: 'venta-cliente', mensaje: 'Elegí un cliente para la venta.' });
  } else if (!listaClientes.some(function (c) { return c.id === clienteId; })) {
    errores.push({ campo: 'venta-cliente', mensaje: 'El cliente elegido no existe.' });
  }
  if (renglones.length === 0) {
    errores.push({ campo: 'venta-libro', mensaje: 'Agregá al menos un libro a la venta.' });
  }
  renglones.forEach(function (renglon) {
    const libro = listaLibros.find(function (l) { return l.id === renglon.libroId; });
    if (!libro) {
      errores.push({ campo: 'venta-libro', mensaje: 'Un libro de la venta ya no existe.' });
    } else if (!esCantidadValida(String(renglon.cantidad))) {
      errores.push({ campo: 'venta-libro', mensaje: 'La cantidad de "' + libro.titulo + '" debe ser un número entero mayor que cero.' });
    }
  });
  return errores;
}

// Arma la venta a guardar copiando título, cliente y precio (precio histórico, RN-VE-08).
function construirVenta(clienteId, renglones, listaLibros, listaClientes, listaVentas, fechaISO) {
  const cliente = listaClientes.find(function (c) { return c.id === clienteId; });
  const renglonesVenta = renglones.map(function (renglon) {
    const libro = listaLibros.find(function (l) { return l.id === renglon.libroId; });
    return {
      libroId: libro.id,
      titulo: libro.titulo,
      cantidad: renglon.cantidad,
      precioUnitario: libro.precio,
      subtotal: Math.round(libro.precio * renglon.cantidad * 100) / 100
    };
  });
  const total = renglonesVenta.reduce(function (suma, renglon) {
    return suma + renglon.subtotal;
  }, 0);
  return {
    id: calcularSiguienteIdVenta(listaVentas),
    fecha: fechaISO,
    clienteId: clienteId,
    clienteNombre: cliente.nombreCompleto,
    renglones: renglonesVenta,
    total: Math.round(total * 100) / 100
  };
}

function registrarHandlerConfirmarVenta() {
  const formVenta = document.getElementById('form-venta');
  if (!formVenta) {
    return;
  }

  formVenta.addEventListener('submit', function (evento) {
    evento.preventDefault();

    const selectCliente = document.getElementById('venta-cliente');
    const divErrores = document.getElementById('venta-errores');
    const divMensaje = document.getElementById('venta-mensaje');

    ocultarMensaje(divErrores);
    ocultarMensaje(divMensaje);
    selectCliente.removeAttribute('aria-invalid');
    document.getElementById('venta-libro').removeAttribute('aria-invalid');

    const erroresCantidad = sincronizarCantidadesBorrador();
    const errores = validarVenta(selectCliente.value, renglonesBorrador, clientes, libros);
    // Tras sincronizar, el borrador solo tiene cantidades válidas: las inválidas figuran en erroresCantidad.
    const todos = errores.concat(erroresCantidad);

    if (todos.length > 0) {
      mostrarErrores(divErrores, todos);
      marcarCamposInvalidos(todos);
      return;
    }

    const venta = construirVenta(selectCliente.value, renglonesBorrador, libros, clientes, ventas, new Date().toISOString());
    ventas.push(venta);
    const guardado = guardar('libreria.ventas', ventas);

    renglonesBorrador = [];
    formVenta.reset();
    renderSelectorClientesVenta();
    renderSelectorLibrosVenta();
    renderRenglonesVenta();
    renderHistorialVentas();

    if (guardado) {
      mostrarMensajeExito(divMensaje, 'Venta ' + venta.id + ' registrada correctamente.');
    } else {
      mostrarAvisoError(divErrores, TEXTO_ERROR_GUARDADO);
    }
  });
}

// ==========================================
// C-10: HISTORIAL DE VENTAS
// ==========================================

// Número de una venta a partir de su id (V-0007 -> 7); 0 si el id no tiene esa forma.
function numeroDeVenta(venta) {
  const coincidencia = /^V-(\d+)$/.exec(venta.id);
  return coincidencia ? Number(coincidencia[1]) : 0;
}

function agregarCeldaTexto(fila, texto) {
  const celda = document.createElement('td');
  celda.textContent = texto;
  fila.appendChild(celda);
  return celda;
}

// Lista las ventas de la más reciente a la más antigua, sin modificar el array guardado (D1).
function renderHistorialVentas() {
  const cuerpo = document.getElementById('historial-tabla');
  const vacio = document.getElementById('historial-vacio');
  if (!cuerpo) {
    return;
  }
  vaciarElemento(cuerpo);
  if (vacio) {
    vacio.hidden = ventas.length > 0;
  }

  const ordenadas = ventas.slice().sort(function (a, b) {
    return numeroDeVenta(b) - numeroDeVenta(a);
  });

  ordenadas.forEach(function (venta) {
    const fila = document.createElement('tr');

    agregarCeldaTexto(fila, venta.id);

    const celdaFecha = document.createElement('td');
    const tiempo = document.createElement('time');
    tiempo.setAttribute('datetime', venta.fecha);
    tiempo.textContent = formatearFecha(venta.fecha);
    celdaFecha.appendChild(tiempo);
    fila.appendChild(celdaFecha);

    agregarCeldaTexto(fila, venta.clienteNombre);
    agregarCeldaTexto(fila, formatearImporteARS(venta.total));

    const celdaAccion = document.createElement('td');
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton boton--secundario';
    boton.textContent = 'Ver detalle de ' + venta.id;
    boton.addEventListener('click', function () {
      mostrarDetalleVenta(venta.id);
    });
    celdaAccion.appendChild(boton);
    fila.appendChild(celdaAccion);

    cuerpo.appendChild(fila);
  });
}

// Agrega "texto" + un span.tabla__id con el id de la venta (sin partirse en el guion).
function escribirTituloConId(elemento, texto, id) {
  vaciarElemento(elemento);
  elemento.appendChild(document.createTextNode(texto));
  const span = document.createElement('span');
  span.className = 'tabla__id';
  span.textContent = id;
  elemento.appendChild(span);
}

// Muestra el detalle con los valores guardados en la venta (nunca el precio actual del catálogo).
function mostrarDetalleVenta(id) {
  const venta = ventas.find(function (v) {
    return v.id === id;
  });
  const panel = document.getElementById('historial-detalle');
  if (!venta || !panel) {
    return;
  }

  const titulo = panel.querySelector('.detalle-venta__titulo');
  const caption = panel.querySelector('caption');
  const cuerpo = panel.querySelector('tbody');
  const total = panel.querySelector('.detalle-venta__total strong');

  escribirTituloConId(titulo, 'Detalle de la venta ', venta.id);
  escribirTituloConId(caption, 'Renglones de la venta ', venta.id);

  vaciarElemento(cuerpo);
  venta.renglones.forEach(function (renglon) {
    const fila = document.createElement('tr');
    agregarCeldaTexto(fila, renglon.titulo);
    agregarCeldaTexto(fila, String(renglon.cantidad));
    agregarCeldaTexto(fila, formatearImporteARS(renglon.precioUnitario));
    agregarCeldaTexto(fila, formatearImporteARS(renglon.subtotal));
    cuerpo.appendChild(fila);
  });
  total.textContent = formatearImporteARS(venta.total);

  panel.hidden = false;
  titulo.focus();
}

// ==========================================
// INICIALIZADOR
// ==========================================
document.addEventListener('DOMContentLoaded', function () {
  poblarFormularioLibro();
  registrarHandlerAltaLibro();
  registrarHandlerAltaCliente();
  renderSelectorClientesVenta();
  renderSelectorLibrosVenta();
  registrarHandlerAgregarDetalle();
  renderRenglonesVenta();
  registrarHandlerConfirmarVenta();
  renderHistorialVentas();
  actualizarContadorLibros();
});
