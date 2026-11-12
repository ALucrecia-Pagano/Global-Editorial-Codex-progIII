# Actores y Roles

## Actores del sistema

| Actor | Descripción | Cómo interactúa |
|---|---|---|
| Operador de la librería | Único usuario de la app. No hay login real ni perfiles. | Navega las 5 vistas, filtra el catálogo, da de alta libros y clientes, registra ventas y consulta el historial. |
| Cliente (entidad) | Persona compradora ficticia. **No usa la app**: es un dato. | Se selecciona en el formulario de venta. |
| Docente evaluador | Usuario externo que verifica la entrega. | Abre `index.html`, ejecuta los casos manuales y, en una copia, edita `localStorage` a mano para probar el precio histórico. |

## Equipo de desarrollo

| Rol | Integrante | Responsabilidad |
|---|---|---|
| Etapa 1 — Maquetación | Amanda | HTML semántico + CSS de todas las vistas, datos estáticos de ejemplo, filtro por título |
| Etapa 2 — Funcionalidad | Liendo Mateo, Avila Lucas, Valentini Tiziano, Garcia Juan | Datos locales, altas con validación, ventas, historial, `localStorage`, README final |

Integrantes del grupo (para el README): Liendo Mateo, Avila Lucas, Pagano Amanda, Valentini Tiziano, Garcia Juan.

Cada integrante hace sus propios commits y push al cerrar su etapa.

## RBAC — Matriz de permisos

No aplica: la consigna excluye explícitamente el inicio de sesión real. El operador tiene acceso total a la interfaz con estas limitaciones **funcionales** (no de seguridad):

| Recurso | Crear | Leer | Editar | Eliminar |
|---|---|---|---|---|
| Libro | ✅ | ✅ | ❌ | ❌ |
| Cliente | ✅ | ✅ | ❌ | ❌ |
| Venta | ✅ (confirmar) | ✅ | ❌ (inmutable) | ❌ (inmutable) |
| Renglón (en venta en curso) | ✅ | ✅ | ✅ (cantidad) | ✅ (quitar) |
| Editorial / Género / Autor | ❌ | ✅ | ❌ | ❌ |

## Rutas públicas

Todas las vistas son públicas: Catálogo, Libros, Clientes, Ventas, Historial.
