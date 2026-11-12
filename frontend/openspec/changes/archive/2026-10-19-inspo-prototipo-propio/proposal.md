# Propuesta: inspo-prototipo-propio

## Por qué

La referencia visual del equipo era una captura de **BookNest** (`docs/inspo/inspo-booknest.png`), un diseño de terceros. El equipo ya tiene su **prototipo propio** (repositorio [Prototipos-Frontend](https://github.com/ALucrecia-Pagano/Prototipos-Frontend)), del que salió la identidad visual de Editorial Codex (DD-14). Amanda borró la captura de BookNest y sumó dos capturas del prototipo; ahora la documentación tiene que apuntar al prototipo propio para que nadie busque una imagen que ya no existe ni tome como referencia un diseño ajeno.

## Qué cambia

- **Nuevo** `docs/inspo/README.md` (en español): declara que la referencia visual es el prototipo propio, enlaza el repositorio, muestra las dos capturas (`prototipo-inicio.png` y `prototipo-recomendados.png`) con texto alternativo descriptivo y agrega una nota de créditos sobre las portadas que aparecen en las capturas.
- El enlace a la página publicada (`https://alucrecia-pagano.github.io/Prototipos-Frontend/`) se agrega: Amanda confirmó que funciona.
- `knowledge-base/09`: nueva decisión **DD-15** (referencia visual = prototipo propio, que tomó a BookNest como inspiración inicial). DD-04 se marca "Reemplazada por DD-15" y DD-12 "Reemplazada parcialmente por DD-15" (solo su parte "inspirado en BookNest"; tapas en CSS, contraste y foto del banner siguen vigentes). No se borra ninguna decisión.
- `knowledge-base/02`, `06`, `README.md` de la KB y el comentario de `docs/` en `08`: apuntan al prototipo (`docs/inspo/README.md`) en lugar de la imagen de BookNest.
- `CHANGES.md`: solo una nota en C-02 de que la imagen fue reemplazada por el prototipo propio en este change; el historial de C-02 no se reescribe.
- `README.md` principal y `openspec/specs/`: hoy no mencionan BookNest; se verifica con búsqueda y solo se tocan si aparece alguna mención.
- **No** se recrea `docs/inspo/inspo-booknest.png` (ya está borrada a mano; se verifica que figure como eliminada).

## Ejercicios de la consigna

No cubre ningún ejercicio nuevo. Es documentación de respaldo del **Ejercicio 2** (identidad visual propia y coherente, US-003): deja claro que la referencia es un diseño propio del equipo.

## Capacidades

### Capacidades nuevas
- Ninguna.

### Capacidades modificadas
- Ninguna. El change no altera el comportamiento de la página ni los requisitos del `README.md` principal (`documentacion-readme`), por eso declara `skip_specs: true`.

## Fuera de alcance

- Cualquier cambio en `index.html`, `css/` o `js/`: la identidad visual implementada no cambia.
- Agregar imágenes de portadas al proyecto: las tapas siguen siendo solo CSS (DD-12 vigente en esa parte). Las capturas muestran portadas reales solo como referencia del prototipo.
- Modificar changes archivados (`openspec/changes/archive/**`) o reescribir el historial de C-02 en `CHANGES.md`.
- Modificar DD-14 (incluida su mención a `../../prueba_parcial_prog3`), salvo que se resuelva la pregunta abierta del diseño.
- Copiar código o recursos del repositorio Prototipos-Frontend.
- Commits y push (los hace la persona responsable).

## Impacto

- Archivos nuevos: `docs/inspo/README.md`.
- Archivos editados: `knowledge-base/02_descripcion_general.md`, `knowledge-base/06_funcionalidades.md`, `knowledge-base/08_arquitectura_propuesta.md`, `knowledge-base/09_decisiones_y_supuestos.md`, `knowledge-base/README.md`, `CHANGES.md`.
- Archivos ya eliminados/agregados por la usuaria (solo se verifican): `docs/inspo/inspo-booknest.png` (eliminado), `docs/inspo/prototipo-inicio.png` y `docs/inspo/prototipo-recomendados.png` (nuevos).
- Sin impacto en código, datos, `localStorage` ni contrato `id`/`name`. Nivel de governance: **LOW**.
