# Descripción General

## Stack tecnológico

| Capa | Tecnología | Notas |
|---|---|---|
| Estructura | HTML5 semántico | `index.html` como entrada; se permiten varias páginas o secciones de una página |
| Presentación | CSS3 propio, en archivos externos | Flexbox y/o Grid; sin frameworks ni CDNs |
| Comportamiento | JavaScript nativo (ES2015+) | Manipulación del DOM y eventos; sin librerías |
| Persistencia | `localStorage` del navegador | Solo en Etapa 2 (Ejercicio 6) |
| Recursos | Imágenes y fuentes locales | Todo incluido en el proyecto, nada remoto |

**Prohibido**: librerías, frameworks, CDNs de CSS/JS, npm, dependencias instaladas, herramientas de compilación, `fetch`, backend.

## Arquitectura general

Aplicación estática que se abre directamente en el navegador (doble clic sobre `index.html`, sin servidor ni npm).

```
Navegador
 ├── index.html (+ otras .html si se usa multipágina)
 │     ├── <header> título + <nav> (Catálogo · Libros · Clientes · Ventas · Historial)
 │     └── <main> vista activa
 ├── css/styles.css        → identidad visual, layout, responsive, foco
 ├── js/app.js             → datos locales, render, eventos, validaciones
 └── localStorage          → libros, clientes, ventas (Etapa 2)
```

El flujo de datos es unidireccional y simple: **datos en memoria (arrays) → funciones de render → DOM**. Los eventos del usuario modifican los arrays, se re-renderiza y (en Etapa 2) se persiste en `localStorage`.

Estado actual del repo: `index.html`, `css/styles.css`, `js/data.js`, `js/storage.js` y `js/app.js` implementan C-01 a C-10. El extra C-12 no está hecho.

## Inspiración visual

La referencia visual es el **prototipo propio** de Editorial Codex ([`docs/inspo/README.md`](../docs/inspo/README.md)), que tomó a BookNest como inspiración inicial. Es un dashboard de lectura en **modo oscuro** con:
- Sidebar vertical con logo, ítems de navegación con ícono y estado activo resaltado (fondo violeta/azul).
- Tarjetas con bordes redondeados, fondos azul-noche y acentos violeta/índigo (`~#6366f1`).
- Grilla de portadas de libros en tarjetas con título y autor.
- Banner/hero con gradiente y tipografía sans-serif limpia.

Es **inspiración**, no un diseño a copiar: la consigna exige identidad visual **propia y coherente**. Ver [09 DD-15](09_decisiones_y_supuestos.md) (que reemplaza a DD-04 y, en parte, a DD-12).

**Decidido (DD-12)**: tema oscuro con contraste suficiente en los textos (objetivo WCAG AA 4.5:1) y **sin imágenes de portadas**: las tapas se generan con CSS (degradé con título y autor).

## Integraciones externas

Ninguna. No hay servicios externos, APIs ni CDNs.

## API REST

No aplica.

## Criterios de evaluación

| Ejercicio | Puntos | Distribución | Etapa |
|---|---|---|---|
| 1. HTML | 20 | Vistas y navegación: 10; semántica, formularios y estados: 10 | 1 |
| 2. CSS | 20 | Coherencia y organización: 8; adaptación: 8; accesibilidad básica: 4 | 1 |
| 3. Datos y catálogo | 15 | Modelo y ejemplos: 5; renderizado: 5; filtro y estados: 5 | 2 (filtro básico adelantado en 1) |
| 4. Altas | 15 | Libros y selectores: 6; clientes: 4; validación y actualización: 5 | 2 |
| 5. Ventas | 20 | Composición y validaciones: 8; cálculos: 5; confirmación e historial inmutable: 7 | 2 |
| 6. Cierre | 10 | Persistencia: 4; pruebas manuales registradas: 3; documentación y entrega: 3 | 2 |
| **Total** | **100** | | |

Se valora: código legible, nombres comprensibles, funciones acotadas, separación estructura/estilos/comportamiento. Usar librerías o frameworks **incumple el alcance técnico**.
