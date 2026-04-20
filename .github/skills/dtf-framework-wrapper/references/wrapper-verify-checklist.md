# Wrapper Verification Checklist

## After building any framework wrapper, run all checks:

### 1. Build Success
```bash
cd packages/react
npm run build
echo "Exit code: $?"  # Must be 0
```

### 2. Type Check
```bash
npx tsc --noEmit
echo "Exit code: $?"  # Must be 0
```

### 3. Dist Output Complete
```bash
echo "=== JS files ==="
ls dist/*.js 2>/dev/null | wc -l
echo "=== DTS files ==="
ls dist/*.d.ts 2>/dev/null | wc -l
echo "(counts should match)"
```

### 4. No CSS in Package
```bash
grep -r "import.*\.css\|require.*\.css" packages/react/src/ 2>/dev/null
echo "(should be 0 — wrappers never import CSS)"
```

### 5. No Inline Styles
```bash
grep -rn "style=" packages/react/src/ --include="*.tsx" | grep -v "// "
echo "(should be 0)"
```

### 6. All Components Exported from Index
```bash
# Count component files vs index exports
comp_count=$(ls packages/react/src/*.tsx 2>/dev/null | grep -v index | wc -l | tr -d ' ')
export_count=$(grep -c "export" packages/react/src/index.ts 2>/dev/null)
echo "Component files: $comp_count"
echo "Index exports: $export_count"
echo "(should be close — index exports types + components)"
```

### 7. Data-Attribute Coverage
```bash
for tsx in packages/react/src/*.tsx; do
  name=$(basename "$tsx" .tsx)
  [ "$name" = "index" ] || [ "$name" = "types" ] && continue
  echo "--- $name ---"
  for attr in data-size data-variant data-role; do
    grep -q "$attr" "$tsx" && echo "  ✅ $attr" || echo "  ⚠️  $attr (may not apply)"
  done
done
```

### 8. Boolean Props Correctly Mapped
```bash
# Check for the correct pattern: prop || undefined
grep -n "data-rounded\|data-disabled\|data-loading" packages/react/src/*.tsx
echo "(each should use: propName || undefined)"
```

### 9. Dry-Run Pack
```bash
cd packages/react
npm pack --dry-run 2>&1 | tail -10
echo "(should show dist/ files only)"
```

### 10. Smoke Test (if React dev environment available)
```tsx
// Create a test file and try importing:
import { Button } from '@design-token-forge/react';

// These should have autocomplete:
<Button size="base" variant="filled" colorRole="primary" rounded>
  Hello
</Button>
```

## Final Sign-Off

- [ ] Build: exit code 0
- [ ] Type-check: exit code 0
- [ ] Dist: JS + DTS files for every component
- [ ] No CSS imports in wrappers
- [ ] No inline styles
- [ ] All components re-exported from index
- [ ] Data-attributes mapped for size, variant, role
- [ ] Boolean props use `|| undefined` pattern
- [ ] `npm pack --dry-run` shows dist/ only
