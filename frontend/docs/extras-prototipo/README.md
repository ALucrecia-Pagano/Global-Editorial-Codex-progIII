# Extras del prototipo (insumo del change C-12 `extras-prototipo`)

> **Insumo del change C-12 `extras-prototipo` (opcional, posterior a la Etapa 2, depende de C-11). No es una spec vigente.**
> Estos documentos son texto plano; no forman parte de la estructura `openspec/`. Salieron del alcance de C-02 el 2026-10-14 para que la Etapa 1 cubra solo lo que pide el Ejercicio 2.

## Índice

- [decisiones-diseno.md](decisiones-diseno.md): decisiones D2 (navegación ampliada), D9 (carrusel), D10 (estrellas), D11 (formularios de acceso), D12 (toasts) y D13 (contenido estático nuevo), literales.
- [requisitos-y-tareas-retirados.md](requisitos-y-tareas-retirados.md): requisitos de `navegacion-vistas`, `maqueta-vistas` y `preferencias-locales` retirados, y los Grupos C y D de las tareas.
- `specs/carrusel-recomendados/spec.md`, `specs/puntuacion-libros/spec.md`, `specs/formularios-acceso/spec.md`, `specs/notificaciones-toast/spec.md`: las cuatro specs completas, literales.

## Decisiones ya tomadas por la usuaria (conservarlas en C-12)

- **Ids de vistas de detalle:** `#libro-li-N` (`libro-li-1` a `libro-li-6`), uno por libro del catálogo. `#libro-titulo` sigue abriendo Libros, no un detalle.
- **Ingresar:** un solo ítem en el menú, sin sesión ni menú de usuario; Registro se alcanza desde Ingresar y no tiene enlace propio en el menú. Nunca se guardan contraseñas ni datos personales. Campos: Ingresar (`ingresar-email`, `ingresar-clave`) y Registro (`registro-nombre`, `registro-email`, `registro-clave`, `registro-repetir`).
- **Inicio:** vista por defecto en C-12 (no en C-02). Conteos 6 libros, 2 géneros («Sin clasificar» no cuenta) y 3 escritores; libro destacado `li-2` "Estrellas de papel"; carrusel "Recomendados" con las 6 tarjetas.
- **Estrellas:** en el detalle, puntuación propia con radios y estrellas; en las tarjetas (catálogo y carrusel), estrellas de solo lectura dibujadas con CSS con valores fijos: li-1 = 4, li-2 = 5, li-3 = 3, li-4 = 4, li-5 = 3, li-6 = 5. **Limitación:** la puntuación de la tarjeta (dato ficticio) y la del detalle (personal, en `localStorage` bajo `libreria.preferencias.puntuaciones`) no se sincronizan; en la Etapa 2 hay que decidir si pasa a ser un campo `puntuacion` del libro o un promedio.
- **Escritores:** tarjetas con enlaces al detalle de cada uno de sus libros (Lucía Ferreyra: li-1 y li-4; Tomás Aguirre: li-2, li-4 y li-6; Inés Montoya: li-3 y li-5).
- **Menú:** `aria-current="true"` en el enlace padre (Catálogo en el detalle, Ingresar en Registro) mediante `VISTA_PADRE`; `"page"` solo en el enlace propio.
- **Migas de pan** estáticas en las vistas internas (menos Inicio).
- **Fondo de Ingresar y Registro:** el proyecto **no usa imágenes** (las `portada*.jpg` se eliminaron el 2026-10-14 y C-12 no las recibe). Si se quiere un fondo propio para esas vistas, debe resolverse **solo con CSS** (degradés sobre el fondo galáctico de C-02), con velo opaco para que el texto conserve el contraste.
- **Toasts** de confirmación en una zona `aria-live="polite"`, sin reemplazar los mensajes en línea.

## Cómo usarlo

Cuando se proponga C-12 (`/opsx:propose extras-prototipo`), leer estos archivos antes y trasladar lo que siga vigente a las specs y al diseño del nuevo change, adaptando el JS a la Etapa 2 (los datos ya salen de arrays y de `localStorage`).
