# Done e Gates — norma do ONP Factory

> **Status:** fonte normativa de Done e de Gates do Factory Kit.
> **Versão:** V0.1 · **Data:** 2026-09-26
> **Escopo:** congelar a norma. **Não** é manual operacional.
> **Substitui:** qualquer definição de "pronto" ou de gate em outro documento do kit.

## 1. Escopo e autoridade

Este documento é a **única** fonte normativa para:

- Task Done, Feature Done, Project Gate;
- os gates canônicos G0–G8;
- os estados PASS, FAIL, BLOCKED, N/A.

| Documento | Complemento |
|---|---|
| `docs/adoption.md` | **como** adotar o kit passo a passo |
| `docs/design.md` | **onde** fica a fronteira entre camadas |
| `docs/done-e-gates.md` (este) | **o que** é exigido para fechar |

Quando qualquer outro texto do kit — inclusive este parágrafo, um template ou um
relatório — contradizer este documento, este documento prevalece.

A autoridade mecânica de estrutura, rastreabilidade e prova é o
`onp-spec audit --ci` do motor ONP. Este documento **não reimplementa** a lógica
do audit: aponta para ele. Onde o audit já decide, o audit decide.

## 2. Estados de gate

| Estado | Definição |
|---|---|
| **PASS** | executado e satisfeito |
| **FAIL** | executado e não satisfeito |
| **BLOCKED** | era obrigatório, mas não pôde ser executado |
| **N/A** | gate condicional, demonstradamente não aplicável |

**Regras de estado:**

1. Gate obrigatório não executado é **BLOCKED**. Nunca PASS.
2. **"Não consegui executar" não é PASS, por ausência de resultado.** Desligar o
   Docker, o banco ou o Supabase não converte gate em PASS.
3. `BLOCKED` impede Done no nível em que o gate é obrigatório.
4. Todo **N/A** exige justificativa registrada.
5. **Não usar `SKIPPED` como estado semântico de gate**: mistura "não aplicável"
   com "não consegui executar". Use N/A e BLOCKED.

> Nota de nomenclatura: `templates/AGENTS.addendum.md:13` afirma que teste
> `skipped`/`ignored` não prova um critério. Isso trata do **resultado do
> teste**, não do estado do gate, e não conflita com esta seção.

## 3. Gates canônicos

| Gate | Pergunta | Aplicação |
|---|---|---|
| **G0 — Escopo da Entrega** | O que exatamente estamos tentando fechar? | obrigatória na entrega |
| **G1 — SPEC Review** | A SPEC está suficientemente correta e testável para ser implementada? | obrigatória por feature |
| **G2 — Test/Evidence Design** | Sabemos como cada AC será provado antes da implementação? | obrigatória por feature |
| **G3 — Feature Verify** | A implementação atual satisfaz mecanicamente os ACs da feature? | obrigatória por feature |
| **G4 — QA Funcional** | O comportamento funciona em cenário real quando a automação não é suficiente? | condicional |
| **G5 — QA Visual** | A mudança perceptível produz o resultado visual esperado? | condicional |
| **G6 — Diff/Scope Review** | O que realmente foi alterado corresponde ao escopo da feature/entrega? | obrigatória no nível de feature **e** de entrega |
| **G7 — Global Regression** | As mudanças continuam compatíveis com o restante do projeto? | obrigatória na entrega |
| **G8 — Audit** | O estado estrutural, documental e de evidência está coerente? | obrigatória por feature e na entrega |

**G1** considera, entre outros: AC observável; resultado versus implementação;
permissividade excessiva; ownership; conflitos; dependências; condições e casos
relevantes.

**G2** é satisfeito quando cada AC tem prova executável identificável antes da
implementação. O audit é a autoridade mecânica (`AC_SEM_TESTE`, `TESTE_ORFAO`).

**G3** exige, no mínimo: executado; `exitCode = 0`; `testsParsed > 0`; ACs PASS.

**G4** e **G5** não são automatizáveis por definição. Quando **G5** for
aplicável, o projeto declara seu método e ferramenta. O processo **não** fixa
Playwright nem nenhuma ferramenta específica.

