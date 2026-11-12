# Visión y Objetivos

> Fuente: consigna del TPI "Frontend de una librería", Programación III, UTN FRM — Prof. Matías Torres. El PDF se retiró del repo al cerrar el trabajo.

## Propósito del sistema

**Nombre de la librería**: Editorial Codex (DD-13).

Frontend web de una librería que presenta su catálogo y registra libros, clientes y ventas, con datos y operaciones **simulados íntegramente en el navegador**.

El proyecto toma como contexto el TP backend de Programación III de otro docente, pero desarrolla **exclusivamente el frontend**: no hay API, base de datos, servidor, conexión con backend ni login real. Se construye con HTML, CSS y JavaScript nativos, sin librerías, frameworks ni CDNs. Los datos son ficticios y la persistencia usa `localStorage`, que sirve para la práctica y no representa seguridad ni integridad garantizada por un servidor.

## Objetivos pedagógicos (de la consigna)

- Construir interfaces con **HTML semántico** y **CSS propio**.
- Relacionar formularios, listados y navegación con las entidades del proyecto.
- Aplicar **JavaScript nativo** para representar datos locales, modificar el DOM y responder a eventos.
- Validar entradas y comprobar el comportamiento mediante **casos manuales reproducibles**.

## Objetivos por actor

| Actor | Objetivo principal | Objetivos secundarios |
|---|---|---|
| Operador de la librería (usuario único de la app) | Consultar el catálogo y registrar libros, clientes y ventas | Filtrar por título, revisar el historial de ventas y su detalle |
| Docente evaluador | Verificar el cumplimiento de los 6 ejercicios | Reproducir los casos manuales del README, incluida la prueba de precio histórico |
| Equipo de desarrollo (Etapa 1 / Etapa 2) | Entregar el TPI en dos etapas con división clara | Dejar documentado qué es maqueta y qué funciona |

## Alcance (TPI completo)

- **Vistas** con navegación clara: Catálogo, Libros, Clientes, Ventas, Historial. `index.html` como entrada.
- **Catálogo** generado por JS desde el array de libros, con filtro por título.
- **Alta de libros** (título, ISBN, precio, editorial, género opcional, autores) con validación.
- **Alta de clientes** (nombre completo, email) con validación.
- **Venta simulada**: cliente + renglones (libro, cantidad), subtotales y total con 2 decimales, confirmación.
- **Historial** de ventas inmutable con acceso al detalle de renglones y precio unitario histórico.
- **Persistencia** de libros, clientes y ventas en `localStorage`, sin duplicar datos iniciales.
- **README** con instrucciones, funcionalidades, datos iniciales, límites de `localStorage` y resultados de casos manuales.

### División en etapas

| Etapa | Responsable | Alcance |
|---|---|---|
| **Etapa 1** | Amanda | Maquetación HTML (Ej. 1) + CSS adaptable (Ej. 2) de **todas** las vistas con datos estáticos de ejemplo + **una interacción básica: filtro por título**. Los controles pendientes se identifican como maqueta. |
| **Etapa 2** | Compañeros del grupo | Datos locales y catálogo dinámico (Ej. 3), altas con validación (Ej. 4), ventas e historial (Ej. 5), persistencia + casos manuales + README final (Ej. 6). |

## Fuera de alcance

- Backend, API, base de datos, servidor, `fetch`.
- Inicio de sesión real / autenticación / roles.
- Gestión de stock, cobros, facturación fiscal.
- Edición o eliminación de libros, clientes o ventas confirmadas.
- ABM de editoriales, géneros o autores (son datos fijos).
- Pantalla de edición de precios.
- Validación del dígito de control del ISBN.
- Librerías, frameworks, CDNs, npm, herramientas de compilación.
- Tests automáticos (la verificación es manual).

## Métricas de éxito

- 100 puntos distribuidos según la consigna (ver tabla en [02](02_descripcion_general.md#criterios-de-evaluación)).
- Todos los casos manuales del Ejercicio 6 ejecutados y su **resultado real** registrado en el README.
- Interfaz usable a 320 px y 1280 px sin scroll horizontal de página y navegable por teclado.
