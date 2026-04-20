# Spec Creation Guide

## When a YAML Spec Doesn't Exist

If building a component that has no spec yet, create one before writing any CSS.

## File Location
`/specs/components/{component}.yaml`

## Template

```yaml
component: {component-name}
prefix: {2-3 letter prefix}
category: {Inputs & Controls | Display & Feedback | Layout & Structure | Navigation | Overlay}
description: {One-line description}

classification:
  type: {interactive-control | display-feedback | layout-container | compound}
  has_variants: true
  has_roles: true | false
  density_modes: [micro, tiny, small, base, medium, large, big, huge, mega, ultra]

variants:
  structural:
    - name: {e.g., filled}
      description: {e.g., Solid background fill}
      default: true | false
    - name: {e.g., outlined}
      description: {e.g., Transparent bg with border}
  roles:
    - primary
    - danger
    - success
    - warning
    - neutral
    - brand
    - info

slots:
  - name: {e.g., icon}
    element: .{comp}__icon
    tokens: [size, color, gap, opacity]
  - name: {e.g., label}
    element: .{comp}__label
    tokens: [font-size, font-weight, color]

states:
  - default
  - hover
  - active
  - focus-visible
  - disabled
  - {component-specific: error, loading, dragover, checked, indeterminate, etc.}

variables:
  shape:
    - name: --{comp}-radius-{size}
      default: var(--radius-md)
      per_density: true
      count: 10
    - name: --{comp}-border-width
      default: 1px
    - name: --{comp}-border-style
      default: solid
    - name: --{comp}-shadow
      default: var(--shadow-none)
    - name: --{comp}-radius-rounded
      default: var(--radius-full)

  dimension:
    - name: --{comp}-height-{size}
      per_density: true
      count: 10
      range: [20px, 64px]
    - name: --{comp}-padding-x-{size}
      per_density: true
      count: 10
    - name: --{comp}-padding-y-{size}
      per_density: true
      count: 10
    - name: --{comp}-gap-{size}
      per_density: true
      count: 10
    - name: --{comp}-min-width
      default: 0

  surface:
    # For each variant × state combination
    - name: --{comp}-{variant}-bg
      default: var(--{role}-component-bg-default)
    - name: --{comp}-{variant}-bg-hover
      default: var(--{role}-component-bg-hover)
    - name: --{comp}-{variant}-bg-active
      default: var(--{role}-component-bg-pressed)
    - name: --{comp}-{variant}-fg
      default: var(--{role}-content-default)
    - name: --{comp}-{variant}-border-color
      default: var(--{role}-component-outline-default)
    # ... continue for all variant × state pairs

  typography:
    - name: --{comp}-font-family
      default: var(--font-family-sans)
    - name: --{comp}-font-size-{size}
      per_density: true
      count: 10
    - name: --{comp}-font-weight
      default: var(--font-weight-medium)
    - name: --{comp}-line-height
      default: var(--line-height-normal)
    - name: --{comp}-letter-spacing
      default: var(--letter-spacing-normal)

  slots:
    icon:
      - name: --{comp}-icon-size-{size}
        per_density: true
        count: 10
      - name: --{comp}-icon-color
        default: currentColor

  motion:
    - name: --{comp}-transition-property
      default: background-color, border-color, color, box-shadow, opacity
    - name: --{comp}-transition-duration
      default: var(--duration-normal)
    - name: --{comp}-transition-easing
      default: var(--easing-in-out)

  a11y:
    - name: --{comp}-focus-outline-width
      default: 2px
    - name: --{comp}-focus-outline-color
      default: var(--primary-component-outline-default)
    - name: --{comp}-focus-outline-offset
      default: 2px
    - name: --{comp}-min-tap-target
      default: 44px

summary:
  total_variables: {count}
  per_density_tokens: {count}
  variant_count: {N}
  role_count: {N}
  slot_count: {N}
```

## Spec Validation Checks

Before proceeding to token CSS:
- [ ] All 7 axis sections present (shape, dimension, surface, typography, slots, motion, a11y)
- [ ] `per_density: true` tokens have `count: 10`
- [ ] Prefix is unique (not used by any other component)
- [ ] All `default` values reference global tokens (no hardcoded hex/px)
- [ ] Variants and roles lists match the component inventory in `/docs/components/inventory.md`
- [ ] States list covers at minimum: default, hover, active, focus-visible, disabled

## Existing Specs to Reference

Read these for patterns:
- `/specs/components/button.yaml` — gold standard (246 vars)
- `/specs/components/input.yaml` — form control pattern
- `/specs/components/toggle.yaml` — compound component pattern
- `/specs/components/slider.yaml` — complex interactive pattern
