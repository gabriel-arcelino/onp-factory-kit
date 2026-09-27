<!-- ONP-FACTORY:BEGIN -->
## ONP Factory — Regras de execução

Este projeto usa a camada ONP Factory para desenvolvimento assistido por IA.
Norma completa de Done e Gates no repositório do kit: `docs/done-e-gates.md`.

### Fluxo

`G0 Escopo → G1 SPEC Review → G2 Test/Evidence Design → Tasks → Implementação → G3 Feature Verify → G4 QA Funcional [se aplicável] → G5 QA Visual [se aplicável] → G6 Diff/Scope Review → G8 Audit → Feature Done`

Na entrega: features incluídas Done → G7 Global Regression → G6 Diff/Scope Review → G8 Audit → Project Gate.

Cada critério de aceite precisa de uma prova automatizada. Teste skipped/ignored não prova um AC.

### Gates

| Gate | Aplicação |
|---|---|
| G0 — Escopo da Entrega | por entrega; artefato `.spec/releases/<id>.md` |
| G1 — SPEC Review | por feature, antes do código |
| G2 — Test/Evidence Design | por feature, antes do código |
| G3 — Feature Verify | por feature |
| G4 — QA Funcional | condicional |
| G5 — QA Visual | condicional: quando a mudança for perceptível |
| G6 — Diff/Scope Review | feature e entrega |
| G7 — Global Regression | por entrega |
| G8 — Audit | por feature e por entrega |

Estados: **PASS** · **FAIL** · **BLOCKED** (obrigatório e não executado) · **N/A** (condicional, com justificativa registrada).

### Regras

- **Gate obrigatório não executado é BLOCKED, nunca PASS.** "Não consegui executar" não é PASS, por ausência de resultado.
- **PASS não é Done.** PASS é estado da prova; Done é estado do trabalho.
- **Feature Verify** (G3) prova somente a feature solicitada. **Global Regression** (G7) executa a suíte completa. Não confunda os dois.
- Para verificar uma feature, use o script `feature-verify` do kit. Não chame o motor ONP diretamente: o escopo do gate é do adapter.
- `Refs:` apontando para AC de outra feature cria dependência de **evidência**, não de status: basta prova PASS válida daquele AC, a feature dona não precisa estar Done.
- Features com pgTAP usam banco local descartável preparado por `npx supabase db reset` antes do Feature Verify.
- Nunca usar `db reset` contra produção.
- Não alterar ACs, testes ou scripts de verificação apenas para transformar resultado vermelho em verde.
- Mudança de contrato, risco de segurança/integridade ou falha desconhecida exige diagnóstico antes de continuar.

### Comandos

```bash
node .onp-factory/scripts/feature-verify.cjs <feature>
node .onp-factory/scripts/combined-verify.cjs
```

O segundo é a regressão global (G7). Para a auditoria, use o comando `audit --ci` do motor ONP (G8).

### Contexto

Antes de editar código, consulte a SPEC e o contexto atual do projeto. Não trate memória da conversa como fonte de verdade quando os arquivos atuais puderem ser consultados.
<!-- ONP-FACTORY:END -->
