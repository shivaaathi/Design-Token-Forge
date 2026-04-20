# TypeScript Types Checklist

## Purpose

Provide IDE autocomplete and type safety for all component props and token names.

## Component Prop Types

### Size Types (shared across all components)
```typescript
// packages/react/src/types.ts
export type DensitySize = 'micro' | 'tiny' | 'small' | 'base' | 'medium' | 'large' | 'big' | 'huge' | 'mega' | 'ultra';
export type SemanticRole = 'primary' | 'danger' | 'success' | 'warning' | 'brand' | 'info' | 'neutral';
```

### Per-Component Types
Each component exports:
- `{Component}Props` interface
- `{Component}Size` type (if not all 10 densities)
- `{Component}Variant` type (union of structural variants)

### Generation from YAML Specs
Types can be auto-generated from the YAML specs in `/specs/components/`:

```bash
# Conceptual: read button.yaml → emit Button types
node scripts/generate-types.js specs/components/button.yaml > packages/react/src/Button.types.ts
```

Until generator exists, write types manually from the spec.

## Token Name Types (CSS variable intellisense)

### For advanced consumers who override tokens:
```typescript
// packages/tokens/types/tokens.d.ts
export type PrimitiveToken =
  | '--prim-primary-white'
  | '--prim-primary-25'
  | '--prim-primary-50'
  // ... all 176 color tokens
  | '--spacing-none'
  | '--spacing-1'
  // ... all spacing tokens
  ;

export type SemanticToken =
  | '--primary-content-default'
  | '--primary-content-strong'
  // ... all semantic tokens
  ;
```

This is a **nice-to-have** — defer until framework wrappers are proven.

## Verification

```bash
cd packages/react

# 1. Type-check passes
npx tsc --noEmit
echo "Exit code: $?" # Must be 0

# 2. Build produces .d.ts files
npm run build
ls dist/*.d.ts
echo "(should list .d.ts for every component)"

# 3. Types are exported from index
grep "export" src/index.ts | head -20

# 4. No 'any' types used
grep -rn ": any" src/ --include="*.ts" --include="*.tsx"
echo "(should be 0)"
```
