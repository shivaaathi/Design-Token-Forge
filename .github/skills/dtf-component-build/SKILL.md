---
name: dtf-component-build
description: "End-to-end component build pipeline for Design Token Forge. Use when: building a new component from scratch, implementing a component from its YAML spec, creating component tokens CSS, writing component structural CSS, building a demo page, or following the spec→tokens→CSS→demo pipeline. Covers the full lifecycle from zero to a shippable component. For reviewing existing components, use dtf-component-qc instead."
---

# DTF Component Build — Spec to Ship Pipeline

## Purpose

Build a new DTF component from zero to gold standard in a single pipeline. This skill covers: reading the spec → writing token CSS → writing structural CSS → creating the demo page → integration into the library.

## When to Use

- Building a **new** component that doesn't exist yet
- Implementing a component that has a YAML spec but no CSS yet
- Rebuilding an existing component to gold standard

## When NOT to Use

- Reviewing/auditing an existing component → use `dtf-component-qc`
- Fixing a single bug in an existing component → just fix it directly
- Adding framework wrappers → use `dtf-framework-wrapper`

## Prerequisites

Before building, the component MUST have a YAML spec in `/specs/components/{component}.yaml`. If it doesn't exist, create the spec first using the [Spec Template](./references/spec-creation-guide.md).

## The Pipeline (MUST follow in order)

### Step 0: Read the Spec & Plan

1. Read `/specs/components/{component}.yaml` completely
2. Read `/docs/components/variable-spec-template.md` for reference
3. Identify:
   - Component prefix (e.g., `btn`, `card`, `inp`)
   - Number of variants (structural) and roles (semantic)
   - Which of the 10 density modes apply
   - Sub-elements (slots) that need their own tokens
   - States: hover, active, disabled, error, loading, etc.
4. Read the gold standard for comparison:
   - `/packages/components/src/button/button.tokens.css` (246 tokens, 7 axes)
   - `/packages/components/src/button/button.css` (829 lines, all patterns)
   - `/demo/button.html` (11 sections, inspector, pill bars)

### Step 1: Write Token CSS

Follow [Token Build Guide](./references/token-build-guide.md).

**Verification**: Run the token checklist from `dtf-component-qc`.

### Step 2: Write Component CSS

Follow [CSS Build Guide](./references/css-build-guide.md).

**Verification**: Run the CSS checklist from `dtf-component-qc`.

### Step 3: Create Demo Page

Follow [Demo Build Guide](./references/demo-build-guide.md).

**Verification**: Run the demo checklist from `dtf-component-qc`.

### Step 4: Integration

Follow the integration checklist from `dtf-component-qc`.

### Step 5: Visual Regression Baselines

```bash
cd /Users/sridhar-2917/Design-Token-Forge
npx playwright test --grep "{component}" --update-snapshots
```
- [ ] New baseline screenshots created in `tests/visual/__screenshots__/`
- [ ] Review screenshots visually — component should be visible and correctly styled

### Step 6: Final QC Pass

Run the full `dtf-component-qc` skill on the completed component.

## Architecture Rules (NEVER violate)

1. **7 axes required**: Shape, Dimension, Surface, Typography, Slots, Motion, A11y
2. **Zero hardcoded values**: Every visual property is a CSS custom property
3. **10 density modes**: micro, tiny, small, base, medium, large, big, huge, mega, ultra
4. **Internal bridge vars**: Component CSS uses `--_{prefix}-*` internal vars, never reads public tokens directly in property declarations
5. **Data attributes for API**: `data-size`, `data-variant`, `data-role`, `data-rounded`, `data-disabled`, `data-error`
6. **BEM naming**: `.{component}`, `.{component}__{element}`
7. **Single CSS file pair**: `{component}.tokens.css` (defaults) + `{component}.css` (structural + state)

## File Checklist (what gets created)

| File | Purpose | Created in |
|---|---|---|
| `specs/components/{comp}.yaml` | Machine-readable variable spec | Step 0 |
| `packages/components/src/{comp}/{comp}.tokens.css` | Token defaults (all 7 axes) | Step 1 |
| `packages/components/src/{comp}/{comp}.css` | Structural CSS + states | Step 2 |
| `packages/components/src/{comp}/index.css` | Entry point (2 imports) | Step 2 |
| `demo/{comp}.html` | Interactive demo page | Step 3 |
| Update: `packages/components/src/index.css` | Uncomment/add import | Step 4 |
| Update: `demo/index.html` | Card + nav link | Step 4 |
| Update: ALL `demo/*.html` | Nav dropdown link | Step 4 |
