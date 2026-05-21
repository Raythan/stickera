# Stickera

Álbum de figurinhas mobile — offline-first, instalável, sem backend. Conteúdo em `content/` + CDN (Netlify/GitHub). MVP portfolio com UI atomizada e i18n.

## Metodologia: Spec Driven Development (SDD)

**Specs primeiro, código depois.** Sem MCP no projeto.

| Doc | Função |
|-----|--------|
| [docs/DOCS-INDEX.md](docs/DOCS-INDEX.md) | **Índice completo** |
| [docs/SDD-DEVELOPMENT.md](docs/SDD-DEVELOPMENT.md) | Metodologia SDD |
| [docs/DEVELOPMENT-STANDARDS.md](docs/DEVELOPMENT-STANDARDS.md) | Padrões de todas as fases |
| [docs/SPEC-VALIDATION.md](docs/SPEC-VALIDATION.md) | Checklists vs specs |
| [docs/SESSION-PROTOCOL.md](docs/SESSION-PROTOCOL.md) | Protocolo de sessão |
| [docs/CURSOR-GOVERNANCE.md](docs/CURSOR-GOVERNANCE.md) | Rules, skills, `.cursorrules` |

## Produto e arquitetura

| Doc | Função |
|-----|--------|
| [docs/PRODUCT.md](docs/PRODUCT.md) | Visão e MVP |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack e camadas |
| [docs/ATOMIC-DESIGN.md](docs/ATOMIC-DESIGN.md) | UI atomizada |
| [docs/DATA-MODEL.md](docs/DATA-MODEL.md) | SQLite e domínio |
| [docs/CONTENT-SYNC.md](docs/CONTENT-SYNC.md) | CDN e manifests |
| [docs/I18N.md](docs/I18N.md) | en + pt |
| [docs/TRADING-P2P.md](docs/TRADING-P2P.md) | Troca sem servidor |
| [docs/schemas/](docs/schemas/) | Contratos JSON |
| [docs/PHASES/](docs/PHASES/) | Gates por fase |
| [docs/MVP-CHECKLIST.md](docs/MVP-CHECKLIST.md) | Checklist |

## Cursor

- `.cursorrules` — regras globais SDD  
- `.cursor/rules/` — 8 rules  
- `.cursor/skills/` — 4 skills com `reference.md`  
- [AGENTS.md](AGENTS.md) — entrada para agentes  

## Conteúdo — molduras CSS por álbum

Cada álbum em `content/albums/{id}/` tem `frame.css` (molde) e `stickers/` para artes (png, jpg, jpeg, gif). Ver [docs/STICKER-FRAMES.md](docs/STICKER-FRAMES.md).

## PWA no celular (GitHub Pages)

**https://raythan.github.io/stickera/** — abra no navegador do telefone e use **Adicionar à tela inicial**. Sem Expo Go e sem estar na mesma rede do notebook.

Deploy automático: push em `main` → workflow [deploy-github-pages.yml](.github/workflows/deploy-github-pages.yml). Detalhes: [docs/DEPLOY-CONTENT.md](docs/DEPLOY-CONTENT.md).

## Desenvolvimento nativo (opcional)

```bash
npm install
npm start
```

`prestart` copia `content/` → `assets/content/`. Build web/PWA: `npm run build:web`.

## Validação

```bash
npm run validate   # estrutura, content, i18n, bundle
npm test
```

## Status

Fases 1–2 em progresso no código; checklist: [docs/MVP-CHECKLIST.md](docs/MVP-CHECKLIST.md).
