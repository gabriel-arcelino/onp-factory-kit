# Processo ONP Factory — Proposta

> **NÃO É FONTE NORMATIVA.** Este documento é uma análise/proposta datada de
> 2026-09-26. Suas definições de Done (§10) e de gates (§5, rotulados G1–G9)
> foram **substituídas** por [done-e-gates.md](done-e-gates.md), que é a fonte
> normativa. Atenção: a numeração de gates aqui é **diferente** da vigente —
> aqui G4 = Feature Verify e G6 = QA visual; na norma G4 = QA Funcional e
> G6 = Diff/Scope Review. Não use os rótulos deste documento.
> Permanece válido como registro da evidência que originou a norma.

> **Status:** PROPOSTA. Não é documentação oficial do kit e não substitui
> `docs/design.md`, `docs/adoption.md` nem `docs/roadmap.md`.
> **Data:** 2026-09-26 · **Base experimental:** 1 projeto (`salao-beleza-sistema`,
> branch `experimento/onp-fase-4`) · **Kit avaliado:** V0.1 (commit `c734a53`)

## Como ler este documento

Cada afirmação carrega uma marcação. Ela é a regra de qualidade mais importante
deste documento e não deve ser relaxada quando ele for convertido em
documentação oficial:

| Marca | Significado |
|---|---|
| `[FATO]` | Comprovado nas fontes. Sempre acompanhado de âncora localizável: `arquivo:linha`, hash de commit, ou código de sinal em `.spec/verification/sinais.json`. |
| `[INFERÊNCIA]` | Derivado de um `[FATO]`, mas não confirmado diretamente. Escrito como hipótese, nunca como conclusão. |
| `[PROPOSTA]` | Posição deste documento. Não é aprendizado. É o que se propõe adotar. |

Regraderivada da própria evidência: **ausência de registro não é prova de
ausência**. Onde o experimento não exercitou algo, o documento diz
"não exercitado" em vez de propor uma regra como se fosse aprendizada.

## Fontes e correções ao briefing original

Duas divergências entre o briefing e o estado real dos repositórios, registradas
aqui para que ninguém as reproduza:

1. **O briefing pedia `docs/relatorio-execucao-refinamento-interface.md` no
 projeto de referência. Esse arquivo não existe.** Ele existiu até o commit
 `62fc9c4` e foi renomeado em `55277ff` para
 `docs/relatorio-execucao-sessao-onp.md`. Toda citação a "§N do relatório"
 neste documento refere-se ao arquivo renomeado, que é o mesmo conteúdo mais a
 feature `recuperacao-carga` (§13).
 `[FATO]` — `git log --oneline` do projeto de referência: `55277ff docs:
 renomear o relatorio de handoff para relatorio-execucao-sessao-onp.md`.

2. **O briefing tratava `_kit/` como diretório do projeto de referência. Não é.**
 O kit vive em repositório próprio, `onp-factory-kit`, com um único commit
 (`c734a53 feat: criar ONP Factory Kit v0.1`) e zero tags.
 `[FATO]` — `git log` e `git branch` do repositório do kit.

 Observação lateral, **fora do escopo deste documento** e não alterada por ele:
 a árvore de trabalho do repositório do kit tem deleções não commitadas
 (`_kit/onp-factory-kit-v0.1-final/*` e `onp-factory-kit-v0.1-ready.zip`).
 Registrado aqui apenas para não ser interpretado como efeito deste trabalho.

---

## 1. Princípios

Cinco princípios. Os cinco são `[FATO]` no sentido de que cada um tem lastro
observável; a formulação é `[PROPOSTA]`.

### 1.1 A prova é o exit code, nunca a palavra de quem implementou

`[FATO]` O motor ONP mantém a distinção em código: `verify.js` grava
`.spec/verification/<feature>.json` a partir da saída do runner, e o comentário
no código é literal — *"O agente (ou o dev) não decide se o AC passou. O test
runner decide."* (`.claude/skills/onp-spec-driven/scripts/lib/src/core/verify.js:5`).
`audit.js` reprova `TASK_CONCLUIDA_SEM_PROVA` quando a tarefa está
`[concluida]` e o AC referenciado não tem `status: pass`
(`audit.js:292-311`).

`[FATO]` A skill formaliza isso como "Regra de ouro": *"Se você está prestes a
dizer 'pronto', rode `onp-spec audit --ci` e cole a saída. Se não saiu 0, não
está pronto."* (`.claude/skills/onp-spec-driven/SKILL.md:325-329`).

`[PROPOSTA]` Nenhum artefato do processo — relatório, resumo, tabela de
andamento, mensagem de commit — tem valor de prova. Eles têm valor de
**rastreabilidade** e de **contexto para quem vai auditar**.

### 1.2 Prova mecânica e validação perceptual são gates distintos

`[FATO]` É o achado mais forte do experimento. O `<h1>` do shell recebeu
`FONT_SIZE_HEADING` na T-024; medido no navegador, o título do sistema e o título
da página ficaram com o mesmo tamanho (24px contra 24px), achatando a hierarquia
exigida pela US-016. O texto do AC-037 foi satisfeito literalmente (o título
referencia os tokens), `audit` saiu 0, 11/11 ACs estavam com prova PASS — e a
tela ficou pior (relatório §11, "Defeito encontrado e corrigido").

`[FATO]` A spec da feature separava os dois de propósito, antes de o defeito
aparecer: *"A prova mecânica deve identificar os grupos e a separação
estrutural; a validação visual humana, distinta da prova mecânica, deve
confirmar a separação visível entre eles."*
(`.spec/features/refinamento-interface/spec.md:52`, `:113`).

`[FATO]` A ordem real foi invertida em relação ao que se imagina: a validação
visual **ocorreu depois** do `audit --ci` = 0. O commit `8d0ee34` (22:57)
escreveu o relatório; `62fc9c4` (23:37) corrigiu o defeito e renovou quatro
provas de uma vez.

`[PROPOSTA]` Nenhum processo pode tratar "todos os ACs PASS" como equivalente a
"a mudança faz o que o usuário pediu". São afirmações diferentes, provadas por
meios diferentes.

### 1.3 O agente executa o processo; o processo não é o agente

`[FATO]` O mesmo conjunto de regras operou sob dois executores diferentes sem
alteração: `.kilo/`, `.claude/` e `.opencode/` coexistem no projeto de
referência, e `AGENTS.md:48-58` documenta a coexistência da skill
`retro-karpathy` nos três. A branch experimental carregava artefatos de
execução produced por Kilo Code, e a validação visual foi feita por script
Playwright, não pelo agente.

`[FATO]` A regra de paralelismo é do motor, não do agente: a skill exige que o
agente **pergunte** ao usuário quais tarefas paralelizar antes de executar, e
proíbe executar sem resposta (`SKILL.md:169-188`).

`[PROPOSTA]` O kit é intercambiável entre agentes porque nenhum de seus
artefatos depende do harness. O que é escrito em `AGENTS.md` é estável entre
Kilo, OpenCode e Claude Code; o que é específico de harness (lista de tarefas
nativa, `AskUserQuestion`, `claude -p` headless) pertence à skill do agente e
**não** deve entrar no kit como regra.

### 1.4 O escopo de um gate é decisão do Adapter, não do ONP

`[FATO]` O motor não tem noção de escopo de feature. `runVerify` executa
`config.testCommand` copiando o ambiente do processo, sem injetar nada
(`verify.js:123-133`). O `testCommand` do projeto de referência é
`node scripts/onp-combined-verify.cjs` (`onpspec.config.json:2`), e é **esse
script** que decide se roda tudo ou só a feature, lendo `ONP_VERIFY_FEATURE`
(`scripts/onp-combined-verify.cjs:6`, `:57-78`, `:80-123`).

`[FATO]` Consequência medida: chamar `onp-spec verify <feature>` diretamente,
sem o wrapper, executa o `testCommand` em modo global — a "feature verify" vira
regressão global silenciosamente. É exatamente o que o `AGENTS.md:30-36` do
projeto de referência proíbe.

`[PROPOSTA]` "Feature Verify ≠ Global Regression" é uma regra de adapter. Ela só
pode ser exijida por um adapter que implemente o filtro, e o Factory Kit deve
tratá-la como tal: ela pertence a `adapters/<perfil>`, não ao kit nem ao motor.

### 1.5 Verde não é "pronto"

`[FATO]` No estado de `audit --ci` = 0 registrado em `docs/relatorio-execucao-sessao-onp.md:28-31`,
`relatorios-gerenciais` tinha 11/11 ACs provados com status `rascunho`, e
`legado-baseline` tinha 1/1 provado com status `em-implementacao` (relatório
§1 e §12.5). O `audit` não reclamou: o gate trata status como campo, não como
verificação.

`[FATO]` Na direção oposta, T-019, T-020 e T-021 estavam implementadas e com
prova PASS, mas marcadas `[pendente]`, e foram regularizadas depois (relatório
§2, "Regularizações fora do escopo de implementação"). T-012
(`legado-baseline`) está `[pendente]` até hoje, com AC-020 provado
(`.spec/features/legado-baseline/tasks.md:5`).

`[PROPOSTA]` "Feature fechada" e "prova PASS" são estados diferentes, e nenhum dos
dois é derivado do outro por um gate. O kit precisa de uma noção explícita de
fechamento que o `audit` não tem.

---

## 2. Fronteiras de responsabilidade

`[PROPOSTA]` Baseado na fronteira já declarada em `docs/design.md:3-25` e
`README.md:31`, estendida para incluir o agente e o projeto como camadas de
primeiro classe.

| Camada | O que decide | O que **não** decide | Substituível? |
|---|---|---|---|
| **Processo** (§3–§5, §10) | Ordem dos estágios, definição de Done, sequência de gates, o que é obrigatório por projeto | Como rodar qualquer comando; o conteúdo de um AC | Não — é o produto |
| **ONP (motor)** | Gramática de `spec.md`/`tasks.md`; unicidade de IDs; existência de teste por AC; existência de prova PASS; obsolescência de prova; lastro de lição | Escopo de feature, paralelismo, percepção, arquitetura, escopo de diff | Não — é upstream |
| **Factory Kit** | Fronteira projeto↔motor: templates de config, bloco `AGENTS.md`, CLI de adoção, inventário de regras | Regras de stack; qualquer gate sem lastro no experimento | Não, mas versiona |
| **Adapter** (§9) | Como o projeto executa cada gate: o comando, o filtro, a preparação de ambiente, o formato de saída | O que deve ser provado; o significado de PASS | **Sim** — é a porta de entrada de outra stack |
| **Agente** (§7) | Execução dentro do escopo; mecanismo; ordem interna; pesquisa | Fechar AC; marcar tarefa sem prova; alterar AC/teste para passar; escolher paralelismo sem perguntar | **Sim, e é a intenção** |
| **Projeto** | Requisitos, prioridade, constituição, decisões de produto | O processo; a semântica do gate | Não |

`[FATO]` O `design.md:25` já afirma o essencial: *"O kit não é um fork do motor
ONP. Ele operacionaliza a adoção e contém adapters para o modo como um projeto
executa os gates."* Esta proposta não contradiz; explicita.

`[PROPOSTA]` Regra de não-difusão, que é a defesa contra o framework
monolítico: **nenhuma regra de stack sobe para Processo; nenhuma regra de
Processo desce para Adapter.** Se uma regra precisa ser reescrita para funcionar
em outra stack, ela não era de Processo.

---

## 3. Ciclo de vida de uma feature

`[FATO]` Reconstrução a partir do `git log` do projeto de referência
(`git log --pretty=format:"%h %ad %s" --date=format:"%Y-%m-%d %H:%M"`), não a
partir da narrativa do relatório. A coluna "grau" distingue o que foi
**comprovado** de exercise do que foi apenas **decidido conceitualmente**.

| # | Estágio | Evidência | Grau | Gate que encerra |
|---|---|---|---|---|
| 1 | Descoberta | `46ecdcf`, `a391509`, `a5dfa26`, `415ce9b`, `6ca1f12`, `2f3dcd6`, `a550d12` (23–24/09) | **Comprovado** — artefato escrito antes de qualquer código | `docs/auditoria-visual-estabilizada.md` com metodologia, inventário de telas, contagem e "Nenhum código alterado" (`:1-9`, `:94-111`); `docs/auditoria-visual-atual.md` registra data, ambiente, viewports |
| 2 | Requisitos | `processo-dev-salao-beleza.md`; `plano-arquitetura-salao-beleza-v2_4.md`/`v2_5.md` | **Comprovado, mas pré-ONP e humano** | Nenhum gate mecânico. Os documentos têm estrutura de prosa, não de AC |
| 3 | Arquitetura / Impacto | Seção "Impacto técnico" da spec; `refinamento-contratos-fundacao-ui.md` | **Conceitual** | Nenhum. Não existe `design.md` de feature no projeto — a fase "Projetar" do ONP **não foi exercitada** |
| 4 | SPEC | `97cc5a8` cria → `01261a3` refina AC+tarefas → `29b56fd` revisa AC-002/005/006/007/008/011 → `5b1a829` finaliza → `218b468` renumera | **Comprovado** — 5 commits, ~9 h | `audit` (ver estágio 5) |
| 5 | **Revisão da SPEC** | `sinais.json`: `ID_DUPLICADO` (AC-001..011, US-001..006) e `Q_STATUS_INVALIDO` em 24/09 19:07:46Z | **Comprovado e mecânico** | `audit` antes de qualquer código — foi 5 h 31 min antes do 1º commit de implementação (`8759338`, 25/09 01:39) |
| 6 | AC | 11 ACs em US-013..US-018, cada um com linha "Evidência" apontando para um achado `P2`/`P3` da auditoria (spec `:173-187`) | **Comprovado** | `AC_SEM_TESTE` (erro) |
| 7 | Testes | `8759338` já cria `tests/ui/refinamento-interface-formularios.spec.tsx` | **Comprovado, por outro caminho** | Ver ressalva abaixo |
| 8 | Tasks | `01261a3`, `29b56fd`, `218b468` (renumeração T-001..007 → T-019..025), `f9158a9` | **Comprovado** | `ARQUIVO_INEXISTENTE` vira erro quando a tarefa está `concluida` |
| 9 | Plano | `5053baf` gera `plano-execucao.{md,html}`, `executar-tarefas.sh`, `plano.json`; `561d86f` e `7e4b7b6` regeneram | **Comprovado como artefato, não como execução** | Nenhum |
| 10 | Implementação | `8759338`→`17b7ff7`→`db6e978`→`0fc7cfc`→`314e6c7`→`7e4b7b6`→`3d2e96e`→`1bfc9e1`→`e5c31fd` | **Comprovado** | 1 task = 1 commit citando `T-xxx` — cumprido em 6 de 7 |
| 11 | Feature Verify | `.spec/verification/*.json` com `command: node scripts/onp-combined-verify.cjs`; `VERIFY_FALHOU` para AC-031/032/041/033/034 em 25/09 20:48:48Z | **Comprovado** | `AC_SEM_PROVA` |
| 12 | QA | O próprio relatório §7 (6 mutações) e §11 (medição no navegador) | **Comprovado, humano** | Nenhum |
| 13 | Regressão global | `combined-verify.cjs` roda dentro de **todo** verify, por ser o `testCommand` | **Comprovado, mas acoplado** | Ver §13 |
| 14 | Audit | `audit --ci` exit 0, saída colada no relatório §1 | **Comprovado** | `ok = erros.length === 0` (`audit.js:582-584`) |
| 15 | Fechamento | `8d0ee34` relatório de handoff; `958a790` e `a578b1f` alinham o relatório ao estado real | **Comprovado** | Nenhum |
| 16 | Manutenção | `recuperacao-carga`: `3f32379` (T-025) e `562c806` (T-026) | **Comprovado** | Ciclo de lição (§15) |

