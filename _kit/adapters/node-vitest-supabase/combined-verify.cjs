#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const FEATURE = process.env.ONP_VERIFY_FEATURE || null;
let failed = false;

function spawnNode(args, env = process.env) {
  return spawnSync(process.execPath, args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: 'pipe',
    maxBuffer: 64 * 1024 * 1024,
    env
  });
}

function getFeatureAcs(feature) {
  const specPath = path.join(ROOT, '.spec', 'features', feature, 'spec.md');
  if (!fs.existsSync(specPath)) return [];
  const content = fs.readFileSync(specPath, 'utf8');
  return [...new Set([...content.matchAll(/AC-\d{3,}/g)].map((m) => m[0]))];
}

function findVitestFilesForAcs(acs) {
  const tags = acs.map((ac) => `@spec:${ac}`);
  const roots = ['tests', 'test', '__tests__', 'src'];
  const results = new Set();
  const ignoredDirs = new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '.spec', '.onp-factory', 'supabase', 'scripts', 'public']);

  function scan(dir) {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const entry of entries) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!ignoredDirs.has(entry.name)) scan(full);
        continue;
      }
      if (!entry.isFile() || !/\.(spec|test)\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) continue;
      try {
        const content = fs.readFileSync(full, 'utf8');
        if (tags.some((tag) => content.includes(tag))) results.add(path.relative(ROOT, full));
      } catch { /* ignore unreadable candidates */ }
    }
  }

  for (const root of roots) {
    const absolute = path.join(ROOT, root);
    if (fs.existsSync(absolute)) scan(absolute);
  }
  return [...results];
}

function runPgTap() {
  const proc = spawnNode([path.join(__dirname, 'pgtap-verify.cjs')], {
    ...process.env,
    ...(FEATURE ? { ONP_VERIFY_FEATURE: FEATURE } : {})
  });
  if (proc.stdout) process.stdout.write(proc.stdout);
  if (proc.stderr) process.stderr.write(proc.stderr);
  if (proc.status !== 0) failed = true;
}

function runVitest(files, feature) {
  const vitestBin = path.join(ROOT, 'node_modules', 'vitest', 'vitest.mjs');
  if (!fs.existsSync(vitestBin)) {
    console.error('onp-factory combined-verify: Vitest não está instalado em node_modules/vitest.');
    failed = true;
    return;
  }

  const args = ['run', '--reporter=tap', '--config=vitest.config.ts'];
  if (feature) {
    const acs = getFeatureAcs(feature);
    if (!acs.length) {
      console.error(`onp-factory combined-verify: nenhum AC em ${feature}`);
      failed = true;
      return;
    }
    if (!files.length) return;
    args.push('--testNamePattern', acs.map((ac) => `@spec:${ac}`).join('|'), ...files);
  }

  const proc = spawnNode([vitestBin, ...args], {
    ...process.env,
    ...(feature ? { ONP_VERIFY_FEATURE: feature } : {})
  });
  if (proc.stdout) process.stdout.write(proc.stdout);
  if (proc.stderr) process.stderr.write(proc.stderr);
  if (proc.status !== 0) failed = true;
}

runPgTap();
if (!FEATURE) {
  runVitest([], null);
} else {
  const files = findVitestFilesForAcs(getFeatureAcs(FEATURE));
  runVitest(files, FEATURE);
}

process.exit(failed ? 1 : 0);
