# Editorial Codex (TPI Frontend de una librería) — Instrucciones para Agentes

> Este archivo (y su copia `CLAUDE.md`) es lo PRIMERO que todo agente lee al entrar al repo.
> Generado a partir de `knowledge-base/` y `CHANGES.md`. No editar a mano sin re-sincronizar ambos archivos.

TPI de Programación III (UTN FRM, Prof. Matías Torres). Frontend estático de una librería que presenta su catálogo y registra libros, clientes y ventas **simulados en el navegador**. Una sola página (`index.html`) con 5 vistas como secciones: Catálogo, Libros, Clientes, Ventas, Historial.

Integrantes: Liendo Mateo, Avila Lucas, Pagano Amanda, Valentini Tiziano, Garcia Juan.

---

## Stack Tecnológico

| Capa | Tecnología | Notas |
|---|---|---|
| Estructura | HTML5 semántico | `index.html` único con secciones (DD-01) |
| Presentación | CSS3 propio, en archivos externos | Flexbox y/o Grid; tema oscuro; metodología BEM |
| Comportamiento | JavaScript nativo (ES2015+) | DOM y eventos; scripts clásicos con `defer` |
| Persistencia | `localStorage` del navegador | Etapa 2 (Ejercicio 6) |
| Recursos | Todo local | Sin imágenes de portadas: tapas generadas con CSS (DD-12) |

**Prohibido**: librerías, frameworks, CDNs, npm, dependencias instaladas, herramientas de compilación, `fetch`, backend. Se abre con doble clic sobre `index.html` (`file://`).

Detalle completo: [knowledge-base/02_descripcion_general.md](knowledge-base/02_descripcion_general.md)

---

## Base de Conocimiento

La fuente de verdad del dominio vive en `knowledge-base/`. **Leé el archivo relevante ANTES de implementar.**

| Archivo | Cuándo leerlo |
|---|---|
| [01_vision_y_objetivos.md](knowledge-base/01_vision_y_objetivos.md) | Propósito, alcance, división en etapas, fuera de alcance |
| [02_descripcion_general.md](knowledge-base/02_descripcion_general.md) | Stack, inspiración visual, criterios de evaluación (100 pts) |
| [03_actores_y_roles.md](knowledge-base/03_actores_y_roles.md) | Actores y operaciones permitidas (sin login) |
| [04_modelo_de_datos.md](knowledge-base/04_modelo_de_datos.md) | Entidades, relaciones, seed mínimo, claves de `localStorage` |
| [05_reglas_de_negocio.md](knowledge-base/05_reglas_de_negocio.md) | Reglas codificadas RN-XX-NN |
| [06_funcionalidades.md](knowledge-base/06_funcionalidades.md) | Historias US-001..012 por ejercicio y etapa |
| [07_flujos_principales.md](knowledge-base/07_flujos_principales.md) | Flujos + los 8 casos manuales de verificación |
| [08_arquitectura_propuesta.md](knowledge-base/08_arquitectura_propuesta.md) | Patrones, directorios, **tabla de contrato `id`/`name`**, formatos |
| [09_decisiones_y_supuestos.md](knowledge-base/09_decisiones_y_supuestos.md) | Decisiones DD-01..13 y supuestos |
| [10_preguntas_abiertas.md](knowledge-base/10_preguntas_abiertas.md) | ⚠️ Preguntas abiertas antes de codear |

> No quedan preguntas de prioridad **Alta** abiertas. Siguen abiertas para la Etapa 2 (se deciden dentro de su change): IN-02 libro repetido en venta (C-08), JSON corrupto en `localStorage` (C-05), regex de email (C-07).

---

## Skills Disponibles

Fuente: [.atl/skill-registry.md](.atl/skill-registry.md). Skills del proyecto instaladas en `.claude/skills/`.

| Agente | Rol | Skills que carga |
|---|---|---|
| **Maquetación (Etapa 1)** | HTML semántico, CSS, tema oscuro, responsive, filtro por título | `frontend-design`, `accessibility` |
| **Funcionalidad (Etapa 2)** | Datos locales, render, formularios con validación, ventas, historial, `localStorage` | `accessibility` (formularios, errores, `aria-live`) |
| **Orquestación** | OPSX: explore / propose / apply / archive / sync / update | `openspec-explore`, `openspec-propose`, `openspec-apply-change`, `openspec-archive-change`, `openspec-sync-specs`, `openspec-update-change` |

**No aplican a este proyecto** (no cargarlas): `tdd`, `vitest`, `python-pro`, `python-testing-patterns`.

Cargá la skill correspondiente al contexto ANTES de escribir código.

> Los compact rules de cada skill los resuelve el orquestador desde `.atl/skill-registry.md` (generado por `skill-registry`). En este proyecto **sí está versionado** (decisión del equipo) para que viaje con el repo; regeneralo con `/active-orchestrator:registry` si cambian las skills. Esta tabla solo mapea skill→rol.

---

## Roadmap de Changes

El plan de implementación completo está en [CHANGES.md](CHANGES.md). Resumen:

