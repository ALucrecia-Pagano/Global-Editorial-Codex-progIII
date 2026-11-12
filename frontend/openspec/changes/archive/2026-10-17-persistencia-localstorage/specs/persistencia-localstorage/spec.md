# Spec Delta

## Purpose

Persiste los datos de dominio (libros, clientes, ventas) en `localStorage` del navegador con un repositorio único de carga/guardado, comportamiento de arranque con seed y protección contra valores corruptos.

## ADDED Requirements

### Requirement: Repositorio único de localStorage
El sistema SHALL exponer funciones `cargar(clave)` y `guardar(clave, datos)` como único punto de acceso a `localStorage` para las claves `libreria.libros`, `libreria.clientes` y `libreria.ventas`.

#### Scenario: Cargar datos existentes
- **WHEN** se llama a `cargar('libreria.libros')` con datos válidos en localStorage
- **THEN** devuelve el array de libros parseado desde JSON

#### Scenario: Guardar datos
- **WHEN** se llama a `guardar('libreria.libros', arrayDeLibros)`
- **THEN** se escribe el JSON serializado en `localStorage` bajo la clave `libreria.libros`

### Requirement: Arranque con seed cuando faltan claves
La aplicación SHALL, al iniciarse, verificar si cada clave de dominio está presente en `localStorage`; si falta, cargar los seed iniciales y guardarlos; si está presente, usar lo guardado sin mezclar con seed.

#### Scenario: Primera apertura sin datos guardados
- **WHEN** se abre la aplicación y `localStorage` no tiene `libreria.libros`
- **THEN** se cargan los seed iniciales de libros y se guardan en `localStorage`

#### Scenario: Apertura con datos ya guardados
- **WHEN** se abre la aplicación y `libreria.libros` ya existe en `localStorage`
- **THEN** se usan los libros guardados, sin duplicar los seed iniciales

#### Scenario: Clientes y ventas arrancan igual
- **WHEN** se abre la aplicación y faltan `libreria.clientes` o `libreria.ventas`
- **THEN** se cargan sus respectivos seeds iniciales y se guardan

### Requirement: Protección contra JSON corrupto
Si un valor de `localStorage` tiene JSON corrupto o inválido, la aplicación SHALL no romperse: volver al seed inicial para esa clave y mostrar un mensaje de error con texto.

#### Scenario: JSON corrupto en libreria.libros
- **WHEN** `libreria.libros` contiene JSON inválido y se recarga la página
- **THEN** la aplicación no lanza excepción, usa el seed de libros y muestra un mensaje de error al usuario

### Requirement: Claves de localStorage documentadas
Las claves `libreria.libros`, `libreria.clientes` y `libreria.ventas` SHALL documentarse en el README con su estructura y límites (navegador, perfil, ubicación de apertura, no compartido entre usuarios).

#### Scenario: Documentación en README
- **WHEN** se lee el README del proyecto
- **THEN** encuentra la sección que documenta las claves de `localStorage` y su propósito
