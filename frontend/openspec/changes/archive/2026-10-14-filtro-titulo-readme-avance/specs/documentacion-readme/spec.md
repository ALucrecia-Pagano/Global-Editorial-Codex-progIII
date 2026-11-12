# documentacion-readme

## Purpose

Define el contenido obligatorio del `README.md` de Editorial Codex como documento de entrega: lo que necesita el docente para abrir y evaluar el proyecto y lo que necesita el equipo de la Etapa 2 para continuarlo sin adivinar.

## ADDED Requirements

### Requirement: Datos de entrega
El `README.md` SHALL indicar el nombre de la librería (Editorial Codex), los cinco integrantes (Liendo Mateo, Avila Lucas, Pagano Amanda, Valentini Tiziano, Garcia Juan) y cómo abrir el proyecto: doble clic sobre `index.html`, sin servidor, sin npm ni instalación.

#### Scenario: Abrir siguiendo el README
- **WHEN** una persona sin contexto sigue solo las instrucciones de apertura del README
- **THEN** abre la página por `file://` sin instalar nada y ve la vista Catálogo

### Requirement: Qué es maqueta y qué funciona
El `README.md` SHALL tener una sección "Qué es maqueta y qué funciona" que, para cada una de las 5 vistas, indique qué controles son maqueta (no guardan ni calculan) y qué interacción ya funciona, incluyendo navegación, filtro por título, tema y sidebar, y qué `id` del contrato usa la Etapa 2 para conectarla.

#### Scenario: Lectura como compañero de Etapa 2
- **WHEN** un integrante de la Etapa 2 lee la sección
- **THEN** sabe que las altas de Libros y Clientes, la venta y el historial son maqueta, que el filtro por título y la navegación funcionan, y qué ganchos usar en cada vista

### Requirement: Decisiones de la Etapa 1
El `README.md` SHALL resumir las decisiones de la Etapa 1: una página con secciones, tema oscuro con alternativa clara, tapas generadas con CSS, contrato de `id`/`name` estable y la regla de filtro reutilizable con su firma y comportamiento, incluida la limitación de acentos.

#### Scenario: Reutilizar el filtro en la Etapa 2
- **WHEN** un integrante de la Etapa 2 busca cómo filtrar el array de libros
- **THEN** el README le indica la función `coincideTitulo(titulo, busqueda)`, que no toca el DOM, y qué devuelve con búsqueda vacía

### Requirement: Contrato confirmado contra el HTML final
La tabla de contrato `id`/`name` del `README.md` SHALL coincidir con la de `knowledge-base/08_arquitectura_propuesta.md` y con el `index.html` final de la Etapa 1, incluida la fila nueva `catalogo-resultados`, y SHALL registrar la fecha y el método de la confirmación.

#### Scenario: Cada fila existe
- **WHEN** se busca en `index.html` cada `id` y `name` de la tabla del README
- **THEN** todos existen y la tabla es idéntica a la de `knowledge-base/08`

### Requirement: Registro honesto de casos manuales
El `README.md` SHALL registrar los casos manuales 1 y 8 con sus pasos, el resultado esperado y el resultado observado. Un caso no ejecutado SHALL figurar como "Pendiente de ejecutar"; un caso que falla SHALL describir el comportamiento real; ningún caso SHALL marcarse como aprobado sin haberse ejecutado.

#### Scenario: Caso sin ejecutar
- **WHEN** el caso manual 1 todavía no se ejecutó en el navegador
- **THEN** su resultado observado dice "Pendiente de ejecutar" y su estado no es "Aprobado"

#### Scenario: Caso ejecutado con falla
- **WHEN** al ejecutar el caso un paso no se comporta como se espera
- **THEN** el README describe lo que se observó en ese paso, con fecha y navegador
