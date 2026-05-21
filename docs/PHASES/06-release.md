# Fase 6 — Portfolio e release

> **SDD:** specs: [PRODUCT.md](../PRODUCT.md) acceptance criteria. Validação final: [SPEC-VALIDATION.md](../SPEC-VALIDATION.md) §1–§6.

## Objetivo

MVP publicável como vitrine profissional: About, branding, build instalável.

## Pré-requisitos

- Fases 0–5 gates
- `app-config.signature` com dados reais

## Artefatos

| Item | Padrão |
|------|--------|
| `AboutTemplate` + `SignatureBlock` | links GitHub/LinkedIn, tagline i18n, avatar opcional |
| `app/about.tsx` | rota |
| Ícone / splash | assets em `assets/` — identidade visual consistente com theme |
| README raiz | como instalar, sync content, créditos |
| Build | EAS ou build local documentado |

## Conteúdo CDN

- `content/` publicado Netlify/GitHub Pages
- `EXPO_PUBLIC_CONTENT_BASE_URL` apontando produção

## Checklist de saída (MVP completo)

- [ ] PRODUCT acceptance criteria ✅
- [ ] App instala em Android e roda no iOS sim/device
- [ ] Offline first launch
- [ ] Pack + trade + i18n + about
- [ ] Sem backend de app
- [ ] Portfólio: nome e links corretos na About

## Anti-padrões

- About vazia ou com placeholder “Your Name” em produção
- Publicar sem `catalog.version` coerente

## Pós-MVP (fora do cerco atual)

- Push notifications cooldown
- OTA EAS Update
- Mais locales além pt
- Validação automatizada opcional alinhada a SPEC-VALIDATION
