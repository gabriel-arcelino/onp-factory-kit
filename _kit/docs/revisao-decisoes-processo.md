# Revisão das decisões do Processo ONP Factory

> **NÃO É FONTE NORMATIVA.** Revisão datada de 2026-09-26, anterior à
> consolidação. As lacunas que ela registra como pendentes — **G-1** (Done),
> **G-2** (lista canônica de gates) e **G-3** (limite de iteração) — foram
> **resolvidas**: Done e G0–G8 estão em [done-e-gates.md](done-e-gates.md).
> As conclusões sobre contradições com o kit atual (seção 6) continuam valendo
> como diagnóstico. Não use este documento para definir Done ou gates.
>
> Correção permanente: o erro factual I-03 relatado abaixo (a proposta afirmar
> que o addendum não menciona auditoria antecipada) já está corrigido nesta
> revisão; ver [processo-proposta.md](processo-proposta.md), que recebeu banner
> de não-normatividade.

> **Papel:** revisor técnico independente.
> **Alvo:** as decisões provisórias consolidadas após a leitura de
> `docs/processo-proposta.md`.
> **Data:** 2026-09-26 · **Estado do kit avaliado:** `onp-factory-kit` @ `c734a53`
> (único commit) · **Estado do projeto de referência:** `salao-beleza-sistema`,
> branch `experimento/onp-fase-4`.
> **Esta revisão não alterou nenhum arquivo do repositório.** O único arquivo
> criado é este.

## Convenção de marcação

| Marca | Significado |
|---|---|
| `[FATO]` | Verificável no repositório, com âncora `arquivo:linha` |
| `[INFERÊNCIA]` | Derivado de um `[FATO]`, não confirmado diretamente |
| `[OPINIÃO]` | Posição do revisor, contestável |

Classificação de severidade: **CRÍTICO** (bloqueia a redação do documento
normativo), **IMPORTANTE** (entra no documento com ressalva ou correção de
formulação), **MENOR** (anotação editorial), **NENHUM PROBLEMA**.

---

## 1. Veredito geral

`[OPINIÃO]` As decisões são, no geral, **melhores do que a proposta original** —
e em três pontos specificamente **melhores** do que eu recomendaria ter
sugerido. Rebaixar R-07 (mutação) de universal para experimental, fragmentar
B-02/B-03 em princípio universal + detalhe de adapter, e rebaixar `testTimeout`
(B-06) são correções que eu teria proposto. A lista de decisões tem bom
juízo de escopo.

`[OPINIÃO]` Mas a lista tem **dois problemas de natureza diferente**, e é
importante não confundi-los:

1. **Uma decisão está factualmente errada** (L-03) e outra **está sem
 lastro no código que diz respeitar** (L-02, B-01). São erros de leitura do
 repositório, não de julgamento.
2. **Quatro decisões estão ausentes** — e uma delas (a definição de Done) é a
 espinha dorsal de um `docs/processo.md` normativo. A §5 detalha.

`[FATO]` A proposta que estas decisões revisam tem **dois erros meus** que
precisam ser corrigidos antes de virar documentação oficial, e que esta revisão
usa como evidência:

| Erro na proposta | Onde | Correção |
|---|---|---|
| Afirma que o `AGENTS.addendum.md` "não menciona" auditoria antecipada | `docs/processo-proposta.md` §20.1 item 3, e a lista de L-05 | **Falso.** `templates/AGENTS.addendum.md:8` contém `Audit` **duas vezes** no fluxo: `… → Teste → Audit → Tasks → Implementação → Verify → Audit → Regressão → …` |
| Lista 5 erros de digitação e 2 palavras em inglês no próprio corpo | §20 linha 20 (`Regraderivada`), linha 102 (`produced by`), linha 185 (`de exercise`), e anglicismos `stale` | Ver §6, M-05 |

`[OPINIÃO]` A primeira correção é **substancial, não editorial**. Ela muda uma
lacuna de "falta adicionar" para "falta **nomear**". Isso é uma decisão diferente,
com custo menor e com uma consequência: se o gate já existe no fluxo do
addendum, então a proposta mais forte para `docs/processo.md` não é adicionar
gates, é **nomear os que já estão implícitos**.

`[OPINIÃO]` Veredito: **aprovado com 2 correções obrigatórias, 4 adições e 9
ajustes de formulação.** Nada aqui exige rever a arquitetura do kit. Tudo aqui
cabe em uma folha antes de escrever o documento normativo.

---

## 2. Decisões que você manteria

`[OPINIÃO]` Mantenho as 14 abaixo sem alteração, e em 4 delas a decisão é
**melhor** do que a proposta propunha.

| Decisão | Por que mantenho |
|---|---|
| **R-01** (IDs globais e únicos) | Consistente com `ID_DUPLICADO` como erro em `audit.js:44-52`. A ressalva de que estabilidade é experimental é a posição correta. |
| **R-02** (FV ≠ GR, escopo no Adapter) | Confirmed: `verify.js:123-133` não injeta nada; o filtro vive em `scripts/onp-combined-verify.cjs:6`. É a arquitetura correta, e é coerente com `design.md:25`. |
| **R-03** (ownership ≠ obrigação de alterar) | Consistente com `ARQUIVO_ORFAO`, que exige *mapeamento*, não mutação (`audit.js:413-435`). E com a observação de que T-019..T-024 declaram 11 arquivos e alteram 6. |
| **R-05** (mecânico ≠ perceptual) | O achado mais forte do experimento. Mantenho **com a ressalva de M-03** (gatilho). |
| **R-06** (privilegiar efeito observável) | Mantenho **na forma condicionada**. Ver ressalva em I-01. |
| **R-08** (provas obsoletas precisam ser renovadas) | É L-001, e é a única lição promovida no projeto. Consistente com `VERIFY_OBSOLETO` escalando em `--ci` (`audit.js:16`). Ver ressalva em I-08. |
| **R-09** (não alterar AC/teste/script para virar verde) | **Melhor que a proposta.** O addendum já diz "apenas" (`AGENTS.addendum.md:18`), o que abre a exceção; a decisão a fecha explicitamente. Isso é um ganho de precisão real. |
| **R-10** (prova ≠ execução; PASS ≠ fechada) | É a assimetria mais subestimada do experimento: 5 casos divergentes (relatório §1, §2; `legado-baseline/tasks.md:5`). |
| **R-11** (`respondida` ≠ `resolvida`) | Bem sustentado por Q-015, cuja resposta declara explicitamente "não sabe-se" (`recuperacao-carga/spec.md:157`). Ver I-07 (falta decidir a casa). |
| **R-13** (gerado ≠ ownership) | Correto. Ver I-06: falta a metade positiva. |
| **B-01** (ambiente descartável, nunca produção) | A *afirmação* é a regra certa. Ver **C-01**: a imposição não existe. |
| **B-03** (separar "não duplicar schema" de `begin/rollback`) | **Melhor que a proposta.** A B-03 original tratava `begin/rollback` como detalhe do adapter, o que é correto, mas a decisão vai além e nomeia o princípio de teste ("não duplicar schema") separadamente. É a distinção certa. |
| **B-06** (`testTimeout` não é regra do kit) | Correto e verificado: nenhum template ou profile do kit contém campo de timeout. Não há contradição. |
| **B-07** (identidade por config, nunca hardcoded) | Correto, e é uma **melhoria já entregue** na V0.1: o projeto de referência tem `SUPABASE_PROJECT_ID \|\| 'salao-beleza-sistema'` (`scripts/onp-pgtap-verify.cjs:24`) e o adapter lê `config.toml` (`adapters/node-vitest-supabase/pgtap-verify.cjs:15-22`). |

