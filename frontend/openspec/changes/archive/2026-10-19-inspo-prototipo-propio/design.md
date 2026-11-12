# Diseño: inspo-prototipo-propio

## Contexto

Motivación: ver `proposal.md` (Por qué). Estado observado al proponer (2026-10-19):

- `git status`: ` D docs/inspo/inspo-booknest.png` (borrada a mano por Amanda) y `?? docs/inspo/prototipo-inicio.png`, `?? docs/inspo/prototipo-recomendados.png`.
- Menciones de BookNest o de la imagen fuera de `openspec/changes/archive/`: `knowledge-base/02_descripcion_general.md:35` (sección "Inspiración visual"), `knowledge-base/06_funcionalidades.md:28` (US-003), `knowledge-base/09_decisiones_y_supuestos.md:34` (DD-12) y `:68` (DD-04), `knowledge-base/README.md:3` (y la fila de 02 en la línea 10, "inspo visual"), `CHANGES.md:178` y `:233` (historial y "Leer antes" de C-02). `knowledge-base/08_arquitectura_propuesta.md:27` describe `docs/` como "consigna + inspo (fuentes, no se modifican)", lo que deja de ser cierto al sumar `docs/inspo/README.md`.
- `README.md` principal, `openspec/specs/**`, `CLAUDE.md` y `AGENTS.md` no mencionan BookNest.
- La última decisión numerada es **DD-14**; **DD-15** está libre (no aparece en la KB ni en `CHANGES.md`).
- DD-12 no es solo "inspirado en BookNest": también contiene reglas vigentes (tapas solo con CSS, contraste WCAG AA, la única foto decorativa del banner y su procedencia), citadas por la tabla de stack de `CLAUDE.md`/`AGENTS.md` ("Sin imágenes de portadas: tapas generadas con CSS (DD-12)") y por DD-14.
- DD-14 cita el prototipo aprobado en la ruta local `../../prueba_parcial_prog3`.

## Objetivos / No objetivos

**Objetivos:**
- Que toda referencia viva a la inspiración visual lleve a `docs/inspo/README.md` (prototipo propio) y no a un archivo inexistente.
- Conservar la trazabilidad: las decisiones viejas no se borran, se marcan como reemplazadas.

**No objetivos:**
- Cambiar la identidad visual implementada ni el código.
- Reescribir el historial (C-02 en `CHANGES.md`, changes archivados, DD-14).

## Decisiones

### D1 — DD-12 se marca "Reemplazada parcialmente por DD-15"
Solo la parte "inspirado en BookNest" (título y primera frase) queda reemplazada; las tapas en CSS, el objetivo de contraste WCAG AA y la foto decorativa del banner (con su procedencia) **siguen vigentes**. Se agrega una línea al inicio de DD-12 que lo diga explícitamente, sin borrar el texto original.
- **Alternativa descartada**: marcar DD-12 entera como reemplazada. Dejaría sin decisión vigente a la regla "tapas solo con CSS" que citan `CLAUDE.md`/`AGENTS.md` y DD-14, y obligaría a mover esas reglas a DD-15 (que pasaría a mezclar la referencia visual con reglas de implementación) o a tocar archivos de instrucciones de agentes que este change no debe tocar.
- **Aclaración que se registra en DD-15**: las capturas del prototipo muestran portadas reales, pero el proyecto **sigue usando tapas en CSS**; la nota de créditos de `docs/inspo/README.md` cubre solo las capturas, no habilita imágenes de portadas en la página.
- Confirmada por Amanda (ver Decisiones resueltas).

### D2 — DD-04 se marca "Reemplazada por DD-15"
DD-04 trata solo de tomar la identidad de la captura de BookNest, por lo que queda reemplazada entera. Se conserva su texto con la marca de estado (mismo criterio de historial que el resto de la KB).

### D3 — Nueva DD-15, no edición de DD-14
DD-15: "la referencia visual del proyecto es el prototipo propio (`docs/inspo/README.md`, repositorio Prototipos-Frontend), que tomó como inspiración inicial a BookNest". Incluye Contexto, Alternativas, Justificación y la sección **Reemplaza a** (DD-04 total, DD-12 parcial), siguiendo el formato de DD-14. Menciona que DD-14 cita el prototipo en `../../prueba_parcial_prog3` y que DD-14 no se modifica.
- **Alternativa descartada**: actualizar DD-14 para apuntar al repositorio. DD-14 es la decisión histórica de C-02 (archivado); cambiarla reescribe historia (la ruta local y el repositorio son el mismo prototipo, confirmado por Amanda, pero DD-14 igual no se reescribe).

