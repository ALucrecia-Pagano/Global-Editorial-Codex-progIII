# documentacion-readme Specification

## Purpose
Define el contenido obligatorio del `README.md` de Editorial Codex como documento de entrega: lo que necesita el docente para abrir y evaluar el proyecto y lo que necesita el equipo de la Etapa 2 para continuarlo sin adivinar.

## Requirements

### Requirement: Datos de entrega
El `README.md` SHALL indicar el nombre de la librería (Editorial Codex), los cinco integrantes (Liendo Mateo, Avila Lucas, Pagano Amanda, Valentini Tiziano, Garcia Juan) y cómo abrir el proyecto: doble clic sobre `index.html`, sin servidor, sin npm ni instalación.

#### Scenario: Abrir siguiendo el README
- **WHEN** una persona sin contexto sigue solo las instrucciones de apertura del README
- **THEN** abre la página por `file://` sin instalar nada y ve la vista Catálogo

### Requirement: Qué es maqueta y qué funciona
El `README.md` SHALL tener una sección "Qué es maqueta y qué funciona" que, en cada una de las 5 vistas, diga qué es maqueta, qué ya funciona y qué `id` usa. SHALL decir que altas, venta e historial funcionan, que C-01 a C-11 están hechos y que lo único pendiente es el extra C-12.

#### Scenario: Lectura como compañero de Etapa 2
- **WHEN** un integrante del equipo lee la sección después de este change
- **THEN** sabe que las altas de Libros y Clientes, la composición y confirmación de ventas y el historial funcionan, que C-11 ya no está pendiente y que el único extra fuera de la entrega es C-12

### Requirement: Decisiones de la Etapa 1
El `README.md` SHALL resumir las decisiones de la Etapa 1: una página con secciones, tema oscuro con alternativa clara, tapas generadas con CSS (que ahora quedan como respaldo de las portadas ilustradas opcionales), contrato de `id`/`name` estable y la regla de filtro reutilizable con su firma y comportamiento, incluida la limitación de acentos.

#### Scenario: Reutilizar el filtro en la Etapa 2
- **WHEN** un integrante de la Etapa 2 busca cómo filtrar el array de libros
- **THEN** el README le indica la función `coincideTitulo(titulo, busqueda)`, que no toca el DOM, y qué devuelve con búsqueda vacía

### Requirement: Contrato confirmado contra el HTML final
La tabla de contrato `id`/`name` del `README.md` SHALL coincidir con la de `knowledge-base/08_arquitectura_propuesta.md` y con el `index.html` final de la Etapa 1, incluida la fila nueva `catalogo-resultados`, y SHALL registrar la fecha y el método de la confirmación.

#### Scenario: Cada fila existe
- **WHEN** se busca en `index.html` cada `id` y `name` de la tabla del README
- **THEN** todos existen y la tabla es idéntica a la de `knowledge-base/08`

### Requirement: Registro honesto de casos manuales
El `README.md` SHALL registrar los casos manuales 1 a 8 con sus pasos, el resultado esperado y el resultado observado, y SHALL incluir un índice que indique en qué sección está el resultado de cada uno. Un caso no ejecutado SHALL figurar como "Pendiente de ejecutar"; un caso que falla SHALL describir el comportamiento real; ningún caso SHALL marcarse como aprobado sin haberse ejecutado.

#### Scenario: Caso sin ejecutar
- **WHEN** un caso manual todavía no se ejecutó en el navegador
- **THEN** su resultado observado dice "Pendiente de ejecutar" y su estado no es "Aprobado"

#### Scenario: Caso ejecutado con falla
- **WHEN** al ejecutar el caso un paso no se comporta como se espera
- **THEN** el README describe lo que se observó en ese paso, con fecha y navegador

#### Scenario: Índice de los ocho casos
- **WHEN** se lee «Estado del trabajo»
- **THEN** hay una fila para cada caso del 1 al 8 y cada fila apunta a la sección donde está el resultado observado

### Requirement: Altas, venta e historial documentados
El `README.md` SHALL explicar cómo funcionan las altas de libros y clientes (validaciones y refrescos), la composición y confirmación de la venta (cantidades, libro repetido, id correlativo) y el historial (orden, "Ver detalle" con valores guardados).

#### Scenario: Consulta del orden del historial
- **WHEN** se lee la sección del historial en el README
- **THEN** dice que las ventas se listan de la más reciente a la más antigua y que el detalle usa los importes guardados

### Requirement: Estructura de la venta guardada
El `README.md` SHALL listar la clave `libreria.ventas` en la tabla de claves de dominio y SHALL tener una sección propia, «Ventas guardadas (correcciones Etapa 2)», con la estructura exacta de cada venta: `{id, fecha, clienteId, clienteNombre, renglones: [{libroId, titulo, cantidad, precioUnitario, subtotal}], total}`, el tipo y formato de cada campo, qué pasa con ventas del formato anterior y con elementos inválidos, y el aviso cuando falla la escritura.

