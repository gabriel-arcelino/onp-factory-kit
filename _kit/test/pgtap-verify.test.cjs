const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const ADAPTER = path.resolve(__dirname, '..', 'adapters', 'node-vitest-supabase', 'pgtap-verify.cjs');

// Procura um container supabase_db em execucao. Sem ele nao ha como exercitar
// o adapter de verdade, e um teste que nao exercita o script real nao pega o
// bug que este teste existe para pegar.
function containerSupabase() {
  const r = spawnSync('docker', ['ps', '--filter', 'name=supabase_db', '--format', '{{.Names}}'], {
    encoding: 'utf8',
  });
  if (r.error || r.status !== 0) return null;
  const nome = (r.stdout || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0];
  return nome || null;
}

const CONTAINER = containerSupabase();
const SKIP = CONTAINER
  ? false
  : 'nenhum container supabase_db em execucao (o teste de integracao do adapter precisa de Docker)';

function projetoTemporario(sql, container) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'onp-pgtap-'));
  fs.mkdirSync(path.join(dir, 'supabase', 'tests'), { recursive: true });
  fs.writeFileSync(
    path.join(dir, 'onp-factory.config.json'),
    JSON.stringify(
      {
        version: '0.1',
        profile: 'node-vitest-supabase',
        onp: { enginePathCandidates: [] },
        database: { projectId: 'teste-integracao', container, resetCommand: 'echo' },
      },
      null,
      2
    )
  );
  fs.writeFileSync(path.join(dir, 'supabase', 'tests', '001_teste.sql'), sql);
  return dir;
}

const SQL_REPROVADO = `begin;
select plan(1);
select is(1, 2, 'falha deliberada para o teste de integracao');
select * from finish();
rollback;
`;

const SQL_APROVADO = `begin;
select plan(1);
select is(1, 1, 'aprovacao deliberada para o teste de integracao');
select * from finish();
rollback;
`;

function rodar(sql) {
  const dir = projetoTemporario(sql, CONTAINER);
  try {
    const r = spawnSync(process.execPath, [ADAPTER], { cwd: dir, encoding: 'utf8' });
    return { status: r.status, saida: `${r.stdout || ''}${r.stderr || ''}` };
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

test(
  'adapter reprova quando uma assercao pgTAP falha, mesmo com psql saindo com 0',
  { skip: SKIP },
  () => {
    const r = rodar(SQL_REPROVADO);
    assert.match(r.saida, /not ok 1 - falha deliberada/, 'a reprovacao deve aparecer na saida');
    assert.match(r.saida, /reprovado\(s\)/, 'o adapter deve reportar quantos reprovaram');
    assert.notEqual(r.status, 0, 'exit code nao pode ser 0 quando ha teste reprovado');
  }
);

test(
  'adapter aprova quando todas as assercoes passam',
  { skip: SKIP },
  () => {
    const r = rodar(SQL_APROVADO);
    assert.match(r.saida, /ok 1 - aprovacao deliberada/);
    assert.doesNotMatch(r.saida, /not ok/);
    assert.equal(r.status, 0, 'exit code deve ser 0 quando nada reprova');
  }
);

test(
  'o detector de reprovacao nao confunde nome de teste com "not ok"',
  { skip: SKIP },
  () => {
    // Um titulo que contenha "not ok" no meio da frase nao e uma reprovacao.
    const r = rodar(`begin;
select plan(1);
select ok(true, 'o comando should fail not ok silenciosamente');
select * from finish();
rollback;
`);
    assert.equal(r.status, 0, 'titulo contendo "not ok" nao pode reprovar o gate');
  }
);
