#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Design Token Forge — Static Build

   Generates static JSON files from CSS tokens for GitHub Pages
   deployment. The Figma plugin polls these files for changes.

   Usage:
     node build-static.js [--out-dir ./dist]

   Output:
     dist/status.json  — lightweight hash check (plugin polls this)
     dist/tokens.json  — full Figma-compatible variable payload
   ═══════════════════════════════════════════════════════════════ */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// ── CLI args ──────────────────────────────────────────────────

const args   = process.argv.slice(2);
const outIdx = args.indexOf('--out-dir');
const BASE_OUT_DIR = outIdx !== -1 ? path.resolve(args[outIdx + 1]) : path.resolve(__dirname, '../../dist');

const projIdx = args.indexOf('--project');
const PROJECT_ID = projIdx !== -1 ? args[projIdx + 1] : null;

// If --project is specified, output into dist/{projectId}/
const OUT_DIR = PROJECT_ID ? path.join(BASE_OUT_DIR, PROJECT_ID) : BASE_OUT_DIR;

// ── Import the server's runExport by re-using its module ──────
//    We dynamically import the server module and call runExport.
//    But since runExport isn't exported, we inline the import of
//    just the build functions. Simplest: require the whole server
//    as a build library by extracting runExport into a shared file.
//
//    For now, we use a clean approach: fork the export logic
//    by importing the server.js module path and extracting config.
//    Actually, the cleanest way is to just call the server's
//    /tokens endpoint — but that requires the server running.
//
//    Best approach: make server.js export its runExport function
//    and import it here.

// We'll import from the server module (ESM)
const serverPath = path.join(__dirname, 'server.js');

// ── Recursive directory copy ──────────────────────────────────
function copyDirSync(src, dst) {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dst, entry.name);
    if (entry.isDirectory()) copyDirSync(s, d);
    else fs.copyFileSync(s, d);
  }
}

