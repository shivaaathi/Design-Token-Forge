# Cross-Component Consistency Audit

**Date**: 2026-03-20  
**Scope**: All 12 completed L1 components  
**Status**: Findings documented — action items tracked below

---

## Executive Summary

The system is **fundamentally sound**. All 12 components follow the core architectural decisions (ADR-001 through ADR-006) — CSS custom properties only, data attributes for variants, 7-axis coverage, layered cascade. The audit found **no broken architecture** but identified **14 inconsistencies** across 3 severity levels.

| Severity | Count | Description |
|----------|-------|-------------|
| High     | 3     | Missing reduced-motion, ring/focus duplication, DatePicker density scale |
| Medium   | 6     | Naming inconsistencies that could confuse implementers |
| Low      | 5     | Documentation & section naming normalization |

---

## What's Consistent (The Foundation Is Solid)

| Aspect | Status | Details |
|--------|--------|---------|
| 7-Axis Coverage | ✅ 12/12 | Every component has Shape, Dimension, Surface, Typography, Slots, Motion, A11y |
| Internal Bridge Vars | ✅ 12/12 | All use `--_prefix-*` pattern (`--_btn-*`, `--_sw-*`, `--_dp-*`, etc.) |
| Token Section Headers | ✅ 12/12 | All use emoji format: 📐 SHAPE / 📏 DIMENSION / 🎨 SURFACE / ✏️ TYPOGRAPHY / 🧩 SLOTS / ⚡ MOTION / ♿ A11y |
| Forced Colors Support | ✅ 12/12 | `@media (forced-colors: active)` present in all component CSS |
| Data-Attribute Variants | ✅ 12/12 | All use `[data-variant]`, `[data-size]` selectors |
| Transition Properties | ✅ 12/12 | All define transition-property, duration, easing via tokens |
| Spec ↔ Token Alignment | ✅ 12/12 | Every spec YAML matches its token CSS implementation |
| Demo Page Structure | ✅ 12/12 | Hero, Density, States, Surface, Shape, Slots, Motion, Playground, A11y, Framework sections |
| Context Playground | ✅ 12/12 | All demo pages include interactive Context Playground |
| Framework Integration | ✅ 12/12 | All have 4 tabs: React, Vue, HTML, CSS Tokens |
| No @layer Usage | ✅ 12/12 | None use @layer (consistent) |
| CSS Class Scoping | ✅ 12/12 | All token variables scoped to component root class |

---

## Findings

### HIGH PRIORITY

#### H1: Reduced Motion — 10/12 Components Missing ✅ RESOLVED

**Resolution**: Added `@media (prefers-reduced-motion: reduce)` blocks to all 10 missing components. All 12/12 now have it. Each targets the component's transition-bearing selectors with `transition-duration: 0s !important; animation-duration: 0s !important;`.

#### H2: Focus Ring Variable Duplication ✅ RESOLVED

**Resolution**: Standardized all 12 components on `--{prefix}-focus-outline-width/color/offset` in the ♿ A11y section. Removed dead `--{prefix}-ring-*` variables from 📐 Shape sections (Button, IconButton, Input, Slider, DatePicker). Added `focus-outline-*` to Textarea and Select A11y sections (were missing). Updated CSS references in Textarea and Select to use `focus-outline-*` vars. Shape var counts corrected in all 7 files.

**Convention**: Focus keyboard outline → `--{prefix}-focus-outline-*` in ♿ A11y. No `ring-*` in Shape.

#### H3: DatePicker Density Scale — 4 vs 10 Sizes ✅ RESOLVED

**Resolution**: Expanded DatePicker to all 10 density modes: micro, tiny, small, base, medium, large, big, huge, mega, ultra. Tokens, CSS selectors, demo page, spec YAML, and inventory all updated.

---

### MEDIUM PRIORITY

#### M1: Outline vs. Outlined Naming ✅ RESOLVED

**Resolution**: Renamed all `--switch-outlined-*`, `--checkbox-outlined-*`, `--radio-outlined-*` tokens to `--switch-outline-*`, `--checkbox-outline-*`, `--radio-outline-*`. Updated `data-variant="outlined"` → `data-variant="outline"` in CSS, specs, and demos. All 12 components now consistently use `outline` (not `outlined`).

#### M2: Variant Taxonomy Inconsistency ✅ RESOLVED

**Resolution**: Documented in ADR-002 under "Variant Taxonomy" section. Buttons use semantic variants (primary, danger, etc.) because they convey intent. Form fields use structural variants only (outline, filled, underline) because they're functionally neutral. This is by design.

#### M3: CSS Root Class Naming ✅ RESOLVED

**Resolution**: Documented in ADR-002 under "CSS Root Class Naming Convention". Three patterns: bare name (simple components), hyphenated (compound names), `-group` suffix (form fields with label+helper wrappers).

#### M4: Typography Density Scaling Gap ✅ RESOLVED

