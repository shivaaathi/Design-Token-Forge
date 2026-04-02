# Component Wrapper Checklist

## React Wrapper Pattern

### Template (Button example)

```tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';

// ── Types ────────────────────────────────────────
export type ButtonSize = 'micro' | 'tiny' | 'small' | 'base' | 'medium' | 'large' | 'big' | 'huge' | 'mega' | 'ultra';
export type ButtonVariant = 'filled' | 'outlined' | 'soft' | 'ghost';
export type ButtonRole = 'primary' | 'danger' | 'success' | 'warning' | 'brand' | 'info' | 'neutral';

export interface ButtonProps extends Omit<HTMLAttributes<HTMLButtonElement>, 'role'> {
  /** Density size (default: base) */
  size?: ButtonSize;
  /** Structural variant (default: filled) */
  variant?: ButtonVariant;
  /** Semantic color role (default: primary) */
  colorRole?: ButtonRole;
  /** Pill/rounded shape */
  rounded?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Icon slot (renders .btn__icon) */
  icon?: ReactNode;
  /** Label text */
  children?: ReactNode;
  /** Native button type */
  type?: 'button' | 'submit' | 'reset';
}

// ── Component ────────────────────────────────────
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ size, variant, colorRole, rounded, disabled, loading, icon, children, type = 'button', className, ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={`btn${className ? ` ${className}` : ''}`}
        data-size={size}
        data-variant={variant}
        data-role={colorRole}
        data-rounded={rounded || undefined}
        data-disabled={disabled || undefined}
        data-loading={loading || undefined}
        disabled={disabled}
        aria-busy={loading || undefined}
        {...rest}
      >
        {icon && <span className="btn__icon">{icon}</span>}
        {children && <span className="btn__label">{children}</span>}
        {loading && <span className="btn__loader" aria-hidden="true" />}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

## Rules for Every Wrapper

### Props → Data Attributes
- [ ] `size` prop → `data-size` attribute
- [ ] `variant` prop → `data-variant` attribute
- [ ] `colorRole` prop → `data-role` attribute (note: `role` conflicts with HTML `role` attr)
- [ ] Boolean props (rounded, disabled, loading) → attribute present/absent (NOT `="true"/"false"`)
- [ ] Undefined props → attribute omitted entirely (not set to empty string)

### Boolean Attribute Pattern
```tsx
// ✅ CORRECT: undefined removes the attribute
data-rounded={rounded || undefined}

// ❌ WRONG: sets data-rounded="false" which CSS still matches
data-rounded={rounded}
```

### Ref Forwarding
- [ ] React: `forwardRef()` wrapping
- [ ] Expose the root DOM element
- [ ] Consumer can read `ref.current.offsetHeight`, etc.

### Event Forwarding
- [ ] Spread `...rest` props to pass onClick, onFocus, etc.
- [ ] Do NOT intercept events unless adding a11y behavior

### Slot Elements
- [ ] Named slots use BEM child classes: `.{comp}__icon`, `.{comp}__label`
- [ ] Render slots conditionally (`{icon && <span className="btn__icon">...`})
- [ ] Do NOT render empty slot containers (breaks `:has()` selectors in CSS)

### ARIA Attributes
- [ ] `disabled` → set both native `disabled` AND `data-disabled`
- [ ] `loading` → set `aria-busy="true"`
- [ ] Checkbox/Radio → `aria-checked`
- [ ] Toggle → `role="switch"` + `aria-checked`
- [ ] Expandable → `aria-expanded`
- [ ] Required → `aria-required`

### CSS Class
- [ ] Root element has the BEM class: `className="btn"` (not configurable)
- [ ] Consumer can append extra classes via `className` prop
- [ ] Pattern: `` className={`btn${className ? ` ${className}` : ''}`} ``

## What NOT to Put in Wrappers

| Anti-Pattern | Why |
|---|---|
| `style={{ color: 'red' }}` | All colors come from CSS tokens |
| `className={variant === 'primary' ? 'btn-primary' : ''}` | CSS uses data-attributes, not modifier classes |
| `useState` for visual state | CSS handles :hover/:active/:disabled |
| `useEffect` to measure size | Size is CSS-driven via data-size |
| Import of CSS file | Consumer imports CSS separately |

## Verification per Component

```bash
COMP="Button"

# 1. File exists
[ -f "packages/react/src/$COMP.tsx" ] && echo "✅ exists" || echo "❌ missing"

# 2. Types exported
grep "export interface ${COMP}Props" "packages/react/src/$COMP.tsx"

# 3. forwardRef used
grep "forwardRef" "packages/react/src/$COMP.tsx"

# 4. data-attributes mapped
for attr in data-size data-variant data-role data-rounded data-disabled; do
  grep -q "$attr" "packages/react/src/$COMP.tsx" && echo "✅ $attr" || echo "❌ $attr"
done

# 5. No style= or inline CSS
grep -c "style=" "packages/react/src/$COMP.tsx"
echo "(should be 0)"

# 6. No CSS import
grep -c "import.*\.css" "packages/react/src/$COMP.tsx"
echo "(should be 0)"
```