**G6** é revisão em nível de feature/entrega. **Não** é condição mecânica de
task.

**Mutation Check não faz parte dos gates obrigatórios.** Permanece
experimental/recomendado, a usar quando houver dúvida sobre a força da prova.

## 4. Definição de Done

### 4.1 Task Done

Uma task está Done quando:

1. `status = [concluida]`;
2. todos os arquivos declarados em `Arquivos:` existem;
3. para cada AC listado em `Refs:`, existe prova PASS na feature dona do AC, e
   essa prova não está obsoleta;
4. quando a task possui `Refs:`, a prova da feature dona da task foi
   **validamente verificada** — isto é, a verificação foi executada e produziu
   resultado, não apenas herdou um arquivo de prova antigo;
5. se a task não possui `Refs:`, isso pode ser legítimo quando o resultado não
   é um AC verificável — por exemplo documentação, inventário ou organização;
6. nenhuma condição obrigatória de validação própria da task está FAIL ou
   BLOCKED.

**Regras negativas:**

- **Não** exigir commit específico. `1 task = 1 commit` permanece como convenção
  de organização, não como condição de Done.
- **Não** colocar escopo de diff como condição mecânica da task. Escopo é
  avaliado por **G6**, no nível de feature/entrega.
- Alterações de escopo de uma task devem ser registradas na própria task.

### 4.2 Feature Done

Uma feature está Done quando:

1. todas as tasks da feature estão Done;
2. todos os ACs da feature estão PASS;
3. **Feature Verify** foi efetivamente executado, com `exitCode = 0` e
   `testsParsed > 0`;
4. **Audit** foi efetivamente executado, com `audit --ci = 0`;
5. **G4** (QA funcional) foi executado quando aplicável;
6. **G5** (QA visual) foi executado quando aplicável — mudança perceptível;
7. todo achado de QA possui um desfecho registrado:
   - corrigido + guarda;
   - convertido em requisito/AC; ou
   - explicitamente fora do escopo + questão aberta registrada;
8. uma feature com 100% dos ACs PASS e zero task pendente não permanece em
   `rascunho` ou `em-implementacao` sem decisão de produto registrada;
9. dependências externas declaradas por `Refs:` estão satisfeitas: seus ACs
   possuem prova PASS válida;
10. nenhum gate obrigatório está FAIL ou BLOCKED.

**Regra fundamental:** gate obrigatório não executado é BLOCKED. "Não consegui
executar o audit" **não** é Done.

**Sobre suposições e perguntas em aberto:** este documento **não** reproduz as
regras de ASM/Q. A autoridade é o `onp-spec audit --ci`, que já decide
`ASM_ABERTA`, `Q_ABERTA` e `SECAO_AUSENTE` conforme o status da spec. Replicar
esses critérios aqui os faria divergir do motor.

### 4.3 Project Gate

**Project Gate é o estado necessário para uma ENTREGA/RELEASE.** Não significa
"o repositório inteiro está fechado".

Uma entrega precisa de um **artefato explícito de escopo** (ver §6.3).

Project Gate é satisfeito quando:

1. existe artefato explícito de escopo da entrega;
2. todas as features **incluídas** nessa entrega estão Done;
3. Global Regression foi efetivamente executado e PASSOU;
4. Audit `--ci` foi efetivamente executado e PASSOU;
5. build PASS;
6. lint PASS;
7. nenhuma prova relevante está obsoleta após a última alteração;
8. Diff/Scope Review da entrega foi concluído;
9. questões abertas relevantes estão explicitamente registradas;
10. existe registro de fechamento/handoff.

**Features não incluídas na entrega não precisam estar Done.** Somente as
incluídas satisfazem o gate.

## 5. Ordem do processo

Feature:

```text
G0 Escopo da Entrega
  ↓
G1 SPEC Review
  ↓
G2 Test/Evidence Design
  ↓
Tasks
  ↓
Implementação
  ↓
G3 Feature Verify
  ↓
G4 QA Funcional        [se aplicável]
  ↓
G5 QA Visual           [se aplicável]
  ↓
G6 Diff/Scope Review
  ↓
G8 Audit
  ↓
Feature Done
```

Entrega:

