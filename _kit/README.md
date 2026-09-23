# ONP Factory Kit

Camada reutilizável para aplicar um processo spec-driven em projetos assistidos por IA, separando processo, adapter e contexto do projeto.

## V0.1

Perfil suportado:

`node-vitest-supabase`

A V0.1 foi extraída do fluxo validado no `salao-beleza-sistema` e **não copia nem modifica o motor upstream do ONP**.

## Uso

```bash
node bin/onp-factory.cjs init ../meu-projeto --profile node-vitest-supabase
node bin/onp-factory.cjs doctor ../meu-projeto
```

O `init` é conservador e preserva arquivos existentes por padrão. O bloco do Factory no `AGENTS.md` usa marcadores para poder ser atualizado futuramente sem reescrever o restante do arquivo.

## O que o kit coloca no projeto

```text
onp-factory.config.json
onpspec.config.json
.onp-factory/scripts/
AGENTS.md (bloco ONP Factory)
```

O projeto continua dono do código, SPECs, testes e contexto. O motor ONP é uma dependência separada localizada por configuração.

## Gates

```text
Feature Verify ≠ Global Regression
```

No perfil Supabase:

- Feature Verify com pgTAP → `db reset` local descartável → Verify do ONP;
- Feature Verify sem pgTAP → sem reset;
- Global Regression → pgTAP + Vitest completos.

Nunca execute o reset contra produção.

## Arquitetura

Veja [docs/design.md](docs/design.md) e [docs/adoption.md](docs/adoption.md).

## Validação da V0.1

O próximo teste obrigatório é aplicar este kit em um **segundo projeto real**. Só depois desse ensaio a interface deve ser congelada para uma possível V0.2/npm.
