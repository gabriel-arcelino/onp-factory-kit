<!-- ONP-FACTORY:BEGIN -->
## ONP Factory — Regras de execução

Este projeto usa a camada ONP Factory para desenvolvimento assistido por IA.

### Fluxo

`Discovery → SPEC → AC → Teste → Audit → Tasks → Implementação → Verify → Audit → Regressão → Build/Lint → revisão humana`

Cada critério de aceite precisa de uma prova automatizada. Teste skipped/ignored não prova um AC.

### Gates

- **Feature Verify** prova somente a feature solicitada.
- **Global Regression** executa a suíte completa.
- Features com pgTAP usam banco local descartável preparado por `npx supabase db reset` antes do Feature Verify.
- Nunca usar `db reset` contra produção.
- Não alterar ACs, testes ou scripts de verificação apenas para transformar resultado vermelho em verde.
- Mudança de contrato, risco de segurança/integridade ou falha desconhecida exige diagnóstico antes de continuar.

### Comandos

```bash
node .onp-factory/scripts/feature-verify.cjs <feature>
node .onp-factory/scripts/combined-verify.cjs
```

O segundo comando é a regressão global. Não confunda os dois gates.

### Contexto

Antes de editar código, consulte a SPEC e o contexto atual do projeto. Não trate memória da conversa como fonte de verdade quando os arquivos atuais puderem ser consultados.
<!-- ONP-FACTORY:END -->
