/**
 * Cliente HTTP centralizado para Editorial Codex.
 * Encapsula las peticiones hacia la API FastAPI a través del reverse proxy /api.
 *
 * Convención de rutas (FastAPI):
 *   - Colecciones: CON barra final -> Api.get('/libros/'), Api.post('/ventas/', datos)
 *   - Recursos por ID: SIN barra final -> Api.get('/libros/1'), Api.patch('/libros/1', datos)
 *     (Con barra de más en un ID, FastAPI responde 307 hacia el host interno y la petición falla en el navegador).
 *
 * Ejemplo de uso:
 *   // Obtener listado con parámetros
 *   const libros = await Api.get('/libros/', { limit: 10, offset: 0 });
 *
 *   // Obtener un libro por ID (sin barra final)
 *   const libro = await Api.get('/libros/1');
 *
 *   // Crear un registro
 *   const nuevoLibro = await Api.post('/libros/', { titulo: '...', isbn: '...' });
 *
 *   // Modificar parcialmente un recurso por ID (sin barra final)
 *   await Api.patch('/libros/1', { stock: 15 });
 */
(function () {
  'use strict';

  const BASE_URL = '/api';
  const STATUS_CONEXION = [0, 502, 503, 504];

  /**
   * Error personalizado para respuestas no exitosas de la API o problemas de conexión.
   */
  class ApiError extends Error {
    constructor(status, message, esConexion) {
      super(message);
      this.name = 'ApiError';
      this.status = status;
      this.esConexion = typeof esConexion === 'boolean'
        ? esConexion
        : STATUS_CONEXION.includes(status);
    }
  }

  /**
   * Determina si un status HTTP corresponde a un fallo de conexión o proxy caído.
   */
  function esErrorConexion(status) {
    return STATUS_CONEXION.includes(status);
  }

  /**
   * Construye la URL final combinando BASE_URL, la ruta y los parámetros de consulta.
   * Omite parámetros con valor undefined, null o cadena vacía ("").
   * Respeta si la ruta incluye o no barra final.
   */
  function construirUrl(ruta, parametros) {
    const normalizada = ruta.startsWith('/') ? ruta : '/' + ruta;
    const urlBase = BASE_URL + normalizada;

    if (!parametros || typeof parametros !== 'object') {
      return urlBase;
    }

    const searchParams = new URLSearchParams();
    for (const [clave, valor] of Object.entries(parametros)) {
      if (valor !== undefined && valor !== null && valor !== '') {
        searchParams.append(clave, String(valor));
      }
    }

    const query = searchParams.toString();
    return query ? `${urlBase}?${query}` : urlBase;
  }

  /**
   * Formatea el mensaje de error extrayendo la información de FastAPI (detail).
   */
  function formatearMensajeError(status, statusText, errorData) {
    if (esErrorConexion(status)) {
      return 'No se pudo conectar con el servidor.';
    }

    if (errorData && typeof errorData === 'object' && errorData.detail) {
      // 409 y otros errores con detail en formato string
      if (typeof errorData.detail === 'string' && errorData.detail.trim()) {
        return errorData.detail.trim();
      }

      // 422: lista de errores de validación de FastAPI / Pydantic
      if (Array.isArray(errorData.detail)) {
        const errores = errorData.detail.map(function (item) {
          const loc = Array.isArray(item.loc)
            ? item.loc.filter(function (segmento) { return segmento !== 'body'; }).join('.')
            : '';
          const msg = item.msg || 'valor inválido';
          return loc ? `${loc}: ${msg}` : msg;
        });
        return errores.join(', ');
      }
    }

    if (status === 404) {
      return 'No se encontró el recurso pedido.';
    }

    return statusText || `Error ${status}`;
  }

  /**
   * Ejecuta una petición HTTP genérica utilizando fetch.
   */
  async function solicitar(metodo, ruta, parametros, cuerpo) {
    const url = construirUrl(ruta, parametros);
    const opciones = {
      method: metodo,
      headers: {
        'Accept': 'application/json'
      }
    };

    if (cuerpo !== undefined && cuerpo !== null) {
      opciones.headers['Content-Type'] = 'application/json';
      opciones.body = JSON.stringify(cuerpo);
    }

    let respuesta;
    try {
      respuesta = await fetch(url, opciones);
    } catch (error) {
      throw new ApiError(0, 'No se pudo conectar con el servidor.', true);
    }

    // 204 No Content
    if (respuesta.status === 204) {
      return null;
    }

    const texto = await respuesta.text();
    if (!texto || !texto.trim()) {
      if (!respuesta.ok) {
        const esConexion = esErrorConexion(respuesta.status);
        const mensaje = esConexion
          ? 'No se pudo conectar con el servidor.'
          : (respuesta.status === 404 ? 'No se encontró el recurso pedido.' : (respuesta.statusText || `Error ${respuesta.status}`));
        throw new ApiError(respuesta.status, mensaje, esConexion);
      }
      return null;
    }

    let datos = null;
    try {
      datos = JSON.parse(texto);
    } catch {
      // Si el cuerpo no es JSON válido (ej. HTML de Nginx 502), no se rompe
      datos = null;
    }

    if (!respuesta.ok) {
      const esConexion = esErrorConexion(respuesta.status);
      const mensaje = formatearMensajeError(respuesta.status, respuesta.statusText, datos);
      throw new ApiError(respuesta.status, mensaje, esConexion);
    }

    return datos;
  }

  const Api = {
    /**
     * Realiza una petición GET.
     * @param {string} ruta - Ej. "/libros/" (colección) o "/libros/1" (por ID)
     * @param {Object} [parametros] - Parámetros de búsqueda opcionales
     */
    get: function (ruta, parametros) {
      return solicitar('GET', ruta, parametros, null);
    },

    /**
     * Realiza una petición POST.
     * @param {string} ruta - Ej. "/ventas/" o "/libros/"
     * @param {Object} cuerpo - Datos a enviar en formato JSON
     */
    post: function (ruta, cuerpo) {
      return solicitar('POST', ruta, null, cuerpo);
    },

    /**
     * Realiza una petición PATCH.
     * @param {string} ruta - Ej. "/libros/1" (por ID, sin barra final)
     * @param {Object} cuerpo - Campos a modificar en formato JSON
     */
    patch: function (ruta, cuerpo) {
      return solicitar('PATCH', ruta, null, cuerpo);
    }
  };

  // Exposición global en window
  window.Api = Api;
  window.ApiError = ApiError;
})();
