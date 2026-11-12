# Modelo de Datos

Todas las entidades se representan como **arrays de objetos en JavaScript** con **identificadores estables** (Ejercicio 3). En Etapa 2 se persisten libros, clientes y ventas en `localStorage`.

## Dominios

- **Catálogo**: Libro, Editorial, Género, Autor.
- **Clientes**: Cliente.
- **Ventas**: Venta, Renglón.

## ERD

```
Editorial 1 ───< Libro >─── N:M ─── Autor
                   │
Género 0..1 ───────┘   (género opcional)

Cliente 1 ───< Venta 1 ───< Renglón >─── 1 Libro (referencia + copia histórica)
```

## Entidades

### Libro
| Atributo | Tipo | Notas |
|---|---|---|
| `id` | string/number | Estable, único |
| `titulo` | string | No vacío |
| `isbn` | string | No vacío; único comparando **sin espacios ni guiones** |
| `precio` | number | Numérico, > 0 |
| `editorialId` | id | Debe existir en editoriales |
| `generoId` | id \| null | Opcional; `null` = «Sin clasificar» |
| `autorIds` | id[] | ≥ 1; todos deben existir en autores |

### Editorial
`id`, `nombre`. Datos fijos (sin ABM).

### Género
`id`, `nombre`. Datos fijos (sin ABM).

### Autor
`id`, `nombre`. Datos fijos (sin ABM).

### Cliente
| Atributo | Tipo | Notas |
|---|---|---|
| `id` | string/number | Estable, único |
| `nombreCompleto` | string | No vacío (sin campo apellido separado) |
| `email` | string | No vacío, formato válido; único con `trim()` + sin distinguir mayúsculas |

### Venta (inmutable una vez confirmada)
| Atributo | Tipo | Notas |
|---|---|---|
| `id` | string | Correlativo `V-0001`, `V-0002`, … (DD-09) |
| `fecha` | string (ISO 8601) | Momento de confirmación; se muestra `dd/mm/aaaa hh:mm` (DD-11) |
| `clienteId` | id | Cliente existente |
| `clienteNombre` | string | Copia descriptiva para leer la venta |
| `renglones` | Renglón[] | ≥ 1 |
| `total` | number | Suma de subtotales |

### Renglón
| Atributo | Tipo | Notas |
|---|---|---|
| `libroId` | id | Libro existente; no repetido dentro de la venta |
| `titulo` | string | Copia descriptiva |
| `cantidad` | integer | Entero > 0 |
| `precioUnitario` | number | **Copia histórica** del precio al confirmar |
| `subtotal` | number | `cantidad × precioUnitario` |

> El historial **nunca** recalcula desde el precio actual del catálogo: usa `precioUnitario` del renglón.

> Todos los importes (`precio`, `precioUnitario`, `subtotal`, `total`) se guardan como `number` y se formatean **solo al mostrarlos** con `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })`, 2 decimales (DD-10).

## Seed data inicial (mínimos de la consigna)

| Entidad | Mínimo |
|---|---|
| Libros | 6 |
| Editoriales | 2 |
| Géneros | 2 |
| Autores | 3 |
| Clientes | 3 |

Requisitos: cada libro con editorial existente y ≥ 1 autor existente; al menos un libro **sin género** (para mostrar «Sin clasificar»). Sugerido: incluir libros con precio 1500 y 2000 para reproducir el caso manual de venta.

Para la **Etapa 1**, los listados e historial se maquetan con **datos estáticos de ejemplo en el HTML**; la estructura debe contemplar los campos y estados que luego usa JS.

## Persistencia (Etapa 2)

Claves de `localStorage` sugeridas (a definir y documentar en el README):

| Clave | Contenido |
|---|---|
| `libreria.libros` | Array de libros (catálogo guardado — donde el docente edita el precio) |
| `libreria.clientes` | Array de clientes |
| `libreria.ventas` | Array de ventas confirmadas |
| `libreria.preferencias.tema` | Preferencia de presentación de la **Etapa 1** (C-02): `"claro"` u `"oscuro"`. No es un dato de dominio; se lee con lista blanca y `try/catch`. |
| `libreria.preferencias.sidebar` | Preferencia de presentación de la **Etapa 1** (C-02): `"colapsada"` o `"expandida"`. No es un dato de dominio; se lee con lista blanca y `try/catch`. |

Primer inicio: si no hay datos guardados, se cargan los ejemplos. Siguientes aperturas: se recuperan los guardados **sin duplicar** los iniciales.
