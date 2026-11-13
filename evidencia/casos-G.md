# Evidencia de los casos G

Pruebas hechas contra la URL pública, a través del mismo proxy que usa el frontend (`/api/...`).

- URL donde se hicieron las pruebas: https://calculadora-libreria-web.a2qkmo.easypanel.host/ (dominio anterior; sigue activo)
- URL pública actual: https://editorial-codex.a2qkmo.easypanel.host/ (mismo servicio, mismos datos)
- Fecha: 13/11/2026, 16:06 (hora de Argentina)
- Las respuestas se recortaron a los campos relevantes.

## G-01 · Catálogo

| Prueba | Pedido | Estado | Resultado |
|---|---|---|---|
| Búsqueda por título | `GET /api/libros/?titulo=faro&limit=10&offset=0` | 200 | 1 libro: *La casa del faro* (id 3) |
| Página 1 | `GET /api/libros/?limit=5&offset=0` | 200 | ids 1 a 5 |
| Página 2 | `GET /api/libros/?limit=5&offset=5` | 200 | ids 6 a 10 |
| Sin coincidencias | `GET /api/libros/?titulo=zzzinexistente&limit=10&offset=0` | 200 | `[]`; el front muestra el mensaje de "sin resultados" |
| Detalle | `GET /api/libros/3` | 200 | Incluye editorial, género y autorías |

Detalle del libro 3 (recortado):

```json
{
  "id": 3, "titulo": "La casa del faro", "isbn": "978-987-0001-01-1",
  "precio": "18500.00", "stock": 12,
  "editorial": { "id": 2, "nombre": "Ediciones del Faro" },
  "genero": { "id": 1, "nombre": "Novela" },
  "autores": [ { "autor_id": 4, "rol": "autor", "orden": 1, "autor": { "nombre": "Lucía Ferreyra" } } ]
}
```

## G-02 · Alta de libro

Hecho desde el formulario de la vista Libros, en la URL pública, el 13/11/2026 a las 17:20.

1. Alta: *El jardín de los relojes*, ISBN `978-987-0001-11-0`, precio 20500, stock 4, Ediciones del Faro, género Fantasía y dos autorías (Inés Montoya como autor, orden 1; Martín Ledesma como ilustrador, orden 2). El front muestra «Libro «El jardín de los relojes» registrado correctamente.», limpia el formulario y la tabla pasa a 13 filas.
2. Detalle: `GET /api/libros/13` responde **200**:

```json
{
  "id": 13, "titulo": "El jardín de los relojes", "isbn": "978-987-0001-11-0",
  "precio": "20500.00", "stock": 4,
  "editorial": { "id": 2, "nombre": "Ediciones del Faro" },
  "genero": { "id": 3, "nombre": "Fantasía" },
  "autores": [
    { "autor_id": 6, "rol": "autor", "orden": 1, "autor": { "nombre": "Inés Montoya" } },
    { "autor_id": 8, "rol": "ilustrador", "orden": 2, "autor": { "nombre": "Martín Ledesma" } }
  ]
}
```

3. ISBN repetido: `POST /api/libros/` con el mismo ISBN responde **409** con `"No se pudo guardar el libro: ISBN, relaciones o datos en conflicto"`. El front muestra el mensaje arriba del formulario y al lado del ISBN, y conserva lo que se había escrito.
4. Sin recargar, el libro aparece en el catálogo (el contador pasa de 12 a 13) y en el selector de libros de Ventas. Como no tiene portada propia, se muestra la portada de respaldo.
5. Terminada la prueba, el libro se borró con `DELETE /api/libros/13` (**204**) para que el catálogo de demostración quede con los 12 libros que tienen portada. La evidencia de arriba es la del momento del alta.

## G-03 · Alta de cliente

Hecho desde el formulario de la vista Clientes, en la URL pública, el 13/11/2026 a las 17:20.