### 3.1 Ressalva sobre o estágio 7 — `scaffold` não foi usado

`[FATO]` A skill prescreve `onp-spec scaffold <feature>` para gerar o esqueleto de
teste que falha (`SKILL.md:232-236`, e `references/fluxo.md:56-60`). No projeto
de referência, nenhum commit menciona `scaffold` e nenhum sinal em `sinais.json`
indica seu uso. A prática real foi outra: **cada task declara seu arquivo de
teste em `Arquivos:` e o escreve como parte da própria task** — T-019 lista
`tests/ui/refinamento-interface-formularios.spec.tsx`, T-020 lista
`...-empty-state.spec.tsx`, e assim por diante
(`.spec/features/refinamento-interface/tasks.md:24-51`).

`[FATO]` O efeito é observável: `ARQUIVO_INEXISTENTE::refinamento-interface::T-020`
a `T-023` aparecem com `primeiraVez: 2026-09-25T12:10:23Z` — o audit acusou
arquivos de teste que ainda iam ser criados, o que é o comportamento esperado de
uma task que declara o que vai produzir.

`[INFERÊNCIA]` O caminho "teste dentro da task" funcionou aqui porque as tasks
eram pequenas e cada uma tocava um arquivo de teste distinto. Não há evidência
de que ele escale para features em que a task precisa de um teste que ainda não
existe porque a **implementação** ainda não existe.

`[PROPOSTA]` O kit **não deve** prescribing `scaffold` como passo obrigatório.
Deve declarar os dois caminhos como válidos e exigir o mesmo resultado: todo AC
com teste anotado antes de a task ser marcada concluída.

### 3.2 Ressalva sobre o estágio 9 — o plano foi gerado e não executado

`[FATO]` `plano-execucao.md:8` declara *"6 tarefa(s) pendente(s): 5 em 2
faixa(s) paralela(s) + 1 sequencial(is)"*, com worktrees
`spec/refinamento-interface-faixa-1` e `-faixa-2` e `executar-tarefas.sh`
pronto. O relatório §4 item 5 registra: *"T-024 executada nesta sessão, sem
executor headless nem sessão nova."* O `git log` confirma execução **sequencial
na árvore principal**: `8759338`, `17b7ff7`, `db6e978`, `0fc7cfc`, `314e6c7`,
`7e4b7b6`, `3d2e96e`, `1bfc9e1`, `e5c31fd`.

`[FATO]` O motivo está no próprio plano: das 5 tarefas em faixas, 4 estão na
mesma faixa-1 (`plano-execucao.md:25-28`) porque compartilham
`ProfissionaisPage.tsx`, `ClientesPage.tsx` e outros. A única tarefa
verdadeiramente isolada era T-023 (`src/App.tsx`).

`[FATO]` E o paralelismo chegou a ser **perigoso**: o relatório §4 item 1 registra
que o `<h1>` do shell "pertence à T-023, para não conflitar com a faixa paralela"
— T-022 e T-023 foram colocadas em faixas disjuntas por arquivo, mas tinham
dependência semântica sobre o mesmo elemento visual.

`[PROPOSTA]` Gerar plano é barato e útil; executar em paralelo por overlap de
arquivo, não. O kit deve tratar o plano como **artefato de decisão** (inclusive
a decisão de não paralelizar), nunca como ordem de execução.

### 3.3 A renomeação de IDs como evento do ciclo de vida

`[FATO]` O commit `218b468` (25/09 00:02, mensagem literally `"ok"`) renumerou
22 códigos de uma vez: `US-001..006` → `US-013..018`, `AC-001..011` →
`AC-031..041`, `T-001..007` → `T-019..025`. O diff toca
`inventario.md`, `spec.md` e `tasks.md` com 85 inserções e 85 remoções.

`[FATO]` Foi seguro **apenas** porque nenhum teste e nenhum plano referenciava
esses IDs ainda: o plano foi gerado em `5053baf`, às 00:16, catorze minutos
depois; o primeiro teste, em `8759338`, às 01:39.

`[INFERÊNCIA]` Renumerar depois de testes existirem exigiria reescrever tags
`@spec:` em arquivos de teste e regenerar o plano — sem gate que detecte a
divergência se os dois lados forem esquecidos de formas diferentes.

`[PROPOSTA]` Ids devem ser tratados como **estáveis após o primeiro teste**.
Ver §18 (regra experimental) e §19 (lacuna L-06).

---

## 4. Ciclo de vida de uma task

### 4.1 O contrato de uma task

`[FATO]` O formato canônico está no cabeçalho de
`.spec/features/refinamento-interface/tasks.md:5-20` e é aplicado pelo parser em
`.claude/skills/onp-spec-driven/scripts/lib/src/parsers/tasks.js:13-19`.

| Campo | Obrigatório | O que o motor faz com ele |
|---|---|---|
| `## T-xxx — Título [status]` | Sim | Status inválido vira `TASK_STATUS_INVALIDO` (erro) — nunca degrada para `pendente` em silêncio (`tasks.js:36-50`) |
| `- Refs: US-xxx, AC-xxx` | Sim por convenção | `REF_QUEBRADA` se a referência não existe em **nenhuma** spec; `globalCoveredAcs` é GLOBAL (`audit.js:78-92`) |
| `- Arquivos: a, b, c` | Sim para task de implementação | Decide paralelismo por overlap; `ARQUIVO_INEXISTENTE` (erro se `concluida`); alimenta `ARQUIVO_ORFAO` |
| `- Modelo:` / `- Esforço:` | Não | Usados pelo plano |
| `- Notas:` | Não | Texto livre; **não é verificado** |

`[FATO]` `Arquivos:` separa **apenas por vírgula**, para permitir caminhos com
espaço (`tasks.js:86-95`).

### 4.2 Os seis estados reais de uma task

`[FATO]` O motor conhece três status (`pendente`, `em-andamento`, `concluida`) e
uma regra de prova. O experimento produziu seis situações distintas:

| # | Situação | O motor detecta? | Evidência |
|---|---|---|---|
| 1 | `[concluida]` com AC sem prova PASS | **Sim**, erro | `TASK_CONCLUIDA_SEM_PROVA` — `TASK_CONCLUIDA_SEM_PROVA::relatorios-gerenciais::T-003` tem **80 ocorrências** |
| 2 | `[concluida]` com AC provado por teste `skip` | **Sim**, erro | `audit.js:300` — a mensagem diz "o teste foi PULADO — skip não é prova" |
| 3 | `[concluida]` com arquivo declarado inexistente | **Sim**, erro | `ARQUIVO_INEXISTENTE` com severidade `erro` quando `concluida` (`audit.js:283-286`) |
| 4 | `[pendente]` com AC provado e código entregue | **Não** | T-019/T-020/T-021 (relatório §2) e T-012 (ainda hoje, `legado-baseline/tasks.md:5`) |
| 5 | Sem `- Refs:` | **Não** | T-006 em `.spec/features/fundacao-ui/tasks.md:3-6` — o cabeçalho do próprio arquivo exige `Refs:`, o audit não |
| 6 | `- Refs:` apontando para AC de outra feature | **Sim**, e é válido por design | A prova é buscada na feature **dona** do AC (`audit.js:294-297`) |

`[PROPOSTA]` O estado 4 é o mais perigoso dos seis, porque produz um artefato
**falso de progresso**: o `tasks.md` subdeclara o que foi entregue. Nenhum gate
do kit ou do motor o detecta. O parche mais barato é um check no Doctor que
compare status de tarefa com a existência do commit citado na mensagem — e mesmo
isso é frágil. Registrado como lacuna L-08 (§19), não como proposta de
implementação.

### 4.3 Ownership de arquivos: o que `Arquivos:` faz e o que não faz

`[FATO]` Ownership **não** é obrigação de alteração. T-019 a T-024 listam
`src/pages/ProfissionaisPage.tsx`, `src/pages/ClientesPage.tsx` e
`tests/ui/...` — 11 tarefas e 3 arquivos compartilhados. Só 6 tasks alteraram
alguma página; `LoginPage.tsx`, por exemplo, está em T-019, T-021 e T-022.

`[FATO]` Ownership **não** é isolamento. T-022 e T-023 declaram arquivos
disjuntos e o plano as colocou em faixas paralelas; a dependência semântica
sobre o `<h1>` do shell só apareceu na execução (relatório §4 item 1).

`[FATO]` Ownership **é** o único mecanismo que impede `ARQUIVO_ORFAO`. O sinal
`ARQUIVO_ORFAO` chegou a 22 ocorrências para cada um de ~20 arquivos de `src/`
(`sinais.json`, e.g. `ARQUIVO_ORFAO::—::src/lib/api/clientes.ts` = 22,
`ARQUIVO_ORFAO::—::src/pages/ClientesPage.tsx` = 22) — o que significa que um
projeto adotando ONP sem baseline começa o processo com ~20 avisos que
desaparecem só quando as tasks forem escritas.

`[PROPOSTA]` `Arquivos:` deve ser lido como **três** declarações, e o processo
deve dizer as três em voz alta na fase de Tarefas:

1. **responsabilidade** — este arquivo pertence a esta feature;
2. **expectativa de mutação** — provavelmente será alterado (informação para
 revisor de diff, não obrigação);
3. **fronteira de paralelismo** — dois tasks que declaram o mesmo arquivo não
 podem rodar em paralelo.

Declaração 3 é a única mecânica. Declarações 1 e 2 são de revisão humana.

---

## 5. Gates

`[PROPOSTA]` Nove gates. A coluna "Ordem real" é a ordem comprovada no
experimento, que **não** é a ordem em que a spec do kit os apresenta
(`templates/AGENTS.addendum.md:8`).

| Gate | Objetivo | Entrada | Saída | Executor | Tipo | Ordem real |
|---|---|---|---|---|---|---|
| **G1 SPEC Review** | Confirmar que a spec é auditável antes de existir código | `.spec/features/<f>/spec.md`, `tasks.md`, `inventario.md` | `audit` sem `ID_DUPLICADO`, `AC_INCOMPLETO`, `Q_STATUS_INVALIDO`, `SECAO_AUSENTE` | `onp-spec audit` | Mecânico | 1º — 24/09 19:07Z |
| **G2 Test Evidence** | Todo AC tem teste anotado; nenhum teste órfão | spec + arquivos de teste | zero `AC_SEM_TESTE`, zero `TESTE_ORFAO` | `audit` | Mecânico | junto com G1 |
| **G3 Mutation Check** | O teste falha quando a implementação é perturbada | AC + teste + implementação | tabela de mutações com o teste que cai (relatório §7) | Humano/Agente | Humano assistido | por task, antes de marcar `concluida` |
| **G4 Feature Verify** | Prova PASS de todos os ACs da feature | spec + `testCommand` | `.spec/verification/<f>.json` com `status: pass` | Adapter + ONP | Mecânico | por task e no fim |
| **G5 QA funcional** | O comportamento pedido acontece na aplicação real | app rodando + AC | evidência de que o cenário real funciona | Humano/Playwright | Humano | dopo de G4 |
| **G6 QA visual** | A mudança é perceptível como pretendida, e não regrediu | baseline de screenshots + medição | medição e screenshot; defeito corrigido + guarda | Humano | **Humano, não automatizável** | **depois do audit** |
| **G7 Global Regression** | A suíte completa continua verde | `combined-verify.cjs` sem `ONP_VERIFY_FEATURE` | exit 0 | Adapter | Mecânico | final |
| **G8 Audit** | Spec continua verdadeira | `.spec/` + código | `audit --ci` exit 0 | ONP | Mecânico | final |
| **G9 Diff/Scope Review** | Nada fora de escopo mudou | `git diff` | lista de alterações com justificativa | Humano | Humano | final |

### 5.1 A inversão de G6 em relação a G8 é intencional

`[FATO]` G6 aconteceu depois de G8 no experimento e encontrou um defeito real que
G8 não podia ver. Fixar G6 antes de G8 seria errado: exigir validação visual de
uma mudança ainda não implementada não tem objeto.

`[PROPOSTA]` G6 é **pós-gate, não pré-gate**, e é o único gate cujo resultado
pode reabrir a implementação. Os demais, uma vez verdes, só podem ser
re-verificados, não desfeitos.

