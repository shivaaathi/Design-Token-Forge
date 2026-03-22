# Design Token Forge

**A Complete Design System Generator — Unified Tokens, Variable-Exhaustive L1 Components, Multi-Product by Design.**

---

## What Is This?

Design Token Forge is a design system platform that solves the fundamental problems with existing design systems:

1. **Unified Token Ontology** — One naming convention across all products in your org
2. **Variable-Exhaustive L1 Components** — ~35 components where *every visual property* is a CSS custom property. No hardcoded values. Zero "you can't customize that" moments.
3. **Multi-Product Architecture** — Same components, same variable names, different values per product/brand
4. **Layered Cascade Resolution** — 3,000+ variables that feel like 50, because 90% auto-resolve from global tokens
5. **Framework-Agnostic** — CSS-first. Thin JS wrappers for React, Vue, Svelte, Web Components
6. **AI-Native Documentation** — Machine-readable component specs that AI coding assistants can consume directly

## Layered Resolution Model

```
Layer 0: DEFAULTS       → Shipped by Design Token Forge (sensible out of box)
    ↓ overrides
Layer 1: GLOBAL TOKENS  → Set org-wide ("our primary is blue, radius is 8px")
    ↓ overrides
Layer 2: PRODUCT TOKENS → Set per-product ("Product A's primary is orange")
    ↓ overrides
Layer 3: COMPONENT TOKENS → Set per-component ("our buttons are pill-shaped")
    ↓ overrides
Layer 4: INSTANCE       → Rare one-off inline var overrides
```

Most teams touch ~50 variables at Layers 1-2 and get a fully branded system. The other 2,950 resolve through the cascade. Power users can go as deep as they need.

## Variable Axis Taxonomy

Every L1 component exposes variables across these axes:

| Axis | What it covers |
|------|---------------|
| **📐 Shape** | border-radius (4 corners), border-width (4 sides), border-style, shadow, ring, outline, clip-path, overflow |
| **📏 Dimension** | width model, height × size, padding (x/y × size), min/max constraints, internal gap |
| **🎨 Surface** | background × variant × state, foreground, opacity, backdrop-filter |
| **✏️ Typography** | font-family, size × scale, weight, line-height, letter-spacing, text-transform |
| **🧩 Slots** | Sub-element variables (icon, label, indicator, etc.) with their own shape/color/size |
| **⚡ Motion** | transition-property, duration, easing, enter/exit/state-change animations |
| **♿ A11y** | focus-visible outline, min tap target, forced-colors overrides |

## Project Structure

```
design-token-forge/
├── docs/
│   ├── architecture/     # System architecture documentation
│   ├── tokens/           # Token specification docs
│   ├── components/       # Component variable spec docs
│   └── decisions/        # Architecture Decision Records (ADRs)
├── packages/
│   ├── tokens/           # Token engine — schema + resolution
│   ├── components/       # L1 component library (CSS + thin JS)
│   └── generator/        # Config → CSS generator
├── specs/
│   ├── tokens/           # Machine-readable token schemas (YAML)
│   └── components/       # Machine-readable component variable schemas
├── .github/
│   └── copilot-instructions.md
├── .instructions.md      # AI assistant project context
├── package.json          # pnpm monorepo root
└── README.md
```

## Tech Stack

- **Language**: TypeScript
- **Styling**: CSS Custom Properties (zero runtime)
- **Package Manager**: pnpm (monorepo with workspaces)
- **Build**: Vite (for dev/preview), unbuild (for packages)
- **Specs**: YAML schemas with JSON Schema validation
- **Docs**: Markdown (human) + YAML/JSON (machine)

## Status

🚧 **Phase 0: Foundation** — Defining specs, schemas, and architecture