1. Alta: Lucía Gómez, `lucia.gomez@example.com`. El front muestra «Cliente «Lucía Gómez» registrado correctamente.».
2. Recuperarlo por ID: `GET /api/clientes/2` responde **200** con `{ "id": 2, "nombre": "Lucía Gómez", "email": "lucia.gomez@example.com", "perfil": null }`.
3. Email repetido: `POST /api/clientes/` con el mismo email responde **409** con `"Ya existe un cliente con ese email"`. El front muestra el mismo mensaje junto al campo email.
4. Sin recargar, la clienta aparece en el selector de clientes de Ventas.

## G-04 · Venta

`POST /api/ventas/` con dos renglones:

```json
{ "cliente_id": 1, "renglones": [ { "libro_id": 3, "cantidad": 1 }, { "libro_id": 4, "cantidad": 2 } ] }
```

Respuesta **201**:

```json
{
  "id": 3, "cliente": { "id": 1, "nombre": "Mateo" },
  "renglones": [
    { "libro_id": 3, "titulo": "La casa del faro", "cantidad": 1, "precio_unitario": "18500.00", "subtotal": "18500.00" },
    { "libro_id": 4, "titulo": "Estrellas de papel", "cantidad": 2, "precio_unitario": "21000.00", "subtotal": "42000.00" }
  ],
  "total": "60500.00"
}
```

Después de recargar la página, la venta figura en el historial con total $ 60.500,00 y `GET /api/ventas/3` devuelve el mismo detalle (200).

Como dice la consigna, el stock es un dato del catálogo y el alta de una venta no lo descuenta: los libros 3 y 4 siguen con stock 12 y 8.

## G-05 · Precio histórico

1. `PATCH /api/libros/4` con `{ "precio": "23000.00" }`: **200**, el libro queda con precio 23000.00.
2. `GET /api/ventas/3`: **200**, el renglón del libro 4 conserva `precio_unitario` 21000.00, `subtotal` 42000.00 y el total 60500.00.
3. Se volvió a dejar el precio del libro 4 en 21000.00 con otro `PATCH` para no alterar el catálogo de demostración.

## G-06 · Rechazo

| Prueba | Cuerpo | Estado | Respuesta |
|---|---|---|---|
| Libro inexistente | `{ "cliente_id": 1, "renglones": [ { "libro_id": 9999, "cantidad": 1 } ] }` | 409 | `"Uno o más libros solicitados no existen en el catálogo"` |
| Renglones repetidos | `{ "cliente_id": 1, "renglones": [ { "libro_id": 3, "cantidad": 1 }, { "libro_id": 3, "cantidad": 1 } ] }` | 422 | `"Value error, No se puede repetir un libro en la venta"` (en `body.renglones`) |

El historial tenía 2 ventas antes de los dos intentos y siguió con 2 después: ninguno de los rechazos guardó nada.

## G-07 · Despliegue

| Prueba | Pedido | Estado | Respuesta |
|---|---|---|---|
| La URL pública abre por HTTPS | `GET /` | 200 | Página de Editorial Codex con certificado válido |
| Salud (lista) | `GET /api/health/ready` | 200 | `{ "estado": "lista" }` |
| Salud (viva) | `GET /api/health/live` | 200 | `{ "estado": "vivo" }` |

La imagen del frontend se construyó en Easypanel a partir de `frontend/Dockerfile` (servicio `libreria-web`).

Revisión del 13/11/2026 a las 19:40, después de implementar `442250f` en `libreria-web` y de dejar `editorial-codex` como dominio principal. El contenedor de la API no se redesplegó en esta pasada; la base está en el volumen de `calculadora_db`.

| Prueba | Pedido | Estado | Resultado |
|---|---|---|---|
| Salud tras el redespliegue del front | `GET /api/health/ready` | 200 | `{"estado":"lista"}` |
| Catálogo | `GET /api/libros/?limit=100` | 200 | 12 libros |
| Clientes | `GET /api/clientes/?limit=100` | 200 | ids 1 y 2 |
| Venta histórica | `GET /api/ventas/3` | 200 | total `60500.00`; el libro 4 sigue en `21000.00` |