### 5.2 Quais gates são obrigatórios para quais features

`[PROPOSTA]` Nem toda feature precisa de todos os gates. Regra de aplicação:

| Gate | Obrigatório quando |
|---|---|
| G1, G2, G4, G7, G8 | Sempre |
| G3 | Quando existe AC de comportamento observável |
| G5 | Quando o AC descreve um cenário que só o app real reproduz |
| G6 | Quando a mudança altera algo perceptível (cor, espaçamento, tipografia, layout, texto visível) |
| G9 | Sempre, e é o único que não pode ser pulado por "deixa pra depois" |

`[FATO]` A separação dessa regra já está implícita na spec da feature, que nomeia
a validação visual como etapa distinta sem exigir automatização
(`refinamento-interface/spec.md:217-219`). O que falta é o gatilho objetivo
("perceptível") e o lugar onde a decisão fica registrada.

---

## 6. Evidências

### 6.1 O que é artefato, e de que tipo

`[FATO]` O experimento produziu seis tipos distintos de artefato, com
propriedades diferentes. Confundi-los é a origem de várias lacunas da §19.

| Artefato | Tipo | Quem escreve | Verificado por | Pertence a uma task? |
|---|---|---|---|---|
| `.spec/verification/<f>.json` | **Gerado** | `onp-spec verify` | é o próprio veredito | **Não** — escrito explicitamente nas Notas da T-011: *"`.spec/verification/fundacao-ui.json` é gerado automaticamente pelo `onp-spec verify` (não é arquivo de implementação)"* (`.spec/features/fundacao-ui/tasks.md`, T-011) |
| `.spec/verification/sinais.json` | **Gerado, imutável para o agente** | `audit` / `verify` | — | Não |
| `.spec/licoes.json` / `LICOES.md` | **Gerado, mutação só por CLI** | `onp-spec licoes` | `LICAO_SEM_LASTRO` | Não |
| `plano-execucao.{md,html,json}`, `executar-tarefas.sh` | **Gerado, regenerável** | `onp-spec plano` | nenhum — ver L-02 | Não |
| `.spec/features/<f>/inventario.md` | **Escrito** | agente + humano | nenhum | **Sim** — T-006 em `fundacao-ui` declara `Arquivos:.spec/features/fundacao-ui/inventario.md` com a nota *"atividade de inventário já realizada; resultado documentado em inventario.md"* |
| `docs/auditoria-visual-*.md`, screenshots, `diagnostico.json` | **Escrito** (medição) | humano/agente | nenhum | Não |

`[FATO]` O `inventario.md` é o artefato mais rico e o menos verificado da
feature `refinamento-interface`: 131 linhas estruturadas em pares
"Observado / Problema / Decisões fechadas" para 9 topics, cada decisão referenciando
os AC que a justifica (`.spec/features/refinamento-interface/inventario.md`).
Nenhum gate o lê.

`[FATO]` `inventario.md` também é a **única** fonte da restriction de
T-024 ("Não alterar `EmptyState`, `Loading` ou `ErrorMessage`"), que aparece
também como "Fora de escopo" da spec (`:170`) e como Nota de T-024 — mas a
máquina nunca cruzou os três.

### 6.2 A prova como artefato de primeira classe

`[FATO]` A prova tem forma, dono e ciclo de vida próprios. Registro em
`verify.js:195-210`:

```text
{ feature, timestamp, gitRev, command, reporter, exitCode, testsParsed, results, principles }
```

`[FATO]` `results[AC]` carrega `status ∈ {pass, fail, skip}`, `testName` e
`method`. A redução é determinística e conservadora: **falha domina passe, passe
domina skip** (`verify.js:62-86`). Um AC provado só por testes pulados fica
`skip`, que nunca conta como prova (`verify.js:17-19`, `SKILL.md:105-106`).

`[FATO]` `method` pode ser `exitcode`, e nesse caso o audit emite `PROVA_FRACA`
(aviso) porque não há granularidade por teste (`audit.js:362-371`). A V0.1
template usa `reporter: "tap"`, o que evita essa prova fraca.

`[FATO]` **O `gitRev` da prova não é o commit do código.** O relatório §1
registra isso com honestidade explícita: a prova registra `1bfc9e1` (T-023)
porque o `verify` roda **antes** do commit, por desenho do fluxo; o código está
em `e5c31fd`; e isso não é divergência porque o `audit` compara *mtime* de
`src/`+`tests/`, não `gitRev` (`audit.js:375-392`).

`[INFERÊNCIA]` Isso significa que `gitRev` serve para auditoria de provenance
("em qual árvore a prova foi gerada"), **não** para vincular prova a código. A
víncula real é `timestamp` vs. mtime, e é essa que detecta `VERIFY_OBSOLETO`.

`[PROPOSTA]` Nenhuma feature pode ser considerada provada por um relatório, um
resumo ou uma tabela. Só por `.spec/verification/<f>.json`.

### 6.3 `VERIFY_OBSOLETO` — a prova é um artefato perecível

`[FATO]` `VERIFY_OBSOLETO` é aviso e **vira erro em `--ci`**
(`audit.js:16`, `CI_ESCALATES`). O gatilho é puramente temporal: `mtime` do
arquivo de código/teste mais recente é posterior ao `timestamp` da prova
(`audit.js:376-392`).

`[FATO]` No experimento o sinal apareceu em três features com contagem alta:
`relatorios-gerenciais` **12**, `legado-baseline` **11**, `fundacao-ui` **7** —
30 ocorrências. É o sinal mais frequente do projeto, e a única lição que o
motor promoveu (§15).

`[FATO]` O commit `62fc9c4` demonstra o efeito de aggregation: ao corrigir
`src/App.tsx` e `tests/ui/.../tipografia.spec.tsx`, o commit renoveu
**quatro** provas de uma vez — `fundacao-ui.json`, `legado-baseline.json`,
`refinamento-interface.json` e `relatorios-gerenciais.json` — todas no mesmo diff.

### 6.4 O que um relatório de execução é, e o que não é

`[FATO]` `docs/relatorio-execucao-sessao-onp.md` é, em si próprio, uma peça de
avaliação independente. O cabeçalho diz: *"Documento de handoff para avaliação
independente"* e avisa que cobre **duas** features apesar do nome
(`:1-13`). Ele registra comandos reproduzíveis (§10), medições (§11) e riscos
conhecidos (§12).

`[FATO]` Ele **também** registra o que não foi feito e por quê (§8): validação
visual executada; `db reset` nunca executado na sessão; `relatorios-gerenciais`
e `legado-baseline` deliberadamente mantidos abertos por decisão de produto;
`marginBottom: 24` literal mantido por nenhum AC pedir; `<nav>` sem `aria-label`
porque nenhum AC exige.

`[PROPOSTA]` Esse é o modelo do artefato de fechamento: o que foi feito, o que
**não** foi, com a razão, e o que continua aberto. Um relatório que só lista o
que foi feito é um relatório de marketing, não evidência.

---

## 7. Papel do agente

`[PROPOSTA]` Contrato de 9 cláusulas, sem menção a harness. Cada uma declara a
âncora de onde vem, para que não pareça opinião.

### 7.1 O que o agente pode decidir

| Pode | Não pode | Por quê |
|---|---|---|
| Mecanismo interno que satisfaz o AC | Alterar o AC, o teste ou o script de verificação para transformar vermelho em verde | `AGENTS.addendum.md:18`; e o caso real: a colisão de `aria-label` foi corrigida **no código de produção**, renomeando labels, e não afrouxando `tests/relatorio-comissao.spec.tsx` (relatório §6a) |
| Ordem interna e ritmo dentro de uma task | Marcar `[concluida]` sem prova PASS | `audit.js:292-311` |
| Nomenclatura interna de teste, desde que a tag `@spec:AC-xxx` esteja no **título** | Colocar a tag no corpo do teste | `verify.js:189-193` emite a dica: *"a tag vai no TÍTULO do teste"* |
| Escolher não paralelizar | Escolher paralelizar sem perguntar | `SKILL.md:169-188` |
| Declarar hipótese e seguir, registrando como suposição | Deixar suposição `aberta` em feature `implementada` | `ASM_ABERTA` é erro (`audit.js:214-223`) |

### 7.2 Quando pesquisar, quando declarar hipótese

`[FATO]` O critério já existe, escrito, e é stack-neutro:
`retro-karpathy/SKILL.md:32-50` manda pesquisar quando isso "realmente reduz uma
inc uncertainties relevante" — APIs desconhecidas, comportamento dependente de
versão, erros ambíguos, autenticação — e proíbe inventar APIs. E
`:56-76` exige a sequência `reproduzir → investigar → causa raiz → hipótese →
validar → corrigir` e a distinção explícita entre **fato observado**,
**inferência** e **hipótese**.

`[FATO]` Aplicação real, com desfecho diferente nos dois casos:

- **Hipótese declarada e registrada** — Q-015. O `401 JWT issued at future` não
 reproduziu em 11 execuções; 2 hipóteses foram refutadas por medição (token
 ausente, desvio de relógio = 0 s); o que faltava eram headers que o script
 não coletava. A spec registra: *"A resposta aqui é 'não sabe-se', não
 'resolvido'"* (`recuperacao-carga/spec.md:157`).
- **Causa raiz identificada e ação tomada** — o mesmo `401` observava um problema
 **com causa raiz**: o estado de erro era terminal porque toda página carregava
 uma única vez, no `useEffect` de montagem, sem forma de pedir nova tentativa.
 A feature `recuperacao-carga` resolveu a **consequência** sem chutar a causa
 (`recuperacao-carga/spec.md:23-35`).

`[PROPOSTA]` Regra herdada do segundo caso, e que vale para qualquer stack: **se
a causa não está determinada, não invente a correção — especifique o que tem
causa raiz e registre o resto como pergunta em aberto.** Isso é o que evitou um
chute no `401`.

### 7.3 Como respeitar ownership

`[FATO]` O comportamento observado no experimento: quando a execução encontrou
conflito de escopo, a **decisão foi registrada e o tasks.md foi corrigido**, não
o código. `62fc9c4` altera apenas
`.spec/features/refinamento-interface/tasks.md` (+1/−1) para registrar a decisão
de dono do produto sobre o `<h1>` do shell, e o texto novo explica o porquê
(incluindo a medição 32px contra 24px e o nome da guarda que impede regressão).

`[PROPOSTA]` Duas regras:

1. **Alteração de escopo é mudança de tasks.md, não improviso no código.** A
 task que Originally não tocava um arquivo pode tocá-lo, desde que o
 `Arquivos:` seja atualizado e arazão escrita.
2. **Arquivo declarado e não alterado é resultado legítimo.** O inverso — arquivo
 alterado e não declarado — é o que escapa do gate.

### 7.4 Como reagir a falhas

`[FATO]` O limite de iterações existe e é explícito: *"Falhou? Corrija e
re-audite — no máximo **3 iterações**; persistindo, pare e escale ao usuário com
os problemas ranqueados"* (`SKILL.md:251-252`), e *"Se o audit falhar 3 vezes
seguidas no mesmo problema, PARE"* (`SKILL.md:117-119`).

`[FATO]` Dois defeitos reais foram corrigidos **sem** enfraquecer nada, e ambos
ficaram registrados em commit, não em lição (§6 do relatório):

- **Colisão de `aria-label`** — o `aria-label` novo do T-022 passou a colidir com
 `screen.getByLabelText(/profissional/i)` de um teste existente. Corrigido no
 código.
- **Fragilidade de timeout do Vitest** — o primeiro teste de cada arquivo
 estourava 5 s sob carga paralela, *"independentemente desta feature (verificado
 removendo o arquivo novo: a falha continuava)"*. Alinhado
 `testTimeout: 15000`, **sem nenhuma asserção mudar** (commit `dc66add`).

`[FATO]` O segundo caso tem uma propriedade que vale generalizar: a suspeita de
culpa própria foi **testada por remoção** antes de aceitar a hipótese. É
disciplina de diagnóstico, não de teste.

`[PROPOSTA]` Ao reagir, a ordem é: (1) reproduzir; (2) remover a própria mudança para
verificar se a falha é dela; (3) corrigir na origem mais próxima; (4) se a
correção exigir afrouxar um AC, um teste ou um script, **parar e escalar**.

### 7.5 Quando parar

`[PROPOSTA]` Cinco condições, todas com lastro:

1. O gate exige decisão que é do dono do produto (o relatório §4 lista 4 decisões
 de produto tomadas explicitamente, não inferidas).
