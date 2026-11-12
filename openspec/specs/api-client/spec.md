# api-client Specification

## Purpose
Provee un cliente HTTP centralizado en JavaScript nativo (`window.Api`) para estandarizar las peticiones a la API backend, la serialización de parámetros y el formateo uniforme de errores.

## Requirements

### Requirement: Cliente HTTP centralizado para peticiones
El cliente HTTP nativo `window.Api` MUST exponer los métodos `get(ruta, params)`, `post(ruta, body)` y `patch(ruta, body)` utilizando `/api` como ruta base y enviando la cabecera `Accept: application/json`.

#### Scenario: Petición GET con parámetros de consulta
- **WHEN** se invoca `Api.get("/libros/", { limit: 10, offset: 0, search: "", extra: null, filter: undefined })`
- **THEN** se realiza una petición HTTP GET a `/api/libros/?limit=10&offset=0`, omitiendo los parámetros con valores nulos, indefinidos o cadenas vacías

#### Scenario: Petición POST con cuerpo JSON
- **WHEN** se invoca `Api.post("/ventas/", { cliente_id: 1, renglones: [] })`
- **THEN** se envía una petición HTTP POST a `/api/ventas/` con cabecera `Content-Type: application/json` y el cuerpo serializado

#### Scenario: Petición PATCH con cuerpo JSON por ID sin barra final
- **WHEN** se invoca `Api.patch("/libros/1", { stock: 5 })`
- **THEN** se envía una petición HTTP PATCH a `/api/libros/1` sin barra final para evitar redirecciones 307 de FastAPI

#### Scenario: Respuesta HTTP 204 o cuerpo vacío
- **WHEN** el servidor responde con status HTTP 204 No Content o cuerpo vacío
- **THEN** el método invocado resuelve devolviendo `null`

### Requirement: Normalización y formateo de errores
El cliente `window.Api` MUST lanzar una excepción de tipo `ApiError` con atributos `status`, `message` y `esConexion` ante respuestas no exitosas o fallas de red.

#### Scenario: Error con detalle en cadena de texto (ej. 409)
- **WHEN** el servidor responde con status 409 y cuerpo JSON `{"detail": "El ISBN ya se encuentra registrado."}`
- **THEN** se lanza `ApiError` con `status: 409`, `message: "El ISBN ya se encuentra registrado."` y `esConexion: false`

#### Scenario: Error de validación con lista de detalles (ej. 422)
- **WHEN** el servidor responde con status 422 y `detail` conteniendo una lista de errores de FastAPI
- **THEN** se lanza `ApiError` con `status: 422`, `esConexion: false` y un mensaje en español uniendo los textos de `msg` junto con el nombre del campo en `loc` sin incluir el prefijo 'body'

#### Scenario: Falla de conexión con el backend (status 0, 502, 503, 504)
- **WHEN** la llamada a `fetch` falla (status 0) o el proxy devuelve 502, 503 o 504 por caída del upstream
- **THEN** se lanza `ApiError` con el status real, `message: "No se pudo conectar con el servidor."` y `esConexion: true`

#### Scenario: Error 404 sin detalle
- **WHEN** el servidor responde con status 404 y sin campo `detail`
- **THEN** se lanza `ApiError` con `status: 404`, `message: "No se encontró el recurso pedido."` y `esConexion: false`

#### Scenario: Respuestas con cuerpo no JSON
- **WHEN** la respuesta no exitosa contiene un cuerpo HTML o texto no serializable como JSON
- **THEN** el procesamiento del cuerpo no arroja excepción de parseo y se devuelve un mensaje por defecto adecuado
