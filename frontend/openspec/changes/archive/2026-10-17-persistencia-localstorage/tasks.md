# Tasks

## 1. Repositorio de localStorage

- [x] 1.1 Crear js/storage.js con funciones cargar(clave) y guardar(clave, datos), cargado con <script defer> antes de js/app.js — verificar que el archivo carga sin errores en consola al abrir index.html
- [x] 1.2 Definir lista blanca de claves permitidas (libreria.libros, libreria.clientes, libreria.ventas) — verificar que cualquier otra clave se rechaza
- [x] 1.3 Envolver todo acceso a localStorage en try/catch — verificar que si localStorage está bloqueado la página sigue funcionando con valores por defecto

## 2. Comportamiento de arranque (seed vs guardado)

- [x] 2.1 Al iniciar, verificar si libreria.libros existe en localStorage — verificar que si falta, se cargan los seed iniciales y se guardan
- [x] 2.2 Al iniciar, verificar si libreria.clientes y libreria.ventas existen — verificar que si faltan, se cargan sus seeds y se guardan
- [x] 2.3 Al recargar con datos ya guardados, usar lo guardado sin mezclar con seed — verificar que no hay duplicados tras recargar

## 3. Protección contra JSON corrupto

- [x] 3.1 Si JSON.parse falla en una clave de dominio, volver al seed inicial para esa clave — verificar que la aplicación no lanza excepción
- [x] 3.2 Mostrar mensaje de error con texto cuando hay JSON corrupto — verificar que el mensaje se ve en pantalla (no solo color)

## 4. Integración con el arranque de la aplicación

- [x] 4.1 Llamar al repositorio al iniciar la aplicación para cargar o inicializar datos — verificar que los datos se cargan desde localStorage o seed según corresponda

## 5. Documentación en README

- [x] 5.1 Documentar claves libreria.libros, libreria.clientes, libreria.ventas con su estructura y límites — verificar que el README explica las claves y sus límites (navegador, perfil, ubicación)

## 6. Verificación final

- [x] 6.1 Verificar a mano en 320px, 1280px y con teclado en las 5 vistas, cero errores en consola — registrar el resultado observado en el README
