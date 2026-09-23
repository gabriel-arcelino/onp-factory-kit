#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const VERSION = '0.1.0';
const MARKER_START = '<!-- ONP-FACTORY:BEGIN -->';
const MARKER_END = '<!-- ONP-FACTORY:END -->';

function die(message) {
  console.error(`onp-factory: ${message}`);
  process.exit(1);
}

function loadJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    die(`JSON inválido ou inacessível em ${file}: ${error.message}`);
  }
}

function parseArgs(argv) {
  const args = [...argv];
  const command = args.shift() || 'help';
  let target = null;
  let profile = null;
  let force = false;

  while (args.length) {
    const arg = args.shift();
    if (arg === '--profile') {
      profile = args.shift();
      if (!profile) die('--profile exige um valor');
    } else if (arg === '--force') {
      force = true;
    } else if (!target) {
      target = arg;
    } else {
      die(`argumento desconhecido: ${arg}`);
    }
  }

  return { command, target, profile, force };
}

function writeIfAbsent(source, destination, force) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  if (fs.existsSync(destination) && !force) {
    return { path: destination, action: 'preservado' };
  }
  fs.copyFileSync(source, destination);
  return { path: destination, action: force && fs.existsSync(destination) ? 'substituído' : 'criado' };
}

function render(text, vars) {
  return text
    .replaceAll('{{PROFILE}}', vars.profile)
    .replaceAll('{{KIT_VERSION}}', vars.version);
}

function upsertAgentsSection(target, force) {
  const kitRoot = path.resolve(__dirname, '..');
  const source = path.join(kitRoot, 'templates', 'AGENTS.addendum.md');
  const addendum = fs.readFileSync(source, 'utf8').trim();
  const agentsPath = path.join(target, 'AGENTS.md');

  if (!fs.existsSync(agentsPath)) {
    fs.writeFileSync(agentsPath, `# Regras do projeto\n\n${addendum}\n`, 'utf8');
    return { path: agentsPath, action: 'criado' };
  }

  const existing = fs.readFileSync(agentsPath, 'utf8');
  const start = existing.indexOf(MARKER_START);
  const end = existing.indexOf(MARKER_END);
  if (start !== -1 && end !== -1 && end >= start) {
    if (!force) return { path: agentsPath, action: 'preservado' };
    const before = existing.slice(0, start);
    const after = existing.slice(end + MARKER_END.length);
    fs.writeFileSync(agentsPath, `${before}${addendum}${after}`, 'utf8');
    return { path: agentsPath, action: 'seção ONP Factory atualizada' };
  }

  const separator = existing.endsWith('\n') ? '\n' : '\n\n';
  fs.writeFileSync(agentsPath, `${existing}${separator}${addendum}\n`, 'utf8');
  return { path: agentsPath, action: 'seção ONP Factory adicionada' };
}

