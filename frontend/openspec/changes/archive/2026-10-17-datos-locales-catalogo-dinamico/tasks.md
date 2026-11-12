# Tasks

## 1. Datos iniciales

- [x] 1.1 Crear js/data.js con los arrays libros, editoriales, generos, autores y clientes, cargado con <script defer> antes de js/app.js — verificar que el archivo carga sin errores en consola al abrir index.html
- [x] 1.2 Definir al menos 6 libros (uno sin género), 2 editoriales, 2 géneros, 3 autores y 3 clientes con ids estables — verificar que los arrays son inspeccionables en DevTools console

## 2. Render del catálogo dinámico

- [x] 2.1 Quitar las tarjetas estáticas de #catalogo-lista en index.html — verificar que el catálogo está vacío al cargar la página
- [x] 2.2 Implementar renderCatalogo() que genere una tarjeta por cada libro de libros usando createElement/textContent con las mismas clases BEM — verificar que aparecen tarjetas con título, ISBN, editorial, género, autores y precio en ARS
- [x] 2.3 Mostrar «Sin clasificar» cuando generoId es null — verificar que el libro sin género muestra ese texto en su tarjeta

## 3. Filtro dinámico sobre el array

- [x] 3.1 Reutilizar coincideTitulo de C-03 sobre el array libros en el handler de input de #catalogo-busqueda — verificar que escribir en el buscador filtra al instante sin recargar
- [x] 3.2 Re-renderizar el catálogo desde el array tras cada filtro — verificar que buscar «mapa» muestra solo la tarjeta «El mapa invisible»
- [x] 3.3 Mostrar #catalogo-sin-resultados cuando no hay coincidencias — verificar que buscar «xyz» muestra el mensaje sin resultados

## 4. Listados iniciales de Libros y Clientes

- [x] 4.1 Renderizar el listado de Libros desde el array libros — verificar que la vista Libros muestra una fila por cada libro
- [x] 4.2 Renderizar el listado de Clientes desde el array clientes — verificar que la vista Clientes muestra una fila por cada cliente

## 5. Formateo de importes y fechas

- [x] 5.1 Crear funciones de formato únicas: importes con Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }) y fechas como dd/mm/aaaa hh:mm — verificar que los precios se ven como $ 1.500,00

## 6. Verificación final

- [x] 6.1 Verificar a mano en 320px, 1280px y con teclado en las 5 vistas, cero errores en consola — registrar el resultado observado en el README
