# Reglas de Negocio

Cada regla tiene un código `RN-{DOMINIO}-{NN}`. Entre corchetes, la etapa responsable.

## Dominio: Catálogo (RN-CA)
- **RN-CA-01**: Cada libro muestra título, ISBN, editorial, género, autores y precio. [E1 maqueta / E2 render]
- **RN-CA-02**: Si un libro no tiene género, se muestra «Sin clasificar». [E1/E2]
- **RN-CA-03**: El catálogo se genera con JS a partir del array de libros. [E2]
- **RN-CA-04**: El filtro por título ignora mayúsculas/minúsculas y tildes u otros diacríticos ("orbita" encuentra "Órbita lenta"; la ñ se compara como n), busca coincidencias parciales y aplica `trim()` a la búsqueda. [E1] _(Tildes: agregado el 15/10/2026, change `pulido-final-etapa1`.)_
- **RN-CA-05**: Búsqueda vacía → catálogo completo. [E1]
- **RN-CA-06**: Búsqueda sin coincidencias → mensaje claro de "sin resultados". [E1]

## Dominio: Libros (RN-LI)
- **RN-LI-01**: Título e ISBN no pueden estar vacíos.
- **RN-LI-02**: El ISBN no puede existir ya en el conjunto local; se compara **sin espacios ni guiones**. No se valida dígito de control.
- **RN-LI-03**: El precio debe ser numérico y > 0.
- **RN-LI-04**: La editorial debe existir en los datos locales.
- **RN-LI-05**: Se selecciona ≥ 1 autor y todos deben existir.
- **RN-LI-06**: El género es opcional; el selector incluye «Sin clasificar»; si se asigna, debe existir.
- **RN-LI-07**: Las opciones de editorial, género y autores se generan desde los datos locales (editorial y género con `<select>`, autores con selector múltiple o checkboxes).

## Dominio: Clientes (RN-CL)
- **RN-CL-01**: Nombre completo y email no pueden estar vacíos.
- **RN-CL-02**: El email debe tener formato válido.
- **RN-CL-03**: No puede existir otro cliente con el mismo email (comparado con `trim()` y sin distinguir mayúsculas).

## Dominio: Formularios (RN-FO) — aplica a altas
- **RN-FO-01**: El envío se controla con `preventDefault`.
- **RN-FO-02**: Los errores se muestran cerca del formulario, como texto (no solo color).
- **RN-FO-03**: Solo se agrega el registro si **todas** las comprobaciones pasan.
- **RN-FO-04**: Tras un alta correcta, el listado y las opciones relacionadas (ej. selector de venta) se actualizan sin recargar.
- **RN-FO-05**: No se edita ni elimina ningún registro.

## Dominio: Ventas (RN-VE)
- **RN-VE-01**: Se selecciona un cliente existente.
- **RN-VE-02**: Se agrega ≥ 1 renglón con libro existente y cantidad **entera > 0** (rechaza 0, negativos y decimales).
- **RN-VE-03**: No se admiten libros repetidos en la misma venta: se suma a la cantidad del renglón existente o se informa el duplicado; nunca se crea otro renglón.
- **RN-VE-04**: Antes de confirmar se pueden cambiar cantidades y quitar renglones.
- **RN-VE-05**: Subtotal = cantidad × precio; total = suma de subtotales; importes con **2 decimales**.
- **RN-VE-06**: No se confirma una venta sin cliente, sin renglones o con cantidades inválidas.
- **RN-VE-07**: Al confirmar se registra id, fecha, cliente, renglones y total.
- **RN-VE-08**: El precio unitario se **copia** al renglón como valor histórico, junto con los datos descriptivos necesarios.
- **RN-VE-09**: La confirmación limpia el formulario y muestra un mensaje de resultado.

## Dominio: Historial (RN-HI)
- **RN-HI-01**: Muestra id, fecha, cliente y total de cada venta.
- **RN-HI-02**: Permite consultar los renglones de cada venta.
- **RN-HI-03**: Las ventas confirmadas no se editan ni eliminan desde la interfaz.
- **RN-HI-04**: Los importes del historial se leen de la venta guardada, nunca del precio actual del catálogo.

## Dominio: Persistencia (RN-PE) [E2]
- **RN-PE-01**: Libros, clientes y ventas se guardan en `localStorage`.
- **RN-PE-02**: Primer inicio carga ejemplos; aperturas posteriores recuperan lo guardado sin duplicar ejemplos ni ventas.
- **RN-PE-03**: El README documenta ubicación y estructura del catálogo guardado y los límites de `localStorage` (depende de navegador, perfil y ubicación de apertura; no se comparte entre usuarios).

## Dominio: Interfaz y accesibilidad (RN-UI) [E1]
- **RN-UI-01**: Encabezado, navegación y contenido principal con etiquetas semánticas.
- **RN-UI-02**: Cada campo tiene `<label>` asociada; los botones describen su acción.
- **RN-UI-03**: Las tablas tienen encabezados (`<th>`).
- **RN-UI-04**: Mensajes para listas vacías, búsquedas sin resultados y operaciones correctas o rechazadas.
- **RN-UI-05**: CSS en archivos externos, clases reutilizadas para elementos equivalentes.
- **RN-UI-06**: Layout con Flexbox o Grid.
- **RN-UI-07**: A 320 px y 1280 px: legible y sin scroll horizontal de la página; las tablas anchas scrollean en su propio contenedor.
- **RN-UI-08**: Foco visible; todo recorrible con teclado.
- **RN-UI-09**: Errores expresados con texto, no solo color.
- **RN-UI-10**: Imágenes informativas con `alt`; decorativas con `alt=""`.
- **RN-UI-11**: Los controles aún no funcionales en Etapa 1 se identifican como parte de la maqueta.

## Dominio: Excepciones globales (RN-GL)
- **RN-GL-01**: Los datos escritos por usuarios se insertan en el DOM como **texto** (`textContent`), nunca como HTML.
- **RN-GL-02**: Sin librerías, frameworks, CDNs, npm, build ni `fetch`.
- **RN-GL-03**: No se marca un caso manual como aprobado sin ejecutarlo; si falla, se registra el comportamiento real.
