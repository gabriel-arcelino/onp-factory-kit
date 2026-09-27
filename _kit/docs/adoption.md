# Adoção em um projeto

## 1. Inicializar

```bash
node bin/onp-factory.cjs init ../meu-projeto --profile node-vitest-supabase
```

O comando cria apenas a maquinaria ausente e adiciona um bloco delimitado ao `AGENTS.md`.

## 2. Executar o Doctor

```bash
node bin/onp-factory.cjs doctor ../meu-projeto
```

O objetivo é identificar rapidamente estrutura ausente, adapter não instalado ou motor ONP não localizado.

## 3. Descobrir o projeto

Registre o estado atual antes de criar requisitos:

- stack e runtime;
- test runners;
- banco e preparação local;
- build e lint;
- motor ONP e caminho efetivo;
- regras do agente;
- arquivos já existentes;
- riscos e contratos existentes.

## 4. Legado

Não invente requisitos históricos. Use baseline apenas para registrar proveniência do código e impedir que código existente fique sem rastreabilidade mínima.

## 5. Nova feature

Crie SPEC e critérios de aceite antes da implementação. Cada critério precisa de uma prova executável identificável.

Os gates **G1 — SPEC Review** e **G2 — Test/Evidence Design** regem esta etapa.
Ver [docs/done-e-gates.md](done-e-gates.md).

## 6. Feature Verify — gate G3

```bash
node .onp-factory/scripts/feature-verify.cjs minha-feature
```

Se a feature possuir testes pgTAP, o adapter prepara um banco local descartável com `npx supabase db reset` e então chama o motor ONP.

## 7. Regressão global — gate G7

```bash
node .onp-factory/scripts/combined-verify.cjs
```

Esse comando não substitui o Feature Verify; ele é o gate da suíte completa.

## 8. Fechamento

A definição de pronto **não** está neste documento. Ela é normativa em
[docs/done-e-gates.md](done-e-gates.md), que define Task Done, Feature Done,
Project Gate, os gates G0–G8 e os estados PASS / FAIL / BLOCKED / N/A.

Este arquivo é o passo a passo de adoção. A norma é o outro arquivo.

## 9. Segundo projeto

A V0.1 só deve ser considerada portátil depois de ser aplicada a um segundo projeto real. As adaptações encontradas nele devem alimentar a próxima versão do kit, não virar exceções espalhadas no primeiro projeto.
