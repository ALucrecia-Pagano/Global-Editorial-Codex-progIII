# Arquitectura Propuesta

## Patrones aplicados

| Patrón | Dónde | Por qué |
|---|---|---|
| SPA de una página con secciones (o multipágina) | `index.html` | La consigna permite ambas; ver [09 DD-01](09_decisiones_y_supuestos.md) |
| Estado en memoria → render | `js/app.js` | Una sola fuente de verdad (arrays); el DOM se regenera desde ahí |
| Funciones pequeñas con una responsabilidad | `js/` | Criterio de evaluación: funciones acotadas y nombres comprensibles |
| Validadores puros (input → lista de errores) | altas y ventas | Reutilizables y fáciles de verificar manualmente |
| Repositorio de `localStorage` (load/save por clave) | `js/` | Aísla la persistencia; facilita documentar claves en README |
| Clases CSS reutilizables (componentes: `.tarjeta`, `.boton`, `.formulario__campo`, `.tabla-contenedor`, `.mensaje`) | `css/styles.css` | Criterio: reutilizar clases para elementos equivalentes |
| Custom properties CSS (`:root { --color-... }`) | `css/styles.css` | Identidad visual coherente y fácil de ajustar |
| Mobile-first + media queries | `css/styles.css` | Garantiza 320 px; escala a 1280 px |

## Estructura de directorios

```
tpi-libreria-frontend/
├── index.html              # entrada; header + nav + main con las 5 vistas
├── css/
│   └── styles.css          # (puede dividirse: base.css, layout.css, components.css)
├── js/
│   └── app.js              # Etapa 1: filtro por título. Etapa 2 puede dividir en
│                           # data.js, storage.js, render.js, validators.js, ventas.js
├── img/                    # (opcional) recursos locales; registrar procedencia en README
├── docs/                   # consigna (fuente, no se modifica) + inspo/ con el prototipo propio (README)
├── knowledge-base/         # esta KB
├── openspec/               # specs y changes
└── README.md
```

Si se divide JS en varios archivos, se cargan con `<script src defer>` en orden (o `type="module"` — ver [10](10_preguntas_abiertas.md): los módulos ES no funcionan abriendo por `file://` en algunos navegadores).

### Contrato de maqueta (Etapa 1 → Etapa 2)

Para que la Etapa 2 conecte sin reescribir el HTML, la maqueta deja **ganchos estables**:
- `id` en cada formulario, campo, contenedor de listado, tabla y zona de mensajes (ej. `#catalogo-lista`, `#form-libro`, `#libro-isbn`, `#venta-renglones`, `#venta-total`, `#historial-tabla`).
- Contenedores de mensajes por vista (vacío / sin resultados / éxito / error) presentes en el HTML, ocultos con el atributo `hidden`.
- Un `name` en cada campo de formulario.
- Las filas/tarjetas estáticas de ejemplo siguen exactamente la estructura que el render de JS replicará.

**Confirmado por Amanda (2026-10-13, DD-08).** El change de maquetación copia esta tabla al `README.md` para que la Etapa 2 la consulte. Si la maqueta cambia algún nombre, se actualizan ambas tablas.

#### Tabla de contrato `id` / `name`

Los mensajes (`*-vacio`, `*-sin-resultados`, `*-errores`, `*-mensaje`) están siempre presentes en el HTML y se ocultan con `hidden`.

