# catalogo-dinamico Specification

## Purpose

Renderiza el catálogo de libros y los listados iniciales de Libros y Clientes de forma dinámica desde arrays de datos locales en el navegador, sin depender de HTML estático maquetado.

## Requirements

### Requirement: Arrays de datos con ids estables
El sistema SHALL mantener arrays con ids estables para libros, editoriales, géneros, autores y clientes, con al menos 6 libros, 2 editoriales, 2 géneros, 3 autores y 3 clientes.

#### Scenario: Arrays iniciales cargados
- **WHEN** se abre la aplicación por primera vez
- **THEN** existen los arrays `libros`, `editoriales`, `generos`, `autores` y `clientes` con los datos iniciales definidos

### Requirement: Render del catálogo desde el array libros
El catálogo SHALL renderizarse en `#catalogo-lista` a partir del array `libros` usando `createElement` y `textContent`, mostrando título, ISBN, editorial, género, autores y precio formateado en ARS.

#### Scenario: Tarjetas generadas desde el array
- **WHEN** se carga la vista Catálogo
- **THEN** se genera una tarjeta por cada libro en el array `libros`, con los mismos datos y clases que las tarjetas estáticas de C-01

#### Scenario: Libro sin género
- **WHEN** un libro tiene `generoId` igual a `null`
- **THEN** su tarjeta muestra «Sin clasificar» en lugar de un nombre de género

### Requirement: Render inicial de listados de Libros y Clientes
Los listados de Libros y Clientes SHALL renderizarse inicialmente desde los arrays `libros` y `clientes` respectivamente.

#### Scenario: Listado de libros inicial
- **WHEN** se abre la vista Libros
- **THEN** se muestra una fila por cada libro en el array `libros`

#### Scenario: Listado de clientes inicial
- **WHEN** se abre la vista Clientes
- **THEN** se muestra una fila por cada cliente en el array `clientes`

### Requirement: Formateo de importes y fechas
Los importes SHALL formatearse con `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })` y las fechas SHALL mostrarse como `dd/mm/aaaa hh:mm`.

#### Scenario: Importe en ARS
- **WHEN** se muestra un precio de 1500
- **THEN** se ve `$ 1.500,00`

#### Scenario: Fecha en formato local
- **WHEN** se muestra una fecha en formato ISO 8601
- **THEN** se ve como `dd/mm/aaaa hh:mm`

### Requirement: Búsqueda activa al volver al Catálogo
Cada vez que se muestra la vista Catálogo SHALL aplicarse la búsqueda que tenga escrita `#catalogo-busqueda`, con la misma regla de coincidencia y los mismos mensajes que al escribir.

#### Scenario: Volver desde otra vista
- **WHEN** se escribe `mapa` en el buscador, se navega a Libros y se vuelve al Catálogo
- **THEN** se ve solo «El mapa invisible» y el campo sigue diciendo `mapa`

#### Scenario: Búsqueda vacía al volver
- **WHEN** el buscador está vacío y se vuelve al Catálogo
- **THEN** se ven todos los libros

### Requirement: Género inexistente se muestra como «Sin clasificar»
Un libro cuyo `generoId` es nulo o no corresponde a ningún género cargado SHALL mostrarse como «Sin clasificar» en el Catálogo y en la tabla de Libros, sin modificar el `generoId` guardado.

#### Scenario: Id de género inexistente
- **WHEN** un libro de `libreria.libros` tiene `generoId` `"ge-99"` y se recarga la página
- **THEN** el Catálogo y la tabla de Libros muestran «Sin clasificar» para ese libro y `libreria.libros` sigue guardando `"ge-99"`

#### Scenario: Libro sin género
- **WHEN** un libro tiene `generoId` `null`
- **THEN** el Catálogo y la tabla de Libros muestran «Sin clasificar»

### Requirement: Contador de libros del Catálogo
El número de la tarjeta «Historias por descubrir» (`.bienvenida__cantidad`) SHALL mostrar la cantidad total de libros cargados (no los filtrados) y actualizarse tras cada alta de libro sin recargar.

#### Scenario: Contador inicial
- **WHEN** se abre la aplicación con los 6 libros iniciales
- **THEN** el contador muestra 6

