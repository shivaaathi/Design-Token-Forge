---
name: dtf-component-qc
description: "QC and review checklist for Design Token Forge components. Use when: building a new component, reviewing an existing component for consistency, auditing component library quality, running a pre-push quality gate, fixing missed patterns, checking UI issues in demo pages, or ensuring designer-level customization depth. Covers tokens CSS, component CSS, demo pages, nav integration, variant system, UI quality, and real-world designer usage completeness."
---

# DTF Component QC — Quality & Consistency Review

The gold standard is **button.html** (246 vars, 11 demo sections, hero inspector, state matrix, surface context, shape gallery, context playground, framework snippets). Every component must match this quality bar.

## When to Use

- **Before building** a new component — read ALL checklists first, plan the build
- **After building** a component — run full QC pass before push
- **Reviewing** an existing component — audit against ALL checklists
- **Debugging** a broken or invisible component — check UI quality rules
- **Ensuring designer adoption** — check designer-usage completeness

## Workflow

### Phase 1: Pre-Build Planning

Before writing any code, determine the component's classification:

| Type | Variant System | Examples |
|------|---------------|----------|
| **Interactive control** | Structural variants (outline, filled, ghost) | Button, Input, Select, FileUpload |
| **Display/feedback** | Semantic roles + structural variants (filled, outline, soft) | Badge, Alert, Toast, Progress |
| **Layout/container** | Surface variants (elevated, flat, outlined) | Card, Accordion, Modal |
| **Compound** | Filled + outlined (empty string = filled) | Toggle, Checkbox, Radio |

**CRITICAL RULE**: Display/feedback components need BOTH semantic roles AND structural variants. Roles = color (info, success, warning, danger). Variants = surface treatment (filled, outline, soft). These are orthogonal axes.

Confirm the prefix (2-3 letter internal var prefix):
- Must be unique across entire system
- Existing prefixes: btn, al, fu, sw, in, ck, bd, tt, ts, pg, rg — check before assigning

### Phase 2: Token File QC

Run [Token Checklist](./references/token-checklist.md).

### Phase 3: Component CSS QC

Run [CSS Checklist](./references/css-checklist.md).

### Phase 4: Demo Page QC

Run [Demo Checklist](./references/demo-checklist.md).

### Phase 5: UI Quality QC

Run [UI Quality Checklist](./references/ui-quality-checklist.md).

### Phase 6: Designer-Usage Completeness

Run [Designer Usage Checklist](./references/designer-usage-checklist.md).

### Phase 7: Integration QC

Run [Integration Checklist](./references/integration-checklist.md).

### Phase 8: Cross-Component Consistency

Run [Consistency Checklist](./references/consistency-checklist.md).

## Quick QC Command (Post-Build)

After building, run this mental checklist in order:

```
TOKEN FILE
 ✓ All 7 axis headers present with emoji markers (📐📏🎨✏️🧩⚡♿)
 ✓ All values reference global tokens (zero hardcoded hex/px)
 ✓ 10 density sizes for EVERY per-size property (including icon-size)
 ✓ Variant/role surface tokens have ALL states (bg, hover, active, disabled, fg, fg-disabled, border-color, border-color-hover, opacity-disabled)
 ✓ Shadow tokens per state (shadow, shadow-hover, shadow-active)
 ✓ Shape override tokens (rounded/pill + square if applicable)

COMPONENT CSS
 ✓ Internal --_ prefix is unique (2-3 letters)
 ✓ Base sets ALL internal vars with defaults
 ✓ :not([data-size]) + [data-size="base"] combined as default
 ✓ 10 size selectors each set ALL internal vars (no cascade gaps)
 ✓ Variant selectors include :not([data-variant]) for default
 ✓ Per-variant hover AND active AND disabled states (not global-only)
 ✓ :has() for slot-conditional styling (icons, dismiss buttons, etc.)
 ✓ @keyframes for any animations (dismiss, loading, enter/exit)
 ✓ @media (forced-colors: active) section
 ✓ @media (prefers-reduced-motion: reduce) section
 ✓ Readable formatting — one selector per line, section comments

DEMO PAGE (match button.html quality bar)
 ✓ CSS imports: global tokens → component tokens → component CSS → shared.css
 ✓ Nav dropdown: ALL existing components listed in correct order
 ✓ aria-current="page" on own link only
 ✓ Sidebar nav numbered sections match actual sections
 ✓ Hero section with BOTH preview AND resolved token inspector
 ✓ Variant/Role gallery with all combinations
 ✓ Density scale — all 10 sizes
 ✓ State Matrix — every variant × state (default, hover, active, disabled, error)
 ✓ Surface Context — component on 3 background levels
 ✓ Shape & Shadow — radius scales + shadow presets
 ✓ Slots & Anatomy — all sub-elements shown
 ✓ A11y section with 4 cards + live demos
 ✓ Framework section with 4 tabs: React, Vue, HTML, CSS Tokens
 ✓ Context Playground — interactive role/surface switcher (if applicable)
 ✓ Global pill-bar controls REACTIVE across all sections
 ✓ IIFE pattern, DTF.onThemeChange hook

UI QUALITY
 ✓ Component visible on all 3 surface backgrounds (not invisible)
 ✓ Dark mode renders correctly (no contrast issues)
 ✓ Animations/transitions demo'd interactively (not just CSS presence)
 ✓ Long text/overflow handled (truncation shown)
 ✓ No layout gaps (flex/grid spacing consistent)
 ✓ <style> block for demo-only layout rules

DESIGNER USAGE
 ✓ Icon slot scales with density (10 per-size entries)
 ✓ Shape override tokens (rounded, square)
 ✓ Loading/skeleton state (if applicable)
 ✓ Truncation/overflow handling
 ✓ Focus-within for composed elements
 ✓ Custom color override surface

INTEGRATION
 ✓ index.css imports both token + CSS files
 ✓ src/index.css import uncommented
 ✓ demo/index.html card: planned → done with <a> link
 ✓ demo/index.html nav dropdown: link added in correct position
 ✓ ALL existing demo pages: nav dropdown updated with new link
 ✓ No corrupted HTML from sed operations — verify with grep
```
