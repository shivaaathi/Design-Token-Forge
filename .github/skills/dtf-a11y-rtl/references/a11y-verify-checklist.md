# A11y Verification Checklist

## Run after making any accessibility changes

### 1. Focus-Visible Coverage (WCAG 2.4.7)
```bash
echo "=== Focus-Visible Coverage ==="
for dir in packages/components/src/*/; do
  comp=$(basename "$dir")
  css="$dir/${comp}.css"
  [ -f "$css" ] || continue
  if grep -q "focus-visible" "$css"; then echo "✅ $comp"
  else echo "❌ $comp"; fi
done
```
**Expected**: ALL interactive components show ✅

### 2. Forced-Colors Coverage (WCAG 1.4.1)
```bash
echo "=== Forced Colors Coverage ==="
for dir in packages/components/src/*/; do
  comp=$(basename "$dir")
  css="$dir/${comp}.css"
  [ -f "$css" ] || continue
  if grep -q "forced-colors" "$css"; then echo "✅ $comp"
  else echo "❌ $comp"; fi
done
```
**Expected**: ALL components show ✅

### 3. Reduced-Motion Coverage (WCAG 2.3.3)
```bash
echo "=== Reduced Motion Coverage ==="
for dir in packages/components/src/*/; do
  comp=$(basename "$dir")
  css="$dir/${comp}.css"
  [ -f "$css" ] || continue
  if grep -q "prefers-reduced-motion" "$css"; then echo "✅ $comp"
  else echo "❌ $comp"; fi
done
```
**Expected**: ALL components show ✅

### 4. Logical Properties Coverage
```bash
echo "=== Physical Direction Properties (should be 0) ==="
for dir in packages/components/src/*/; do
  comp=$(basename "$dir")
  css="$dir/${comp}.css"
  [ -f "$css" ] || continue
  hits=$(grep -cE "padding-(left|right)\b|margin-(left|right)\b" "$css" 2>/dev/null)
  if [ "$hits" -gt 0 ]; then echo "⚠️  $comp: $hits physical properties"
  else echo "✅ $comp"; fi
done
```
**Expected**: ALL components show ✅

### 5. CSS Layer Structure
```bash
echo "=== Layer Declarations ==="
grep -r "@layer" packages/tokens/src/index.css packages/components/src/index.css 2>/dev/null
echo "(should show dtf-base, dtf-theme, dtf-component, dtf-instance)"
```

### 6. Min Tap-Target Tokens
```bash
echo "=== Min Tap Target Tokens ==="
for dir in packages/components/src/*/; do
  comp=$(basename "$dir")
  tokens="$dir/${comp}.tokens.css"
  [ -f "$tokens" ] || continue
  if grep -q "min-tap-target" "$tokens"; then echo "✅ $comp"
  else echo "⚠️  $comp (non-interactive?)"; fi
done
```

### 7. No Bare :focus (only :focus-visible)
```bash
echo "=== Bare :focus Check ==="
for dir in packages/components/src/*/; do
  comp=$(basename "$dir")
  css="$dir/${comp}.css"
  [ -f "$css" ] || continue
  # Find :focus that's NOT :focus-visible and NOT :focus-within
  bare=$(grep -cE ":focus[^-]" "$css" 2>/dev/null)
  if [ "$bare" -gt 0 ]; then echo "⚠️  $comp: $bare bare :focus (check manually)"
  else echo "✅ $comp"; fi
done
```

### 8. Visual Regression After Changes
```bash
cd /Users/sridhar-2917/Design-Token-Forge
npx playwright test
echo "(all tests should pass — no visual regressions from a11y changes)"
```

## Summary

After running all checks:
- ALL ✅ → safe to commit
- Any ❌ → must fix before commit
- Any ⚠️ → investigate manually (may be expected for non-interactive components)