---

## 3. Decisões que você alteraria

### C-01 — B-01 "Nunca produção" não é imposta por nenhum código

**Classificação: CRÍTICO**

`[FATO]` Quatro campos de política no template de config **não são lidos por
nenhum código do kit**. Varredura completa em `bin/onp-factory.cjs`,
`adapters/node-vitest-supabase/*.cjs` e `test/cli.test.cjs` por
`allowProductionReset`, `productionDbResetAllowed`,
`featureVerifyIsNotGlobalRegression`, `resetLocalDbBeforePgTapFeatureVerify` e
`commands`: **zero ocorrências de leitura**.

`[FATO]` O único campo lido que habilita a operação destrutiva é
`database.resetCommand`, e ele é executado **verbatim**, sem validação:

```text
adapters/node-vitest-supabase/feature-verify.cjs:55
 const command = config?.database?.resetCommand || 'npx supabase db reset';
adapters/node-vitest-supabase/feature-verify.cjs:57-62
 const parts = command.trim().split(/\s+/);
 const proc = spawnSync(parts[0], parts.slice(1), { cwd: root, stdio: 'inherit',... });
```

`[FATO]` As duas declarações da regra estão em prosa: `README.md:45` ("Nunca
execute o reset contra produção") e `templates/AGENTS.addendum.md:17` ("Nunca
usar `db reset` contra produção"). Nenhuma das duas é lida por máquina.

`[INFERÊNCIA]` Um usuário que aponte `resetCommand` para uma URL de produção
terá o comando executado. As flags `allowProductionReset: false`
(`templates/onp-factory.config.json:19`) e `productionDbResetAllowed: false`
(`:31`) parecem defendê-lo e não defendem: são decorativas.

`[OPINIÃO]` Isto é a única regra da lista cuja consequência é **irreversível**, e
é a única que é exclusivamente documentação. Para um kit cuja raison d'être é
"não confie na palavra do agente", uma regra de segurança que é uma frase é
inaceitável.

**Ação sugerida (não implementada):** antes de escrever `docs/processo.md`,
decidir explicitamente se a regra é *documental* ou *enforced*. Se enforced, o
checamento pertence ao adapter (é lá que o comando é montado) e o `doctor`
deveria validar a forma de `resetCommand`. Se documental, B-01 deve ser
reescrita como "o adapter **deve** recusar reset não-local" e o
`docs/processo.md` não deve afirmar que a regra está satisfied por enquanto.

### C-02 — L-03 "Status é declarativo" é factualmente incorreto

**Classificação: CRÍTICO**

`[FATO]` O motor **já** acopla status à severidade dos achados:

| Linhas | Acoplamento |
|---|---|
| `audit.js:147-148` | `specMatured = ['pronta','em-implementacao','implementada','auditada']` |
| `audit.js:154`, `:164` | `SECAO_AUSENTE` vira **erro** (não aviso) se `specMatured` |
| `audit.js:200-201` | `implemented` / `inProgress` derivados de `spec.status` |
| `audit.js:214` | `ASM_ABERTA` é **erro** somente quando `implemented` |
| `audit.js:237` | `Q_ABERTA` é aviso quando `inProgress` |

`[FATO]` Ou seja: `status` **não é declarativo** — é campo semântico. E a segunda
metade de L-03 ("estados finais devem respeitar os gates") **já é verdade hoje**
para `ASM_ABERTA`.

`[INFERÊNCIA]` Se L-03 for implementada como enunciada, o efeito líquido é
**remover** um acoplamento existente — o oposto do robusto. Uma feature marcada
`implementada` hoje bloqueia com `ASM_ABERTA`; sob "status é declarativo", essa
proteção deixa de ser esperada.

`[OPINIÃO]` L-03 deve ser reescrita, não apenas ajustada. O problema real não é
"status é declarativo": é que **a coerência de status só é verificada em uma
direção** (status avançado demais é punished; status atrasado não é). Isso é
`TASK_CONCLUIDA_SEM_PROVA` invertido, e é o que a §1.5 da proposta documenta.

**Ação sugerida:** reformular L-03 como *"Status é semântico e já acopla
severidade de gate (`ASM_ABERTA`, `SECAO_AUSENTE`, `Q_ABERTA`); a lacuna é
unicamente a direção oposta — status atrasado em relação à prova PASS não é
detectado. Mecanizar isso é upstream, não kit."*

### I-01 — R-06, na forma forte, contradiz o único dado que temos

**Classificação: IMPORTANTE**

`[FATO]` O único caso do experimento em que a tensão "construção vs. efeito" foi
deliberadamente decidida foi AC-037, e a spec **escolheu construção**:

```text
.spec/features/refinamento-interface/spec.md:104
 "Não é aceitável usar apenas `fontSize > 1rem`, o tamanho padrão do navegador
 (`h1`/`h2`) ou o valor `"1.5rem"` diretamente sem utilizar `FONT_SIZE_HEADING`;
 não há exceção para integração direta."
.spec/features/refinamento-interface/spec.md:105
 "O tamanho renderizado pode corroborar a prova, mas não substitui a
 referência obrigatória ao token."
```

`[FATO]` E foi essa escolha que produziu o defeito do `<h1>` achatado — que
R-05 capturou, não R-06 (relatório §11).

`[INFERÊNCIA]` A resposta do projeto à pergunta "construção ou efeito?" foi:
**especificar por construção quando o efeito não é mecanicamente observável, e
cobrir a lacuna por R-05.** Uma leitura forte de R-06 proibiria esse padrão
legítimo.

**Ação sugerida:** reescrever R-06 como:

> Um teste pode provar a implementação sem provar o objetivo. Quando o efeito
> observável é mecanicamente verificável, prefira teste de efeito. Quando não é,
> o AC pode especificar por construção — e a lacuna passa a ser responsabilidade
> de R-05, não do teste.

### I-02 — L-02 "config é fonte de verdade" é falso para 8 de 12 chaves

**Classificação: IMPORTANTE**

`[FATO]` Chaves realmente lidas em todo o kit:

| Chave | Lida em |
|---|---|
| `onp.enginePathCandidates` | `feature-verify.cjs:22` |
| `database.resetCommand` | `feature-verify.cjs:55` |
| `database.projectId` | `pgtap-verify.cjs:16` |
| `database.container` | `pgtap-verify.cjs:64` |

`[FATO]` Chaves **nunca** lidas: `version`, `profile`, `adapter.path`, `database.provider`,
`allowProductionReset`, todo o bloco `commands` (5 entradas) e todo o bloco
`policy` (3 entradas).

`[FATO]` `adapter.path` é particularly enganoso: o acoplamento real entre
`combined-verify.cjs` e `pgtap-verify.cjs` é `__dirname`
(`combined-verify.cjs:58`), não o caminho declarado na config.

`[FATO]` O mesmo vale para o profile: `bin/onp-factory.cjs` lê apenas
`profile.name` (`:113`) e `profile.adapter` (`:120`, `:122`). Os outros 7 campos
(`runtime`, `featureTestRunner`, `database`, `pgtap`, `featureDatabasePrepare`,
`globalRegression`, `build`, `lint`) são decorativos.

`[FATO]` `bin/onp-factory.cjs:59` substitui `{{KIT_VERSION}}` nos templates, e
`{{KIT_VERSION}}` **não aparece em nenhum template** — ramo morto.

**Ação sugerida:** L-02 deve dizer: *"`spec.md`, `tasks.md` e config são fonte de
verdade; `plano-execucao` é derivado. Hoje a config é fonte de verdade para
**4 chaves** e o profile para **2**; o resto é documentação. Ou os campos ficam
marcados como declarativos, ou passam a ser lidos."*

### I-03 — Falta a decisão sobre G1 (Revisão da SPEC), e a proposta errou sobre ele

**Classificação: IMPORTANTE**

`[FATO]` `templates/AGENTS.addendum.md:8` já contém **dois** `Audit` no fluxo:
`Discovery → SPEC → AC → Teste → **Audit** → Tasks → Implementação → Verify →
**Audit** → Regressão → Build/Lint → revisão humana`.

`[FATO]` O gate G1 existia, portanto, no kit desde `c734a53`. A proposta
afirmou o contrário (§20.1 item 3, e L-05 na §19) — **erro meu**, corrigido aqui.

`[FATO]` A evidência de que G1 é o gate mais produtivo do experimento é a mais
forte de todas: rodou 24/09 19:07:46Z, detectou `ID_DUPLICADO` (AC-001..011,
US-001..006) e `Q_STATUS_INVALIDO`, e ficou 5h31min antes do primeiro commit de
código (`8759338`, 25/09 01:39). A colisão foi resolvida em `218b468` — antes de
qualquer teste existir.

`[OPINIÃO]` A consequence é boa: a ação não é "adicionar G1", é "**nomear** G1
e dizer o que ele tem de bloquear". Um `Audit` não nomeado num fluxo de 12
etapas é instrução que o agente pode interpretar como " rode o audit quando
tiver tempo".

**Ação sugerida:** adicionar à lista: *"G1 — Auditoria da SPEC antes de
implementação. Já implícita em `AGENTS.addendum.md:8`; a decisão é nomeá-la e
declarar que é bloqueante."*

### I-04 — Falta a exigência de que o gate tenha rodado algo

**Classificação: IMPORTANTE**

`[FATO]` Dois caminhos do adapter retornam sucesso sem executar nada:

```text
adapters/node-vitest-supabase/combined-verify.cjs:83 if (!files.length) return;
adapters/node-vitest-supabase/pgtap-verify.cjs:49 if (!files.length) process.exit(0);
```

`[FATO]` O motor já registra a informação necessária para detectar isso:
`testsParsed` em `.spec/verification/<f>.json` (`verify.js:200`).

`[FATO]` A proposta registrou o problema (§9.3) mas nenhuma decisão o adotou.

`[OPINIÃO]` `exit 0` do adapter **não** é prova — a prova é
`results[AC].status == pass`, e ela vem do `audit`. Mas sem uma exigência de
`testsParsed > 0`, um fluxo verde pode significar "não havia o que rodar", e o
`AC_SEM_PROVA` chega tarde (só no audit, e como erro).

**Ação sugerida:** incluir em Done: *"Feature Verify só vale se
`.spec/verification/<f>.json` tiver `exitCode: 0` **e** `testsParsed > 0`
**e** todo AC com `status: pass`."*

### I-05 — Falta a definição de Done

**Classificação: IMPORTANTE**

`[FATO]` A proposta define Done em §10 (Task / Feature / Project Gate). A
A lista de decisões **não tem nenhuma entrada** para Done. R-10 cobre só a relação
prova↔status.

`[FATO]` O kit hoje só tem a versão de projeto, em prosa:
`docs/adoption.md:56-65` (AC PASS, `audit --ci` 0, regressão global, build, lint,
revisão humana de diff e escopo).

`[OPINIÃO]` Sem Done, um `docs/processo.md` normativo não tem espinha dorsal: ele
vira uma lista de regras sem critério de encerramento. Done é o que permite
dizer "parou aqui" e "pode avançar".

**Ação sugerida:** incorporar Done como decisão, com Task Done e Feature Done
mecânicos onde possível (como na proposta §10) e Project Gate citando
`adoption.md:56-65` sem duplicar.

### I-06 — R-13 perdeu a metade positiva

**Classificação: IMPORTANTE**

`[FATO]` A decisão diz apenas "gerados não devem ser tratados como
implementação/ownership". A proposta §16 R-13 tinha as duas metades, e a segunda
tem evidência direta:

```text
.spec/features/fundacao-ui/tasks.md (T-006)
 - Arquivos:.spec/features/fundacao-ui/inventario.md
 - Notas: atividade de inventário já realizada; resultado documentado em
 inventario.md.
```

`[FATO]` `inventario.md` é escrito à mão, é ownership de T-006, e é a fonte mais
rica da feature (131 linhas, 9 topics). O simétrico em `T-011` é
`.spec/verification/fundacao-ui.json`, explicitamente "gerado automaticamente
(não é arquivo de implementação)".

`[INFERÊNCIA]` Sem a metade positiva, a leitura natural de R-13 é "artefato não
vai em `Arquivos:`" — e então `inventario.md` fica sem dono, que é exatamente o
que R-13 deveria evitar.

**Ação sugerida:** R-13 → *"Arquivos **gerados por comando** não são ownership.
Arquatos **escritos pela task** (ex.: inventário) são ownership e podem constar
de `Arquivos:`. O critério é a origem, não a extensão."*

### I-07 — R-11 e R-12 não decidem a casa da regra

**Classificação: IMPORTANTE**

`[FATO]` R-11 exige conteúdo específico da resposta a pergunta em aberto
(«o que foi estabelecido, o que permanece desconhecido, o que seria necessário
para fechar»). Mas o template upstream tem só quatro colunas e nenhum
guidance:

```text
.claude/skills/onp-spec-driven/scripts/lib/templates/spec.md:53-59
 ## Perguntas em aberto
 <!-- O que ainda não sabemos. Status: aberta | respondida -->
 | ID | Pergunta | Status | Resposta |
 | Q-001 | [o que precisa ser decidido pelo dono do produto?] | aberta | — |
```

`[FATO]` O addendum (`templates/AGENTS.addendum.md:1-33`) não comporta
orientação de escrita de spec, e não deve — a proposta §1.3 diz que só
imperativos entram ali.

`[OPINIÃO]` R-11 pertence ao **template upstream** (`lib/templates/spec.md`) e
ao `docs/processo.md` do kit. Não pertence ao adapter e não pertence ao projeto.
Sem essa decisão, R-11 fica sem lugar e não será praticada.

### I-08 — R-08 tem uma fragilidade que o próprio kit recomenda acionar

**Classificação: IMPORTANTE**

`[FATO]` `VERIFY_OBSOLETO` compara `mtime` de código/teste com o `timestamp` da
prova:

```text
core/project.js:99-107 latestMtime() via statSync(...).mtimeMs
core/audit.js:376-392 if (codeMtime > Date.parse(verification.timestamp)) → VERIFY_OBSOLETO
```

`[FATO]` O plano de execução upstream prescreve `git worktree` + branches +
merges (`plano-execucao.md:44-48`). Operações de checkout/worktree **reescrevem
mtime**.

`[INFERÊNCIA]` Portanto, o fluxo que o próprio motor recomenda pode invalidar
massa de provas — independentemente de qualquer alteração de conteúdo. O
experimento não encontrou isso porque a execução foi sequencial na árvore
principal (§3.2 da proposta).

`[OPINIÃO]` Isso fortalece L-01: "renovar prova sem reset" deixa de ser otimização
e vira rotina obrigatória após troca de branch. E obriga R-08 a carregar a
ressalva de que o gatilho é **temporal**, não de conteúdo.

**Ação sugerida:** R-08 → acrescer "o gatilho do motor é temporal (mtime), não
de conteúdo; trocar de branch ou worktree pode invalidar provas sem alteração
de código."

### I-09 — B-05: o modelo de escopo é binário e não expressa necessidades reais

**Classificação: IMPORTANTE**

`[FATO]` A mesma variável `ONP_VERIFY_FEATURE` filtra **os dois** runtimes:

```text
adapters/node-vitest-supabase/combined-verify.cjs:7 const FEATURE = process.env.ONP_VERIFY_FEATURE || null;
adapters/.../combined-verify.cjs:58-65 runPgTap() recebe FEATURE
adapters/.../combined-verify.cjs:84 --testNamePattern com as tags dos ACs
```

`[INFERÊNCIA]` Logo, "todos os testes de banco + só os de UI da minha feature" é
**inexpressável**. Um caso plausível: uma feature de UI cujo risco é
regressão de dados, e que quer a suíte pgTAP completa com a suíte Vitest
filtrada.

`[OPINIÃO]` Não é motivo para mudar o adapter agora, mas é motivo para o
`docs/processo.md` **não** afirmar que FV/GR cobrem todos os recortes desejados.
Uma frase de limite custa nada e evita uma decepção no segundo projeto.

### M-01 — L-06 contradiz um artefato upstream

**Classificação: MENOR**

`[FATO]` `plano-execucao.md:45` enuncia como política do plano: *"cada faixa
nasce dela como branch própria e roda no seu worktree — **1 tarefa = 1 commit**
(`T-xxx feature: título`)"*.

`[INFERÊNCIA]` Se o `docs/processo.md` disser que não há política rígida de commit
enquanto o plano gerado diz o contrário, o agente recebe duas instruções
inconsistentes — e o plano é mais específico, então vence.

**Ação sugerida:** L-06 → "o plano pode **recomendar** 1 task = 1 commit; o
processo não exige. A diretriz do plano prevalece dentro do plano."

### M-02 — `doctor` verifica 2 dos 3 scripts do adapter

**Classificação: MENOR**

`[FATO]` `bin/onp-factory.cjs:161-162` verifica `feature-verify.cjs` e
`combined-verify.cjs`. **Não verifica `pgtap-verify.cjs`**, embora `init` o
instale (`:124-131`) e `test/cli.test.cjs:29` afirme que ele existe.

`[INFERÊNCIA]` Cópia parcial do adapter passa no `doctor` e só falha no verify,
via `combined-verify.cjs:58` — com `stdio: 'pipe'`, o erro chega como falha de
spawn, não como diagnóstico. Relevante para L-01: se passar a haver 3 fluxos
oficiais (verify preparado / renovação / regressão), a lacuna passa a 3 de 4.

### M-03 — R-05: "perceptível" é indecidível e exclui mudanças só de acessibilidade

**Classificação: MENOR**

`[FATO]` AC-040 é inteiramente sobre `role` e `aria-live`
(`refinamento-interface/spec.md:135-140`), e a QA visual do experimento
**mediu** corretamente que o defeito era perceptual, mas o assunto da regra é
não-visual.

`[INFERÊNCIA]` "Perceptível" exclui: (a) mudanças que só afetam tecnologia
assistiva; (b) alterações de performance; (c) refactors de classe CSS com estilos
computados idênticos, que são imperceptíveis mas não detectáveis estaticamente.

**Ação sugerida:** o gatilho deve ser **declarado** na spec, não inferido. Uma
linha: *"a spec declara se a mudança é perceptível; o padrão é sim, quando toca
cor, espaçamento, tipografia, layout, texto visível, ícone ou semântica
assistiva."*

### M-04 — R-01, R-08, R-09 e R-12 são garantias do motor, não regras do kit

**Classificação: MENOR**

`[FATO]` As quatro já são impostas mecanicamente: `ID_DUPLICADO`
(`audit.js:44-52`), `VERIFY_OBSOLETO` (`audit.js:376-392`),
`TASK_CONCLUIDA_SEM_PROVA` (`audit.js:292-311`) e `LICAO_SEM_LASTRO`
(`references/licoes.md:12-17`).

`[OPINIÃO]` Listá-las como "regras universais do Factory Kit" duplica
garantias e cria dois lugares onde a regra pode divergir — exatamente o risco que
a §19.5 da proposta nomeou. Sugiro mantê-las na doc, mas marcadas como
**garantias upstream herdadas**, numa seção separada das regras do processo.

### M-05 — B-02: o princípio já é upstream

**Classificação: MENOR**

`[FATO]` O motor já exige granularidade e penaliza a ausência dela:
`PROVA_FRACA` quando `method === 'exitcode'` (`audit.js:362-371`).

`[OPINIÃO]` A parte universal de B-02 ("o runner precisa produzir granularidade
suficiente") pertence ao upstream. Só a tradução para "docker/psql em vez do
wrapper do Supabase CLI" é do adapter. A decisão está correta; sugiro apenas
marcar a origem para não duplicar.

### M-06 — L-04 não pode nomear o caminho do motor

**Classificação: MENOR**

`[FATO]` `upsertAgentsSection` insere um template estático
(`bin/onp-factory.cjs:62-87`); o addendum nunca sabe onde o motor está. Os
candidatos estão em `templates/onp-factory.config.json:8-12` e são resolvidos em
tempo de execução (`feature-verify.cjs:21-27`).

**Ação sugerida:** a regra deve ser formulada sem caminho: *"Use o script
`feature-verify` do kit. Não chame o motor ONP diretamente para verificar uma
feature."*

### M-07 — L-04, L-05 e I-03 crescem um addendum de 33 linhas

**Classificação: MENOR**

`[FATO]` `templates/AGENTS.addendum.md` tem 33 linhas e é o **único** artefato
lido em toda sessão (`README.md:20`).

`[OPINIÃO]` A proposta §1.3 já diz que racional não entra no addendum. Se
adicionarmos três itens, o racional deve ir para `docs/processo.md` e o addendum
ficar só com o imperativo. Caso contrário, o addendum vira um segundo documento
normativo concorrente.

### M-08 — Sobreposição entre `docs/processo.md` e `docs/adoption.md` não decidida

**Classificação: MENOR**

`[FATO]` `docs/adoption.md` é um procedimento numerado (1..9) que já descreve
gates, fechamento e baseline. Um `docs/processo.md` normativo vai repetir parte
disso.

`[OPINIÃO]` Decidir antes de escrever: `adoption.md` vira "como adotar" (passo a
passo, mantém) e `processo.md` vira "o que é exigido" (normativo, novo), com
`adoption.md` referenciando `processo.md` em vez de reescrever. Sem essa
decisão, o kit ganha duas fontes de verdade para a mesma coisa.

### M-09 — Nenhuma decisão cobre a constituição

**Classificação: MENOR**

`[FATO]` `.spec/constituicao.md` não é verificado pelo `doctor`
(`bin/onp-factory.cjs:151-185` não a menciona) e `CONSTITUICAO_AUSENTE` é apenas
**aviso** (`audit.js:438-443`).

`[FATO]` O projeto de referência tem 2 princípios, e o segundo é
`[RECOMENDADO]` (`constituicao.md:23-26`) — logo violá-lo é aviso, não erro.

`[INFERÊNCIA]` Um projeto adotado pelo kit pode ter zero constituição e passar
`audit --ci` com avisos. Um `docs/processo.md` normativo precisa dizer se
constituição é obrigatória.

### M-10 — Evidência de R-04 é uma única instância, e é visual

**Classificação: MENOR**

`[FATO]` O único caso é T-022 × T-023 sobre o `<h1>` (relatório §4.1).

`[OPINIÃO]` O princípio ("overlap de arquivo não implica independência
semântica") é quase tautológico e o efeito éredutível. **Não rebaixaria**, mas o
documento normativo deveria marcar os casos não-UI como não testados — para não
serem citados como se tivessem lastro.

---

## 4. Decisões que ainda deveriam permanecer experimentais

`[OPINIÃO]` **Concordo com as 6 decisões experimentais** (E-01 a E-06). Nenhuma
delas tem lastro para subir, e o critério que você aplicou (2 features
independentes ou 2 projetos) está correto.

| Decisão | Verificação da minha parte |
|---|---|
| **E-01** ownership como proxy de paralelismo | Confirma o rebaixamento. O plano gerou 2 faixas, a execução foi sequencial, e 4 de 6 tasks já compartilhavam arquivo (`plano-execucao.md:25-28`). |
| **E-02** estabilidade de IDs após referência | Correto. `218b468` só foi seguro porque nenhum teste existia ainda. |
| **E-03** → promovido a R-11 | `[OPINIÃO]` A decisão que traduz E-03 para R-11 está correta, mas cria **duplicação** (R-11 e E-03 dizem a mesma coisa). Para o documento normativo, E-03 deve desaparecer como entrada própria. |
| **E-04** `diagnostico.json` | Correto. O formato nunca foi lido por máquina; só versionado em `62fc9c4`. |
| **E-05** Playwright/`executablePath` | Correto, e é pior que experimental: é observação de ambiente. Não deveria nem aparecer num documento normativo. |
| **E-06** refs cruzadas de AC | Correto, e há um agravante não registrado (ver I-10 abaixo). |

`[INFERÊNCIA]` **I-10 — o acoplamento de ref cruzada é latente e não foi
observado.** `audit.js:294-297` busca a prova **na feature dona do AC**, não na
feature da task:

```text
const owner = acById.get(acId);
const verification = owner? project.verifications[owner.feature.name] || null: null;
if (!proof || proof.status!== 'pass') → TASK_CONCLUIDA_SEM_PROVA
```

`[FATO]` Nenhuma task do projeto de referência usa `Refs:` cruzado — verifiquei
`fundacao-ui`, `refinamento-interface` e `recuperacao-carga`: todas as refs são
da própria feature. As referências a `AC-018`/`AC-040` aparecem em **prosa de
spec** (`refinamento-interface/spec.md:203`; `recuperacao-carga/spec.md:78`).

`[INFERÊNCIA]` Se alguém escrever `Refs: AC-040` numa task de outra feature, essa
task ficará bloqueada até a feature dona re-verificar — e, por R-08, editar
`src/` torna isso provável. O efeito é uma task que não fecha por causa de
código que ela não tocou. É exatamente o tipo de acoplação invisível que o
processo quer evitar, e ninguém mediu.

---

## 5. Lacunas que ainda precisam de decisão

`[OPINIÃO]` Cinco lacunas. As três primeiras são **bloqueantes** para escrever um
`docs/processo.md` pequeno e coerente; as duas últimas são de governance.

| # | Lacuna | Por que bloqueia |
|---|---|---|
| **G-1** | **Done** (Task / Feature / Project Gate) — I-05 | É o critério de encerramento. Sem ele o documento vira lista de regras. R-10 cobre só um eixo. |
| **G-2** | **Lista canônica de gates** com nome, entrada, saída e mecanismo | R-05, R-08, L-04, L-05 e I-03 implicam gates, mas não há lista. `AGENTS.addendum.md:14-19` tem 4 bullets; a proposta §5 tem 9; a decision list não tem nenhum. Um documento normativo precisa de **uma** lista. |
| **G-3** | **Limite de iteração e escalada** | O motor já tem: 3 iterações, depois escalar (`SKILL.md:117-119`, `:251-252`). Nenhuma decisão adotou. Sem isso, o documento não diz o que fazer quando um gate falha repetidamente — que é a situação mais frequente na prática. |
| **G-4** | **Onde a QA visual é registrada** | L-05 diz "deve entrar no contrato". Mas onde? Um novo arquivo por feature é mais superfície. O experimento deixou o registro no **relatório** e no `tasks.md` (commit `62fc9c4`). Decidir se o registro é um artefato nomeado ou parte do relatório de execução. |
| **G-5** | **Relação entre `processo.md` e `adoption.md`** — M-08 | Duas fontes de verdade para o mesmo assunto, ou `adoption.md` passa a ser ponteiro. Decidir antes de escrever evita retrabalho. |

`[OPINIÃO]` Duas observações de escopo sobre as decisões já tomadas:

- **L-08 (baseline) está sub-especificada quanto ao *lugar*.** `[FATO]` O
 enforcement do baseline no experimento não é do kit: é ONP + um teste de
 processo que lê `tasks.md` e falha se algum arquivo declarado faltar
 (`tests/processo/legado-baseline.spec.ts:28-34`), com o AC definido em
 `legado-baseline/spec.md:22-28`. Ou seja: baseline é um **padrão de processo
 expresso em artefatos ONP**, não uma mecanismo do kit. A decisão deveria
 dizer isso, porque a leitura atual ("dependente de segundo projeto") sugere que
 há algo no kit para construir — e não precisa.
- **L-07 é a decisão mais bem fundamentada da lista.** Não apenas correta: o
 motor é *descobierto* (`templates/onp-factory.config.json:7-13`), não
 pertencido, e `design.md:25` diz "não é um fork". Investigar a causa de
 `ID_DUPLICADO` é trabalho upstream, e a proposta §19 L-07 já marcou a causa
 como não determinada.

---

## 6. Contradições com o Factory Kit atual

`[FATO]` Resume: **nenhuma decisão contradiz o `design.md`, o `adoption.md` ou o
`roadmap.md`.** As tensões reais são com o **código** e com o **addendum**.

| ID | Contradição | Gravidade | Onde |
|---|---|---|---|
| **C-01** | B-01 ("nunca produção") não é lida por código nenhum; `resetCommand` executa verbatim | **CRÍTICO** | `templates/onp-factory.config.json:18-19,30-31` vs. `adapters/.../feature-verify.cjs:55-64` |
| **C-02** | L-03 ("status é declarativo") contradiz o acoplamento status→severidade já implementado | **CRÍTICO** | decisão L-03 vs. `audit.js:147-148,200-201,214,237` |
| **I-02** | L-02 ("config é fonte de verdade") é falso para 8 de 12 chaves e 7 de 9 campos de profile | IMPORTANTE | decisão L-02 vs. `onp-factory.config.json:1-33`, `profiles/*.json:1-13` vs. leitura em `feature-verify.cjs:22,55`, `pgtap-verify.cjs:16,64`, `onp-factory.cjs:113,120,122` |
| **I-03** | Proposta §20.1 afirma que o addendum não menciona auditoria antecipada | IMPORTANTE | `docs/processo-proposta.md` §20.1 vs. `templates/AGENTS.addendum.md:8` (dois `Audit`) |
| **M-01** | L-06 (sem política rígida de commit) vs. política do plano gerado | MENOR | decisão L-06 vs. `plano-execucao.md:45` |
| **M-02** | `doctor` verifica 2 de 3 scripts do adapter | MENOR | `bin/onp-factory.cjs:161-162` vs. `:124-131` e `test/cli.test.cjs:29` |
| **M-03** | R-05 exige QA visual "quando perceptível"; o addendum não menciona QA visual | MENOR | decisão R-05 vs. `templates/AGENTS.addendum.md:1-33` — **é** a intenção de L-05, não contradição |
| **M-05** | B-02 (granularidade) já é upstream | MENOR | decisão B-02 vs. `audit.js:362-371` |

`[FATO]` E um achado de higiene do documento que será oficial:

| ID | Item | Onde |
|---|---|---|
| **M-05b** | `Regraderivada` | `processo-proposta.md:20` |
| **M-05c** | `produced by Kilo Code` | `:102` |
| **M-05d** | `de exercise` | `:185` |
| **M-05e** | `stale` (×3), `staleness` | `:636`, `:1360`, `:1373` |

---

## 7. Riscos de overengineering

`[OPINIÃO]` O maior risco não é adicionar; é **duplicar**. `design.md:36-43` e a
§19.5 da proposta já apontaram isso. O que a lista de decisões confirma e o que
acrescento:

| Risco | Estado | Verificação |
|---|---|---|
| **Reimplementar garantias do motor** | **Acontecendo** | R-01, R-08, R-09, R-12 listadas como regras do kit quando são `audit.js`/`licoes.js` (M-04) |
| **Transformar gate humano em comando** | **Evitado** | As decisões mantêm G3/G5/G6/G9 como humanos ao não listá-los. Mas `adoption.md:65` já lista "revisão humana de diff e escopo" como item de Definition of Done — o precedente correto existe |
| **Criar config para QA visual** | **Risco ativo em L-09** | A decisão diz "o processo deve declarar a ferramenta" — sem dizer onde. Se isso virar um bloco `visualQA` em `onp-factory.config.json`, o kit ganha config que ninguém lê (§I-02), isto é, o oposto do ripe. **Recomendação: tool de QA visual fica no `AGENTS.md` do projeto.** |
| **Criar 3º/4º comando de verify (L-01)** | **Risco se mal feito** | `feature-verify.cjs:68` hoje rejeita qualquer argumento extra (`process.argv.length!== 3`). A forma barata é **flag**, não comando novo. Um `verify-renew` separado é o caminho mais curto para o kit virar framework |
| **Mecanizar status (L-03)** | **Risco se mal feito** | Se L-03 for implementado como "declarativo", mexe-se em semântica que hoje é útil. Mecanizar coerência de status é **upstream** |
| **Detector de plano desatualizado (L-02)** | **Bem tratado** | A decisão mantém experimental. Correto: `plano.json` já existe e o mtime de `tasks.md` é sinal disponível — mas uma vez que a decisão é "artefato derivado", aDetector é conveniência, nãonecessidade |
| **Baseline no kit (L-08)** | **Bem tratado** | A decisão mantém dependente de 2º projeto. Acrescento: o enforcement é ONP+teste de processo, então **não há nada a construir no kit** — só a documentar |
| **Template de baseline** | **Não decidido** | `adoption.md:32-34` fala em baseline sem dar caminho, e não há template. `[OPINIÃO]` Isso é uma lacuna real, mas pertence a `adoption.md`, não a V0.2 |

`[OPINIÃO]` Regra de defesa que eu adotaria, para tornar C-01 e I-02 impossíveis de
reincidir: **um campo de config que nenhum código lê é um campo de documentação,
e deve estar marcado como tal — ou ser lido.** Hoje 12 dos 21 campos de
config+profile estão nesse caso, sem marcação.

---

## 8. Recomendação para o próximo passo

`[OPINIÃO]` Não escreva `docs/processo.md` ainda. A lista de decisões tem 2 erros
factuais (C-01, C-02) e 5 lacunas de definição (G-1..G-5) que o documento
normativo teria de resolver **dentro do texto**, misturando decisão nova com
regra vigente. Isso é exatamente o risco que a proposta §19.5 warns contra.

Sequência que recomendo, em três passos de esforço desigual:

**Passo 1 — folha de correções, meia página, antes de qualquer documento.**
Resolver C-01 (B-01 é documental ou enforced?), C-02 (reescrever L-03), I-02
(reescrever L-02), I-01 (reescrever R-06), I-06 (completar R-13), I-08
(ressalva de mtime em R-08). São seis correções de uma ou duas frases cada.
Levar M-01..M-10 como notas de rodapé do documento.

**Passo 2 — fechar as 5 lacunas de definição, como decisões, não como texto.**
G-1 (Done), G-2 (lista de gates), G-3 (3 iterações), G-4 (onde a QA visual é
registrada), G-5 (`processo.md` vs. `adoption.md`). G-3 é a mais barata — o
motor já diz; G-1 e G-2 são as que dão espinha ao documento.

**Passo 3 — só então, `docs/processo.md`.**
Com G-1 e G-2 fechadas, o documento fica pequeno por construção: Done + gates +
as 13 regras. I-03 (nomear G1) e L-04/L-05 (imperativos no addendum) entram
como última edição de template, com o racional no documento e não no addendum
(M-07).

`[OPINIÃO]` **Não fazer agora:** V0.2, adapter novo, baseline no kit, config de
QA visual, detector de plano desatualizado, mexer no motor. `roadmap.md:15-20` já
condiciona V0.2 ao segundo projeto, e essa condição continua válida — o segundo
projeto ainda não aconteceu, e nenhuma destas decisões o substitui.

`[OPINIÃO]` **Umaregisterseção Honesta sobre o método.** Três dos achados mais
úteis desta revisão (C-01, C-02, I-03) vieram de **ler o código do kit** e
**contar quantas vezes cada campo de config é lido**, não de ler a proposta. A
proposta é forte em evidência vinda do projeto de referência e mais fraca em
evidência vinda do kit — porque ela foi escrita para(processo), não para (kit).
`[INFERÊNCIA]` Um próximo ciclo de revisão deveria começar por
`docs/design.md` + código, com a proposta como hipótese a testar, e não o
contrário.

---

## Tabela de classificação

| ID | Decisão analisada | Classificação | Motivo | Ação sugerida |
|---|---|---|---|---|
| **C-01** | B-01 — ambiente descartável, nunca produção | **CRÍTICO** | `allowProductionReset` e `productionDbResetAllowed` não são lidos por nenhum código; `resetCommand` executa verbatim (`feature-verify.cjs:55-64`) | Decidir se é regra *enforced* (checar no adapter) ou *documental* (e reescrever B-01 sem afirmar garantia) |
| **C-02** | L-03 — "status é declarativo" | **CRÍTICO** | O motor já acopla status à severidade: `audit.js:147-148, 200-201, 214, 237`. "Estados finais respeitam os gates" já é verdade para `ASM_ABERTA` | Reescrever L-03: status é semântico; a lacuna é só a direção oposta (status atrasado com prova PASS) |
| **I-01** | R-06 — preferir efeito observável | **IMPORTANTE** | AC-037 escolheu construção deliberadamente (`spec.md:104-105`) e a lacuna foi coberta por R-05, não por R-06 | Reescrever: construção é legítima quando o efeito não é mecanicamente verificável; a lacuna vira responsabilidade de R-05 |
| **I-02** | L-02 — config é fonte de verdade | **IMPORTANTE** | Só 4 de 12 chaves de config e 2 de 9 campos de profile são lidos; `adapter.path` mente (acoplamento real é `__dirname`, `combined-verify.cjs:58`) | Reescrever L-02 com a contagem real; marcar campos não lidos como declarativos |
| **I-03** | Ausência de decisão sobre G1 (Revisão da SPEC) | **IMPORTANTE** | G1 já existe no addendum (`AGENTS.addendum.md:8`, dois `Audit`); a proposta afirma o contrary (§20.1) — erro meu | Adicionar decisão: **nomear** G1 e declará-lo bloqueante, não adicioná-lo |
| **I-04** | Ausência de exigência de que o gate rodou algo | **IMPORTANTE** | `combined-verify.cjs:83` e `pgtap-verify.cjs:49` retornam 0 sem executar nada; o motor já grava `testsParsed` (`verify.js:200`) | Incluir em Done: `exitCode: 0` **e** `testsParsed > 0` **e** todo AC `pass` |
| **I-05** | Ausência de definição de Done | **IMPORTANTE** | É o critério de encerramento; `adoption.md:56-65` só tem a versão de projeto | Incorporar Task/Feature Done da proposta §10 como decisão |
| **I-06** | R-13 — gerado ≠ ownership | **IMPORTANTE** | Perdeu a metade positiva: `inventario.md` é ownership escrito (`fundacao-ui/tasks.md`, T-006) | Acrescentar: o critério é a **origem** (gerado por comando vs. escrito pela task), não a extensão |
| **I-07** | R-11 — `respondida` ≠ `resolvida` | **IMPORTANTE** | O template upstream (`lib/templates/spec.md:53-59`) não tem colunas para "o que falta"; o addendum não comporta guidance | Decidir a casa: template upstream **+** `docs/processo.md`. Não adapter, não projeto |
| **I-08** | R-08 — renovar provas obsoletas | **IMPORTANTE** | O gatilho é mtime (`project.js:99-107` + `audit.js:376-392`), e o plano upstream prescreve worktree/branch (`plano-execucao.md:44-48`) — trocar de branch invalida | Acrescentar ressalva: invalidação é temporal, não de conteúdo; reforça L-01 |
| **I-09** | B-05 — escopo é do Adapter | **IMPORTANTE** | O mesmo `ONP_VERIFY_FEATURE` filtra pgTAP e Vitest (`combined-verify.cjs:58-65, 84`); recortes parciais são inexpressáveis | Não mudar o adapter; declarar o limite no documento normativo |
| **M-01** | L-06 — sem política rígida de commit | **MENOR** | `plano-execucao.md:45` enuncia "1 tarefa = 1 commit" como política do plano | Acrescentar: o plano **recomenda**, o processo não exige |
| **M-02** | — | **MENOR** | `doctor` verifica 2 de 3 scripts do adapter (`onp-factory.cjs:161-162`); `pgtap-verify.cjs` não é checado | Registrar; worsens se L-01 criar um 4º script |
| **M-03** | R-05 — QA visual quando perceptível | **MENOR** | "Perceptível" é indecidível e exclui mudanças só de acessibilidade (o assunto de AC-040) | Gatilho **declarado** na spec, com lista de exemplos |
| **M-04** | R-01, R-08, R-09, R-12 como regras do kit | **MENOR** | As quatro já são garantias mecânicas upstream (`audit.js:44-52, 292-311, 376-392`; `licoes.md:12-17`) | Mover para seção "garantias upstream herdadas", fora das regras do processo |
| **M-05** | B-02 — granularidade é universal | **MENOR** | O motor já exige e pune com `PROVA_FRACA` (`audit.js:362-371`) | Marcar origem; só a tradução docker/psql é do adapter |
| **M-06** | L-04 — proibir verify direto no addendum | **MENOR** | O addendum é estático (`onp-factory.cjs:62-87`) e não conhece o caminho do motor | Formular sem caminho: "use o script `feature-verify` do kit" |
| **M-07** | L-04 + L-05 + I-03 crescendo o addendum | **MENOR** | 33 linhas, lido em toda sessão; §1.3 da proposta diz que racional não entra | Só imperativos no addendum; racional em `processo.md` |
| **M-08** | `processo.md` vs. `adoption.md` | **MENOR** | Sobreposição não decidida; risco de duas fontes de verdade | Decidir: `adoption.md` = como adotar; `processo.md` = o que é exigido |
| **M-09** | Ausência de decisão sobre constituição | **MENOR** | `doctor` não verifica; `CONSTITUICAO_AUSENTE` é aviso (`audit.js:438-443`); `[RECOMENDADO]` não bloqueia | Dizer no documento se constituição é obrigatória |
| **M-10** | R-04 — overlap ≠ independência semântica | **MENOR** | Evidência: 1 instância, e visual (relatório §4.1) | Manter; marcar casos não-UI como não testados |
| **I-10** | E-06 — refs cruzadas de AC | **MENOR** | Acoplamento latente: `audit.js:294-297` busca a prova na feature **dona** do AC; nenhuma task do projeto usou ref cruzada, logo não foi medido | Manter experimental; observar no 2º projeto |
| **R-02** | FV ≠ GR, escopo no Adapter | **NENHUM PROBLEMA** | `verify.js:123-133` confirma que o motor não injeta escopo; filtro está no adapter. Consistente com `design.md:25` | Manter |
| **R-03** | Ownership ≠ obrigação de alterar | **NENHUM PROBLEMA** | `ARQUIVO_ORFAO` exige mapeamento, não mutação (`audit.js:413-435`) | Manter |
| **R-04** | Overlap ≠ independência semântica | **NENHUM PROBLEMA** | Princípio quase tautológico; efeito redutível | Manter, com M-10 |
| **R-09** | Não alterar AC/teste/script para verde | **NENHUM PROBLEMA** | **Melhor que a proposta**: o "apenas" do addendum (`:18`) fica com exceção explícita | Manter |
| **R-10** | Prova ≠ execução | **NENHUM PROBLEMA** | 5 casos divergentes no experimento; a assimetria é comprovada | Manter |
| **R-11** | `respondida` ≠ `resolvida` | **NENHUM PROBLEMA** | Q-015 declara "não sabe-se" explicitamente (`recuperacao-carga/spec.md:157`) | Manter, **com I-07** |
| **R-12** | Lastro para virar regra | **NENHUM PROBLEMA** | `LICAO_SEM_LASTRO` + o caso negativo do relatório §6 | Manter, com M-04 |
| **B-03** | Separar "não duplicar schema" de `begin/rollback` | **NENHUM PROBLEMA** | **Melhor que a proposta**: nomeia o princípio de teste separadamente do detalhe | Manter |
| **B-04** | Seleção de testes por AC | **NENHUM PROBLEMA** | `verify.js:189-193` já padronizou a tag no título | Manter |
| **B-06** | `testTimeout` não é regra do kit | **NENHUM PROBLEMA** | Nenhum template ou profile tem campo de timeout | Manter |
| **B-07** | Identidade por config | **NENHUM PROBLEMA** | Já entregue na V0.1 (`pgtap-verify.cjs:15-22` vs. hardcode no projeto de referência) | Manter |
| **E-01, E-02, E-04, E-05** | Experimentais | **NENHUM PROBLEMA** | Critério de 2 features / 2 projetos está correto; E-05 nem deveria entrar em documento normativo | Manter; retirar E-05 do normativo |
| **E-03** | Promovido a R-11 | **NENHUM PROBLEMA** | Correto, mas duplica R-11 | Fundir em R-11 |
| **L-02** (parcial) | plano-execucao é artefato derivado | **NENHUM PROBLEMA** | Correto e bem fundamentado; detector fica experimental | Manter, com I-02 |
| **L-05** | QA visual no contrato do processo | **NENHUM PROBLEMA** |lacuna real; `adoption.md` e addendum não a mentionam | Manter, com M-03 e G-4 |
| **L-07** | Não mexer na geração de IDs | **NENHUM PROBLEMA** | Motor é *descobierto* (`onp-factory.config.json:7-13`), não pertencido; `design.md:25` | Manter |
| **L-08** | Baseline dependente de 2º projeto | **NENHUM PROBLEMA** | Correto, mas sub-especificado: o enforcement é ONP + teste de processo (`tests/processo/legado-baseline.spec.ts:28-34`), não kit | Acrescentar: **nada a construir no kit**, só documentar |
| **L-09** | Declarar ferramenta de QA visual | **NENHUM PROBLEMA** | Direção correta; **risco** de virar config não lida | Onde: `AGENTS.md` do projeto. **Não** criar bloco `visualQA` |
| **L-01** | Três fluxos oficiais de verify | **NENHUM PROBLEMA** | Formulação está certa; risco é criar 4º script | Flag, não comando novo |
| **L-06** | Sem política rígida de commit | **NENHUM PROBLEMA** | Direção correta | Com M-01 |

---

## Índice de âncoras verificadas

`[FATO]` Todas as afirmações `[FATO]` deste documento remetem a:

**Factory Kit** — `README.md:20,31,45,53` · `docs/design.md:25,27-34,36-43` ·
`docs/adoption.md:32-34,36-38,44-46,56-65,67-69` · `docs/roadmap.md:11-13,15-20` ·
`bin/onp-factory.cjs:56-60,59,62-87,113,120,122,124-131,151-185,161-162` ·
`templates/AGENTS.addendum.md:1-33` (esp. `:8`, `:14-19`) ·
`templates/onp-factory.config.json:1-33` (esp. `:7-13,18-19,21-27,28-32`) ·
`templates/onpspec.config.json:1-25` · `profiles/node-vitest-supabase.profile.json:1-13` ·
`adapters/node-vitest-supabase/feature-verify.cjs:21-27,29-34,36-52,55,55-64,68,80-85` ·
`adapters/node-vitest-supabase/combined-verify.cjs:7,27-55,58,58-65,83,84,96-104` ·
`adapters/node-vitest-supabase/pgtap-verify.cjs:15-22,16,34-55,49,57-64` ·
`test/cli.test.cjs:18-31,29,33-43,45-55` · `package.json:1-17`

**Projeto de referência** — `docs/relatorio-execucao-sessao-onp.md` §1, §2, §4, §6,
§8, §11, §12 · `docs/auditoria-visual-estabilizada.md:1-9,94-111` ·
`docs/diagnostico-final.md:69-72` · `AGENTS.md:20,22-46` · `onpspec.config.json:2` ·
`scripts/onp-combined-verify.cjs:6,57-78` · `scripts/onp-pgtap-verify.cjs:1-7,24` ·
`scripts/onp-feature-verify.cjs:24-67,48` ·
`.spec/constituicao.md:15-26` · `.spec/licoes.json` · `.spec/LICOES.md` ·
`.spec/verification/sinais.json` ·
`.spec/features/refinamento-interface/spec.md:52,104-105,113,135-140,203,217-219` ·
`.spec/features/refinamento-interface/tasks.md:5-20,24-51` ·
`.spec/features/refinamento-interface/inventario.md` ·
`.spec/features/refinamento-interface/plano-execucao.md:8,15,25-28,40,44-48` ·
`.spec/features/recuperacao-carga/spec.md:78,157` ·
`.spec/features/legado-baseline/spec.md:22-28` ·
`.spec/features/legado-baseline/tasks.md:5` ·
`.spec/features/fundacao-ui/tasks.md` (T-006, T-011) ·
`tests/processo/legado-baseline.spec.ts:28-34` · `supabase/tests/` (14 arquivos) ·
`vitest.config.ts:11` · `package.json` (sem `playwright`) · `git log` (`46ecdcf`
… `55277ff`, `218b468`, `62fc9c4`, `8759338`)

**Motor ONP upstream (cópia vendorizada no projeto de referência)** —
`scripts/lib/src/core/audit.js:16,44-52,147-148,154,164,200-201,214,237,283-286,292-311,294-297,362-371,376-392,413-435,438-443,556-560,582-584` ·
`scripts/lib/src/core/verify.js:5,17-19,123-133,164-186,189-193,195-210,200,62-86` ·
`scripts/lib/src/core/project.js:98-107` ·
`scripts/lib/src/cli.js:300-330,315-327` · `scripts/lib/src/parsers/tasks.js:13-19,36-50,86-95` ·
`scripts/lib/templates/spec.md:53-59` · `SKILL.md:105-106,117-119,138-140,169-188,232-236,248-252,269-300,325-329` ·
`references/fluxo.md:56-60,100-134` · `references/escrevendo-specs.md:64-70,72-83` ·
`references/licoes.md:5-17,27-42,68-78`