| Vista | Elemento | `id` | `name` |
|---|---|---|---|
| Global | Navegación principal | `nav-principal` | — |
| Global | Secciones de vista | `catalogo`, `libros`, `clientes`, `ventas`, `historial` | — |
| Global | Contenido principal (destino del skip-link) | `contenido` | — |
| Global | Botón de tema | `tema-alternar` | — |
| Global | Sidebar (`aside`, contiene `nav-principal`) | `sidebar` | — |
| Global | Botón colapsar sidebar (escritorio) | `sidebar-colapsar` | — |
| Global | Botón abrir menú (celular) | `menu-abrir` | — |
| Global | Botón cerrar menú (celular) | `menu-cerrar` | — |
| Global | Velo del menú móvil | `sidebar-velo` | — |
| Catálogo | Formulario de búsqueda | `form-busqueda` | — |
| Catálogo | Campo de búsqueda por título | `catalogo-busqueda` | `busqueda` |
| Catálogo | Contenedor de tarjetas | `catalogo-lista` | — |
| Catálogo | Zona de estado del filtro (anuncia resultados) | `catalogo-resultados` | — |
| Catálogo | Mensaje sin resultados | `catalogo-sin-resultados` | — |
| Catálogo | Mensaje catálogo vacío | `catalogo-vacio` | — |
| Libros | Formulario de alta | `form-libro` | — |
| Libros | Título | `libro-titulo` | `titulo` |
| Libros | ISBN | `libro-isbn` | `isbn` |
| Libros | Precio | `libro-precio` | `precio` |
| Libros | Editorial (`select`) | `libro-editorial` | `editorialId` |
| Libros | Género (`select`, incluye «Sin clasificar» con `value=""`) | `libro-genero` | `generoId` |
| Libros | Autores (`fieldset` de checkboxes) | `libro-autores` | `autorIds` (cada checkbox) |
| Libros | Errores del formulario | `libro-errores` | — |
| Libros | Mensaje de resultado | `libro-mensaje` | — |
| Libros | Cuerpo de tabla del listado | `libros-tabla` | — |
| Libros | Mensaje listado vacío | `libros-vacio` | — |
| Clientes | Formulario de alta | `form-cliente` | — |
| Clientes | Nombre completo | `cliente-nombre` | `nombreCompleto` |
| Clientes | Email | `cliente-email` | `email` |
| Clientes | Errores del formulario | `cliente-errores` | — |
| Clientes | Mensaje de resultado | `cliente-mensaje` | — |
| Clientes | Cuerpo de tabla del listado | `clientes-tabla` | — |
| Clientes | Mensaje listado vacío | `clientes-vacio` | — |
| Ventas | Formulario de venta | `form-venta` | — |
| Ventas | Cliente (`select`) | `venta-cliente` | `clienteId` |
| Ventas | Libro a agregar (`select`) | `venta-libro` | `libroId` |
| Ventas | Cantidad | `venta-cantidad` | `cantidad` |
| Ventas | Botón agregar renglón | `venta-agregar` | — |
| Ventas | Cuerpo de tabla de renglones | `venta-renglones` | — |
| Ventas | Mensaje sin renglones | `venta-renglones-vacio` | — |
| Ventas | Total | `venta-total` | — |
| Ventas | Botón confirmar venta | `venta-confirmar` | — |
| Ventas | Errores | `venta-errores` | — |
| Ventas | Mensaje de resultado | `venta-mensaje` | — |
| Historial | Cuerpo de tabla de ventas | `historial-tabla` | — |
| Historial | Mensaje historial vacío | `historial-vacio` | — |
| Historial | Panel de detalle de renglones | `historial-detalle` | — |

### Formato de datos mostrados (DD-09 a DD-11)

- **Importes**: se guardan como `number` y se formatean **solo al mostrarlos** con `new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2, maximumFractionDigits: 2 })`. Ej.: `$ 1.500,00`.
- **Fechas**: se guardan en ISO 8601 (`toISOString()`) y se muestran como `dd/mm/aaaa hh:mm`.
- **Id de venta**: correlativo `V-0001`, `V-0002`, …
- Los ejemplos estáticos de la Etapa 1 ya usan estos formatos.

## Seguridad

- **Autenticación/Autorización**: no aplica (sin login).
- **Validación de input**: en el cliente, solo con fines de práctica.
- **XSS**: todo dato ingresado por usuarios se inserta con `textContent` / `createElement`, nunca `innerHTML` con datos del usuario (RN-GL-01).
- **Secrets**: no hay.

## Accesibilidad

- Landmarks: `header`, `nav`, `main`, `section` con encabezados.
- `label for` en cada campo; `fieldset`/`legend` para autores (checkboxes).
- `:focus-visible` con contorno de alto contraste; no quitar `outline` sin reemplazo.
- Mensajes de error con texto + ícono/prefijo; zona `aria-live="polite"` para resultados.
- Tablas dentro de `.tabla-contenedor { overflow-x: auto; }`.

## Variables de entorno

No aplica.

## Verificación

Manual en navegador (sin tests automáticos ni TDD): 320 px, 1280 px y teclado. Resultados en el README.