**Resolution**: Added 10 per-density `--{prefix}-label-font-size-{size}` tokens to Toggle, Checkbox, and Radio. Updated CSS `[data-size]` selectors to map `--{prefix}-label-font-size` at each density. Scale follows Button convention: 10px, 11px, 12px, 14px, 14px, 16px, 16px, 18px, 20px, 24px. DatePicker also expanded to 10 font sizes (Task 2).

#### M5: A11y Section Variable Coverage ✅ RESOLVED

**Resolution**: Standardized A11y sections across all form elements:
- Radio: added `--radio-required-indicator`
- Input: added `--input-required-indicator`, `--input-required-color`
- Textarea: added `--textarea-min-tap-target`, `--textarea-required-indicator`, `--textarea-required-color`
- Select: added `--select-required-indicator`, `--select-required-color`

All form elements (Toggle, Checkbox, Radio, Input, Textarea, Select) now have: focus-outline-*, min-tap-target, required-indicator, required-color. Buttons keep only focus-outline-* + min-tap-target (no required/label tokens — correct by design).

#### M6: Motion — Dual Easing Pattern Undocumented ✅ RESOLVED

**Resolution**: This is inherent to the 7-axis system — components with animated inner parts (thumb, checkmark) define slot-specific easing tokens. Toggle: `--switch-thumb-transition-easing`, Checkbox: `--checkbox-check-transition-easing`. Already correctly documented in their spec YAMLs.

---

### LOW PRIORITY

#### L1: Section Naming in Demo Pages ✅ RESOLVED

**Resolution**: Standardized all demos: slot sections renamed to "Slots & Anatomy" everywhere (was "Slot Compositions", "Slot Combinations", or "Anatomy"). Variant section kept as-is: "Variant Gallery" for components with `data-variant`, "Design Styles" for CSS-driven components (Slider, DatePicker).

#### L2: Shape Modifier (data-rounded) Limited to Button-Family

Only buttons support `data-rounded`. Could be useful for Input (pill search bar), Select (rounded dropdowns), DatePicker (rounded day cells).

**Fix**: Low priority — add when requested. Document as intentional current scope.

#### L3: Border-Width Granularity

Button has 4-side border-width (`--btn-border-width-t/r/b/l`). Most others have single border-width.

**Fix**: Acceptable. Only add per-side control where it's needed (Input underline variant needs bottom-only).

#### L4: Padding Property Naming ✅ RESOLVED

**Resolution**: Documented in the variable-spec-template.md under "Padding Property Conventions". Rule: default to `padding-x`/`padding-y` for symmetric padding; use logical properties (`ps`/`pe`) only when a specific slot requires asymmetric RTL-sensitive inline padding.

#### L5: Demo [New] Tag Inconsistency ✅ RESOLVED

**Resolution**: No `[New]` tags found in any demo pages — already clean.

---

## Variable Count Distribution

| Component | Shape | Dim | Surface | Type | Slots | Motion | A11y | **Total** |
|-----------|-------|-----|---------|------|-------|--------|------|-----------|
| Button | 26 | 62 | 120 | 15 | 14 | 5 | 4 | **246** |
| IconButton | 16 | 20 | 72 | — | 2 | 5 | 5 | **120** |
| SplitButton | 14 | 50 | 48 | 15 | 12 | 5 | 5 | **149** |
| MenuButton | 14 | 40 | 48 | 15 | 12 | 5 | 5 | **139** |
| Toggle | 6 | 30 | 36 | 4 | 3 | 6 | 9 | **94** |
| Checkbox | 16 | 10 | 29 | 4 | 3 | 5 | 8 | **75** |
| Radio | 4 | 20 | 29 | 4 | 4 | 5 | 7 | **73** |
| Input | 24 | 52 | 52 | 15 | 20 | 5 | 4 | **172** |
| Textarea | 18 | 36 | 38 | 13 | 6 | 3 | 1 | **115** |
| Select | 18 | 32 | 38 | 13 | 16 | 3 | 1 | **121** |
| Slider | 19 | 39 | 27 | 11 | 8 | 7 | 9 | **120** |
| DatePicker | 21 | 36 | 50 | 19 | 11 | 8 | 5 | **150** |
| **System Total** | **196** | **427** | **587** | **128** | **111** | **62** | **63** | **~1574** |

---

## Action Plan

### Phase 1 — Fix Before Next Component (High Priority)
- [ ] Add `prefers-reduced-motion` to 10 components
- [ ] Expand DatePicker to 10 density modes
- [ ] Document ring vs focus-outline distinction

### Phase 2 — Normalize Naming (Medium Priority)
- [ ] Rename `outlined` → `outline` in Toggle/Checkbox/Radio tokens
- [ ] Add per-density font-size to Toggle/Checkbox/Radio
- [ ] Standardize A11y section variables across all form elements
- [ ] Document variant taxonomy (semantic vs structural) in ADR-002

### Phase 3 — Polish (Low Priority)
- [ ] Standardize demo section names
- [ ] Remove [New] tags from demo pages
- [ ] Document CSS class naming convention
- [ ] Document padding property conventions