- **Total**: 11 changes + 1 opcional (C-12) en 2 etapas.
  - **Etapa 1 — Pagano Amanda**: C-01 `estructura-html-navegacion` (Ej. 1), C-02 `estilos-responsive-accesibilidad` (Ej. 2), C-03 `filtro-titulo-readme-avance` (filtro del Ej. 3 + README de avance).
  - **Etapa 2 — responsables a definir**: C-04 `datos-locales-catalogo-dinamico`, C-05 `persistencia-localstorage`, C-06 `alta-libros`, C-07 `alta-clientes`, C-08 `composicion-venta`, C-09 `confirmacion-venta`, C-10 `historial-ventas`, C-11 `casos-manuales-readme-final`.
  - **Opcional (posterior a la Etapa 2, depende de C-11)**: C-12 `extras-prototipo` (Inicio, escritores, detalles con estrellas, Ingresar/Registro, toasts, migas; insumo en `docs/extras-prototipo/`).
- **Camino crítico** (9): `C-01 → C-02 → C-03 → C-04 → C-05 → C-08 → C-09 → C-10 → C-11`.
- **Primer change**: `C-01` (`estructura-html-navegacion`) → `/opsx:propose estructura-html-navegacion`.

**Antes de cualquier `/opsx:propose`**: leé [CHANGES.md](CHANGES.md), identificá las dependencias del change y los archivos de "Leer antes".

---

## Reglas Duras (específicas del proyecto)

> Reglas **globales** ya definidas en `~/.claude/CLAUDE.md` (orquestador OPSX, delegación, governance, engram): el proyecto las **hereda**, no se repiten acá. **Excepción explícita**: el "Strict TDD Mode" del global **NO aplica** a este proyecto (ver regla 2).

Son contrato; romperlas es un defecto.

### Stack y verificación
1. **NUNCA** usar librerías, frameworks, CDNs, npm, dependencias, herramientas de build ni `fetch` → solo HTML, CSS y JavaScript nativos; persistencia con `localStorage`.
2. **NUNCA** escribir tests automáticos ni aplicar TDD (**anula el Strict TDD Mode del global**; no se cargan las skills `tdd`/`vitest`) → verificación **manual** en el navegador (320 px, 1280 px y teclado) y resultado registrado en el `README.md`.
3. **NUNCA** marcar un caso manual como aprobado sin haberlo ejecutado → registrar el comportamiento real observado, aunque falle (RN-GL-03).

### Git, repo y herramientas
4. **NUNCA** hacer `git commit` ni `git push` → los hace cada integrante al cerrar su etapa.
5. **NUNCA** ignorar en git `CLAUDE.md`, `AGENTS.md`, `openspec/`, `.atl/`, `.claude/skills/` ni `skills-lock.json` → deben quedar versionados.
6. **NUNCA** sobrescribir ni re-inicializar `openspec/` ni crear su estructura a mano → usar la CLI `openspec`.
7. **NUNCA** instalar skills con `-g` ni `-a '*'` → en el proyecto, una por comando: `npx skills add <repo> --skill <name> -a claude-code --copy`.
8. **NUNCA** borrar archivos ni correr comandos destructivos (`rm`, `git clean`, `git reset`, etc.) sin confirmación explícita de la usuaria → describir qué se borraría y esperar el OK.

### HTML y JavaScript
9. **NUNCA** insertar datos escritos por usuarios con `innerHTML` → usar `textContent` / `createElement` (RN-GL-01).
10. **NUNCA** usar `<script type="module">` → scripts clásicos con `<script src="..." defer>` (el docente abre por `file://`, SU-02).
11. **NUNCA** usar estilos ni handlers inline (`style="..."`, `onclick="..."`) → CSS en archivos externos y eventos con `addEventListener`.
12. **NUNCA** enviar un formulario sin controlarlo → botón `type="submit"` + `preventDefault()` en JS; la página nunca se recarga.
13. **NUNCA** renombrar un `id`/`name` del contrato de maqueta sin actualizar a la vez la tabla de [knowledge-base/08](knowledge-base/08_arquitectura_propuesta.md#tabla-de-contrato-id--name) y la del `README.md` (DD-08).
14. **NUNCA** guardar importes formateados ni fechas como texto de presentación → importes como `number`, formateados solo al mostrarlos con `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })` (2 decimales); fechas en ISO 8601, mostradas como `dd/mm/aaaa hh:mm`. Id de venta correlativo `V-0001` (DD-09..11).

### CSS y accesibilidad
15. **NUNCA** nombrar clases CSS fuera de la metodología **BEM** → `bloque__elemento--modificador`, reutilizables para elementos equivalentes.
16. **NUNCA** quitar el `outline` sin reemplazo ni expresar un error solo con color → foco visible con `:focus-visible` y errores siempre con texto.

### Idioma
17. **NUNCA** escribir la interfaz, los nombres del código o la documentación en otro idioma → todo en **español** (ej. `coincideTitulo`, `renderCatalogo`, mensajes de UI, README, artefactos de OpenSpec).

---

## Flujo de Trabajo

```
1. Leer la KB relevante (knowledge-base/)        → entender el dominio
2. Identificar el change en CHANGES.md           → respetar dependencias y etapa
3. /opsx:propose <nombre-del-change>             → proposal + design + specs + tasks
4. /opsx:apply (cargando skills)                 → respetando las reglas duras
5. Verificar a mano (320 px, 1280 px, teclado)   → registrar resultado real en README
6. /opsx:archive <nombre> + marcar [x] en CHANGES.md → cerrar el change
7. Commit/push: lo hace la persona responsable al cerrar su etapa (nunca el agente)
```

Aplicar TODAS las reglas duras en cada paso. Ante conflicto entre la KB y este archivo, las reglas duras prevalecen.
