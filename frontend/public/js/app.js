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

  // Render inicial de listados desde los arrays si existen (C-04).
  if (id === 'libros' && typeof renderLibros === 'function') {
    renderLibros();
  }
  if (id === 'clientes' && typeof renderClientes === 'function') {
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

