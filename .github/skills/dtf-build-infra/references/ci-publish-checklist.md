# CI/CD Publishing Checklist

## GitHub Actions Workflow: `publish-packages.yml`

### File Location
- [ ] `.github/workflows/publish-packages.yml`

### Trigger
- Manual dispatch (recommended for pre-1.0)
- OR: on push to `main` with changeset files present

### Job Steps
1. Checkout code
2. Setup Node 20 + pnpm
3. Install dependencies (`pnpm install --frozen-lockfile`)
4. Build all packages (`pnpm run build:packages`)
5. Run changesets version (`npx changeset version`)
6. Publish to npm (`npx changeset publish`)
7. Push version tags to git

### Required Secrets
- [ ] `NPM_TOKEN` — npm automation token (Settings → Secrets → Actions)
- [ ] Token must have `publish` permission for `@design-token-forge` scope

### npm Org Setup
- [ ] Create npm org `@design-token-forge` at npmjs.com
- [ ] Add publishing user to the org
- [ ] Verify: `npm whoami` shows correct user
- [ ] Verify: `npm access list packages @design-token-forge` shows org scope

### Workflow Template
```yaml
name: Publish Packages
on:
  workflow_dispatch:

permissions:
  contents: write
  id-token: write

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: https://registry.npmjs.org
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm run build:packages
      - run: npx changeset publish
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Verification
- [ ] Workflow file is valid YAML (no syntax errors)
- [ ] `NPM_TOKEN` secret is set in GitHub repo settings
- [ ] Dry run: `npm pack --dry-run` in each package shows correct files
- [ ] After first publish: `npm view @design-token-forge/tokens` returns package info
