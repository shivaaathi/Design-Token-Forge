<!-- Design Token Forge — Copilot workspace instructions -->

## Project

Design Token Forge — a unified token system + variable-exhaustive L1 component library.

## Key rules for AI assistants

1. Read `.instructions.md` at project root for full context before making changes.
2. All component styling uses CSS custom properties. NEVER hardcode visual values.
3. Variable naming: `--{prefix}-{property}` for components, `--{category}-{name}-{scale}` for global tokens.
4. Use data attributes for variants/states: `data-variant="primary"`, `data-size="base"`.
5. Every component must cover 7 axes: Shape, Dimension, Surface, Typography, Slots, Motion, A11y.
6. Specs go in `/specs/`, docs go in `/docs/`, code goes in `/packages/`.

## Key docs to reference

- Architecture: `docs/architecture/overview.md`
- Global tokens: `docs/tokens/global-tokens.md`
- Component template: `docs/components/variable-spec-template.md`
- Component inventory: `docs/components/inventory.md`
- Decision records: `docs/decisions/adrs.md`
