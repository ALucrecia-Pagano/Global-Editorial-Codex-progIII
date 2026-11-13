// Editorial Codex - preferencias de interfaz.
// Único acceso a localStorage: tema y estado de la barra lateral.
// Libros, clientes y ventas viven en la API. Al arrancar se borran las claves
// viejas del primer parcial, si el navegador todavía las tiene.

const PREFIJO_PREFERENCIAS = 'libreria.preferencias.';
const CLAVES_DOMINIO_RETIRADAS = ['libreria.libros', 'libreria.clientes', 'libreria.ventas'];

function retirarDatosDeDominio() {
  try {
    CLAVES_DOMINIO_RETIRADAS.forEach(function (clave) {
      window.localStorage.removeItem(clave);
    });
  } catch (error) {
    // Almacenamiento bloqueado: no queda nada que retirar.
  }
}

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

retirarDatosDeDominio();