#### Scenario: Contador tras un alta
- **WHEN** se registra un libro nuevo
- **THEN** el contador muestra 7 sin recargar la página, aunque haya una búsqueda activa

### Requirement: Portada ilustrada opcional
Un libro SHALL poder declarar un campo opcional `portada` con la ruta relativa a una imagen local. Cuando la tarjeta del Catálogo tenga una portada disponible, SHALL mostrar un `<img>` con `alt="Portada de «<título>»"`, `loading="lazy"`, `decoding="async"` y atributos `width="600"` y `height="900"`, dentro de una caja de proporción 2:3 con recorte `object-fit: cover`. El título, el autor y los demás datos de la tarjeta SHALL seguir presentes como texto HTML insertado con `textContent`.

#### Scenario: Libro con portada
- **WHEN** se renderiza la tarjeta de un libro que tiene `portada`
- **THEN** la tarjeta muestra un `<img>` con `alt="Portada de «<título>»"`, `loading="lazy"`, `decoding="async"`, `width="600"` y `height="900"`, y la imagen se recorta con `object-fit: cover` en una caja 2:3

#### Scenario: Texto de la tarjeta se mantiene
- **WHEN** un libro con portada ilustrada aparece en el Catálogo
- **THEN** su título, autor, ISBN, editorial, género y precio siguen visibles como texto, el filtro por título lo encuentra igual y un lector de pantalla puede leerlos

#### Scenario: La portada no altera el filtro ni el contador
- **WHEN** se filtra el Catálogo o se registra un libro nuevo
- **THEN** las portadas no cambian la cantidad de resultados, el mensaje de estado ni el contador de libros

### Requirement: Respaldo con la tapa CSS
Cuando un libro no tenga portada disponible o su imagen no se pueda cargar, la tarjeta SHALL mostrar la tapa CSS existente (degradé con título y autor) dentro de la misma caja 2:3. No SHALL quedar una caja vacía ni el ícono de imagen rota. La imagen fallida SHALL ocultarse para que el navegador no muestre el ícono de error.

#### Scenario: Libro sin portada
- **WHEN** se renderiza la tarjeta de un libro sin campo `portada`, por ejemplo uno dado de alta desde el formulario
- **THEN** se muestra la tapa CSS con el título y el autor, sin elemento `<img>`

#### Scenario: Imagen que no carga
- **WHEN** la ruta de `portada` apunta a un archivo renombrado, eliminado o inaccesible
- **THEN** la tarjeta oculta la imagen rota y muestra la tapa CSS en la misma caja, sin cambiar el alto de la tarjeta

#### Scenario: La tapa CSS sigue siendo decorativa
- **WHEN** la tarjeta muestra la tapa CSS como respaldo
- **THEN** la tapa y su texto duplicado quedan fuera del árbol de accesibilidad y el título se anuncia una sola vez desde el encabezado de la tarjeta

### Requirement: Compatibilidad con libros guardados sin portada
Al renderizar un libro cargado de `localStorage` que no tenga el campo `portada`, el sistema SHALL resolver la imagen mediante un mapa de ids conocidos (`li-1` a `li-6` → `assets/img/portadas/<id>.webp`). Un libro sin `portada` cuyo id no esté en el mapa SHALL mostrar la tapa CSS. La aplicación NO SHALL reescribir `libreria.libros` al arrancar solo para agregar el campo.

#### Scenario: Libro viejo con id conocido
- **WHEN** `libreria.libros` contiene un libro guardado con id `li-1` y sin el campo `portada`
- **THEN** su tarjeta muestra la imagen `assets/img/portadas/li-1.webp`

#### Scenario: Libro viejo con id desconocido
- **WHEN** `libreria.libros` contiene un libro guardado con un id que no está en el mapa de ids conocidos y sin el campo `portada`
- **THEN** su tarjeta muestra la tapa CSS

#### Scenario: Datos viejos no se reescriben
- **WHEN** se abre la aplicación con libros guardados que no tienen el campo `portada`
- **THEN** el valor de `libreria.libros` conserva su forma original y no se le agrega el campo automáticamente