```text
Features incluídas Done
  ↓
G7 Global Regression
  ↓
G6 Diff/Scope Review da entrega
  ↓
G8 Audit final
  ↓
Project Gate
  ↓
Fechamento / Handoff
```

**G6 aparece nos dois fluxos** porque os níveis de escopo são diferentes: o
escopo de uma feature e o escopo de uma entrega não são o mesmo diff.

## 6. Regras de escopo

### 6.1 Staleness

Usar escopo preciso. **Não** usar "prova relevante" como termo genérico.

- **Task:** "a prova da feature dona desta task".
- **Feature:** a prova da própria feature.
- **Project Gate:** a condição de staleness pode constar como defesa em
  profundidade, mas **não** deve ser apresentada como regra independente do
  restante do mecanismo — ela é implicada por G7 + G8.

### 6.2 Dependências entre features via `Refs:`

`Refs:` pode apontar para AC de outra feature. Isso cria **dependência de
EVIDÊNCIA**, não necessariamente dependência de STATUS.

> Se uma task de A referencia um AC de B, A depende de uma prova PASS válida
> daquele AC externo, mas **não** precisa esperar que toda a feature B esteja
> Done.

Não criar regra que gere deadlock entre features.

### 6.3 Escopo da entrega

**Convenção aprovada:** `.spec/releases/<release-id>.md`

O artefato deve identificar, no mínimo:

- features **incluídas**;
- features **não incluídas**, quando necessário;
- objetivo/escopo da entrega;
- questões abertas relevantes, quando existirem.

Exemplo mínimo:

```markdown
# Release r-2026-09

## Objetivo
Estabilizar a experiência de interface antes da entrega ao cliente.

## Features incluídas
- refinamento-interface
- recuperacao-carga

## Features não incluídas
- relatorios-gerenciais — aguardando decisão de produto sobre fechamento

## Questões abertas relevantes
- Q-015: causa do `401 JWT issued at future` não determinada (impacto resolvido)
```

**Esta é uma convenção documental do processo.** O kit V0.1 não cria, valida
nem verifica esse artefato, e o motor ONP não tem noção de release. Não há
template no kit porque `onp-factory init` não cria `.spec/`.

## 7. Experimental

| Item | Situação |
|---|---|
| Mutation Check | **não** é gate obrigatório universal; recomendado quando houver dúvida sobre a força da prova |
| Estabilidade de IDs após o primeiro teste | não consolidada |
| Ownership de arquivos como proxy de paralelismo | não comprovado |
| Reuso de AC entre features com propagação de impacto | não medida |
| Formato do registro de QA visual | não padronizado |

## 8. Enforcement: o que é mecânico e o que é norma

Distinção obrigatória. Uma regra ser "normativa" **não** significa que o kit a
verifique.

### 8.1 Regras com enforcement real hoje

| Regra | Mecanismo | Âncora |
|---|---|---|
| Todo AC tem prova PASS | `AC_SEM_PROVA` (erro em `--ci`) | `verify.js:174-186` · `audit.js:16` |
| Teste `skip` não prova AC | redução de resultados | `verify.js:17-19, 62-86` |
| Task `[concluida]` exige prova PASS | `TASK_CONCLUIDA_SEM_PROVA` | `audit.js:292-311` |
| Arquivo declarado deve existir | `ARQUIVO_INEXISTENTE` (erro se concluída) | `audit.js:279-291` |
| Prova não obsoleta | `VERIFY_OBSOLETO` (erro em `--ci`) | `audit.js:376-392` |
| IDs únicos | `ID_DUPLICADO` | `audit.js:44-52` |
| G3 — `exitCode` e ACs PASS | adapter + motor | `adapters/node-vitest-supabase/combined-verify.cjs:104` |
| G7 — suíte completa | adapter, modo global | `adapters/node-vitest-supabase/combined-verify.cjs:96-102` |
| G8 — `audit --ci` exit 0 | motor | `audit.js:582-584` |

### 8.2 Regras hoje apenas normativas

Nenhuma ferramenta do kit verifica estas. São responsabilidade do executor.

