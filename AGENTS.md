# Stickera — Agent guide (SDD)

**Spec Driven Development:** leia as specs antes de escrever código. Este repo **não usa MCP**.

## Leitura obrigatória

| Ordem | Documento |
|-------|-----------|
| 1 | Este arquivo |
| 2 | [docs/SDD-DEVELOPMENT.md](docs/SDD-DEVELOPMENT.md) |
| 3 | [docs/DEVELOPMENT-STANDARDS.md](docs/DEVELOPMENT-STANDARDS.md) |
| 4 | [docs/PHASES/](docs/PHASES/) (fase atual) |
| 5 | Spec da tarefa (tabela abaixo) |
| 6 | [docs/SPEC-VALIDATION.md](docs/SPEC-VALIDATION.md) antes de “pronto” |

## Produto (uma frase)

Álbum de figurinhas PWA, offline-capable, pacotes temporizados, troca P2P de repetidas, conteúdo estático — sem backend.

## Tarefa → specs

| Tarefa | Specs |
|--------|-------|
| Qualquer código | ARCHITECTURE |
| UI | ATOMIC-DESIGN + FILE-TEMPLATES |
| Textos | I18N |
| Álbuns/CDN | CONTENT-SYNC + schemas |
| Pacotes | PRODUCT + DATA-MODEL + PHASES/04 |
| Troca | TRADING-P2P + trade-payload.schema |
| Conteúdo JSON | CONTENT-SYNC + schemas + I18N |
| Processo / fase | SDD-DEVELOPMENT + MVP-CHECKLIST + PHASES |
| Cursor rules/skills | CURSOR-GOVERNANCE |

## Skills

| Skill | Uso |
|-------|-----|
| `stickera-sdd-session` | Início de sessão, gates, spec drift |
| `stickera-feature` | Features de app |
| `stickera-atomic-component` | Componentes UI |
| `stickera-content-bundle` | `content/` e locales |

## Restrições

1. Sem backend MVP  
2. Spec antes de código; sem spec drift  
3. Atomic UI; i18n en+pt  
4. Ordem: domain → services → features → components → app  
5. Commits só quando o usuário pedir  
6. **Não** adicionar MCP ao projeto  

## Stack (ADR-001)

Expo (web export) + Expo Router + TypeScript + Zustand + localStorage + i18next.

## Pastas (após scaffold)

Ver [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) e [docs/PHASES/01-scaffold.md](docs/PHASES/01-scaffold.md).

## Governança Cursor

[docs/CURSOR-GOVERNANCE.md](docs/CURSOR-GOVERNANCE.md) · `.cursorrules` · `.cursor/rules/`
