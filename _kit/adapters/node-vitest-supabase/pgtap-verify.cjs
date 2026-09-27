#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const ROOT = process.cwd();
const FEATURE = process.env.ONP_VERIFY_FEATURE || null;
const TEST_DIR = path.join(ROOT, 'supabase', 'tests');

function config() {
  const file = path.join(ROOT, 'onp-factory.config.json');
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function detectProjectId(cfg) {
  if (cfg?.database?.projectId) return cfg.database.projectId;
  const file = path.join(ROOT, 'supabase', 'config.toml');
  if (!fs.existsSync(file)) return null;
  const content = fs.readFileSync(file, 'utf8');
  const match = content.match(/^project_id\s*=\s*"([^"]+)"/m);
  return match ? match[1] : null;
}

function featureAcs(feature) {
  const specPath = path.join(ROOT, '.spec', 'features', feature, 'spec.md');
  if (!fs.existsSync(specPath)) {
    console.error(`onp-factory pgtap-verify: feature "${feature}" não encontrada`);
    process.exit(1);
  }
  const content = fs.readFileSync(specPath, 'utf8');
  return [...new Set([...content.matchAll(/AC-\d{3,}/g)].map((m) => m[0]))];
}

// Asserção pgTAP reprovada NÃO é erro SQL: o psql termina com exit 0 e imprime
// "not ok N" no TAP. Só o exit code, portanto, não distingue "tudo passou" de
// "um teste reprovou" — e um gate que reporta PASS com teste reprovado é pior do
// que gate nenhum. Aqui a reprovação vira falha explicitamente.
function reprovadosTap(out) {
  return out
    .split(/\r?\n/)
    .filter((line) => /^\s*not\s+ok\s+\d+/.test(line))
    .map((line) => line.trim());
}

let files = fs.existsSync(TEST_DIR)
  ? fs.readdirSync(TEST_DIR).filter((name) => /^0\d{2}_.*\.sql$/.test(name)).sort()
  : [];

if (FEATURE) {
  const acs = featureAcs(FEATURE);
  const tags = acs.map((ac) => `@spec:${ac}`);
  files = files.filter((name) => {
    try {
      const content = fs.readFileSync(path.join(TEST_DIR, name), 'utf8');
      return tags.some((tag) => content.includes(tag));
    } catch {
      return false;
    }
  });
  if (!files.length) process.exit(0);
}

if (!files.length) {
  console.error('onp-factory pgtap-verify: nenhum arquivo em supabase/tests/0*.sql');
  process.exit(1);
}

const cfg = config();
const projectId = detectProjectId(cfg);
if (!projectId) {
  console.error('onp-factory pgtap-verify: não foi possível determinar o project_id do Supabase.');
  process.exit(1);
}

const container = cfg?.database?.container || `supabase_db_${projectId}`;
const user = process.env.PGUSER || 'postgres';
const db = process.env.PGDATABASE || 'postgres';
let anyFailed = false;

for (const name of files) {
  const sql = `CREATE EXTENSION IF NOT EXISTS pgtap;\n${fs.readFileSync(path.join(TEST_DIR, name), 'utf8')}`;
  const proc = spawnSync('docker', [
    'exec', '-i', '-e', 'PGPASSWORD=postgres', container,
    'psql', '-U', user, '-d', db, '-t', '-A', '-v', 'ON_ERROR_STOP=1'
  ], { input: sql, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });

  if (proc.error) {
    console.error(`onp-factory pgtap-verify: erro ao executar docker: ${proc.error.message}`);
    anyFailed = true;
    continue;
  }

  let out = `${proc.stdout || ''}${proc.stderr || ''}`;
  out = out.split(/\r?\n/).map((line) => line.replace(/^NOTICE:\s+/, '')).join('\n');
  if (out.trim()) process.stdout.write(`${out.trimEnd()}\n`);
  if (proc.status !== 0) anyFailed = true;

  const reprovados = reprovadosTap(out);
  if (reprovados.length) {
    console.error(
      `onp-factory pgtap-verify: ${reprovados.length} teste(s) pgTAP reprovado(s) em ${name}:`
    );
    for (const linha of reprovados) console.error(`  ${linha}`);
    anyFailed = true;
  }
}

process.exit(anyFailed ? 1 : 0);
