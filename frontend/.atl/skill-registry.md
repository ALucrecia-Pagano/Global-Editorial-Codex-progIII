# Skill Registry

**Delegator use only.** Any agent that launches sub-agents reads this registry to resolve compact rules, then injects them directly into sub-agent prompts. Sub-agents do NOT read this registry or individual SKILL.md files.

Project: TPI "Frontend de una libreria" (Editorial Codex). Stack: HTML5 + CSS3 + vanilla JS + localStorage. NO libraries/frameworks/CDNs/npm/build/fetch. NO automated tests, NO TDD: verification is manual in the browser (320px, 1280px, keyboard), results recorded in README.

## User Skills

### Aplican al proyecto

| Trigger | Skill | Path |
|---------|-------|------|
| "improve accessibility", "a11y audit", "WCAG", "keyboard navigation" | accessibility | .claude/skills/accessibility/SKILL.md |
| building/reshaping UI, aesthetic direction, typography | frontend-design | .claude/skills/frontend-design/SKILL.md |
| "openspec apply", "opsx apply" | openspec-apply-change | .claude/skills/openspec-apply-change/SKILL.md |
| "openspec archive", "opsx archive" | openspec-archive-change | .claude/skills/openspec-archive-change/SKILL.md |
| "openspec explore", "opsx explore" | openspec-explore | .claude/skills/openspec-explore/SKILL.md |
| "openspec propose", "opsx propose" | openspec-propose | .claude/skills/openspec-propose/SKILL.md |
| "openspec sync", "opsx sync" | openspec-sync-specs | .claude/skills/openspec-sync-specs/SKILL.md |
| "openspec update change", "opsx update" | openspec-update-change | .claude/skills/openspec-update-change/SKILL.md |

### Foundation / tooling (global, no se inyectan en codigo del proyecto)

| Trigger | Skill | Path |
|---------|-------|------|
| start project foundation flow | active-orchestrator | ~/.claude/skills/active-orchestrator/SKILL.md |
| generate AGENTS.md / CLAUDE.md | agent-instruction | ~/.claude/skills/agent-instruction/SKILL.md |
| discovery / market research | discovery-research | ~/.claude/skills/discovery-research/SKILL.md |
| find/install skills | find-skill, find-skills | ~/.claude/skills/find-skill(s)/SKILL.md |
| build knowledge base | kb-creator | ~/.claude/skills/kb-creator/SKILL.md |
| generate CHANGES.md | roadmap-generator | ~/.claude/skills/roadmap-generator/SKILL.md |
| create/improve skills | skill-creator | ~/.claude/skills/skill-creator/SKILL.md |
| competitor scraping | web-scraper | ~/.claude/skills/web-scraper/SKILL.md |

### NO APLICAN a este proyecto (no se cargan ni se inyectan reglas)

| Skill | Motivo |
|-------|--------|
| tdd | no aplica a este proyecto: sin tests automatizados ni TDD |
| vitest | no aplica a este proyecto: sin npm/build/test runner |
| python-pro | no aplica a este proyecto: no hay Python |
| python-testing-patterns | no aplica a este proyecto: no hay Python ni tests |

## Compact Rules

Pre-digested rules per skill. Delegators copy matching blocks into sub-agent prompts as `## Project Standards (auto-resolved)`.

### accessibility
- Target WCAG 2.2 AA. Prefer native elements (`<button>`, `<a href>`, `<label>`, `<dialog>`) over div + role/tabindex; ARIA only when no native option.
- Every `<img>` has alt (descriptive; `alt=""` if decorative). Icon-only buttons need an accessible name (aria-label or `.visually-hidden` text); icons `aria-hidden="true"`.
- Contrast: normal text 4.5:1, large text 3:1, UI components/focus indicators 3:1. Never convey info by color alone (add text/icon).
- Never remove focus outline; use `:focus-visible { outline: 2px solid currentColor; outline-offset: 2px }`. Focused element must not be hidden by sticky headers (`scroll-margin-top`).
- Everything keyboard operable, logical focus order, no keyboard traps; provide a skip link; modals: native `<dialog>` or focus trap + Esc + return focus.
- Touch/click targets >= 24x24 CSS px (aim 44x44 on mobile). No drag-only actions.
- Respect `@media (prefers-reduced-motion: reduce)` (kill animations/transitions/smooth scroll).
- `<html lang="es">`, one `<h1>`, no skipped heading levels, landmarks (`header/nav/main/footer`), descriptive link text.
- Forms: every input has an associated `<label>`; errors: `aria-invalid="true"`, `aria-describedby` to message, `role="alert"`/`aria-live`, focus first error on submit; don't make users re-enter data (3.3.7).
- Dynamic updates (toasts, sale confirmations) announced via `aria-live` region without moving focus.
- Check at 200% zoom and 320px; manual keyboard pass is mandatory. Lighthouse/axe need npm: use only as external dev check, never as a project dependency.