| Regra | Observação |
|---|---|
| `testsParsed > 0` | o campo **existe** na prova (`verify.js:202`) e é escrito, mas **nada o lê** |
| G0 e o artefato de release | nenhuma leitura; o motor não conhece release |
| G2, além de `AC_SEM_TESTE` | o audit cobre a existência do teste, não o desenho da evidência |
| G4, G5, G6 | revisão humana por natureza |
| Coerência de status (cláusula 8 de 4.2) | o audit não verifica status atrasado em relação à prova |
| N/A com justificativa | sem registro mecânico |
| Escopo de staleness no Project Gate | implicado por G7 + G8, não verificado à parte |
| BLOCKED como estado | sem representação nos artefatos do motor |
| **Ambiente descartável, nunca produção (B-01)** | **documental, não enforced.** `database.resetCommand` é executado verbatim, sem validação (`adapters/node-vitest-supabase/feature-verify.cjs:55-64`), e `allowProductionReset` / `productionDbResetAllowed` não são lidos por nenhum código do kit. A frase "nunca execute o reset contra produção" está em `README.md:45` e `templates/AGENTS.addendum.md:17` e é **norma, não garantia técnica**. Ver C-01 em `docs/revisao-decisoes-processo.md`. O kit **não** impede tecnicamente um reset contra produção nesta V0.1 |
| Suficiência e independência da evidência (R-06 ampliado) | o audit vê se o teste **passou**, nunca se a prova é completa, circular ou independente |
| Validade além do código (R-08 ampliado) | só `src/` e `tests/` são observados; versão da SPEC, config, dependências, ambiente e dados não são |
| Diagnóstico causal (R-15) | o motor não reproduz nem explica; não há sinal de causa |
| Conclusão vs limites da evidência (R-16) | na **dimensão da evidência** o gate é binário (`pass`/não); o eixo de status já é semântico e acopla severidade (`ASM_ABERTA`, `SECAO_AUSENTE`, `Q_ABERTA` — C-02). A lacuna é a direção inversa: status atrasado com prova PASS não é detectado. **Nenhum estado tipo `PASS_WITH_LIMITATION` está previsto ou implementado** — ver `docs/processo-proposta.md` E-07 |
| Fonte de verdade com autoridade (R-17) | sem leitura de precedência entre artefatos |
| Revisão independente (R-18) | sem enforcement, e **não** obrigatória |
| Verificar capacidade antes de declarar incapacidade (R-19) | sem enforcement |
| Registrar problema da Factory antes de mudar (R-20) | sem enforcement |

`Nenhuma linha desta tabela autoriza enforcement novo.` Todas permanecem
normativas e dependem do executor.

### 8.3 Divergência conhecida — RESOLVIDA

`templates/AGENTS.addendum.md` é injetado em cada projeto adotado. Ele **tinha**
três divergências em relação a esta norma: não nomeava nenhum dos gates G0–G8,
continha **dois** `Audit` sem rótulo no fluxo, e listava seis bullets de gate que
não correspondiam à lista canônica.

**As três foram corrigidas no mesmo commit que versiona esta norma.** O template
agora traz a tabela G0–G8, o fluxo rotulado (`G0 → … → G6 → G8 Audit → Feature
Done`, e na entrega `… → G7 → G6 → G8 Audit → Project Gate`), os estados
PASS/FAIL/BLOCKED/N/A e a distinção Feature Verify (G3) × Global Regression
(G7). Restou apenas um ponto, registrado abaixo.

**Ponto ainda aberto:** um projeto que já tenha o addendum antigo injetado
continua com a versão anterior até ser re-injetado. `onp-factory init` em projeto
existente não é coberto por este documento.

## 9. O que este documento não define

- Como adotar o kit → `docs/adoption.md`.
- A fronteira entre Processo, ONP, Kit, Adapter, Agente e Projeto →
  `docs/design.md`.
- O processo completo em suas demais etapas → documento futuro.
- Roadmap e decisões de versão → `docs/roadmap.md`.

Nenhuma regra aqui autoriza suporte a release no CLI, detector de release
obsoleta, configuração de QA visual, alteração do motor ONP ou enforcement
adicional. Essas são decisões posteriores, condicionadas ao segundo projeto real
conforme `docs/roadmap.md`.
