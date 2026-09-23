const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const KIT_ROOT = path.resolve(__dirname, '..');
const CLI = path.join(KIT_ROOT, 'bin', 'onp-factory.cjs');

function run(args, cwd) {
  return spawnSync(process.execPath, [CLI, ...args], {
    cwd,
    encoding: 'utf8'
  });
}

test('init cria estrutura mínima do perfil', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'onp-factory-'));
  const project = path.join(temp, 'project');
  fs.mkdirSync(project);

  const result = run(['init', project, '--profile', 'node-vitest-supabase'], KIT_ROOT);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.existsSync(path.join(project, 'onp-factory.config.json')), true);
  assert.equal(fs.existsSync(path.join(project, 'onpspec.config.json')), true);
  assert.equal(fs.existsSync(path.join(project, '.onp-factory/scripts/feature-verify.cjs')), true);
  assert.equal(fs.existsSync(path.join(project, '.onp-factory/scripts/combined-verify.cjs')), true);
  assert.equal(fs.existsSync(path.join(project, '.onp-factory/scripts/pgtap-verify.cjs')), true);
  assert.equal(fs.readFileSync(path.join(project, 'AGENTS.md'), 'utf8').includes('ONP-FACTORY:BEGIN'), true);
});

test('init não sobrescreve configuração existente sem --force', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'onp-factory-'));
  const project = path.join(temp, 'project');
  fs.mkdirSync(project);
  const configPath = path.join(project, 'onp-factory.config.json');
  fs.writeFileSync(configPath, '{"custom":true}\n', 'utf8');

  const result = run(['init', project, '--profile', 'node-vitest-supabase'], KIT_ROOT);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(fs.readFileSync(configPath, 'utf8'), '{"custom":true}\n');
});

test('doctor falha de forma explícita quando o motor ONP não está presente', () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'onp-factory-'));
  const project = path.join(temp, 'project');
  fs.mkdirSync(project);

  const init = run(['init', project, '--profile', 'node-vitest-supabase'], KIT_ROOT);
  assert.equal(init.status, 0, init.stderr);
  const doctor = run(['doctor', project], KIT_ROOT);
  assert.equal(doctor.status, 1);
  assert.match(doctor.stdout, /motor ONP localizado/);
});
