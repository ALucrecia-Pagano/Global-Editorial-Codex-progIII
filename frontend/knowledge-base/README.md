# TPI Librería Frontend — Base de Conocimiento

Base de conocimiento generada a partir de la consigna del TPI (el PDF se retiró del repo al cerrar el trabajo) y, como referencia visual, el prototipo propio (`docs/inspo/README.md`). La KB se generó inicialmente con una captura de BookNest, ya reemplazada (DD-15).

## Índice de Archivos

| Archivo | Contenido |
|---|---|
| [01_vision_y_objetivos.md](01_vision_y_objetivos.md) | Propósito, objetivos, alcance, división en etapas, fuera de alcance |
| [02_descripcion_general.md](02_descripcion_general.md) | Stack nativo, arquitectura, referencia visual (prototipo propio), criterios de evaluación |
| [03_actores_y_roles.md](03_actores_y_roles.md) | Operador, docente, equipo; matriz de operaciones permitidas |
| [04_modelo_de_datos.md](04_modelo_de_datos.md) | Libro, Editorial, Género, Autor, Cliente, Venta, Renglón; seed; claves localStorage |
| [05_reglas_de_negocio.md](05_reglas_de_negocio.md) | Reglas RN-CA/LI/CL/FO/VE/HI/PE/UI/GL |
| [06_funcionalidades.md](06_funcionalidades.md) | Épicas por ejercicio e historias US-001..012 con etapa |
| [07_flujos_principales.md](07_flujos_principales.md) | Filtro, altas, venta, historial, arranque + 8 casos manuales |
| [08_arquitectura_propuesta.md](08_arquitectura_propuesta.md) | Patrones, directorios, contrato de maqueta, accesibilidad |
| [09_decisiones_y_supuestos.md](09_decisiones_y_supuestos.md) | DD-01..13, SU-01..04 |
| [10_preguntas_abiertas.md](10_preguntas_abiertas.md) | Inconsistencias y preguntas priorizadas |

## Quick Start para Desarrolladores

1. Entender el dominio → [01](01_vision_y_objetivos.md), [03](03_actores_y_roles.md)
2. Entender los datos → [04](04_modelo_de_datos.md)
3. Entender las reglas → [05](05_reglas_de_negocio.md)
4. Entender la arquitectura → [02](02_descripcion_general.md), [08](08_arquitectura_propuesta.md)
5. Implementar → [07](07_flujos_principales.md), [06](06_funcionalidades.md)
6. Antes de codificar → [10](10_preguntas_abiertas.md)

## Resumen Ejecutivo

Frontend estático de una librería (catálogo, libros, clientes, ventas, historial) en HTML, CSS y JS nativos, sin backend ni librerías, con persistencia en `localStorage` y verificación manual. Se entrega en dos etapas: **Etapa 1** (maquetación de todas las vistas + filtro por título) y **Etapa 2** (datos, validaciones, ventas, historial y persistencia).
