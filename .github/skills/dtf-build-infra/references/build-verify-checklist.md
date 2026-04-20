# Build Verification Checklist

Run these checks after completing the build infrastructure. Every check must pass.

## Token Package Verification

```bash
cd /Users/sridhar-2917/Design-Token-Forge

# 1. Build succeeds
pnpm --filter @design-token-forge/tokens build
echo "Exit code: $?"  # Must be 0

# 2. All expected files exist
for f in index.css primitives.css semantic.css surfaces.css extras.css; do
  [ -f "packages/tokens/dist/$f" ] && echo "✅ $f" || echo "❌ MISSING $f"
done

# 3. CSS custom properties preserved (NOT mangled)
count=$(grep -c "^  --" packages/tokens/dist/primitives.css 2>/dev/null || echo 0)
echo "Custom properties in dist/primitives.css: $count (should be ~252)"

# 4. No hardcoded hex leaked (should be 0 outside :root blocks)
# This checks that build didn't inline values
echo "Checking for inlined values..."

# 5. File sizes reasonable
for f in packages/tokens/dist/*.css; do
  size=$(wc -c < "$f" | tr -d ' ')
  name=$(basename "$f")
  echo "$name: $size bytes"
done
echo "(total should be 15-40KB minified)"

# 6. Dry-run pack
cd packages/tokens && npm pack --dry-run 2>&1 | tail -5
```

## Component Package Verification

```bash
cd /Users/sridhar-2917/Design-Token-Forge

# 1. Build succeeds
pnpm --filter @design-token-forge/components build
echo "Exit code: $?"  # Must be 0

# 2. All-in-one file exists
[ -f "packages/components/dist/index.css" ] && echo "✅ index.css" || echo "❌ MISSING"

# 3. Per-component files exist  
for comp in button input icon-button split-button menu-button toggle checkbox radio textarea select slider datepicker file-upload avatar badge tooltip alert toast progress-bar progress-ring; do
  [ -f "packages/components/dist/$comp/index.css" ] && echo "✅ $comp" || echo "❌ MISSING $comp"
done

# 4. Component CSS still has BEM class names (not mangled)
grep -c "\.btn" packages/components/dist/button/index.css
echo "(.btn occurrences — should be > 20)"

# 5. Component CSS custom properties preserved
grep -c "^  --btn-" packages/components/dist/button/index.css 2>/dev/null || \
grep -c "  --btn-" packages/components/dist/button/index.css 2>/dev/null
echo "(--btn- token count — should be ~246)"

# 6. Tokens are NOT inlined — component CSS should NOT contain hex colors
hex_count=$(grep -oE '#[0-9a-fA-F]{3,8}' packages/components/dist/button/index.css | wc -l | tr -d ' ')
echo "Hardcoded hex values: $hex_count (should be < 5 — only #000/#fff in forced-colors)"
```

## Cross-Package Integration Verification

```bash
cd /Users/sridhar-2917/Design-Token-Forge

# 1. Full build from root works
pnpm run build:packages
echo "Exit code: $?"

# 2. Exports map resolves correctly
node -e "
const tokens = require('packages/tokens/package.json');
const comps = require('packages/components/package.json');
console.log('Tokens main:', tokens.exports['.']);
console.log('Components main:', comps.exports['.']);
const fs = require('fs');
const tMain = tokens.exports['.'];
const cMain = comps.exports['.'];
console.log('Tokens file exists:', fs.existsSync('packages/tokens/' + tMain));
console.log('Components file exists:', fs.existsSync('packages/components/' + cMain));
"

# 3. No stale src/ references in published exports
node -e "
const tokens = require('packages/tokens/package.json');
const comps = require('packages/components/package.json');
const allExports = [...Object.values(tokens.exports || {}), ...Object.values(comps.exports || {})];
const srcRefs = allExports.filter(e => typeof e === 'string' && e.includes('/src/'));
if (srcRefs.length > 0) { console.error('❌ FAIL: exports still reference src/', srcRefs); process.exit(1); }
else { console.log('✅ All exports point to dist/'); }
"
```

## Final Sign-Off

All checks below must show ✅ before merge:

- [ ] Token build: exit code 0
- [ ] Token dist: all 5 CSS files present
- [ ] Token dist: custom properties not mangled (>200 `--` prefixed lines)
- [ ] Component build: exit code 0
- [ ] Component dist: index.css + per-component dirs present
- [ ] Component dist: BEM class names preserved
- [ ] Component dist: hex values < 5 per file (only forced-colors)
- [ ] `npm pack --dry-run`: shows dist/ only (no src/)
- [ ] Exports map: all paths resolve to existing dist/ files
- [ ] No `src/` references in any exports field
