# Spec Delta

## MODIFIED Requirements

### Requirement: Qué es maqueta y qué funciona
El `README.md` SHALL tener una sección "Qué es maqueta y qué funciona" que, en cada una de las 5 vistas, diga qué es maqueta, qué ya funciona y qué `id` usa. SHALL decir que altas, venta e historial funcionan, que C-01 a C-11 están hechos y que lo único pendiente es el extra C-12.

#### Scenario: Lectura como compañero de Etapa 2
- **WHEN** un integrante del equipo lee la sección después de este change
- **THEN** sabe que las altas de Libros y Clientes, la composición y confirmación de ventas y el historial funcionan, que C-11 ya no está pendiente y que el único extra fuera de la entrega es C-12

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

### Requirement: Plantilla de verificación de las correcciones de Etapa 2
El `README.md` SHALL tener una sección "Verificación manual — correcciones Etapa 2" que incluya los casos manuales 2 a 7 con los datos exactos de la consigna (el caso 5 es dos unidades a 1500 y una a 2000: subtotales 3000 y 2000, total 5000), un caso de seguridad con un título con HTML, uno de «Sin clasificar», uno de filtro al volver al Catálogo y uno del contador. La columna Resultado SHALL contener el resultado observado. Ningún caso SHALL figurar como aprobado sin haberse ejecutado.

#### Scenario: Plantilla sin resultados inventados
- **WHEN** se abre la sección
- **THEN** cada fila tiene pasos, resultado esperado y el resultado que se observó al ejecutarlo, o "Pendiente de ejecutar" si no se ejecutó

## ADDED Requirements

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