function init(targetArg, profileName, force) {
  const kitRoot = path.resolve(__dirname, '..');
  const target = path.resolve(process.cwd(), targetArg || '.');
  fs.mkdirSync(target, { recursive: true });

  const profilePath = path.join(kitRoot, 'profiles', `${profileName}.profile.json`);
  if (!fs.existsSync(profilePath)) die(`perfil inexistente: ${profileName}`);
  const profile = loadJson(profilePath);

  const results = [];
  const templateMap = [
    ['onp-factory.config.json', 'onp-factory.config.json'],
    ['onpspec.config.json', 'onpspec.config.json']
  ];

  for (const [templateName, destinationName] of templateMap) {
    const source = path.join(kitRoot, 'templates', templateName);
    const destination = path.join(target, destinationName);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    if (fs.existsSync(destination) && !force) {
      results.push({ path: destination, action: 'preservado' });
      continue;
    }
    const content = render(fs.readFileSync(source, 'utf8'), {
      profile: profile.name,
      version: VERSION
    });
    fs.writeFileSync(destination, content, 'utf8');
    results.push({ path: destination, action: force ? 'substituído' : 'criado' });
  }

  const adapterRoot = path.join(kitRoot, 'adapters', profile.adapter);
  const destinationAdapter = path.join(target, '.onp-factory', 'scripts');
  if (!fs.existsSync(adapterRoot)) die(`adapter inexistente: ${profile.adapter}`);

  for (const entry of fs.readdirSync(adapterRoot, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.cjs')) continue;
    results.push(writeIfAbsent(
      path.join(adapterRoot, entry.name),
      path.join(destinationAdapter, entry.name),
      force
    ));
  }

  results.push(upsertAgentsSection(target, force));

  console.log(`ONP Factory Kit ${VERSION}`);
  console.log(`Perfil: ${profile.name}`);
  console.log(`Destino: ${target}`);
  for (const result of results) console.log(`- ${result.action}: ${result.path}`);
  console.log('\nO motor ONP continua separado. Use `node bin/onp-factory.cjs doctor <projeto>` para verificar o onboarding.');
}

function findEngine(target, config) {
  const candidates = config?.onp?.enginePathCandidates || [];
  for (const candidate of candidates) {
    const absolute = path.resolve(target, candidate);
    if (fs.existsSync(absolute)) return absolute;
  }
  return null;
}

function doctor(targetArg) {
  const target = path.resolve(process.cwd(), targetArg || '.');
  const configPath = path.join(target, 'onp-factory.config.json');
  const packagePath = path.join(target, 'package.json');
  const config = fs.existsSync(configPath) ? loadJson(configPath) : null;
  const checks = [];

  checks.push(['package.json', fs.existsSync(packagePath)]);
  checks.push(['onp-factory.config.json', !!config]);
  checks.push(['onpspec.config.json', fs.existsSync(path.join(target, 'onpspec.config.json'))]);
  checks.push(['.onp-factory/scripts/feature-verify.cjs', fs.existsSync(path.join(target, '.onp-factory/scripts/feature-verify.cjs'))]);
  checks.push(['.onp-factory/scripts/combined-verify.cjs', fs.existsSync(path.join(target, '.onp-factory/scripts/combined-verify.cjs'))]);
  checks.push(['AGENTS.md com bloco ONP Factory', (() => {
    if (!fs.existsSync(path.join(target, 'AGENTS.md'))) return false;
    const content = fs.readFileSync(path.join(target, 'AGENTS.md'), 'utf8');
    return content.includes(MARKER_START) && content.includes(MARKER_END);
  })()]);

  if (config) {
    checks.push(['motor ONP localizado', !!findEngine(target, config)]);
    if (config.profile === 'node-vitest-supabase') {
      checks.push(['supabase/config.toml', fs.existsSync(path.join(target, 'supabase', 'config.toml'))]);
      checks.push(['supabase/tests/', fs.existsSync(path.join(target, 'supabase', 'tests'))]);
      checks.push(['vitest instalado', fs.existsSync(path.join(target, 'node_modules', 'vitest', 'vitest.mjs'))]);
    }
  }

  console.log(`ONP Factory Doctor — ${target}`);
  let failed = 0;
  for (const [label, ok] of checks) {
    console.log(`${ok ? '✓' : '✗'} ${label}`);
    if (!ok) failed++;
  }
  process.exitCode = failed ? 1 : 0;
}

function help() {
  console.log(`ONP Factory Kit ${VERSION}`);
  console.log('Uso:');
  console.log('  node bin/onp-factory.cjs init <projeto> --profile node-vitest-supabase [--force]');
  console.log('  node bin/onp-factory.cjs doctor [projeto]');
}

const { command, target, profile, force } = parseArgs(process.argv.slice(2));
if (command === 'help' || command === '--help') help();
else if (command === 'init') init(target, profile || 'node-vitest-supabase', force);
else if (command === 'doctor') doctor(target);
else die(`comando desconhecido: ${command}`);
