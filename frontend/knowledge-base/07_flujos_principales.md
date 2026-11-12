# Flujos Principales

## Flujo 1: Filtrar catálogo por título (Etapa 1)
**Disparador**: el operador escribe en el buscador. **Actor**: operador.
1. Evento `input` en el campo de búsqueda.
2. Se normaliza el texto: `trim()` + `toLowerCase()`.
3. Vacío → se muestran todos los libros.
4. Si no → se muestran los libros cuyo título (en minúsculas) `includes` el texto.
5. Cero coincidencias → se muestra el mensaje "sin resultados"; si no, se oculta.

**Errores**: ninguno bloqueante.

## Flujo 2: Alta de libro (Etapa 2)
1. `submit` → `preventDefault()`.
2. Leer campos; normalizar ISBN (quitar espacios y guiones).
3. Validar RN-LI-01..06; acumular errores.
4. Con errores → mostrar mensajes de texto junto al formulario; no agregar.
5. Sin errores → push al array, persistir, re-render de listado, catálogo y selector de venta; mensaje de éxito; reset del form.

## Flujo 3: Alta de cliente (Etapa 2)
Igual al flujo 2 con RN-CL-01..03 (email `trim()` + `toLowerCase()` para comparar duplicados).

## Flujo 4: Componer y confirmar venta (Etapa 2)
1. Seleccionar cliente.
2. Elegir libro + cantidad → "Agregar renglón".
   - Cantidad no entera o ≤ 0 → error de texto.
   - Libro ya presente → sumar cantidad al renglón existente o informar duplicado (no crear otro).
3. Re-calcular subtotales y total (2 decimales).
4. Editar cantidad / quitar renglón → re-calcular.
5. "Confirmar venta":
   - Sin cliente / sin renglones / cantidades inválidas → rechazar con mensaje.
   - Válida → crear venta `{id, fecha, clienteId, clienteNombre, renglones[{libroId, titulo, cantidad, precioUnitario, subtotal}], total}`, persistir, limpiar formulario, mensaje de éxito, actualizar historial.

```
Operador → Form venta → validar → ventas[] → localStorage
                                    └→ render historial
```

## Flujo 5: Consultar historial (Etapa 2)
1. Render de la tabla de ventas (id, fecha, cliente, total).
2. Acción "Ver detalle" → muestra renglones con los valores **guardados en la venta**.

## Flujo 6: Arranque y persistencia (Etapa 2)
1. Al cargar, leer las claves de `localStorage`.
2. Ausentes → cargar seed y guardarlo.
3. Presentes → usar lo guardado (no mezclar con seed).
4. Render inicial de todas las vistas.

**Errores**: JSON corrupto en `localStorage` → **Suposición**: volver al seed (ver [10](10_preguntas_abiertas.md)).

## Casos manuales de verificación

El README registra el **resultado observado** de cada caso (no marcar aprobado sin ejecutar).

| # | Caso | Resultado esperado | Etapa |
|---|---|---|---|
| 1 | Búsqueda con parte del título en mayúsculas; luego vacía; luego texto inexistente | Coincidencias sin distinguir mayúsculas; catálogo completo; mensaje sin resultados | **1** |
| 2 | Alta de libro con ISBN existente y luego con ISBN nuevo | Duplicado rechazado; el válido aparece en catálogo y selección de venta | 2 |
| 3 | Alta de cliente con email inválido, email existente en mayúsculas y email nuevo | Se rechazan los dos primeros; el nuevo aparece en listado y selección | 2 |
| 4 | Venta sin cliente, cantidad 0, negativa o decimal; libro repetido | No se confirma; el duplicado no crea otro renglón | 2 |
| 5 | Venta válida: 2 u. a 1500 y 1 u. a 2000 | Subtotales 3000 y 2000; total 5000; detalle en historial | 2 |
| 6 | Venta confirmada + cambio manual del precio en el catálogo guardado (copia del proyecto) | Tras recargar, el historial conserva precio unitario, subtotales y total | 2 |
| 7 | Recarga después de altas y venta | Datos recuperados sin duplicar ejemplos ni ventas | 2 |
| 8 | Navegación por teclado y anchos 320 px / 1280 px | Foco visible, controles usables, tabla con scroll propio | **1** (re-verificar en 2) |

Cómo verificar 320/1280 px: DevTools → modo responsive, ancho exacto; comprobar que `document.documentElement.scrollWidth <= window.innerWidth`.