### frontend-design
- Identify the real subject (a bookstore: Editorial Codex) and draw palette/type/layout from its vernacular; make deliberate, distinctive choices, not templated defaults.
- Plan first (4-6 named hex colors, type roles, layout, principles), review against the brief, then code. Define tokens as CSS custom properties.
- Typography carries personality: 1-2 families (if two, clearly distinct), explicit type scale, line length < 80ch, serif body gets slightly more line-height. No CDN fonts: use system/local font stacks.
- Avoid tells: cream bg + terracotta accent, near-black + acid accent, identical rounded SaaS cards with same grey shadow, ALL-CAPS tracked eyebrows above every heading, "A · B · C" meta strings, arrow on every link, accenting one word in a headline.
- Structural devices (borders, numbering, dividers) must encode information; numbered markers only for real sequences.
- Motion: sparse, one orchestrated moment max; user-triggered motion (open/expand/confirm) is welcome; no fade-slide-up on every section.
- Spend boldness in one memorable element; keep the rest quiet.
- Quality floor: responsive to 320px, visible keyboard focus, reduced-motion respected, accessible contrast.
- Watch CSS specificity collisions (e.g. `.section` vs element selectors) on padding/margins.
- Copy: active voice, sentence case, specific CTAs ("Guardar cambios", not "Enviar"), same verb across flow and confirmation; errors say what failed and how to fix; empty states invite action. UI copy in Spanish.

### openspec-explore
- Thinking-partner mode only: investigate, clarify, compare options; NEVER implement code. May create/update OpenSpec artifacts if the user asks.
- Start from `openspec list --json`; read existing change artifacts via CLI paths, not guesses.
- Surface tradeoffs and open questions; offer to capture insights into proposal/design/tasks.

### openspec-propose
- CLI is source of truth: `openspec new change "<kebab-name>"`, then `openspec status --change "<name>" --json` and `openspec instructions <artifact-id> --change "<name>" --json` per artifact.
- Create artifacts in dependency order (proposal -> specs/design -> tasks) until all `applyRequires` are done; follow each instruction's template and rules (do not copy context/rules blocks into files).
- Read dependency artifacts before creating the next; ask the user only if the request is unclear.
- Never create `openspec/` structure manually.

### openspec-apply-change
- `openspec status --change "<name>" --json` then `openspec instructions apply --change "<name>" --json`; read all `contextFiles` before coding.
- Implement tasks in order with minimal scoped changes; mark each `- [ ]` -> `- [x]` in tasks.md right after finishing it.
- Pause and report on unclear tasks, design issues, errors or blockers; do not guess.
- This project has no tests: verify manually in the browser (320px, 1280px, keyboard) and note results; ignore TDD requirements.
- On completion show progress and suggest archive.

### openspec-archive-change
- Check `openspec status`; warn (do not block) on incomplete artifacts/tasks; assess delta spec sync status and offer sync before archiving.
- Move change to `openspec/changes/archive/YYYY-MM-DD-<name>/`; fail clearly if the target exists.
- Report summary: schema, archive location, spec sync state, warnings.

### openspec-sync-specs
- Agent-driven merge of delta specs (`openspec/changes/<name>/specs/`) into main specs `openspec/specs/<capability>/spec.md` without archiving.
- Apply ADDED/MODIFIED/REMOVED/RENAMED requirements intelligently (partial updates allowed); keep requirement + scenario structure intact.
- Idempotent: re-running yields the same result.

### openspec-update-change
- Revise existing planning artifacts (proposal/design/specs/tasks) and keep them coherent with each other; fold new decisions into every affected artifact.
- NEVER edit code. If the user means the `openspec update` CLI command, run that instead.
- Re-check `openspec status` after edits; do not discard completed task progress without telling the user.

## Project Conventions

| File | Path | Notes |
|------|------|-------|
| CLAUDE.md / AGENTS.md | (not created yet) | Next phase (agent-instruction) generates them |
| Knowledge base | knowledge-base/README.md | 10 canonical files (vision, data model, rules, features, flows, architecture, decisions, open questions) |
| Roadmap | CHANGES.md | Operational index of OpenSpec changes |
| Orchestrator state | .active-orchestrator-state.json | Shared foundation state |

Read the convention files listed above for project-specific patterns and rules.