2. O mesmo problema falha 3 vezes seguidas (`SKILL.md:117-119`).
3. A causa raiz não está determinada e a correção seria especulativa (§7.2).
4. Uma suposição needed confirmação e o dono não está disponível.
5. A correção exigiria violar um princípio da constituição
 (`SKILL.md:114-116`: *" Nunca conserte o princípio para 'fazer passar' — conserte
 o código"*).

### 7.6 O que o agente apresenta ao final

`[FATO]` O padrão já é do motor: *"Cole a saída final na conversa e traduza em uma
frase o que ela significa"* (`SKILL.md:248-250`), e a regra de ouro exige colar a
saída do `audit --ci` (`SKILL.md:325-329`). A degradação graciosa quando falta
runtime também é prescrita: rotular como `PROVA FRACA (auditoria manual)` e
**nunca** apresentar auditoria manual como o gate mecânico (`SKILL.md:94-98`).

`[PROPOSTA]` Contrato de saída, mínimo:

1. Estado de cada gate, com a saída colada.
2. O que foi alterado, arquivo a arquivo.
3. O que **não** foi alterado e por quê.
4. O que ficou aberto, e quem decide.
5. Nível de confiança por afirmação: `verificado` / `bem fundamentado` /
 `não verificado` (`retro-karpathy/SKILL.md:124-130`).

O item 5 é o que impede "o agente disse que terminou" de virar evidência: ele é
uma **qualificação** da evidência, nunca a evidência.

---

## 8. Papel do ONP

`[FATO]` O motor garante mecanicamente seis coisas, todas por exit code:

| Garantia | Código | Severidade |
|---|---|---|
| Todo AC tem teste anotado | `AC_SEM_TESTE` | erro |
| Todo AC tem prova PASS (skip não conta) | `AC_SEM_PROVA` | aviso → **erro em `--ci`** |
| Tarefa `[concluida]` tem prova | `TASK_CONCLUIDA_SEM_PROVA` | erro |
| IDs são únicos no projeto | `ID_DUPLICADO` | erro |
| Prova não está desatualizada | `VERIFY_OBSOLETO` | aviso → **erro em `--ci`** |
| Lição tem lastro em sinal real | `LICAO_SEM_LASTRO` | recusa |

`[FATO]` `CI_ESCALATES` escala exatamente cinco códigos em `--ci`:
`AC_SEM_PROVA`, `VERIFY_OBSOLETO`, `Q_ABERTA`, `AC_SEM_TASK`, `ARQUIVO_ORFAO`
(`audit.js:16`).

### 8.1 O que o motor não tem noção de

`[FATO]` Do catálogo de ~25 códigos (`SKILL.md:269-300`), nenhum cobre:

- escopo de feature na execução de testes (§1.4);
- paralelismo real vs. overlap de arquivo (§3.2);
- semântica compartilhada entre arquivos disjuntos;
- coerência de status de feature e de task (§1.5);
- alteração fora de escopo no diff;
- percepção visual;
- obsolescência de artefato gerado (`plano-execucao.md` está stale hoje — L-02);
- validade de `inventario.md`, `Notas:` de task e seções livres de spec.

`[PROPOSTA]` Consequência para o kit: o Factory Kit **não deve** tentar
reimplementar nenhuma das seis garantias. Onde o motor já prova, o kit documenta
e encapsula; onde o motor não prova, o kit propõe gate — e sabe que esse gate é
humano.

---

## 9. Papel do Adapter

`[FATO]` A V0.1 tem três scripts, com responsabilidades que não se sobrepõem:

| Script | Responsabilidade | Detalhe |
|---|---|---|
| `adapters/node-vitest-supabase/feature-verify.cjs` | Detectar se a feature tem pgTAP, preparar o banco, delegar ao motor | Lê ACs por regex `/AC-\d{3,}/` no `spec.md` (`:29-34`); detecta pgTAP procurando `@spec:AC-xxx` em `supabase/tests/0*.sql` (`:36-52`); roda `npx supabase db reset` se houver (`:54-65`); chama `<engine> verify <feature>` com `ONP_VERIFY_FEATURE` (`:80-85`) |
| `adapters/node-vitest-supabase/pgtap-verify.cjs` | Executar pgTAP e emitir TAP por teste | Filtra por `ONP_VERIFY_FEATURE` (`:38-50`); **`if (!files.length) process.exit(0)`** (`:49`); injeta `CREATE EXTENSION IF NOT EXISTS pgtap` e roda `docker exec... psql -t -A -v ON_ERROR_STOP=1` (`:69-88`) |
| `adapters/node-vitest-supabase/combined-verify.cjs` | Unir pgTAP + Vitest num só `testCommand` | `FEATURE = process.env.ONP_VERIFY_FEATURE` (`:7`); sem feature ⇒ suíte completa (`:96-102`); com feature ⇒ filtra arquivos por tag e passa `--testNamePattern` (`:27-55`, `:84`) |

### 9.1 Propriedades herdadas do experimento

`[FATO]` Decisões da V0.1 que veio **diretamente** do projeto de referência, e que
a documentação do kit assume sem explicar o porquê:

- **Feature Verify ≠ Global Regression** — `README.md:35-43`;
 `onp-factory.config.json:29` (`policy.featureVerifyIsNotGlobalRegression`).
- **Banco descartável para Feature Verify com pgTAP** —
 `design.md:32`; `onp-factory.config.json:18-19`
 (`resetCommand` + `allowProductionReset: false`).
- **Nunca resetar produção** — `README.md:45`;
 `AGENTS.addendum.md:17`.
- **pgTAP por `docker exec` + `psql`, não `supabase test db`** — a razão está no
 cabeçalho do script do projeto de referência: *"`npx supabase test db` hides
 per-test titles behind file-level dots, so this adapter bypasses it and drives
 psql straight into supabase_db_<project>"*
 (`scripts/onp-pgtap-verify.cjs:1-7`).
- **Testes pgTAP são `begin; … rollback;` com fixtures próprios** — 14 arquivos
 em `supabase/tests/`, todos abrindo transação e inserindo dados
 (ex.: `supabase/tests/001_rls_isolamento_salao.sql:10-28`). Nenhum duplica
 migration.

### 9.2 Onde a V0.1 já diverge do projeto de referência (melhoria)

`[FATO]` `project_id` do Supabase: o projeto de referência tem fallback
hardcoded `process.env.SUPABASE_PROJECT_ID || 'salao-beleza-sistema'`
(`scripts/onp-pgtap-verify.cjs:24`); a V0.1 lê de `onp-factory.config.json` e
depois de `supabase/config.toml` (`adapters/…/pgtap-verify.cjs:15-22`). Isso é
o que torna o adapter portátil.

`[FATO]` `.onp-factory/**` foi acrescentado a `ignoreGlobs` no template
(`templates/onpspec.config.json:22`), evitando que a própria maquinaria do kit
seja vista como código órfão.

### 9.3 Fragilidades do adapter que o experimento não exercitou

`[FATO]` Exit 0 do adapter não é prova. Se a feature não tiver nenhum arquivo de
teste com as tags, `combined-verify.cjs` retorna sem rodar Vitest (`:83 if
(!files.length) return;`) e `pgtap-verify.cjs` sai com 0 (`:49`). O gate real
fecha depois, em `AC_SEM_PROVA`.

`[FATO]` O `vitest.config.ts` do projeto de referência restringe execução a
`include: ["tests/**/*.spec.*"]`, enquanto `findVitestFilesForAcs` varre
`['tests','test','__tests__','src']` (`adapters/…/combined-verify.cjs:29`).
`[INFERÊNCIA]` Um teste com `@spec:` colocado em `src/` seria **encontrado** pelo
scanner e passado ao Vitest, que não o executaria por causa do `include`. O
resultado esperado é falha por "no test files found", não PASS silencioso — mas
isso **não foi verificado** e fica registrado como tal.

`[PROPOSTA]` O adapter deve, ao terminar, reportar quantos testes foram lidos e
quais arquivos — o `verify.js:200` já grava `testsParsed`, e a V0.1 não expõe
isso. Um exit 0 com `testsParsed: 0` precisa ser distinguível de um exit 0 com
81 testes.

---

## 10. Definição de Done

`[PROPOSTA]` Três níveis, com mechanicalidade declarada. Nenhum deles aceita
declaração verbal.

### 10.1 Task Done

```text
Task Done ⟺
 (a) todo arquivo em `Arquivos:` existe → ARQUIVO_INEXISTENTE (erro se concluída)
 (b) todo AC em `Refs:` tem status: pass
 na verificação da feature DONA do AC → TASK_CONCLUIDA_SEM_PROVA
 (c) a feature dona não está com VERIFY_OBSOLETO → VERIFY_OBSOLETO (erro em --ci)
 (d) existe um commit citando T-xxx
 (e) status = [concluida] no tasks.md
```

`[FATO]` (a), (b) e (c) são mecânicos. (d) e (e) **não são**, e (e) é justamente
o estado que divergiu no experimento (T-019/T-020/T-021 e T-012).

`[FATO]` O `onp-spec tarefa <feature> <T-xxx> <status>` existe como atalho
(`tasks.md:19`), o que reduz a chance de status errado, mas o atalho é
documentado como se fosse manual e não é validado.

### 10.2 Feature Done

```text
Feature Done ⟺
 (a) todas as tasks da feature em Task Done
 (b) audit --ci exit 0 → ok = erros.length === 0
 (c) zero ASM_ABERTA → erro se status ∈ {implementada, auditada}
 (d) zero Q_ABERTA escalado em --ci → CI_ESCALATES
 (e) QA visual executada, se houver mudança perceptível (§12)
 (f) achados abertos da QA visual: cada um tem um dos três desfechos
 corrigido + guarda | convertido em AC | registrado como questao aberta
 (g) status da spec coerente com o estado real
```

`[FATO]` (c) e (d) são mecânicos. (e) e (f) **não têm gate** — existem apenas
como texto da spec e como prática do relatório. (g) é o item que o audit não
verifica e que o experimento mostrou quebrado duas vezes (feature com 11/11 e
status `rascunho`; três tasks entregues e `[pendente]`).

`[FATO]` O padrão de (f) foi executado com sucesso na feature `recuperacao-carga`:
o defeito do `h1` virou **guarda permanente** em
`tests/ui/refinamento-interface-tipografia.spec.tsx` (relatório §11), verificada
por mutação — *"com o `<h1>` tokenizado de novo, o guarda falha com `expected
'1.5rem' to be ''`"*. E quatro achados abertos ficaram registrados com impacto
declarado, incluindo um que **mudou o status de um risco** (relatório §12.1:
o impacto do `401` foi resolvido por `recuperacao-carga`).

### 10.3 Project Gate

`[FATO]` O `docs/adoption.md:56-65` do kit já define o fechamento de projeto como
a combinação de: ACs da feature com prova PASS; `audit --ci` exit 0; regressão
global PASS; build PASS; lint PASS; revisão humana de diff e escopo.

`[PROPOSTA]` Acrescentar dois itens, ambos derivados de lacunas observadas:

- **regressão global PASS depois** da última alteração (a L-001 mostra que
 renovar uma prova invalida as outras; a ordem importa);
- **nenhuma feature com prova integral em status não fechado** sem decisão de
 produto registrada — o caso `relatorios-gerenciais` (11/11, `rascunho`) e
 `legado-baseline` (1/1, `em-implementacao`) são exatamente o que isso
 endereça.

### 10.4 O que **não** é Done, em nenhuma hipótese

`[PROPOSTA]` Registrado explicitamente porque são as confundir mais comuns:

- "os testes passam" sem `verify` executado;
- "`audit` saiu 0" sem a saída colada;
- "a tarefa está feita" sem status atualizado;
- "a feature está pronta" sem QA visual quando há mudança perceptível;
- "o agenteimplementou" — irrespective de quality.

---

## 11. QA funcional

`[FATO]` O que o projeto provou mecanicamente, e como:

| Tipo | Ferramenta | O que prova | Onde está |
|---|---|---|---|
| Componente | Vitest + Testing Library + jsdom | estrutura, atributos, props, semântica | 11 arquivos em `tests/` (10 em `tests/ui/`, 1 em `tests/processo/`) |
| DOM / integração | idem, com app real | comportamento de página, não de componente | `refinamento-interface-acessibilidade.spec.tsx` tem 2 testes: um no componente isolado, **um nas páginas reais** |
| Banco | pgTAP, 14 arquivos | regra de negócio no Postgres | `supabase/tests/001..013` |
| Processo | Vitest lendo artefato | o inventário de baseline continua válido | `tests/processo/legado-baseline.spec.ts:28-34` |

`[FATO]` O caso mais informativo é AC-040. A spec explica por que o teste tem duas
metades: *"os três em produção, pela aplicação real — Dashboard com CMV em
carregamento e consulta de estoque falhando, e a aba Clientes com lista vazia.
Este é o teste que sustenta o AC-040, cuja exigência é que as mudanças visuais
não removam a semântica — algo só provável nas páginas reais, nunca no
componente isolado"* (relatório §2, T-024).

`[FATO]` `AC-043` provou ser um AC de comportamento, não deestrutura: a
primeira versão da implementação **esquecia de limpar o erro** no início da
carga; o AC reprovou porque *"sem `setErro(null)`, o alerta persistiria mesmo
após uma nova tentativa bem-sucedida, tornando a ação inútil"* (relatório §13).
O próprio teste encontrou o defeito.

`[FATO]` `AC-042` especifica prova por **efeito observável**, não por presença de
símbolo: *"presença do controle na tela e aumento do número de chamadas à API de
carga quando ele é acionado"*, e a estratégia de testes exige que *"nenhuma
mudança nas páginas pode alterar a quantidade de chamadas de API além da
esperada: o teste de `AC-042` conta as chamadas"*
(`recuperacao-carga/spec.md:54-55`, `:126-127`).

`[PROPOSTA]` Critério de aplicação de QA funcional: **o AC deve ser asserido por
efeito observável, não por presença de construção**. Um teste que assere
`fontFamily: FONT_HEADING` prova que o token foi referenciado; não prova
hierarquia visual — que é exatamente o que §12 cobre.

`[FATO]` O contraexemplo está no mesmo arquivo de spec, e é útil porque é
**deliberado**: AC-037 exige `FONT_HEADING` e `FONT_SIZE_HEADING` e diz
explicitamente *"Não é aceitável usar apenas `fontSize > 1rem`, o tamanho padrão
do navegador (`h1`/`h2`) ou o valor `"1.5rem"` diretamente sem utilizar
`FONT_SIZE_HEADING`"*. Ou seja: a spec **reconheceu** que o teste mecânico
poderia ser satisfeito por construção, e Nonetheless escreveu o AC por
construção. A proteção contra isso foi a QA visual e a decisão de dono do
produto, não o teste.

---

## 12. QA visual

`[FATO]` É o gate mais resistente a automação do experimento, e o único que
encontrou um defeito real com o audit limpo.

### 12.1 O que a execução fez

`[FATO]` Playwright dirigindo a app local em Chromium headless (1440×960), login
com usuário de teste, captura das 11 telas e **medição dos estilos computados**.
Imagens em `docs/screenshots/validacao-visual/` (12 PNGs) mais
`diagnostico.json` (relatório §11, commit `62fc9c4`).

`[FATO]` O resultado medido, não opinionado:

| Item | Medido |
|---|---|
| Aba ativa | `border-bottom: 2px solid rgb(220,20,60)` + `font-weight: 700` |
| Aba inativa | `2px solid transparent`, `font-weight: 400` → mesma espessura, sem pulo de layout |
| Botão primário | fundo `rgb(220,20,60)`, texto branco, negrito |
| Card da lista | `1px solid rgb(224,224,224)` |
| Grupo do formulário | `margin-bottom: 24px` |
| Estado vazio | texto `rgb(220,20,60)` dentro do card |
| Título do sistema | `32px` |
| Título da página | `24px` (token) |

`[FATO]` O caminho inicial **não** era esse: *"as ferramentas de navegador do
harness só funcionam com o app desktop conectado (`[browser.disconnected]`)". O
Playwright já estava no projeto (`node_modules/playwright`, sem entrada em
`package.json`) com Chromium em cache; a versão instalada pede `chromium-1243` e
o cache tem `chromium-1217` — o `executablePath` foi apontado para o binário
existente (relatório §11).

`[FATO]` `playwright` **não está em `package.json`** — confirmado: `package.json`
lista `@supabase/supabase-js`, `react`, `react-dom` em `dependencies` e 14
entradas em `devDependencies`, nenhuma delas Playwright. A ferramenta que sustenta
o gate visual é uma dependência não declarada.

### 12.2 Os limites honestos do gate

`[FATO]` *"Limite conhecido: o jsdom não resolve o tamanho default do `h1` (2em),
então o guarda verifica o contrato ('shell sem tamanho inline forçado'), não a
comparação em pixels. A comparação em pixels foi medida no navegador e está na
tabela acima."* (relatório §11).

`[FATO]` *"harmonia entre variantes" e "separação perceptível" são julgadas por
olho humano e continuam sendo o judge's final* (relatório §12.1).

`[FATO]` A spec assume isso explicitamente: *"A SPEC não exige que a validação
visual humana esteja automatizada; ela complementa a prova mecânica"*
(`refinamento-interface/spec.md:219`).

`[PROPOSTA]` Contrato do gate visual:

1. **Gatilho:** a alteração mexe em cor, espaçamento, tipografia, layout, texto
 visível ou ícone. Não há como mecanizar esse gatilho; ele é declarado.
2. **Baseline obrigatório:** comparação com capturas anteriores. O experimento
 tinha baseline em `docs/screenshots/visual-audit/` (auditoria anterior) e
 comparou com `docs/screenshots/validacao-visual/` (relatório §10).
3. **Medição, não impressão:** o que o gate produziu foram valores computados
 (`2px solid transparent`, `32px` contra `24px`), não adjetivos.
4. **Desfecho obrigatório por achado:** corrigido + guarda | convertido em AC |
 registrado como questão aberta. Nenhum achado fica só no relatório.
5. **Positividade dos achados:** de 11 achados abertos, 1 foi resolvido por
 feature, 3 são cosméticos/pré-existentes e 1 é um landmark vazio correto para
 o AC. O gate não bloqueia a feature por isso (relatório §11.1, "nenhum
 bloqueia").

`[PROPOSTA]` O item 4 é o que impede "não transformar toda observação em novo
AC". O experimento aplicou isso nos dois sentidos: o defeito do `<h1>` **não** virou
AC novo (virou guarda sem tag `@spec:`, porque *"não é escopo de nenhum AC"*), e o
problema terminal de carga **virou feature** porque tinha causa raiz. O critério
que separou os dois casos foi **causa raiz identificada**, não gravidade.

---

## 13. Regressão

`[FATO]` Dois comandos, e a distinção é de adapter:

| Comando | O que faz | Evidência |
|---|---|---|
| `node scripts/onp-feature-verify.cjs <feature>` | Detecta pgTAP da feature → `db reset` se houver → `<engine> verify <feature>` com `ONP_VERIFY_FEATURE` | `scripts/onp-feature-verify.cjs:24-67` |
| `node scripts/onp-combined-verify.cjs` | Sem `ONP_VERIFY_FEATURE`: pgTAP completo + **todas** as suítes Vitest | `scripts/onp-combined-verify.cjs:57-78` |

`[FATO]` O `testCommand` do projeto é o **segundo** (`onpspec.config.json:2`), o
que significa que **toda** feature verify executa a suíte como parte do
`testCommand` — mas filtrada por `ONP_VERIFY_FEATURE`, que o wrapper de feature
injeta via ambiente (`onp-feature-verify.cjs:48`).

`[FATO]` E é por isso que `AGENTS.md:30-36` proíbe chamar o motor diretamente:
`runVerify` não injeta a variável (`verify.js:123-133`), então
`onp-spec verify <feature>` roda o `testCommand` em modo global.

`[FATO]` O relatório §8 registra que **`db reset` nunca foi executado na
feature session**: *"As renovações de prova usaram `onp-spec verify` com
`ONP_VERIFY_FEATURE`, sem o wrapper `onp-feature-verify.cjs` — logo sem reset.
Os 14 arquivos pgTAP são `begin;... rollback;` com fixtures idempotentes,
então não dependem de banco resetado."*

`[FATO]` Commit `1b4d57f` é esse bypassing registrado em código:
`chore(verificacao): renovar prova de relatorios-gerenciais sem db reset`.

`[PROPOSTA]` O hecho é que existem **três** modos de verify, não dois:

1. **Feature Verify completo** — wrapper + `db reset` se houver pgTAP;
2. **Renovação de prova sem reset** — útil eRotado, mas viola a letra do
 `AGENTS.md`;
3. **Regressão global** — `combined-verify.cjs` sem variável de ambiente.

O modo 2 é uma lacuna de interface do kit, não um erro do executor. Registrado
como L-01 (§19) e como implicação em §20.

### 13.1 O custo do `db reset` e como ele foi gerenciado

`[FATO]` O `AGENTS.md:46` do projeto de referência é explícito: *"O banco local
usado nesse fluxo é descartável; não há preservação de dados manuais de
desenvolvimento nesse processo. Se precisar manter dados locais, faça backup
antes de rodar o verify."* E o próprio script avisa
(`scripts/onp-pgtap-verify.cjs:9-11`).

`[FATO]` O custo apareceu em dois pontos: o checklist de validação visual avisa que
*"o banco pode estar sem dados de desenvolvimento (houve `db reset` em momento
anterior do histórico). Tela vazia é o `EmptyState` novo funcionando — nesse
caso, criar dados de exemplo para ver a tela cheia"* (relatório §10), e existe um
`scripts/bootstrap-local-test-user.cjs` citado no mesmo checklist.

`[PROPOSTA]` A relação entre `db reset` e QA visual é uma dependência real e
não documentada como gate: **rodar Feature Verify com pgTAP invalida o ambiente
de QA visual**. O processo precisa de um gate que restaure os dados de
demonstração, ou de um snapshot. O experimento resolveu com um script ad hoc;
isso não é portável.

---

## 14. Audit

`[FATO]` `audit` é o veredito: `ok = errors.length === 0`, `exitCode` 0 ou 1
(`audit.js:582-584`). A saída é colável e traduzível — e colar é obrigatório
(`SKILL.md:248-250`).

### 14.1 As cinco famílias de achados

`[FATO]` Do catálogo de `SKILL.md:269-300` e do código de `audit.js`:

| Família | Códigos | Gate que fecha |
|---|---|---|
| **Rastreabilidade** | `AC_SEM_TESTE`, `TESTE_ORFAO`, `REF_QUEBRADA`, `AC_SEM_TASK`, `ID_DUPLICADO`, `US_SEM_AC`, `AC_INCOMPLETO`, `AC_FORA_DE_US`, `ID_CURTO` | especificação ↔ teste ↔ task |
| **Prova** | `AC_SEM_PROVA`, `TASK_CONCLUIDA_SEM_PROVA`, `VERIFY_OBSOLETO`, `PROVA_FRACA` | exit code do runner |
| **Tarefas e artefatos** | `ARQUIVO_INEXISTENTE`, `ARQUIVO_ORFAO`, `TASK_STATUS_INVALIDO`, `TASK_SEM_STATUS`, `REF_MALFORMADA` | `tasks.md` ↔ árvore |
| **Constituição** | `PRINCIPIO_VIOLADO`, `PRINCIPIO_SEM_VERIFICACAO`, `VERIFICACAO_MALFORMADA`, `GLOB_SEM_ARQUIVOS`, `NIVEL_INVALIDO` | `.spec/constituicao.md` |
| **Estrutura** | `SECAO_AUSENTE`, `SPEC_SEM_US`, `SPEC_AUSENTE`, `STATUS_INVALIDO`, `FEATURE_DIVERGENTE`, `ASM_ABERTA`, `ASM_STATUS_INVALIDO`, `Q_ABERTA`, `Q_STATUS_INVALIDO`, `CONSTITUICAO_AUSENTE`, `PROJETO_INVALIDO` | forma da spec |

`[FATO]` A constituição do projeto de referência tem 2 princípios, e é o exemplo
mais curto possível de princípio verificável (`constituicao.md`):

- `P-001 [DEVE] Todo requisito tem prova executável`, verificado por
 `verificação(gate)` — *"satisfeita pelo próprio audit"*, dispensando teste
 extra;
- `P-002 [RECOMENDADO] Segredos nunca em código`, verificado por
 `verificação(proibido)`: regex em glob.

`[FATO]` A regra é explícita no próprio arquivo: *"Todo [DEVE] precisa de
verificação executável — senão o audit acusa 'princípio sem verificação'
(`PRINCIPIO_SEM_VERIFICACAO`)"*, e `GLOB_SEM_ARQUIVOS` existe para pegar glob que
não casa nada, isto é, **verificação inerte** (`audit.js:490-496`).

`[INFERÊNCIA]` `P-002` é `[RECOMENDADO]`, não `[DEVE]`, e por isso sua violação
é aviso, não erro. Isso é uma escolha de projeto, não um defeito — mas significa
que **um princípio `[RECOMENDADO]` não bloqueia o gate**. Isso não foi discutido
em lugar nenhum do experimento.

### 14.2 O que o audit não cobre (e foi coberto por gates humanos)

`[FATO]` Cruzando `audit.js` com o que o experimento corrigiu:

| Situação real | Quem pegou |
|---|---|
| `App.tsx` fora da T-022 para não conflitar com a faixa paralela | Decisão de dono do produto (relatório §4.1) |
| `LoginPage` com 2 grupos em vez de 1 | Decisão de dono do produto (relatório §4.2) |
| Título do shell e da página com 24px contra 24px | **QA visual** (§12) |
| Erro que persistia após nova tentativa bem-sucedida | **O próprio teste** de AC-043 (§11) |
| Teste de AC-038 que aceitaria `gap` no futuro | Teste-guarda sem tag `@spec:` (relatório §7) |
| Colisão de `aria-label` com query existente | Análise de causa, corrigida no código (relatório §6a) |
| Timeout do Vitest independente da feature | Verificação por remoção (relatório §6b) |

`[PROPOSTA]` A lista é a justificativa para o capítulo de gates: o audit é
completo em rastreabilidade e cego em escopo, arquitetura e percepção.

---

## 15. Manutenção

### 15.1 O ciclo de lição

`[FATO]` O motor é dono de toda a contabilidade; o agente entra só com o
julgamento (`references/licoes.md:5-11`). O gate que torna isso seletivo:
`licoes add` **só aceita lição que cita um sinal real** registrado em
`sinais.json`; sem lastro, `LICAO_SEM_LASTRO` e a lição não existe
(`licoes.md:12-17`).

`[FATO]` Ciclo de vida: `candidata` (1 feature — registrada, não confiada) →
`confirmada` (2+ features distintas — vira guia) → `quarentena` (aplicada e a
falha recorreu). Máximo 3 lições por feature, máximo 280 caracteres por texto,
uma lição por sinal, dedup exato após normalização (`licoes.md:27-30`,
`:68-78`).

`[FATO]` No experimento: **1 lição em 5 features**, `L-001`, sobre
`VERIFY_OBSOLETO`, recorrência 2, features `relatorios-gerenciais` e
`fundacao-ui`, penalidades 0 (`.spec/licoes.json`; `.spec/LICOES.md`). Candidatas:
nenhuma. Quarentena: nenhuma.

`[FATO]` E o caso negativo, que é tão importante quanto o positivo: *"Nenhum dos
dois [defeitos reais corrigidos] virou lição. O motor recusa lição sem sinal
registrado (`LICAO_SEM_LASTRO`) e nenhum dos dois problemas gera sinal de audit.
Eles estão registrados nos corpos dos commits, que é onde resolvem."* (relatório §6)

`[PROPOSTA]` Essa assimetria é o comportamento correto e deve ser explícita no
processo: **nem toda correção vira regra.** Correção sem sinal mecânico fica no
commit. Regra sem sinal é opinião, e opinião escrita como regra é a principal forma de um
processo inflar.

`[FATO]` Onde a lição entra: `onp-spec licoes list` é **obrigatório no
Especificar** — *"Obrigatório e barato (teto fixo de itens, não cresce com o
repo)"* (`SKILL.md:138-140`; `licoes.md:31-42`).

### 15.2 O ciclo de retorno da validação visual

`[FATO]` O ciclo fechado, completo, com um desfecho melhor que o esperado:

1. `refinamento-interface` fecha com `audit --ci` = 0 e 11/11 PASS;
2. QA visual encontra o defeito do `<h1>` e **um segundo problema** com causa raiz
 identificada (falha de carga terminal, observada em 2 de execuções, sem
 reproduzir em 11 de controle — relatório §11.1);
3. O primeiro vira guarda permanente em teste existente, **sem tag `@spec:`**
 (porque não é escopo de nenhum AC) — commit `62fc9c4`;
4. O segundo **vira feature nova**, escrita depois do documento existir
 (relatório §6-10 avisa: *"`recuperacao-carga` — T-025, T-026, criada depois
 deste documento existir, a partir do achado da validação visual"*);
5. `recuperacao-carga` fecha com 4/4 e a nota explícita de escopo: *"Escopo
 deliberadamente não incluído: refetch automático ao recuperar o foco da aba,
 retry com backoff e a correção do `401` em si. As três foram decididas fora, e
 a última por não ser reproduzível"* (relatório §13).

`[FATO]` E a feature nascida disso **corrigiu o status de um risco que o
relatório declarava** e alterou um componente que lá era declarado intocado
(cabeçalho do relatório, `:11-13`): `ErrorMessage` ganhou prop `onRetry`, e o
relatório tem um *"Atualização posterior"* no ponto exato (§2, T-024).

`[PROPOSTA]` Esse ciclo — **gate humano encontra → causa raiz separa o que é
feature do que é pergunta → o que não tem causa vira pergunta aberta, não
chute** — é o motor de manutenção do processo. Ele é mais geral que qualquer
regra de stack e pertence ao Processo.

### 15.3 Manutenção do próprio kit

`[FATO]` A regra de adotar já está escrita: *"A V0.1 só deve ser considerada
portátil depois de ser aplicada a um segundo projeto real. As adaptações
encontradas nele devem alimentar a próxima versão do kit, não virar exceções
espalhadas no primeiro projeto."* (`adoption.md:67-69`; `roadmap.md:11-13`)

`[PROPOSTA]` Um critério de.bool para decidir se algo vira regra do kit ou
adaptação local: **a regra apareceu em 2 features independentes, ou em 2 projetos
independentes?** Uma ocorrência é caso local. Duas features no mesmo projeto é
melhor que uma, mas não é portabilidade.

---

## 16. Regras universais

`[PROPOSTA]` Treze regras. Cada uma com evidência, problema que resolve, se deve
virar regra, e **onde deve morar**.

Legenda de destino:

| Sigla | Onde |
|---|---|
| `AA` | `templates/AGENTS.addendum.md` do kit — regra que o agente precisa ler em toda sessão |
| `PROC` | Doc de processo do kit — regra que não precisa estar no contexto do agente |
| `CFG` | `onp-factory.config.json` (seção `policy`) — regra que a máquina deve implicar |
| `ADP` | `adapters/<perfil>` — regra que depende de como o projeto executa |
| `UP` | Upstream do motor ONP — regra que só o motor pode impor |
| `CONST` | `.spec/constituicao.md` do projeto — restrição específica do projeto |

---

**R-01 — Códigos de rastreio são globais, únicos e estáveis.**

- *Evidência:* `ID_DUPLICADO` com `severity: erro` para `AC-001..011` e
 `US-001..006` entre `relatorios-gerenciais` e `refinamento-interface`
 (`sinais.json`); colisão corrigida por renumeração manual em `218b468`; regra
 declarada em `references/escrevendo-specs.md:64-70` e em `tasks.md:7` e
 `spec.md:13` ("nunca reutilize um número").
- *Problema resolve:* refs cruzadas entre features ficam ambíguas; `TASK_CONCLUIDA_SEM_PROVA`
 busca a prova na feature errada.
- *Vira regra?* **Sim — já é** (`UP`).
- *Onde morar:* já mora no motor e nos templates de spec. **Falta** a regra de
 **estabilidade após o primeiro teste** — ver §18 (E-02).

**R-02 — Feature Verify e Regressão Global são gates distintos.**

- *Evidência:* `design.md:31`; `README.md:35-43`;
 `onp-factory.config.json:29`; e a prova de que o escopo é do adapter —
 `combined-verify.cjs:6,57-78` só filtra se `ONP_VERIFY_FEATURE` existir, e
 `verify.js:123-133` não a injeta.
- *Problema resolve:* "Feature Verify" executado em modo global dá falsa sensação
 de escopo; e `verify` sem filtro podeRenew prova de AC de outra feature.
- *Vira regra?* **Sim.**
- *Onde morar:* `ADP` (implementação) + `AA` (comando) + `CFG` (política). **Falta**
 a proibição explícita no addendum — ver L-04.

**R-03 — Ownership de arquivo não é obrigação de alteração.**

- *Evidência:* `refinamento-interface/tasks.md:24-51` — 6 tasks, 11 arquivos de
 página, overlap massivo; o commit `62fc9c4` altera `src/App.tsx` e um teste já
 listados, e o ajuste de escopo foi registrado em `tasks.md`, não improvisado.
- *Problema resolve:* apressure para "marcar tudo o que foi declarado" produz
 alterações artificiais; e `notas` de task viram obrigação implícita.
- *Vira regra?* **Sim** — é o que torna `Arquivos:` utilizável como fronteira de
 paralelismo sem virar obrigação.
- *Onde morar:* `PROC` (§4.3), com uma linha em `AA`.

**R-04 — Dependência semântica e overlap de arquivo são coisas diferentes.**

- *Evidência:* T-022 e T-023 foram colocadas em faixas paralelas por `Arquivos:`
 disjuntos e entraram em conflito sobre o `<h1>` do shell; a correção foi
 decisão de dono do produto (relatório §4.1), não um gate.
- *Problema resolve:* o plano de execução promete paralelismo que não existe.
- *Vira regra?* **Sim**, mas como **ressalva explícita**, não como gate novo.
- *Onde morar:* `PROC` (§3.2) e no cabeçalho do artefato de plano.

**R-05 — Prova mecânica e validação perceptual são gates distintos.**

- *Evidência:* o `<h1>` com 24px contra 24px, com `audit` = 0, 11/11 PASS e tela
 pior (relatório §11); a spec já separava os dois antes do defeito
 (`spec.md:52,113,217-219`).
- *Problema resolve:* a falseja mais cara do experimento — conclude-se que a
 mudança visível não porque a suíte passou.
- *Vira regra?* **Sim — é a regra mais importante deste documento.**
- *Onde morar:* `PROC` (§5, §12) **e** `AA` (gatilho). Hoje **não está em nenhum
 dos dois** — ver L-05.

**R-06 — Teste que prova implementação não prova objetivo.**

- *Evidência:* AC-037 é satisfeito literalmente por referenciar o token, e ainda
 assim a hierarquia achatou; o teste-guarda de AC-038 existe *sem* tag
 `@spec:` justamente por não ser escopo de AC (relatório §7); o jsdom não
 resolve `2em` do `h1` (relatório §11).
- *Problema resolve:* auto-confirmação. O teste passa, o agente reporta sucesso.
- *Vira regra?* **Sim.**
- *Onde morar:* `PROC` (§11) + `references/escrevendo-specs.md`, que já tem a
 tabela "Ruim (não testável) / Bom (observável)".

**R-07 — Mutação é o que prova que o teste prova.**

- *Evidência:* relatório §7, 6 mutações com o teste que cai em cada caso
 (remover `marginTop`; trocar token por literal; remover `aria-current`; remover
 `borderBottom`; remover token do `<h1>`; trocar `ErrorMessage` por `<p>`); mais a
 mutação verificada da guarda do `<h1>` e a de `recuperacao-carga` (*"remover o
 `onRetry` de uma página derruba exatamente o teste dela e mantém as outras 9
 verdes"*).
- *Problema resolve:* teste que nunca falhou não é prova de nada.
- *Vira regra?* **Sim**, mas **não** como gate mecânico obrigatório.
- *Onde morar:* `PROC` como G3, com escopo: obrigatórios quando o AC é de
 comportamento. Automatizar isso exigiria mutação de código por AC — caro e não
 validado. Ver §18.

**R-08 — Alterar código invalida a prova de todas as features alcançadas.**

- *Evidência:* L-001, `sinais.json` com `VERIFY_OBSOLETO` 12+11+7 = 30
 ocorrências; commit `62fc9c4` renovando 4 provas num diff; relatório §9
 descrevendo o ciclo que se fechou.
- *Problema resolve:* o gate final falha por features que você não tocou, e o
 agente "conserta" enfraquecendo em vez de renovando.
- *Vira regra?* **Sim — já é** (`UP`, e é a única lição promovida).
- *Onde morar:* `UP` (mecânico) + `PROC` (o que fazer quando acontece: renovar
 com `verify` da feature dona, sem `db reset` se os testes forem
 transacionais).

**R-09 — Nunca alterar AC, teste ou script para virar vermelho em verde.**

- *Evidência:* `AGENTS.addendum.md:18`; e o caso real — a colisão de
 `aria-label` foi corrigida renomeando labels no código de produção
 (relatório §6a), não afrouxando `tests/relatorio-comissao.spec.tsx`.
- *Problema resolve:* o bypass mais fácil de todo o processo.
- *Vira regra?* **Sim — já é.**
- *Onde morar:* `AA` (já está) + `CONST` do projeto, se o dono quiser que seja
 infração.

**R-10 — Verde não é "pronto": prova PASS e feature fechada são estados distintos.**

- *Evidência:* `relatorios-gerenciais` 11/11 PASS com status `rascunho`;
 `legado-baseline` 1/1 PASS com `em-implementacao`; `audit --ci` = 0 nos dois
 casos (relatório §1, §12.5). E na direção inversa, T-019/T-020/T-021
 entregues com status `[pendente]`, mais T-012 até hoje.
- *Problema resolve:* o gate verde é lido como "entregue".
- *Vira regra?* **Sim.**
- *Onde morar:* `PROC` (§10) + `AA` (uma linha). O `audit` não pode cobrir isso
 sem mudar de semântica.

**R-11 — `respondida` não significa `resolvida`.**

- *Evidência:* Q-015 (`recuperacao-carga/spec.md:155-157`): *"A resposta aqui é
 'não sabe-se', não 'resolvido'"*, com 2 hipóteses refutadas por medição e o que
 faltava explicitado. O relatório §13 alerta quem ler o spec e encontrar
 `respondida` para ler a resposta inteira.
- *Problema resolve:* leitura apressada de spec concluding que houve diagnóstico.
- *Vira regra?* **Sim**, e com uma exigência adicional: exigir que a resposta traga **o que
 falta** para fechar, não só a conclusão.
- *Onde morar:* `PROC` (§7.2, §12.2) + o template de spec do motor.

**R-12 — Aprendizado só vira regra com lastro mecânico.**

- *Evidência:* `LICAO_SEM_LASTRO` (`references/licoes.md:12-17`); o motor
 maintaining candidatas/confirmadas/quarentena; e o caso negativo do relatório
 §6 — 2 defeitos reais corrigidos, nenhum virando lição, porque nenhum gerou
 sinal.
- *Problema resolve:* inflar o processo com opinião.
- *Vira regra?* **Sim — já é** (`UP`).
- *Onde morar:* `UP`. **Falta** o critério de promoção para o **kit** (não para o
 projeto): o que faz um aprendizado virar regra do Factory Kit — ver §15.3.

**R-13 — Artefato gerado não é arquivo de ownership; artefato escrito é.**

- *Evidência:* T-011 declara explicitamente que
 `.spec/verification/fundacao-ui.json` *"é gerado automaticamente pelo
 `onp-spec verify` (não é arquivo de implementação)"*; T-006 declara
 `Arquivos:.spec/features/fundacao-ui/inventario.md` como resultado de
 inventário. `docs/screenshots/validacao-visual/diagnostico.json` e os
 `plano-execucao.*` são gerados/medidos e não estão em `Arquivos:` de
 ninguém.
- *Problema resolve:* (a) colocar `.spec/verification/*.json` em `Arquivos:`
 geraria `ARQUIVO_INEXISTENTE` falso e tornaria a task improdutível; (b) deixar
 `inventario.md` fora tornaria o inventário órfão de propósito.
- *Vira regra?* **Sim.**
- *Onde morar:* `PROC` (§6.1). É a regra que mais precisa estar escrita, porque a
 distinção é sutil e o motor não a conhece.

---

## 17. Regras específicas do adapter Node/Vitest/Supabase

`[PROPOSTA]` Sete regras. A coluna "portabilidade" diz se a regra sobrevive a
outro adapter.

| # | Regra | Evidência | Destino | Portabilidade |
|---|---|---|---|---|
| **B-01** | Banco de Feature Verify com pgTAP é **descartável**, preparado por `db reset`; nunca em produção | `design.md:32`; `onp-factory.config.json:18-19`; `AGENTS.addendum.md:16-17`; `scripts/onp-pgtap-verify.cjs:9-11` | `CFG` + `AA` + `ADP` | **Alta** — o conceito é "ambiente de prova descartável", o comando não |
| **B-02** | pgTAP por `docker exec … psql -t -A -v ON_ERROR_STOP=1`, não pelo wrapper do Supabase CLI | `scripts/onp-pgtap-verify.cjs:1-7`: *"`supabase test db` hides per-test titles behind file-level dots"* | `ADP` | **Média** — o princípio (expor título por teste) é universal; o comando é do adapter |
| **B-03** | Testes pgTAP são transacionais (`begin; … rollback;`) com fixtures próprios; **não duplicar migrations** | 14 arquivos em `supabase/tests/`, todos com transação e inserts próprios; relatório §8 | `ADP` + doc do projeto | **Média** — "teste não reimplementa o schema" é universal |
| **B-04** | Filtro de prova por `@spec:AC-xxx` no **título** do teste, com `--testNamePattern` | `verify.js:189-193` (dica explícita); `adapters/…/combined-verify.cjs:84` | `ADP` | **Alta** — o ONP já padronizou |
| **B-05** | `testCommand` é **global**; o escopo de feature é injetado por variável de ambiente pelo adapter | `onpspec.config.json:2`; `verify.js:123-133`; `combined-verify.cjs:6` | `ADP` | **Alta** — consequência estrutural de como o motor funciona |
| **B-06** | `testTimeout` do Vitest precisa de teto acima do padrão sob carga paralela | `vitest.config.ts:11` com o comentário *"sem ele, o primeiro teste de cada arquivo estoura o padrão de 5s sob carga paralela"*; commit `dc66add`, com a causa isolada por remoção do arquivo novo (relatório §6b) | `ADP` + config do projeto | **Baixa** — valor e sintaxe são do Vitest |
| **B-07** | `project_id` do Supusto deve ser lido de `config.toml`/config, **nunca hardcoded** | O projeto de referência tem `SUPABASE_PROJECT_ID \|\| 'salao-beleza-sistema'` (`scripts/onp-pgtap-verify.cjs:24`); a V0.1 já corrigiu (`adapters/…/pgtap-verify.cjs:15-22`) | `ADP` | **Média** |

**Rejeitadas como regra de adapter (registrado para não voltar):**

- `npm run dev -- --port 5173` quebra — *"o npm consome as flags e o vite
 interpreta `5173` como diretório raiz, servindo 404 em tudo"* (relatório §10).
 É ** conhecimento local do npm + Vite**, não uma regra de processo. Fica no README
 do projeto.
- `set local role authenticated;` após os INSERTs de setup e antes dos asserts
 (`PROGRESS.md` §2, `supabase/tests/001_rls_isolamento_salao.sql:22-26`).
 É uma regra **de teste de RLS** com rationale própria (*"sem isso, os testes
 rodavam como superusuário e ignoravam as políticas, gerando falsos
 positivos"*), e vale para qualquer adapter com teste de isolamento — mas pertence
 ao `CONST` do projeto, não ao kit.

---

## 18. Regras experimentais ainda não consolidadas

`[PROPOSTA]` Cinco itens com aprendizado real e insufficientemente corroborado.
Para cada um, o critério de promoção.

| # | Aprendizado | Evidência | O que falta para virar A |
|---|---|---|---|
| **E-01** | Ownership de arquivos é bom proxy de paralelismo | `plano-execucao.md:8,25-34` — 5 tasks em 2 faixas; mas 4 caíram na mesma faixa e a execução foi sequencial; e houve conflito semântico entre faixas disjuntas | Um projeto em que a execução paralela com worktrees **funcionou** e o gain foi medido. No experimento, o plano foi gerado e não executado |
| **E-02** | Renumerar IDs globalmente é o mecanismo correto de colisão | `218b468` renumerou 22 IDs com sucesso | Terteza de que falha **depois** de testes existirem. Não há nem registro de tentativa. Precisa de 1 caso testado |
| **E-03** | `Q respondida` com conclusão negativa é o padrão correto para causa indeterminada | Q-015 é um exemplo bem executado | 2 casos. Um é observação, não corroboração |
| **E-04** | Medição computada (`diagnostico.json`) é o artefato certo de QA visual | `62fc9c4` versiona 12 PNGs + `diagnostico.json` | Um segundo gate visual. O `diagnostico.json` nunca foi lido por máquina |
| **E-05** | Playwright com `executablePath` apontado para binário de cache divergente | relatório §11 | ÉÉ um problema de ambiente, não de processo. Não deve virar regra |

`[FATO]` E há um sexto item que é learning sem forma de regra, registrado aqui
porque **não** deve ser esquecido: `AC-018` foi reutilizada por outra feature
como referência cruzada (*"conforme `AC-018` da feature `fundacao-ui`"* em
`refinamento-interface/spec.md:203`, e *"`AC-045` … não regride `AC-040` e
`AC-018`"* em `recuperacao-carga/spec.md:78`). O motor suporta refs cruzadas por
desenho (`audit.js:78-92`).

`[INFERÊNCIA]` Esse é um padrão de **reuso de requisito** entre features — útil,
e não documentado em lugar nenhum do kit. Pode ser a origem de uma classe de
regressão: se `AC-018` mudar, as features que o referenciam precisam de prova
renovada, e nada sinaliza isso.

`[PROPOSTA]` Não criar regra agora. Registrar como candidato a E-06 e observar no
segundo projeto.

---

## 19. Lacunas conhecidas

`[PROPOSTA]` Nove conflitos entre documentos, registrados **sem resolução** —
por decisão explícita deste documento. Cada um traz as duas versões, a evidência
de cada lado, e o que falta para decidir.

---

### L-01 — "Não use `onp-spec verify` diretamente" vs. "usamos exatamente isso"

- **Versão A:** `AGENTS.md:30-36` do projeto de referência: *"Não use
 diretamente: `node.claude/.../onp-spec.mjs verify <feature>` como gate final de
 uma feature, porque o testCommand do projeto é global."*
- **Versão B:** relatório §8 e §10 documentam o uso direto do motor com
 `ONP_VERIFY_FEATURE` setado, **sem** o wrapper, para renovar prova sem
 `db reset`. O commit `1b4d57f` é esse bypassing versionado.
- **Por que A está certa:** sem o wrapper, o `testCommand` roda em modo global e
 a prova atribuída pode vir de testes fora da feature.
- **Por que B está certa:** o wrapper **acopla** reset de banco a verify. Como
 os 14 arquivos pgTAP são transacionais, o reset é desnecessário para renovar
 prova — e custa dados de desenvolvimento à QA visual (§13.1).
- **O que falta:** um terceiro caminho na interface — "renovar prova sem
 preparar banco" — que hoje só existe como contorno manual.

### L-02 — `plano-execucao.md` está stale em relação a `tasks.md`

- **Versão A:** `.spec/features/refinamento-interface/tasks.md:50` — T-024 tem
 `- Arquivos: src/App.tsx, tests/ui/refinamento-interface-tipografia.spec.tsx`.
- **Versão B:** `.spec/features/refinamento-interface/plano-execucao.md:15` —
 *"⚠ T-024 não lista Arquivos: — pegada desconhecida, vai rodar sozinha ao final
 (sem paralelismo)"* — e `:40` repete o motivo.
- **Verificação:** no commit `7e4b7b6` a tasks.md de T-024 realmente não tinha
 `Arquivos:` (só `Evidência gerada:` e `Testes:`). O campo foi adicionado em
 `e5c31fd` (T-024) e **o plano não foi regenerado**.
- **Consequência:** o artefato diz que T-024 é sequencial por pegada
 desconhecida; a verdade é que ela tem arquivos. Alguém que siga o plano hoje
 toma uma decisão errada.
- **O que falta:** staleness de artefato gerado não é detectada por gate algum.
 O cabeçalho do plano diz *"NÃO edite à mão; mudou tasks.md ou a config?
 Regenere"*, mas nada verifica.
- **Observação de baixa confiança, registrada como tal:** o cabeçalho diz
 *"gerado por `onp-spec plano` em 2026-09-25 21:12"* em um commit cujo próprio
 `Date` é `18:52:01 -0300` do mesmo dia, e a versão anterior dizia `12:10` em
 commit de `00:28`. O timestamp do artefato gerado **não é um sinal confiável de
 ordenação**. Não investiguei a causa.

### L-03 — `Status` de spec e de task não é verificado, e diverge

- **Versão A:** `escrevendo-specs.md:72-83` define o ciclo
 `rascunho → pronta → em-implementacao → implementada → auditada` com
 `implementada` = "código pronto".
- **Versão B (observada):** `relatorios-gerenciais` com 11/11 PASS em `rascunho`;
 `legado-baseline` com 1/1 PASS em `em-implementacao`; T-019/T-020/T-021
 entregues com `[pendente]`; T-012 entregue com `[pendente]`. `audit --ci` = 0
 em todos esses casos.
- **Por que importa:** "feature fechada" não é auditável. Um relatório que cita
 `audit --ci` = 0 como prova de entrega está citando um sinal que não cobre
 status.
- **O que falta:** definir se status é campo declarativo (e o gate é outro) ou
 campo verificado (e o gate deve cobri-lo). As duas opções são defensáveis e
 Levam a arquiteturas diferentes.

### L-04 — O `AGENTS.addendum.md` do kit perdeu uma regra do projeto de referência

- **Versão A (referência):** `AGENTS.md:30-36` proíbe `onp-spec verify <feature>`
 direto, com a razão.
- **Versão B (kit):** `templates/AGENTS.addendum.md:12-19` lista três gates
 (Feature Verify, Global Regression, pgTAP com `db reset`) e **não menciona** a
 proibição. O addendum diz *"Cada critério de aceite precisa de uma prova
 automatizada"* e *"Não alterar ACs, testes ou scripts de verificação apenas
 para transformar resultado vermelho em verde"* — as duas regras foram
 extraídas; esta não.
- **Consequência:** um projeto adotado pelo kit não recebe a instrução que
 impede o bypass mais tentador.
- **O que falta:** a regra não écontraditória com nada no kit. Seems **omissão na
 extração**, não conflito de princípio. Mas este documento não altera o
 addendum (§20 apenas registra).

### L-05 — Validação visual não é gate em nenhum artefato de regras

- **Versão A:** a spec da feature declara a separação dos dois gates em três
 lugares (`spec.md:52`, `:113`, `:217-219`) e o relatório a executa (§11).
- **Versão B:** nem `AGENTS.md` do projeto de referência nem
 `templates/AGENTS.addendum.md` do kit mencionam QA visual. A única ocorrência de
 "visual" no addendum é_none_ — não há.
- **Consequência:** a regra que encontrou o defeito mais caro do experimento só
 existe dentro da feature que a produziu. A feature seguinte precisou
 redescobri-la.
- **O que falta:** um gatilho declarado ("mudança perceptível") e um lugar de
 registro da decisão. §12 propõe os dois; este documento não os implementa.

### L-06 — O commit `218b468` viola a regra de commit que o próprio plano prescreve

- **Versão A:** `plano-execucao.md:45` — *"cada faixa nasce dela como branch própria
 e roda no seu worktree — **1 tarefa = 1 commit** (`T-xxx feature: título`)"*.
- **Versão B:** `218b468` tem mensagem `"ok"` e renumera 22 IDs de uma vez.
- **Observação atenuante:** a regra do plano é sobre execução de tarefa, e `218b468`
 é uma renumeração **pré-execução** — arguably fora do escopo da regra. Mas a
 renumeração alterou `spec.md`, `tasks.md` **e** `inventario.md` num commit sem
 rastro, num artefato cujo valor é a rastreabilidade.
- **O que falta:** uma política de commit para mudanças de artefato que não são
 tarefa. Não há hoje.

### L-07 — A numeração automática de IDs é contradita pela evidência

- **Versão A:** `references/escrevendo-specs.md:66-70` — *"`onp-spec new` continua a
 numeração automaticamente. Se você duplicar, o audit acusa código duplicado
 (`ID_DUPLICADO`)."*
- **Versão B (observado):** `ID_DUPLICADO` para `AC-001..011` e `US-001..006`
 entre features. No momento em que `refinamento-interface` foi criada
 (`97cc5a8`, 24/09 15:19), `relatorios-gerenciais` **já continha** US-001..003 e
 AC-001..011 corretamente aninhados em histórias (verificado em
 `97cc5a8~1:.spec/features/relatorios-gerenciais/spec.md`) — e mesmo assim a
 feature nova recebeu AC-001.
- **Mecânica:** `cmdNew` (`cli.js:315-327`) calcula `maxUs`/`maxAc` percorrendo
 `project.features` e, para cada spec, `s.stories` e `s.acs` — isto é, **ACs
 aninhadas em histórias**.
- **O que falta:** a causa-raiz não foi investigada. Pode ser a spec anterior não
 ter sido parseada no momento, ou o feature não ter sido visto. **Registrado
 como não determinado.**
- **Consequência para o processo:** a numeração automática **não pode ser
 presumida**. O gate real é `ID_DUPLICADO`, e ele precisa rodar **antes** da
 implementação — que é exatamente o que aconteceu, e é o argumento mais forte a
 favor de G1 (§5).

### L-08 — `ARQUIVO_ORFAO` é ruído inevitável na adoção

- **Versão A:** `audit.js:413-435` — todo arquivo em `srcGlobs` não mapeado por
 task gera `ARQUIVO_ORFAO`; e em `--ci` vira **erro** (`CI_ESCALATES`).
- **Versão B (observado):** o projeto de referência acumulou **22 ocorrências por
 arquivo** para ~20 arquivos de `src/` — o suficiente para tornar o sinal
 indistinguível de ruído.
- **Mitigação que funcionou:** a feature `legado-baseline` existe exatamente para
 isso, e seu AC-020 é provado por um teste **de processo** que lê
 `.spec/features/legado-baseline/tasks.md` e falha se algum arquivo declarado
 estiver ausente (`tests/processo/legado-baseline.spec.ts:28-34`).
- **Lacuna no kit:** `adoption.md:32-34` diz *"Use baseline apenas para registrar
 proveniência do código e impedir que código existente fique sem rastreabilidade
 mínima"* — mas **não há template de baseline**, e o `doctor` da V0.1
 (`bin/onp-factory.cjs:151-185`) não verifica baseline nem constituição.
- **O que falta:** decidir se o kit fornece um caminho de baseline. É a maior
 fricção de adoção conhecida.

### L-09 — A ferramenta que sustenta o gate visual não é declarada

- **Evidência:** `package.json` do projeto de referência não lista `playwright` em
 `dependencies` nem em `devDependencies`; o pacote existe em
 `node_modules/playwright`; o relatório §11 confirma *"sem entrada em
 `package.json`"* e que a versão do cache divergia da instalada
 (`chromium-1217` vs `chromium-1243`).
- **Consequência:** um clone limpo do projeto **não consegue executar G6**. A QA
 visual é o gate que encontrou o defeito mais importante, e é o menos
 reproduzível.
- **O que falta:** o kit não deveria declarar Playwright (é escolha de adapter de
 QA visual, não de test runner), mas o processo precisa de um gate que declare
 **qual** ferramenta de QA visual o projeto usa, para que ela seja instalável.

---

### 19.1 Etapas ainda implícitas

`[PROPOSTA]` Treze etapas mapeadas acima; quatro não têm gate, artefato ou dono
declarado:

| Etapa | Situação |
|---|---|
| **Arquitetura / Impacto (3)** | Nunca exercitada como etapa. A seção "Impacto técnico" da spec cumpre a função, mas não é verificada |
| **Escolha de paralelismo (3.2)** | O motor exige a pergunta (`SKILL.md:169-188`); o registro da resposta não é arquivado em lugar nenhum |
| **QA visual (12)** | Executada com alta qualidade, mas sem gatilho declarado e sem gate |
| **Revisão de diff / escopo (G9)** | Listada em `adoption.md:64` como "revisão humana de diff e escopo" e em `AGENTS.md:20` ("Revise o diff antes de concluir"), mas sem critério: o que conta como "fora de escopo"? |

### 19.2 Gates que ainda dependem de julgamento humano

`[PROPOSTA]` G1, G2, G4, G7 e G8 são mecânicos. **G3, G5, G6 e G9 são humanos**,
e somam a maior parte do custo do processo. Nenhum tem critério declarado:

- G3 (mutação): quando fazer? §12 propõe "quando o AC é de comportamento", mas
 isso é heurística.
- G5 (QA funcional): quando o AC "só o app real reproduz"? O experimento respondeu
 para AC-040, não como regra.
- G6 (QA visual): o gatilho "perceptível" é humano.
- G9 (escopo): sem critério.

### 19.3 Informação que existe só em prompt ou relatório

`[PROPOSTA]` Oito itens que estão em prosa e **não** em nenhum artefato
verificável:

1. Por que `App.tsx` ficou fora da T-022 (relatório §4.1).
2. Por que `LoginPage` tem 2 grupos (relatório §4.2).
3. Por que a borda transparente nas abas inativas foi decisão de implementação e
 não da spec — com a alternativa registrada (relatório §12.3).
4. Que a taxonomia de `aria-label` **não** é coberta por critério, e que um
 `aria-label` futuro pode reintroduzir a colisão sem teste reclamar
 (relatório §12.4).
5. Que o `<nav>` ficou sem `aria-label` porque nenhum AC exige (relatório §8).
6. Que `marginBottom: 24` literal no `<nav>` foi mantido de propósito (relatório
 §8).
7. Que `relatorios-gerenciais` e `legado-baseline` ficaram abertos **por decisão
 de produto** (relatório §8).
8. Que `ErrorMessage` deixou de ser intocado por causa de `recuperacao-carga` —
 registrado como "Atualização posterior" dentro de T-024, o que é frágil
 (relatório §2).

`[INFERÊNCIA]` Os itens 1–4 são os mais valiosos: são decisões de escopo e
armadilhas conhecidas que se perdem. O item 8 é o mais frágil estruturalmente —
uma atualização posterior escrita dentro do bloco de outra tarefa.

### 19.4 Situações em que o ONP permite PASS sem provar o suficiente

`[PROPOSTA]` Quatro, com lastro:

| Situação | Por que passa | Evidência |
|---|---|---|
| Feature com todos os ACs PASS e status `rascunho` | Status não é verificado | `relatorios-gerenciais`, `audit --ci` = 0 (relatório §1) |
| Tarefa entregue e `[pendente]` para sempre | `TASK_CONCLUIDA_SEM_PROVA` só dispara em `concluida` | T-012; T-019/T-020/T-021 antes de `3d2e96e` |
| AC satisfeito por construção, não por objetivo | O audit vê tag e prova PASS, não intenção | AC-037 e o `<h1>` achatado (relatório §11) |
| Colisão semântica entre dois artefatos | Nenhum gate cruza spec, tasks, inventário e plano | §12.2 do relatório documenta que a escolha do grupo de formulário *"vale conferir contra o texto do critério"* — e ninguém conferiu mecanicamente |

### 19.5 Risco de overengineering do Factory Kit

`[PROPOSTA]` O risco real, nomeado: o kit duplicar garantias que o motor já dá.

| Já é do motor | Risco de o kit também fazer |
|---|---|
| `AC_SEM_TESTE`, `AC_SEM_PROVA`, `ID_DUPLICADO`, `TASK_CONCLUIDA_SEM_PROVA`, `VERIFY_OBSOLETO` | um segundo "verificador de spec" |
| `LICAO_SEM_LASTRO`, ciclo de lições | um tracker de lições no kit |
| `onp-spec plano` + `executar-tarefas.sh` | um executor de tarefas no kit |
| `scaffold` | um gerador de testes no kit |
| Grammática de `spec.md`/`tasks.md` | um parser de spec no kit |

`[FATO]` A V0.1 não caiu nessa armadilha: `design.md:36-43` lista explicitamente o
que **não** entra, incluindo *"fork do motor upstream"* e *"abstrações além das
comprovadas no projeto de referência"*. E `README.md:51-53` já diz que o próximo
teste obrigatório é o **segundo projeto real**.

`[PROPOSTA]` O critério de defesa é o §2: regra de stack não sobe para Processo.
Se uma proposta de V0.2 exigir que o ONP mude, ela provavelmente é uma proposta de
ONP, não de kit.

---

## 20. Implicações para V0.2

`[PROPOSTA]` Só o que a §19 justifica. Cada item cita a lacuna que o motivou.
Nada aqui é plano de execução.

### 20.1 Três restituições no `AGENTS.addendum.md`

`[FATO]` Lacunas L-04, L-05 e §3.2. O addendum atual
(`templates/AGENTS.addendum.md`) tem 33 linhas e cobre fluxo, dois gates, `db
reset`, a proibição de enfraquecer teste e a consulta à SPEC. Faltam três coisas
que o projeto de_reference demonstrou serem necessárias:

1. **A proibição de `onp-spec verify <feature>` direto**, com a razão
 (`testCommand` é global). Uma linha.
2. **O gate de QA visual**, com o gatilho "mudança perceptível" e a exigência de
 medição, não impressão. Um parágrafo.
3. **O gate de SPEC Review antes de implementar.** O addendum lista o Audit no
 fim do fluxo (`:8`) e não menciona auditoria antecipada — que foi o que pegou
 o `ID_DUPLICADO` 5 h 31 min antes do primeiro código.

`[INFERÊNCIA]` Estas três são as de menor custo e maior retorno porque são
**informação que já existe** no projeto de referência e foi perdida na extração
ou nunca extraída. Nenhuma exige mudança de código.

### 20.2 Um caminho de "renovar prova sem preparar banco"

`[FATO]` Lacuna L-01. Hoje existem três modos de verify e o segundo só existe
como contorno manual documentado em relatório (§8) e versionado em `1b4d57f`.

`[PROPOSTA]` A lacuna é de **interface**, não de arquitetura. A forma mais barata
não é um comando novo: é tornar o `db reset` **condicional e explicável** — o
adapter já detecta se a feature tem pgTAP (`feature-verify.cjs:36-52`); falta o
mesmo para "os testes desta feature são transacionais", que é a condição real
observada. `docs/adoption.md:44-46` e `README.md:41-43` já descrevem o
comportamento; falta o terceiro modo.

`[PROPOSTA]` **Não** criar um quarto comando para isso. Criar comando para
contornar um bug de interface é o caminho mais rápido para o framework
monolítico.

### 20.3 Um caminho de baseline na adoção

`[FATO]` Lacuna L-08. `adoption.md:32-34` fala em baseline sem dar o caminho, e
`ARQUIVO_ORFAO` é erro em `--ci`. O projeto de referência resolveu com a feature
`legado-baseline` + um teste de processo que lê o inventário
(`tests/processo/legado-baseline.spec.ts`).

`[PROPOSTA]` A lição é que **o baseline pode ser provado por um teste que lê o
artefato que o declara**. Isso é portável e não é stack-specific. Mas é uma
funcionalidade nova, e a §15.3 exige 2 projetos antes de promover a regra.

### 20.4 O que **não** fazer agora

`[PROPOSTA]` Cada item é uma tentação real, e cada uma é contrariada por
evidência:

| Tentação | Por que não |
|---|---|
| Reescrever `design.md` com este documento | Este documento é proposta, com `[PROPOSTA]` misturado a `[FATO]`. `design.md` é arquitetura decidida |
| Transformar §5 (gates) em comando | G3, G5, G6 e G9 são humanos. Um comando aqui seria teatro |
| Levar as regras R-01..R-13 para dentro do motor | 8 delas **já são** do motor. Duplicar cria dois lugares onde a regra pode divergir |
| Adicionar um 2º adapter "speculativo" (Python, Playwright, Next.js) | `design.md:36-43` já excluiu isso, e não há projeto para comprovar |
| Tornar QA visual automatizável | O relatório §11 e §12.1 registram o limite: jsdom não resolve `2em`, e "harmonia entre variantes" é judge's final |
| Publicar npm | `roadmap.md:22` e `README.md:53` já condicionam ao segundo projeto |
| Tratar a proposta como documento oficial | É o objetivo do passo seguinte, e você pediu para revisar antes |

### 20.5 O que só o segundo projeto real decide

`[PROPOSTA]` Cinco perguntas que este documento **não** pode responder, e que
`README.md:51-53` e `roadmap.md:11-13` já condicionam:

1. Se as 13 regras universais (§16) sobrevivem a uma stack sem banco, sem
 componente e sem suíte de UI. A mais frágil é **R-05** (prova mecânica ≠
 perceptual): ela foi provada em UI, e pode ser specific de UI.
2. Se **R-07** (mutação) é obrigação ou prática recomendada. No experimento foi
 seis mutações em 3 tasks — pode ser o certo, pode ser excessivo.
3. Se o padrão de **baseline** (§20.3) é necessário em todo projeto ou só em
 projeto com legado.
4. Se **G1** (SPEC Review antes de implementar) continua barato em projeto com
 dezenas de features, onde o audit completo pode ser caro.
5. Se o `onp-spec` que o kit descobre por candidatos de caminho
 (`onp-factory.config.json:8-12`) é a mesma versão que o motor usado no
 projeto de referência — hoje **não há verificação de versão**
 (`design.md:33` só fala em "candidatos configuráveis").

### 20.6 Caminho recomendado para transformar esta proposta em documentação oficial

`[PROPOSTA]` Quatro passos, fora do escopo deste documento:

1. **Revisão deste documento.** Cada `[PROPOSTA]` vira aceita, corrigida ou
 descartada. As `[FATO]` com âncora quebrada são corrigidas. Os 9 conflitos da
 §19 são resolvidos um a um, com decisão registrada.
2. **Segundo projeto real.** Não para validar a arquitetura — para produzir as
 contra-exemplos. Um processo só se prova no primeiro projeto que **não** é o
 projeto que o inventou.
3. **Promoção.** O que sobreviveu dos dois projetos vira `docs/processo.md`
 (universal), `docs/adapters/node-vitest-supabase.md` (stack) e o
 `AGENTS.addendum.md` (§20.1). O que não sobreviveu fica em §18 com o motivo.
4. **Congelamento.** Só então a interface é congelada, como `README.md:51-53`
 já determina.

`[INFERÊNCIA]` O passo 2 é o que o próprio kit já identifica como "o próximo teste
obrigatório". Este documento **não** o substitui, e não deve ser lido como se
substituísse.

---

## Apêndice — Índice de evidências

`[PROPOSTA]` Referências usadas neste documento, para auditoria independente.

### Projeto de referência — `salao-beleza-sistema`

| Arquivo | Usado para |
|---|---|
| `docs/relatorio-execucao-sessao-onp.md` | §1.2, §1.5, §3, §7, §8, §9, §12, §13, §15, §19 |
| `docs/auditoria-visual-estabilizada.md` | §3 estágio 1 |
| `docs/auditoria-visual-atual.md` | §3 estágio 1 |
| `docs/diagnostico-final.md` | §3 estágio 1 (nível de confiança explícito) |
| `.spec/constituicao.md` | §14.1 |
| `.spec/LICOES.md`, `.spec/licoes.json` | §15.1 |
| `.spec/verification/sinais.json` | §3, §6.3, §8, §14, §15, §19 |
| `.spec/verification/*.json` | §6.2 |
| `.spec/features/refinamento-interface/{spec,tasks,inventario,plano-execucao}.md` | §3, §4, §5, §6, §10, §11, §12, §19 |
| `.spec/features/recuperacao-carga/{spec,tasks}.md` | §7.2, §10.2, §11, §12.2, §15.2 |
| `.spec/features/legado-baseline/{spec,tasks}.md` | §1.5, §4.2, §19 (L-03, L-08) |
| `.spec/features/fundacao-ui/tasks.md` | §6.1, §4.2 |
| `AGENTS.md` | §1.4, §5, §13, §19 (L-01, L-05) |
| `onpspec.config.json` | §1.4, §13 |
| `scripts/onp-{feature,combined,pgtap}-verify.cjs` | §9, §13, §17 |
| `tests/processo/legado-baseline.spec.ts` | §11, §19 (L-08) |
| `supabase/tests/*.sql` (14 arquivos) | §11, §17 (B-02, B-03) |
| `vitest.config.ts`, `package.json` | §17 (B-06), §19 (L-09) |
| `processo-dev-salao-beleza.md`, `PROGRESS.md` | §3 estágio 2, §17 |
| `.claude/skills/onp-spec-driven/SKILL.md` | §1.1, §7, §8, §14 |
| `.claude/skills/onp-spec-driven/references/{fluxo,escrevendo-specs,licoes}.md` | §3.1, §15, §19 (L-07) |
| `.claude/skills/onp-spec-driven/scripts/lib/src/core/{verify,audit}.js` | §1.1, §1.4, §6.2, §8, §14 |
| `.claude/skills/onp-spec-driven/scripts/lib/src/{cli.js,parsers/tasks.js}` | §4.1, §19 (L-07) |
| `.claude/skills/retro-karpathy/SKILL.md` | §7.2, §7.4, §7.6 |
| `git log` (commits `46ecdcf` … `55277ff`) | §3, §3.2, §3.3, §6.3, §19 |

### Factory Kit — `onp-factory-kit` (commit `c734a53`)

| Arquivo | Usado para |
|---|---|
| `README.md` | §1.4, §13, §20 |
| `docs/design.md` | §2, §13, §19.5, §20 |
| `docs/adoption.md` | §10.3, §19 (L-08), §20 |
| `docs/roadmap.md` | §15.3, §20 |
| `bin/onp-factory.cjs` | §19 (L-08) |
| `profiles/node-vitest-supabase.profile.json` | §9 |
| `templates/{AGENTS.addendum,onp-factory.config,onpspec.config}.*` | §1.4, §9, §19 (L-04, L-05) |
| `adapters/node-vitest-supabase/*.cjs` | §1.4, §9, §13, §17, §20 |
| `test/cli.test.cjs` | §19 (3 testes: init cria, init não sobrescreve, doctor falha sem motor) |