### D4 — `docs/inspo/README.md` como punto único de referencia
La KB (02, 06, README de la KB) enlaza a `docs/inspo/README.md` en lugar de repetir enlaces o rutas de imágenes; así, si cambian las capturas o se suma el enlace publicado, se edita un solo archivo. Estructura del archivo:
1. Título y una frase: la referencia visual del equipo es el prototipo propio.
2. Enlace al repositorio `https://github.com/ALucrecia-Pagano/Prototipos-Frontend` con texto descriptivo (no "clic aquí").
3. Las dos capturas como imágenes Markdown con rutas relativas (`prototipo-inicio.png`, `prototipo-recomendados.png`) y **texto alternativo descriptivo** (skill `accessibility`: el `alt` describe el contenido, no "imagen" ni el nombre del archivo), por ejemplo:
   - `prototipo-inicio.png`: «Pantalla de inicio del prototipo de Editorial Codex en tema oscuro: encabezado con el título "Editorial CODEX", barra lateral de navegación, banner principal y tarjeta "Historias por descubrir"».
   - `prototipo-recomendados.png`: «Sección del prototipo con un carrusel de libros recomendados, un carrusel de escritores destacados y el banner "Descubrí nuevos mundos"».
   El agente de apply ajusta el texto a lo que efectivamente se ve en cada captura.
4. Nota de créditos: las portadas de libros que se ven en las capturas pertenecen a sus autores, editoriales e ilustradores y se usan solo como ejemplo visual en un trabajo educativo, sin fines comerciales.
5. Una línea de contexto: el prototipo tomó a BookNest como inspiración inicial (coherente con DD-15) y el proyecto mantiene tapas generadas con CSS.

### D5 — Enlace publicado
`https://alucrecia-pagano.github.io/Prototipos-Frontend/` se agrega a `docs/inspo/README.md`: Amanda confirmó que la página carga (tarea 2.4 desbloqueada).

### D6 — CHANGES.md: nota, no reescritura
Se agrega una nota breve dentro del bloque de C-02 (después de su lista "Leer antes"): la imagen `docs/inspo/inspo-booknest.png` fue reemplazada por el prototipo propio (`docs/inspo/README.md`) en el change `inspo-prototipo-propio` (DD-15). Las líneas 178 y 233 quedan igual.

### D7 — Sin delta specs (`skip_specs: true`)
La spec `documentacion-readme` regula el `README.md` principal como documento de entrega; `docs/inspo/README.md` es material de referencia interno y no cambia ningún comportamiento observable de la página. El esquema indica no inventar requisitos para cambios solo de documentación, así que el change declara `skip_specs: true`.
- **Alternativa descartada**: un requisito ADDED en `documentacion-readme` para `docs/inspo/README.md`. Mezclaría en esa capacidad un archivo que no es el README de entrega y sumaría un requisito sin comportamiento verificable en la página.

## Riesgos / Trade-offs

- [Que una búsqueda posterior encuentre "BookNest" y parezca un resto sin limpiar] → la verificación final lista las menciones esperadas (historial de C-02, texto de DD-04/DD-12/DD-15, frase de "inspiración inicial" en 02 y en `docs/inspo/README.md`).
- [Las capturas muestran portadas reales y alguien podría tomarlas como permiso para usar imágenes de tapas] → DD-15 y `docs/inspo/README.md` aclaran que el proyecto sigue con tapas en CSS (DD-12 vigente en esa parte).
- [Las imágenes no se ven en la vista previa por mayúsculas o espacios en la ruta] → rutas relativas exactas, verificadas abriendo el Markdown en una vista previa.
- [Las capturas siguen sin versionar] → el commit lo hace Amanda; el change solo verifica que existan.

## Decisiones resueltas (antes, preguntas abiertas)

- **DD-12 parcial vs. total**: Amanda confirmó "Reemplazada parcialmente por DD-15" (D1); las reglas de tapas en CSS, contraste y banner siguen en DD-12.
- **Prototipo de DD-14**: la ruta local `../../prueba_parcial_prog3` es el mismo prototipo publicado en el repositorio Prototipos-Frontend (se subió sin la imagen de BookNest y sin la carpeta `.vscode`). DD-15 lo declara explícitamente; DD-14 no se modifica.
- **Enlace publicado**: Amanda confirmó que `https://alucrecia-pagano.github.io/Prototipos-Frontend/` funciona; se agregó al README de `docs/inspo/`.
