# Decisiones de diseño retiradas de C-02 (insumo de C-12)

> Texto literal de las decisiones D2 y D9 a D13 del `design.md` de C-02, retiradas del alcance de C-02 el 2026-10-14. Insumo del change C-12 `extras-prototipo`. **No es una decisión vigente.** Las referencias a otras decisiones (D1, D3, D4, D6, D7, D8, D14) corresponden al `design.md` de C-02.

### D2. Navegación ampliada sobre el código de C-01
- `VISTAS` pasa a incluir `inicio`, `escritores`, `ingresar`, `registro` y `libro-li-1` … `libro-li-6`. La vista por defecto pasa de `'catalogo'` a `'inicio'` en `iniciarNavegacion` y en `alCambiarHash`.
- `obtenerVistaDesdeHash` no cambia de lógica: `#libro-titulo` no está en `VISTAS`, se busca el elemento y `closest('.vista')` devuelve `libros` (por eso el formato `libro-li-N` no choca con los campos del formulario).
- Mapa `VISTA_PADRE = { 'libro-li-1': 'catalogo', …, 'registro': 'ingresar' }`. En `mostrarVista`: si el `href` del enlace es `#id` → `aria-current="page"`; si es `#VISTA_PADRE[id]` → `aria-current="true"`; en otro caso se quita el atributo. El CSS resalta `[aria-current]` (cualquier valor) con fondo + borde izquierdo + peso de fuente (no solo color).
- **Alternativa descartada**: marcar Catálogo con `aria-current="page"` en el detalle; anunciaría una página falsa.

### D9. Carrusel
- Marcado: `section.carrusel[aria-labelledby]` > `h3` "Recomendados" (las subsecciones de Inicio usan `h3` bajo el `h2` de la vista) + `div.carrusel__marco` > `ul#carrusel-recomendados.carrusel__fila` con 6 `li > article.tarjeta.tarjeta--recomendada` + botones `#carrusel-anterior` / `#carrusel-siguiente` (`type="button"`, texto visible u oculto con `.solo-lectores`).
- Botones: `fila.scrollBy({ left: ±fila.clientWidth * 0.8 })`; un listener de `scroll` habilita/deshabilita cada botón según `scrollLeft`.
- Borde: en `pointermove` con `pointerType === 'mouse'` se calcula si el cursor está en el 15 % izquierdo/derecho; un bucle `requestAnimationFrame` suma `scrollLeft` mientras siga ahí; se cancela en `pointerleave` o al llegar al extremo. Se activa solo si `matchMedia('(prefers-reduced-motion: reduce)')` no coincide y se re-evalúa en `change`.
- Táctil: scroll nativo (`overflow-x: auto`, `overscroll-behavior-inline: contain`). Foco: el desplazamiento nativo al enfocar un enlace ya trae la tarjeta a la vista; `scroll-padding-inline` evita que quede debajo del degradé del borde.
- **Alternativa descartada**: carrusel con `transform` y slides. Rompe el scroll nativo táctil y el foco.

### D10. Estrellas: dos componentes distintos
- **Tarjetas (solo lectura, sin JS)**: `<p class="estrellas estrellas--lectura estrellas--valor-4"><span class="solo-lectores">4 de 5 estrellas</span></p>`. El dibujo es un `::before` con `content: "★★★★★" / ""` (texto alternativo vacío, para que los lectores de pantalla no lean los símbolos; con fallback `content: "★★★★★"` antes, dado que el texto oculto ya da el valor) y un degradé (`background-clip: text`) cuyo corte depende del modificador `--valor-N` (`--porcentaje: 80%`). Con fallback de color sólido si no hay `background-clip`.
  - Valores ficticios fijos: li-1 = 4, li-2 = 5, li-3 = 3, li-4 = 4, li-5 = 3, li-6 = 5 (iguales en catálogo y carrusel).
- **Detalle (entrada del usuario)**: `fieldset#puntuacion-li-N.estrellas.estrellas--entrada` con `legend` "Tu puntuación de «<título>»" y 5 `input type="radio" name="puntuacion-li-N" value="1..5"` visualmente ocultos (no `display:none`, para que sigan enfocables) con `label` que muestra "★" y contiene texto oculto "N de 5 estrellas". El resaltado acumulado (todas las anteriores pintadas) se logra con `:has(input:checked)` + orden de los radios; foco visible en la `label` vía `input:focus-visible + label`.
  - Al `change`, se guarda en `libreria.preferencias.puntuaciones` y se muestra el toast "Puntuación guardada: 4 de 5 estrellas". Al cargar, se marca el radio guardado.
- **Relación entre ambas (decisión pedida por la usuaria)**: la tarjeta muestra una **puntuación ficticia del libro** (dato de ejemplo, como el precio) y el detalle muestra **la puntuación personal del usuario**; en la Etapa 1 **no se sincronizan** y la tarjeta no cambia al puntuar. El detalle lo aclara con el texto "Tu puntuación" y la tarjeta con "Puntuación de lectores" (texto oculto o visible). **Limitación conocida para C-04**: al generar las tarjetas desde el array, el equipo decide si la puntuación de tarjeta pasa a ser un campo `puntuacion` del libro (no está hoy en `knowledge-base/04`) o un promedio que incluya la del usuario. Se documenta en el README.

