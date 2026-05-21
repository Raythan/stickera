# Fase 6 — Portfolio e release

> **SDD:** specs: [PRODUCT.md](../PRODUCT.md) acceptance criteria. Validação final: [SPEC-VALIDATION.md](../SPEC-VALIDATION.md) §1–§6.

## Objetivo

MVP publicável como vitrine profissional: About, branding, PWA instalável via GitHub Pages.

## Pré-requisitos

- Fases 0–5 gates
- `app-config.signature` com dados reais

## Artefatos

| Item | Padrão |
|------|--------|
| `AboutTemplate` + `SignatureBlock` | links GitHub/LinkedIn, tagline i18n, avatar opcional |
| `app/about.tsx` | rota |
| Ícone / splash | assets em `assets/` — identidade visual consistente com theme |
| README raiz | como rodar, sync content, créditos |
| PWA manifest | `public/manifest.webmanifest` com ícones corretos |

## Conteúdo CDN

- `content/` publicado GitHub Pages
- `EXPO_PUBLIC_CONTENT_BASE_URL` apontando produção

## Checklist de saída (MVP completo)

- [ ] PRODUCT acceptance criteria met
- [ ] PWA instala via "Add to Home Screen" em mobile
- [ ] Offline-capable (service worker + localStorage)
- [ ] Pack + trade + i18n + about
- [ ] Sem backend de app
- [ ] Portfólio: nome e links corretos na About

## Anti-padrões

- About vazia ou com placeholder "Your Name" em produção
- Publicar sem `catalog.version` coerente

## Pós-MVP (fora do cerco atual)

- Push notifications cooldown
- Mais locales além pt
- App nativo via EAS (se demanda justificar)
