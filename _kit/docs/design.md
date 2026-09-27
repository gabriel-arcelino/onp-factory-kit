# Arquitetura da V0.1

## Fronteira de responsabilidades

```text
ONP Factory Kit
├── processo universal
├── templates
├── CLI de adoção
└── adapters
      └── node-vitest-supabase
             │
             ↓
          Projeto
             │
             ├── .spec/
             ├── código/testes
             ├── AGENTS.md
             └── onpspec.config.json

Motor ONP
└── separado do Factory Kit
```

O kit não é um fork do motor ONP. Ele operacionaliza a adoção e contém adapters para o modo como um projeto executa os gates.

O **processo** (Done, gates G0–G8, estados de gate) é normativo em
[done-e-gates.md](done-e-gates.md). A **adoção** é [adoption.md](adoption.md).
Este documento define apenas a fronteira entre camadas.

## Decisões V0.1

1. O projeto de referência é `salao-beleza-sistema` na branch experimental que validou o fluxo.
2. A V0.1 suporta somente Node + Vitest + Supabase/pgTAP.
3. Feature Verify e Global Regression permanecem separados.
4. Banco para Feature Verify de uma feature com pgTAP é descartável e preparado por `supabase db reset`.
5. O motor ONP é descoberto por candidatos configuráveis, em vez de um caminho fixo.
6. Arquivos existentes são preservados pelo `init`, salvo uso explícito de `--force`.

## O que não entra na V0.1

- suporte genérico a Python, Jest, Playwright ou Next.js;
- fork do motor upstream;
- publicação npm como pacote estável;
- autodetecção avançada de qualquer stack;
- integração automática com GitHub;
- abstrações além das comprovadas no projeto de referência.