### D11. Formularios de acceso
- ids/names: `form-ingresar`, `ingresar-email` (`email`), `ingresar-clave` (`clave`); `form-registro`, `registro-nombre` (`nombreCompleto`), `registro-email` (`email`), `registro-clave` (`clave`), `registro-repetir` (`repetirClave`). Errores por campo en `p.formulario__error#<id-campo>-error` vacío, referenciado por `aria-describedby`. `autocomplete` adecuado (`email`, `current-password`, `new-password`, `name`). `novalidate` en el `form`.
- Validación: función pura `validarAcceso(valores, esRegistro)` que devuelve `{ campo: mensaje }`; el email se valida con `input.checkValidity()` del `type="email"` (validación nativa del navegador, sin regex propio — el de clientes lo decide C-07). Los mensajes se insertan con `textContent`.
- `registrarFormulariosMaqueta` de C-01 sigue aplicando `preventDefault` a todos los forms; los de acceso suman su propio listener `submit`.
- Éxito: toast "Listo — Ingresaste a la demostración. No se guardó ningún dato." / "Cuenta de demostración creada…", se vacían las contraseñas, no hay estado de sesión. Las variables con valores leídos son locales a la función (nada queda en memoria global).

### D12. Toasts
- `div#notificaciones.notificaciones[role="status"][aria-live="polite"]` fijo abajo a la derecha (a 320 px ocupa el ancho menos márgenes). `notificar(texto, tipo)` crea el toast con `createElement`/`textContent`, incluye botón `.toast__cerrar` "Cerrar aviso" y lo quita a los 5 s. Máximo un toast visible: uno nuevo reemplaza al anterior.

### D13. Contenido estático nuevo
- Descripciones inventadas (2–3 oraciones) para los 6 libros, solo en el HTML del detalle; **no** se agregan a la entidad Libro de KB-04.
- Escritores (derivado del catálogo de C-01): Lucía Ferreyra — 2 libros (li-1, li-4), Novela · Ciencia ficción; Tomás Aguirre — 3 libros (li-2, li-4, li-6), Ciencia ficción · Novela; Inés Montoya — 2 libros (li-3, li-5), Novela · Sin clasificar.
- Inicio: `#inicio-total-libros` 6, `#inicio-total-generos` 2 («Sin clasificar» no cuenta como género), `#inicio-total-escritores` 3; destacado `#inicio-destacado` = "Estrellas de papel" (li-2) con enlace a `#libro-li-2`. "Escritores destacados" (`#inicio-escritores`) reutiliza `.escritor` en versión compacta.
- Migas: `nav.migas[aria-label="Migas de pan"] > ol.migas__lista`, último paso `span.migas__actual[aria-current="page"]`. Está fuera del menú principal, por lo que no viola la regla "un solo enlace del menú con `aria-current='page'`" (el paso actual no es enlace).
- Tapas CSS: `.tapa--degrade-N` por libro, reutilizada en tarjeta, carrusel, destacado y detalle.

### D14. Contrato ampliado (DD-08)
Se agregan a la tabla de `knowledge-base/08` y del `README.md`:

| Vista | Elemento | `id` | `name` |
|---|---|---|---|
| Global | Contenido principal (destino del skip-link) | `contenido` | — |
| Global | Sidebar | `sidebar` | — |
| Global | Botón colapsar sidebar (escritorio) | `sidebar-colapsar` | — |
| Global | Botón abrir menú (celular) | `menu-abrir` | — |
| Global | Botón cerrar menú (celular) | `menu-cerrar` | — |
| Global | Velo del menú móvil | `sidebar-velo` | — |
| Global | Botón de tema | `tema-alternar` | — |
| Global | Zona de toasts | `notificaciones` | — |
| Global | Secciones de vista nuevas | `inicio`, `escritores`, `ingresar`, `registro`, `libro-li-1` … `libro-li-6` | — |
| Inicio | Cantidad de libros / géneros / escritores | `inicio-total-libros`, `inicio-total-generos`, `inicio-total-escritores` | — |
| Inicio | Libro destacado | `inicio-destacado` | — |
| Inicio | Fila del carrusel / botones | `carrusel-recomendados`, `carrusel-anterior`, `carrusel-siguiente` | — |
| Inicio | Escritores destacados | `inicio-escritores` | — |
| Escritores | Contenedor de tarjetas | `escritores-lista` | — |
| Detalle | Grupo de puntuación propia | `puntuacion-li-1` … `puntuacion-li-6` | `puntuacion-li-N` (cada radio, `value` 1–5) |
| Ingresar | Formulario / email / contraseña | `form-ingresar`, `ingresar-email`, `ingresar-clave` | —, `email`, `clave` |
| Registro | Formulario / nombre / email / contraseña / repetir | `form-registro`, `registro-nombre`, `registro-email`, `registro-clave`, `registro-repetir` | —, `nombreCompleto`, `email`, `clave`, `repetirClave` |

Nota de contrato (no es id): cada tarjeta de libro (catálogo y carrusel) lleva `p.estrellas.estrellas--lectura.estrellas--valor-N` con texto "N de 5 estrellas"; C-04 debe generarla igual. Los ids `titulo-*` de las vistas nuevas, `*-error` de los campos y `puntuacion-li-N-M` de cada radio siguen siendo internos.