async function main() {
  // Dynamically import server module to access runExport
  // First, we need to modify server.js to export runExport.
  // For the static build, we inline the necessary code instead.

  // Actually, the simplest approach: just run the server's export
  // logic by reading the same CSS files and producing the same output.
  // We achieve this by importing a shared build module.

  // For now: call the server's HTTP endpoint if running,
  // or inline the build. Let's do the inline approach since
  // this is a CI script that won't have the server running.

  console.log('');
  console.log('  Design Token Forge — Static Build');
  console.log('  ─────────────────────────────────');

  // ── Load & validate project config (if --project specified) ──
  const ROOT = path.resolve(__dirname, '../..');
  let projectConfig = null;
  if (PROJECT_ID) {
    const configPath = path.join(ROOT, 'projects', PROJECT_ID, 'config.json');
    if (!fs.existsSync(configPath)) {
      console.error(`  ✗ Project config not found: ${configPath}`);
      process.exit(1);
    }
    projectConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    console.log(`  Project: ${projectConfig.name} (${projectConfig.id})`);
  }

  // Import the build functions from server.js
  // We need to make server.js export them. Let's do that.
  let serverModule;
  try {
    serverModule = await import(serverPath);
  } catch (e) {
    console.error('  ✗ Failed to import server.js:', e.message);
    process.exit(1);
  }

  if (typeof serverModule.runExport !== 'function') {
    console.error('  ✗ server.js does not export runExport(). Please update it.');
    process.exit(1);
  }

  const data = serverModule.runExport();

  // Inject project identity into the payload
  if (projectConfig) {
    data.project = { id: projectConfig.id, name: projectConfig.name };
  }

  // Ensure output dir exists
  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Write tokens.json — full payload
  const tokensPath = path.join(OUT_DIR, 'tokens.json');
  fs.writeFileSync(tokensPath, JSON.stringify(data, null, 2));
  console.log(`  ✓ tokens.json  → ${data.stats.totalVariables} variables (${data.contentHash})`);

  // Write status.json — lightweight polling endpoint
  const status = {
    connected: true,
    hash: data.contentHash,
    lastChanged: data.exported,
    pendingChanges: 0,
    totalVariables: data.stats.totalVariables,
    totalCollections: data.stats.totalCollections,
    lastSyncedHash: '',
    ...(projectConfig && { project: { id: projectConfig.id, name: projectConfig.name } })
  };
  const statusPath = path.join(OUT_DIR, 'status.json');
  fs.writeFileSync(statusPath, JSON.stringify(status, null, 2));
  console.log(`  ✓ status.json  → hash ${data.contentHash}`);

  // Write a minimal index.html for GitHub Pages root
  const projLabel = projectConfig ? projectConfig.name : '';
  const projLine = projLabel ? `<p><strong>Project:</strong> ${projLabel}</p>\n` : '';
  const indexHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>DTF Token API${projLabel ? ' — ' + projLabel : ''}</title></head>
<body>
<h1>Design Token Forge — Token API</h1>
${projLine}<p>This is a static token API served via GitHub Pages.</p>
<ul>
  <li><a href="demo/editor.html"><strong>Token Editor</strong></a> — edit tokens live, auto-deploy to Figma</li>
  <li><a href="demo/">Component Explorer</a> — preview all components</li>
  <li><a href="status.json">status.json</a> — hash check (plugin polls this)</li>
  <li><a href="tokens.json">tokens.json</a> — full variable payload</li>
  <li><a href="demo/">demo/</a> — Component Explorer</li>
</ul>
<p>Hash: <code>${data.contentHash}</code> | Variables: ${data.stats.totalVariables} | Built: ${data.exported}</p>
</body></html>`;
  fs.writeFileSync(path.join(OUT_DIR, 'index.html'), indexHtml);
  console.log('  ✓ index.html   → landing page');

  // ── Copy demo pages + dependencies ──────────────────────────
  const demoSrc = path.join(ROOT, 'demo');
  const demoDst = path.join(OUT_DIR, 'demo');

  if (fs.existsSync(demoSrc)) {
    copyDirSync(demoSrc, demoDst);
    console.log('  ✓ demo/        → component explorer');

    // Copy packages/ (tokens + components CSS) so ../packages/ refs work
    const pkgSrc = path.join(ROOT, 'packages');
    const pkgDst = path.join(OUT_DIR, 'packages');
    // Only copy what demos need: tokens/src and components/src
    const tokensSrc = path.join(pkgSrc, 'tokens', 'src');
    const tokensDst = path.join(pkgDst, 'tokens', 'src');
    if (fs.existsSync(tokensSrc)) {
      copyDirSync(tokensSrc, tokensDst);
      console.log('  ✓ packages/tokens/src/');
    }
    const compSrc = path.join(pkgSrc, 'components', 'src');
    const compDst = path.join(pkgDst, 'components', 'src');
    if (fs.existsSync(compSrc)) {
      copyDirSync(compSrc, compDst);
      console.log('  ✓ packages/components/src/');
    }
  }

  // ── Backward compatibility: mirror full output to dist root ──
  if (PROJECT_ID) {
    // Copy tokens + status to root
    fs.copyFileSync(path.join(OUT_DIR, 'tokens.json'), path.join(BASE_OUT_DIR, 'tokens.json'));
    fs.copyFileSync(path.join(OUT_DIR, 'status.json'), path.join(BASE_OUT_DIR, 'status.json'));
    fs.copyFileSync(path.join(OUT_DIR, 'index.html'), path.join(BASE_OUT_DIR, 'index.html'));
    // Mirror demo + packages so existing GitHub Pages URLs keep working
    const rootDemo = path.join(BASE_OUT_DIR, 'demo');
    const rootPkg  = path.join(BASE_OUT_DIR, 'packages');
    if (fs.existsSync(path.join(OUT_DIR, 'demo')))     copyDirSync(path.join(OUT_DIR, 'demo'), rootDemo);
    if (fs.existsSync(path.join(OUT_DIR, 'packages'))) copyDirSync(path.join(OUT_DIR, 'packages'), rootPkg);
    console.log(`  ✓ Backward compat → mirrored to dist/ root`);
  }

  // ── Deploy project config.json so demo pages can load it ────
  if (PROJECT_ID && projectConfig) {
    const cfgDst = path.join(OUT_DIR, 'config.json');
    fs.writeFileSync(cfgDst, JSON.stringify(projectConfig, null, 2));
    console.log('  ✓ config.json  → project configuration');
    // Also mirror to dist root for backward compat
    fs.copyFileSync(cfgDst, path.join(BASE_OUT_DIR, 'config.json'));
  }

  // ── Generate projects.json manifest ─────────────────────────
  const projectsDir = path.join(ROOT, 'projects');
  if (fs.existsSync(projectsDir)) {
    const projectList = [];
    for (const entry of fs.readdirSync(projectsDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const cfgPath = path.join(projectsDir, entry.name, 'config.json');
      if (!fs.existsSync(cfgPath)) continue;
      const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf-8'));
      projectList.push({ id: cfg.id, name: cfg.name, description: cfg.description || '' });
    }
    const manifestPath = path.join(BASE_OUT_DIR, 'projects.json');
    fs.writeFileSync(manifestPath, JSON.stringify(projectList, null, 2));
    console.log(`  ✓ projects.json → ${projectList.length} project(s)`);
  }

  console.log('');
  console.log(`  Output: ${OUT_DIR}`);
  console.log(`  Deploy this folder to GitHub Pages.`);
  console.log('');
}

main().catch(e => {
  console.error('Build failed:', e);
  process.exit(1);
});
