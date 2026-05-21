# Stickera

Álbum de figurinhas PWA — offline-capable, instalável via navegador, sem backend. Conteúdo em `content/` + GitHub Pages. MVP portfolio com UI atomizada e i18n.

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
| [docs/DATA-MODEL.md](docs/DATA-MODEL.md) | localStorage e domínio |
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

## PWA (GitHub Pages)

**https://raythan.github.io/stickera/** — abra no navegador do telefone e use **Adicionar à tela inicial**.

Deploy automático: push em `main` → workflow [deploy-github-pages.yml](.github/workflows/deploy-github-pages.yml). Detalhes: [docs/DEPLOY-CONTENT.md](docs/DEPLOY-CONTENT.md).

## Desenvolvimento

```bash
npm install
cp .env.example .env   # opcional: EXPO_PUBLIC_CONTENT_BASE_URL
npm start
```

`prestart` copia `content/` → `assets/content/` e gera ícones PWA. Build para deploy: `npm run build:web`.

Variável opcional para sync remoto em produção:

```bash
EXPO_PUBLIC_CONTENT_BASE_URL=https://raythan.github.io/stickera
```

## Validação

```bash
npm run validate   # estrutura, content, i18n, bundle
npm test
npx tsc --noEmit
```

## Testar MVP (manual)

1. Abra o PWA no telefone e use **Adicionar à tela inicial**.
2. **Settings** → sincronizar álbuns (online).
3. **Pack** → abrir pacotes até ter figurinha com quantidade ≥ 2.
4. **Settings** → **Trocar repetidas** → criar oferta → copiar payload.
5. Segunda aba/dispositivo → colar em **Aceitar** → confirmar.
6. Volte ao iniciador → **Confirmar troca recebida** no hub de trade.
7. **About** → assinatura (Raythan / GitHub).

## Status

MVP Fases 0–6 concluídas; checklist: [docs/MVP-CHECKLIST.md](docs/MVP-CHECKLIST.md).
