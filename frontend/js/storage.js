// Editorial Codex - repositorio de localStorage (C-05).
// Script clásico (se carga con defer). Antes de js/app.js.
// Único punto de acceso a localStorage para datos de dominio.
// Claves permitidas: libreria.libros, libreria.clientes, libreria.ventas.
// Todo acceso va envuelto en try/catch: si falla, la app sigue con valores por defecto.

// Lista blanca de claves de dominio que este repositorio gestiona.
const CLAVES_VALIDAS = ['libreria.libros', 'libreria.clientes', 'libreria.ventas'];

// Devuelve true si la clave está en la lista blanca.
function esClaveValida(clave) {
  return CLAVES_VALIDAS.includes(clave);
}

// Lee un valor de localStorage.
// Retorna:
//   - el valor parseado si la clave existe y su JSON es válido.
//   - undefined si la clave no existe (null en localStorage).
//   - null si la clave existe pero su JSON es corrupto/inválido (error de parseo).
// Si el almacenamiento está bloqueado, retorna undefined (se trata como ausencia).
function cargar(clave) {
  if (!esClaveValida(clave)) {
    return undefined;
  }
  let texto;
  try {
    texto = window.localStorage.getItem(clave);
  } catch (error) {
    // Almacenamiento bloqueado o inaccesible: se trata como ausencia.
    return undefined;
  }
  if (texto === null) {
    return undefined;
  }
  try {
    return JSON.parse(texto);
  } catch (error) {
    // JSON corrupto: la clave existe pero su contenido no es JSON válido.
    return null;
  }
}

// Escribe un valor en localStorage. Devuelve true si se pudo guardar.
function guardar(clave, datos) {
  if (!esClaveValida(clave)) {
    return false;
  }
  try {
    const texto = JSON.stringify(datos);
    window.localStorage.setItem(clave, texto);
    return true;
  } catch (error) {
    // Cuota excedida, almacenamiento bloqueado o cualquier otro fallo.
    return false;
  }
}
