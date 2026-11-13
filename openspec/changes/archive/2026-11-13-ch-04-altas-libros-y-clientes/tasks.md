# Tasks: CH-04 altas-libros-y-clientes

## 1. Estilos y marcado HTML

- [x] 1.1 Crear `frontend/public/css/altas.css` con estilos para mensajes de error junto a campos, estados inválidos, selectores y lista interactiva de autores.
- [x] 1.2 Actualizar `frontend/public/index.html` vinculando `css/altas.css` y `js/altas.js` (con defer), y ajustando el marcado de las secciones `#libros` y `#clientes` con campos del backend (`stock`, autores dinámicos con rol y orden, spans de error accesibles).

## 2. Limpieza modular y sincronización entre vistas

- [x] 2.1 Limpiar en `frontend/public/js/app.js` el bloque viejo de altas y maquetas de libros/clientes (`renderLibros`, `renderClientes`, `actualizarContadorLibros`, `llenarOpciones`, `poblarFormularioLibro`, `normalizarIsbn`, `validarLibro`, `refrescarVistasLibros`, `registrarHandlerAltaLibro`, `validarCliente`, `refrescarVistasClientes`, `registrarHandlerAltaCliente` y llamadas en `DOMContentLoaded`), preservando los helpers compartidos de nombres.
- [x] 2.2 Agregar listener mínimo a `libros:cambiaron` en `frontend/public/js/catalogo.js` para recargar catálogo y contador sin recargar la página.
- [x] 2.3 Agregar listeners mínimos a `libros:cambiaron` y `clientes:cambiaron` en `frontend/public/js/ventas.js` para refrescar los selectores de la venta sin recargar la página.

## 3. Implementación del módulo de altas

- [x] 3.1 Implementar carga inicial de editoriales (`GET /editoriales/?limit=100`), géneros (`GET /generos/?limit=100`) y autores (`GET /autores/?limit=100`) en `frontend/public/js/altas.js`, con gestión de estados de carga y errores de conexión.
- [x] 3.2 Implementar gestión interactiva de autorías de libros (selección de autor, rol entre `autor`, `coautor`, `traductor`, `ilustrador`, orden automático, agregar, quitar y auto-inclusión al enviar).
- [x] 3.3 Implementar validación local de formularios de libro y cliente con mensajes visibles junto a cada control y foco en el primer error.
- [x] 3.4 Implementar envío de `POST /libros/` y `POST /clientes/` con botón deshabilitado (`aria-busy`), manejo de respuestas 201 (limpieza, mensaje de éxito y `Destellos.lanzar(...)`), 409 (conflicto de duplicado en banner y campo), 422 (errores de validación Pydantic) y fallos de conexión (`ApiError.esConexion`).
- [x] 3.5 Disparar `CustomEvent('libros:cambiaron')` y `CustomEvent('clientes:cambiaron')` tras cada alta exitosa y actualizar las tablas visuales de libros y clientes en pantalla.

## 4. Verificación y documentación

- [x] 4.1 Probar en stack local en `http://127.0.0.1:8080`: alta válida de libro, alta válida de cliente, 409 por ISBN duplicado, 409 por email duplicado, validaciones 422, error de conexión con backend apagado, y sincronización reactiva en catálogo y ventas.
- [x] 4.2 Verificar que el libro nuevo sin portada cargue limpiamente `portada-fallback.svg` sin errores en la consola.
- [x] 4.3 Limpiar registros creados durante las pruebas o verificar estado final de la base.
- [x] 4.4 Actualizar `CHANGES.md` marcando CH-04 como hecho con dueño "Amanda" y registrando las decisiones tomadas.
