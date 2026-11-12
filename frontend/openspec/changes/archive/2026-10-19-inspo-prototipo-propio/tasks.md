# Tareas: inspo-prototipo-propio

> Change solo de documentación (governance LOW). No se edita `index.html`, `css/` ni `js/`. No se borra ni recrea ningún archivo. Sin commits ni push.
> Las tareas de `knowledge-base/09` siguen la recomendación de `design.md` D1 (DD-12 reemplazada **parcialmente**), confirmada por Amanda.

## 1. Estado inicial de `docs/inspo/`

- [x] 1.1 Verificar que `docs/inspo/inspo-booknest.png` figura como eliminada y que NO se recrea: `git status --short docs/inspo` muestra ` D docs/inspo/inspo-booknest.png`.
- [x] 1.2 Verificar que existen las dos capturas propias: `docs/inspo/prototipo-inicio.png` y `docs/inspo/prototipo-recomendados.png` aparecen en `git status` como `??` (o ya agregadas) y se abren como imagen en el visor.

## 2. `docs/inspo/README.md` (referencia visual propia)

- [x] 2.1 Crear `docs/inspo/README.md` en español (design D4): título, frase "la referencia visual del equipo es el prototipo propio" y enlace con texto descriptivo al repositorio `https://github.com/ALucrecia-Pagano/Prototipos-Frontend`. Verificar abriendo el archivo en la vista previa de Markdown: el enlace lleva al repositorio.
- [x] 2.2 Agregar las dos capturas como imágenes Markdown con rutas relativas (`prototipo-inicio.png`, `prototipo-recomendados.png`) y texto alternativo descriptivo según la skill `accessibility` (describe lo que se ve: encabezado "Editorial CODEX", sidebar, banner y tarjeta "Historias por descubrir"; carruseles de recomendados y de escritores destacados, banner "Descubrí nuevos mundos"; nunca "imagen" ni el nombre del archivo). Verificar en la vista previa que ambas imágenes se ven y que el `alt` coincide con lo que muestra cada captura.
- [x] 2.3 Agregar la nota de créditos: "Las portadas de libros que se ven en las capturas pertenecen a sus autores, editoriales e ilustradores y se usan solo como ejemplo visual en un trabajo educativo, sin fines comerciales", más una línea que aclare que el prototipo tomó a BookNest como inspiración inicial y que el proyecto sigue usando tapas generadas con CSS (DD-12, DD-15). Verificar leyendo el archivo en la vista previa.
- [x] 2.4 Agregar el enlace a la página publicada `https://alucrecia-pagano.github.io/Prototipos-Frontend/` en `docs/inspo/README.md` (Amanda confirmó que carga). Verificar leyendo el archivo.

## 3. Decisiones en `knowledge-base/09_decisiones_y_supuestos.md`

- [x] 3.1 Confirmar que DD-15 es el número libre (`grep -rn "DD-15" knowledge-base CHANGES.md` sin resultados) y agregar **DD-15 — La referencia visual es el prototipo propio** después de DD-14, con el formato de DD-14 (Decisión, Contexto, Alternativas, Justificación, Reemplaza a): la referencia visual del proyecto es el prototipo propio (`docs/inspo/README.md`, repositorio Prototipos-Frontend), que tomó como inspiración inicial a BookNest; reemplaza a DD-04 (total) y a DD-12 (parcial: solo "inspirado en BookNest"); aclara que las capturas muestran portadas reales pero el proyecto sigue con tapas en CSS y que la nota de créditos cubre solo las capturas; menciona que DD-14 cita el prototipo en `../../prueba_parcial_prog3` y que DD-14 no se modifica. Verificar leyendo la sección renderizada.
- [x] 3.2 Marcar DD-04 con "**Estado**: Reemplazada por DD-15" (y su referencia a la imagen como histórica), sin borrar su texto. Verificar que DD-04 sigue presente y muestra el estado.
- [x] 3.3 Marcar DD-12 con "**Estado**: Reemplazada parcialmente por DD-15 — solo la parte \"inspirado en BookNest\"; las tapas en CSS, el contraste WCAG AA y la foto decorativa del banner siguen vigentes", sin borrar su texto. Verificar que DD-12 conserva todas sus reglas y que `CLAUDE.md`/`AGENTS.md` (que citan DD-12 para las tapas) siguen siendo correctos sin editarlos.

