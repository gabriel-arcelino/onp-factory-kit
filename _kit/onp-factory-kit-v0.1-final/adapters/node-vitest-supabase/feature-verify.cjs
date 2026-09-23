#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

function fail(message, code = 1) {
  console.error(`onp-factory feature-verify: ${message}`);
  process.exit(code);
}

function loadConfig(root) {
  const file = path.join(root, 'onp-factory.config.json');
  if (!fs.existsSync(file)) fail('onp-factory.config.json não encontrado');
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    fail(`configuração inválida: ${error.message}`);
  }
}

function findEngine(root, config) {
  for (const candidate of config?.onp?.enginePathCandidates || []) {
    const file = path.resolve(root, candidate);
    if (fs.existsSync(file)) return file;
  }
  return null;
}

function featureAcs(root, feature) {
  const specPath = path.join(root, '.spec', 'features', feature, 'spec.md');
  if (!fs.existsSync(specPath)) fail(`feature "${feature}" não encontrada`);
  const content = fs.readFileSync(specPath, 'utf8');
  return [...new Set([...content.matchAll(/AC-\d{3,}/g)].map((m) => m[0]))];
}

function featureHasPgTap(root, feature) {
  const acs = featureAcs(root, feature);
  if (!acs.length) return false;
  const testDir = path.join(root, 'supabase', 'tests');
  if (!fs.existsSync(testDir)) return false;
  const tags = acs.map((ac) => `@spec:${ac}`);
  return fs.readdirSync(testDir)
    .filter((name) => /^0\d{2}_.*\.sql$/.test(name))
    .some((name) => {
      try {
        const content = fs.readFileSync(path.join(testDir, name), 'utf8');
        return tags.some((tag) => content.includes(tag));
      } catch {
        return false;
      }
    });
}

function runReset(root, config) {
  const command = config?.database?.resetCommand || 'npx supabase db reset';
  const parts = command.trim().split(/\s+/);
  const proc = spawnSync(parts[0], parts.slice(1), {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, CI: process.env.CI || '1' },
    shell: process.platform === 'win32'
  });
  if (proc.error) fail(`falha ao executar reset: ${proc.error.message}`);
  if (proc.status !== 0 || proc.signal) fail('db reset falhou; Feature Verify abortado', proc.status || 1);
}

const feature = process.argv[2];
if (!feature || process.argv.length !== 3) fail('uso: node .onp-factory/scripts/feature-verify.cjs <feature>');

const root = process.cwd();
const config = loadConfig(root);
const engine = findEngine(root, config);
if (!engine) fail('motor ONP não encontrado. Execute `onp-factory doctor` e configure um enginePathCandidate válido.');

if (featureHasPgTap(root, feature)) {
  console.log('Feature possui testes pgTAP; preparando banco local descartável com db reset...');
  runReset(root, config);
}

const env = { ...process.env, ONP_VERIFY_FEATURE: feature };
const proc = spawnSync(process.execPath, [engine, 'verify', feature], {
  cwd: root,
  stdio: 'inherit',
  env
});
process.exit(proc.status !== null ? proc.status : 1);
