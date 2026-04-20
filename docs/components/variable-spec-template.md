# Component Variable Specification Template

This document defines the standard template for specifying L1 component variables. Every component spec MUST follow this structure.

---

## Template Structure

```yaml
# /specs/components/{component-name}.yaml
component:
  name: "{ComponentName}"
  tag: "{html-tag}"              # Primary HTML element
  prefix: "{prefix}"             # CSS variable prefix (e.g., "btn", "input")
  description: "..."
  category: "inputs|display|layout|navigation|overlay|feedback"

sizes: [micro, tiny, small, base, medium, large, big, huge, mega, ultra]
                                 # Which density modes this component supports
                                 # (not all components need all 10 modes;
                                 #  `base` is the default)

variants: [primary, secondary, tertiary, ghost, danger, success, warning]
                                 # Which visual variants it supports

states: [default, hover, active, focus-visible, disabled, loading, error, selected]
                                 # Which interactive states it has

variables:

  # ──────────────────────────────────────────
  # 📐 SHAPE
  # ──────────────────────────────────────────
  shape:
    border-radius:
      - name: "--{prefix}-radius-tl"
        default: "var(--radius-md)"
        description: "Top-left border radius"
      - name: "--{prefix}-radius-tr"
        default: "var(--radius-md)"
        description: "Top-right border radius"
      - name: "--{prefix}-radius-br"
        default: "var(--radius-md)"
        description: "Bottom-right border radius"
      - name: "--{prefix}-radius-bl"
        default: "var(--radius-md)"
        description: "Bottom-left border radius"

    border:
      - name: "--{prefix}-border-width-t"
        default: "1px"
      - name: "--{prefix}-border-width-r"
        default: "1px"
      - name: "--{prefix}-border-width-b"
        default: "1px"
      - name: "--{prefix}-border-width-l"
        default: "1px"
      - name: "--{prefix}-border-style"
        default: "solid"
        options: [solid, dashed, dotted, double, none]

    shadow:
      - name: "--{prefix}-shadow"
        default: "var(--shadow-none)"
      - name: "--{prefix}-shadow-hover"
        default: "var(--shadow-sm)"
      - name: "--{prefix}-shadow-active"
        default: "var(--shadow-none)"

    outline:
      - name: "--{prefix}-outline-style"
        default: "solid"
      - name: "--{prefix}-outline-width"
        default: "2px"

    clip:
      - name: "--{prefix}-clip-path"
        default: "none"
        description: "Custom clip shape (none, pill, squircle, or CSS clip-path)"

    overflow:
      - name: "--{prefix}-overflow"
        default: "hidden"
        options: [visible, hidden, clip, scroll, auto]

  # ──────────────────────────────────────────
  # 📏 DIMENSION
  # ──────────────────────────────────────────
  dimension:
    height:
      # One entry per supported density mode
      - name: "--{prefix}-height-{size}"
        default: "varies"
        per_size:
          micro: "var(--spacing-18)"
          tiny: "var(--spacing-20)"
          small: "var(--spacing-24)"
          base: "var(--spacing-32)"
          medium: "var(--spacing-36)"
          large: "var(--spacing-40)"
          big: "var(--spacing-48)"
          huge: "var(--spacing-54)"
          mega: "var(--spacing-64)"
          ultra: "var(--spacing-80)"

    padding:
      - name: "--{prefix}-padding-x-{size}"
        description: "Horizontal (inline) padding"
        per_size:
          micro: "var(--spacing-4)"
          tiny: "var(--spacing-6)"
          small: "var(--spacing-8)"
          base: "var(--spacing-12)"
          medium: "var(--spacing-14)"
          large: "var(--spacing-16)"
          big: "var(--spacing-20)"
          huge: "var(--spacing-24)"
          mega: "var(--spacing-32)"
          ultra: "var(--spacing-40)"
      - name: "--{prefix}-padding-y-{size}"
        description: "Vertical (block) padding"
        per_size:
          micro: "var(--spacing-1)"
          tiny: "var(--spacing-2)"
          small: "var(--spacing-3)"
          base: "var(--spacing-4)"
          medium: "var(--spacing-5)"
          large: "var(--spacing-6)"
          big: "var(--spacing-8)"
          huge: "var(--spacing-10)"
          mega: "var(--spacing-12)"
          ultra: "var(--spacing-16)"

    width:
      - name: "--{prefix}-min-width"
        default: "auto"
      - name: "--{prefix}-max-width"
        default: "none"
      - name: "--{prefix}-inline-size"
        default: "auto"
        options: [auto, fit-content, fill-available, "100%"]

    gap:
      - name: "--{prefix}-gap"
        default: "var(--spacing-2)"
        description: "Internal content gap"

  # ──────────────────────────────────────────
  # 🎨 SURFACE
  # ──────────────────────────────────────────
  # Component surfaces reference Tokn T1 semantic roles and T2 surface contexts.
  # Repeat for each variant × state combination
  # Pattern: --{prefix}-{variant}-{property}-{state}
  # state "default" is omitted from name
  surface:

    per_variant:
      - property: "bg"
        states: [default, hover, active, disabled]
      - property: "fg"
        states: [default, hover, disabled]
      - property: "border-color"
        states: [default, hover, active, disabled]
      - property: "opacity-disabled"
        states: null  # single value, not per-state

    # Example expansion for "primary" variant (referencing Tokn T1):
    # --{prefix}-primary-bg         → var(--primary-component-bg-default)
    # --{prefix}-primary-bg-hover   → var(--primary-component-bg-hover)
    # --{prefix}-primary-bg-active  → var(--primary-component-bg-pressed)
    # --{prefix}-primary-bg-disabled → var(--primary-component-bg-default) + opacity
    # --{prefix}-primary-fg         → var(--primary-on-component)
    # --{prefix}-primary-fg-hover   → var(--primary-on-component)
    # --{prefix}-primary-fg-disabled → var(--primary-on-component) + opacity
    # --{prefix}-primary-border-color → var(--primary-component-outline-default)
    # --{prefix}-primary-border-color-hover → var(--primary-component-outline-hover)
    # --{prefix}-primary-border-color-active → var(--primary-component-outline-pressed)
    # --{prefix}-primary-border-color-disabled → var(--primary-component-outline-default)
    # --{prefix}-primary-opacity-disabled → 0.5

  # ──────────────────────────────────────────
  # ✏️ TYPOGRAPHY
  # ──────────────────────────────────────────
  typography:
    - name: "--{prefix}-font-family"
      default: "var(--font-family-sans)"
    - name: "--{prefix}-font-size-{size}"
      per_size:
        micro: "var(--font-size-10)"
        tiny: "var(--font-size-11)"
        small: "var(--font-size-12)"
        base: "var(--font-size-14)"
        medium: "var(--font-size-14)"
        large: "var(--font-size-16)"
        big: "var(--font-size-18)"
        huge: "var(--font-size-20)"
        mega: "var(--font-size-24)"
        ultra: "var(--font-size-28)"
    - name: "--{prefix}-font-weight"
      default: "var(--font-weight-medium)"
    - name: "--{prefix}-line-height"
      default: "var(--line-height-normal)"
    - name: "--{prefix}-letter-spacing"
      default: "var(--letter-spacing-normal)"
    - name: "--{prefix}-text-transform"
      default: "none"
      options: [none, uppercase, capitalize, lowercase]

  # ──────────────────────────────────────────
  # 🧩 SLOTS (sub-elements)
  # ──────────────────────────────────────────
  # Slots are component-specific. Each slot follows a mini version
  # of the shape/dimension/surface/typography template.
  slots:
    "{slot-name}":
      - name: "--{prefix}-{slot}-size"
      - name: "--{prefix}-{slot}-color"
      - name: "--{prefix}-{slot}-color-hover"
      - name: "--{prefix}-{slot}-gap"
      - name: "--{prefix}-{slot}-radius"
      - name: "--{prefix}-{slot}-bg"
      - name: "--{prefix}-{slot}-font-size"
      - name: "--{prefix}-{slot}-font-weight"
      # ... as needed per slot

  # ──────────────────────────────────────────
  # ⚡ MOTION
  # ──────────────────────────────────────────
  motion:
    - name: "--{prefix}-transition-property"
      default: "background-color, border-color, color, box-shadow, opacity, transform"
    - name: "--{prefix}-transition-duration"
      default: "var(--duration-normal)"
    - name: "--{prefix}-transition-easing"
      default: "var(--easing-in-out)"
    # Component-specific animations (optional):
    - name: "--{prefix}-animation-enter"
      default: "none"
    - name: "--{prefix}-animation-exit"
      default: "none"

  # ──────────────────────────────────────────
  # ♿ ACCESSIBILITY
  # ──────────────────────────────────────────
  a11y:
    - name: "--{prefix}-focus-outline-width"
      default: "2px"
    - name: "--{prefix}-focus-outline-color"
      default: "var(--color-border-focus)"
    - name: "--{prefix}-focus-outline-offset"
      default: "2px"
    - name: "--{prefix}-min-tap-target"
      default: "44px"
      description: "Minimum touch target size (WCAG 2.5.8)"
```