## 4. Resto de la base de conocimiento

- [x] 4.1 `knowledge-base/02_descripcion_general.md`, sección "Inspiración visual": reemplazar la referencia a `docs/inspo/inspo-booknest.png` por el prototipo propio (enlace a `../docs/inspo/README.md`), indicando que el prototipo tomó a BookNest como inspiración inicial y citando DD-15 junto a DD-04/DD-12. Mantener el párrafo "Decidido (DD-12)" sobre tapas en CSS. Verificar en la vista previa que el enlace abre `docs/inspo/README.md`.
- [x] 4.2 `knowledge-base/06_funcionalidades.md` US-003: cambiar "(inspirados en BookNest, no copiados)" por una referencia al prototipo propio (`docs/inspo/README.md`, DD-15). Verificar leyendo la línea.
- [x] 4.3 `knowledge-base/README.md`: en la línea 3, reemplazar `docs/inspo/inspo-booknest.png` por el prototipo propio (`docs/inspo/README.md`), aclarando que la KB se generó inicialmente con la captura de BookNest si hace falta conservar el dato; en la fila de 02 cambiar "inspo visual" por "referencia visual (prototipo propio)". Verificar en la vista previa.
- [x] 4.4 `knowledge-base/08_arquitectura_propuesta.md:27`: ajustar el comentario de `docs/` a algo como `# consigna (fuente, no se modifica) + inspo/ con el prototipo propio (README)`. Verificar que el árbol de directorios sigue alineado.

## 5. Roadmap y documentos de entrega

- [x] 5.1 `CHANGES.md`: agregar dentro del bloque de C-02, después de su lista "Leer antes", una nota: la imagen `docs/inspo/inspo-booknest.png` fue reemplazada por el prototipo propio (`docs/inspo/README.md`) en el change `inspo-prototipo-propio` (DD-15). No modificar las líneas 178 ni 233. Verificar con `git diff CHANGES.md` que solo se agregaron líneas.
- [x] 5.2 Revisar `README.md` principal, `openspec/specs/`, `CLAUDE.md` y `AGENTS.md` con `grep -rni "booknest\|inspo-booknest" README.md openspec/specs CLAUDE.md AGENTS.md`: si no hay resultados, no se tocan; si aparece alguna mención, actualizarla con el mismo criterio (apuntar a `docs/inspo/README.md`). Registrar el resultado de la búsqueda en el resumen del apply.

## 6. Verificación final

- [x] 6.1 Ejecutar `grep -rni booknest . --exclude-dir=.git --exclude-dir=archive` y confirmar que solo quedan las menciones previstas: historial de C-02 en `CHANGES.md` (líneas 178 y 233 y la nota nueva), texto de DD-04/DD-12/DD-15, la frase de "inspiración inicial" en `knowledge-base/02` y en `docs/inspo/README.md` (y, si se conservó, el dato de origen en `knowledge-base/README.md`).
- [x] 6.2 Ejecutar `git status` y confirmar: `docs/inspo/inspo-booknest.png` eliminada, `docs/inspo/README.md` y las dos capturas nuevas, y solo los `.md` previstos modificados. Confirmar con `git diff --stat -- index.html css js` que no hay cambios en HTML, CSS ni JS.
- [x] 6.3 Abrir `index.html` por `file://` a 320 px, a 1280 px y recorrerlo con teclado (Tab, Shift+Tab, Enter) para confirmar que la página se ve y funciona igual que antes del change (no se tocó código). Registrar el resultado real observado; no marcar sin haberlo ejecutado. — **Resultado (verificado por el grupo, 19/10/2026):** la página se ve igual, sin errores en consola, sin scroll horizontal a 320 y a 1280 px, y con foco visible al recorrerla con Tab.