#### Scenario: Leer una venta en DevTools
- **WHEN** se compara una venta de `libreria.ventas` en DevTools con el README
- **THEN** cada campo de la venta y de sus renglones figura en «Ventas guardadas (correcciones Etapa 2)» con su significado

#### Scenario: Sección de C-05 intacta
- **WHEN** se compara la sección «Datos de dominio guardados en el navegador (C-05)» antes y después del change
- **THEN** no tiene otro cambio que, si hiciera falta, la fila de la clave `libreria.ventas`

### Requirement: Reproducción del caso de precio histórico
El `README.md` SHALL dar los pasos para reproducir el caso de precio histórico: confirmar una venta, anotar sus importes, cambiar solo el precio del libro dentro de `libreria.libros` desde DevTools > Application > Local Storage sin tocar `libreria.ventas`, recargar y abrir el detalle en Historial, donde deben verse los importes confirmados.

#### Scenario: Docente siguiendo los pasos
- **WHEN** el docente sigue solo esos pasos en una copia del proyecto
- **THEN** puede ubicar el libro en `libreria.libros`, cambiar su precio y comprobar el detalle de la venta en Historial

### Requirement: Plantilla de verificación de las correcciones de Etapa 2
El `README.md` SHALL tener una sección "Verificación manual — correcciones Etapa 2" que incluya los casos manuales 2 a 7 con los datos exactos de la consigna (el caso 5 es dos unidades a 1500 y una a 2000: subtotales 3000 y 2000, total 5000), un caso de seguridad con un título con HTML, uno de «Sin clasificar», uno de filtro al volver al Catálogo y uno del contador. La columna Resultado SHALL contener el resultado observado. Ningún caso SHALL figurar como aprobado sin haberse ejecutado.

#### Scenario: Plantilla sin resultados inventados
- **WHEN** se abre la sección
- **THEN** cada fila tiene pasos, resultado esperado y el resultado que se observó al ejecutarlo, o "Pendiente de ejecutar" si no se ejecutó

### Requirement: Decisiones de la Etapa 2 en el README
El `README.md` SHALL escribir las cuatro decisiones ya aplicadas: un libro repetido en la venta suma la cantidad al renglón existente; un JSON corrupto en una clave de dominio vuelve al seed y muestra el aviso de datos corruptos; el email usa la expresión `^[^\s@]+@[^\s@]+\.[^\s@]+$` y se guarda sin espacios exteriores y en minúsculas; los scripts son `js/data.js`, `js/storage.js` y `js/app.js`, clásicos y con `defer`, en ese orden.

#### Scenario: Leer las decisiones
- **WHEN** se lee «Estado del trabajo»
- **THEN** aparecen las cuatro decisiones con ese comportamiento

### Requirement: Consigna fuera del repositorio
El `README.md` y el resto de la documentación vigente SHALL dejar de indicar que la consigna se abre desde `docs/consigna-tpi.pdf`. Ese archivo SHALL no estar en el repositorio.

#### Scenario: No hay PDF de consigna
- **WHEN** se busca `docs/consigna-tpi.pdf` en el repositorio
- **THEN** el archivo no existe y el README dice que se retiró al cerrar el trabajo

### Requirement: Procedencia de las portadas ilustradas
El `README.md` SHALL documentar en «Recursos y procedencia» que las seis imágenes `assets/img/portadas/li-1.webp` a `li-6.webp` son ilustraciones generadas con IA (Gemini) para este proyecto, de uso educativo, guardadas localmente y sin pedidos externos. SHALL aclarar que la imagen ya contiene el título dibujado pero la tarjeta sigue mostrando el título, el autor y los datos como texto, y que la tapa CSS sigue existiendo como respaldo.

#### Scenario: Lectura de la procedencia
- **WHEN** se lee la sección «Recursos y procedencia» del README
- **THEN** indica que las seis portadas son generadas con IA (Gemini) para el proyecto, son locales y de uso educativo, y que la tapa CSS es el respaldo

### Requirement: Plantilla de verificación manual de portadas ilustradas
El `README.md` SHALL incluir una sección «Verificación manual — portadas ilustradas» con una tabla de pasos, resultado esperado y una columna Resultado inicialmente vacía. La tabla SHALL cubrir las seis portadas visibles, un libro nuevo con tapa CSS, una imagen renombrada con respaldo, 320 px, 1280 px, ambos temas y el filtro por título.

#### Scenario: Plantilla sin resultados inventados
- **WHEN** se abre la sección «Verificación manual — portadas ilustradas» antes de ejecutarla
- **THEN** cada fila tiene pasos y resultado esperado, y la columna Resultado está vacía o dice «Pendiente de ejecutar»

### Requirement: Registro honesto de la verificación de portadas
Al ejecutar la plantilla de portadas, cada fila SHALL registrar el resultado observado real. Una fila no ejecutada SHALL decir «Pendiente de ejecutar» y ninguna SHALL marcarse como aprobada sin haberse ejecutado.

#### Scenario: Registro de lo observado
- **WHEN** se ejecuta un paso de la plantilla
- **THEN** su fila registra el comportamiento real observado, aunque falle, sin marcarlo como aprobado si no se ejecutó