---

## How to Create a New Component Spec

1. Copy this template
2. Replace `{prefix}` with the component's CSS prefix
3. Replace `{ComponentName}` with the component name
4. Fill in supported `sizes`, `variants`, `states`
5. Define each axis — remove unused entries, add component-specific ones
6. Define all **slots** with their sub-element variables
7. Document any **component-specific** variables not covered by the template
8. Save as `/specs/components/{component-name}.yaml`

## Naming Rules

| Pattern | When to use | Example |
|---------|-------------|---------|
| `--{prefix}-{property}` | Global to the component | `--btn-font-weight` |
| `--{prefix}-{property}-{size}` | Per-size variations | `--btn-height-md` |
| `--{prefix}-{variant}-{property}` | Per-variant default | `--btn-primary-bg` |
| `--{prefix}-{variant}-{property}-{state}` | Variant + state | `--btn-primary-bg-hover` |
| `--{prefix}-{slot}-{property}` | Sub-element | `--btn-icon-size` |
| `--{prefix}-{slot}-{property}-{state}` | Sub-element + state | `--btn-icon-color-hover` |

## Padding Property Conventions

| Pattern | When to use | Example |
|---------|-------------|---------|
| `padding-x` / `padding-y` | General horizontal/vertical padding | `--btn-padding-x-base`, `--input-padding-y-small` |
| `ps` / `pe` (padding-start/end) | RTL-sensitive slots where start ≠ end | `--menu-btn-chevron-pe-base` |
| `pt` / `pb` (padding-top/bottom) | When top ≠ bottom (rare) | `--textarea-padding-t-base` |

**Rule**: Default to `padding-x`/`padding-y` for symmetric padding. Use logical properties (`ps`/`pe`) only when a specific slot requires asymmetric inline padding that must respect writing direction (e.g., chevron placement in MenuButton).

## Variable Count Estimation Formula

```
Per component ≈
  Shape (radius×4 + border×5 + shadow×3 + outline×2 + clip×1 + overflow×1)      = ~16
+ Dimension (height×sizes + padding-x×sizes + padding-y×sizes + width×3 + gap×1)      = ~3×sizes + 4
+ Surface (variants × properties × states)                                              = ~variants × 12
+ Typography (6 base + font-size×sizes)                                                 = ~6 + sizes
+ Slots (varies: typically 4-8 vars per slot × num_slots)                               = ~slots × 6
+ Motion (4-6)                                                                          = ~5
+ A11y (4)                                                                              = ~4

Example: Button with 5 sizes, 6 variants, 3 slots
= 19 + 19 + 72 + 11 + 18 + 5 + 4 = ~148 variables
```
