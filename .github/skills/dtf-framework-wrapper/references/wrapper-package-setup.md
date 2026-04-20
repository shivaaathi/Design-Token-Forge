# Wrapper Package Setup Checklist

## React Package

### Create package.json
```json
{
  "name": "@design-token-forge/react",
  "version": "0.1.0",
  "private": false,
  "description": "React wrapper components for Design Token Forge CSS design system",
  "type": "module",
  "main": "./dist/index.js",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./button": {
      "import": "./dist/Button.js",
      "types": "./dist/Button.d.ts"
    }
  },
  "files": ["dist/"],
  "peerDependencies": {
    "react": ">=18",
    "react-dom": ">=18",
    "@design-token-forge/tokens": "^0.1.0",
    "@design-token-forge/components": "^0.1.0"
  },
  "devDependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "typescript": "^5.0.0",
    "@types/react": "^18.0.0"
  },
  "scripts": {
    "build": "tsc",
    "prepublishOnly": "npm run build"
  }
}
```

### Key Decisions:
- `peerDependencies` for React + DTF packages — consumer provides these
- `"type": "module"` — ES modules output
- `tsc` for build — simple, produces `.js` + `.d.ts`

### Create tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Verification
```bash
cd packages/react
pnpm install
npx tsc --noEmit  # Type-check without building
```

---

## Vue Package (when needed)

Similar structure with `vue-tsc` and `.vue` files. Same peerDependency pattern. Defer until React package is proven.

## Svelte Package (when needed)

Similar structure with `svelte-package`. Defer until React package is proven.

---

## Add to Root Workspace

In root `pnpm-workspace.yaml`:
```yaml
packages:
  - 'packages/*'
```
- [ ] Already includes packages/* — new packages are auto-discovered
- [ ] Run `pnpm install` to pick up new package

## Add to Root package.json Scripts
```json
{
  "scripts": {
    "build:react": "pnpm --filter @design-token-forge/react build"
  }
}
```
