# Fase 1 — Scaffold Expo e design system

## Objetivo

Projeto compilável com navegação, tema, i18n estruturado e **átomos** base — sem features de negócio.

## Pré-requisitos

- Fase 0 gate completo
- Node 18+, conta Expo opcional

## Comando de scaffold (quando autorizado)

```bash
npx create-expo-app@latest . --template tabs
# Ajustar para Expo Router conforme ARCHITECTURE.md
```

Migrar para estrutura em `docs/ARCHITECTURE.md` (pastas `src/`).

## Artefatos obrigatórios

| Artefato | Caminho |
|----------|---------|
| Rotas shell | `app/_layout.tsx`, `app/index.tsx` |
| Tema | `src/theme/colors.ts`, `spacing.ts`, `typography.ts` |
| i18n | `src/i18n/index.ts`, `locales/en.json`, `pt.json` |
| Átomos | `Button`, `Text`, `Image`, `Icon`, `Badge` |
| Templates | `ScreenTemplate` |
| Env | `.env.example` com `EXPO_PUBLIC_*` |

## Skills

- `stickera-atomic-component`
- `stickera-sdd-session`

## Rules

- Todas always + `atomic-components`, `coding-standards`, `i18n`

## Padrões

### Dependências permitidas (MVP)

- `expo`, `expo-router`, `react-native`
- `i18next`, `react-i18next`, `expo-localization`
- `zustand` (store vazio ok)
- `typescript`, eslint, prettier

### Proibido nesta fase

- `expo-sqlite` (fase 2)
- Lógica de pack/trade
- Telas completas de álbum

### i18n mínimo

Chaves obrigatórias antes de sair da fase 1:

```
screens.home.title
nav.languageMenu
nav.themeMenu
screens.settings.themeLight|Dark|Bloom|Ocean
screens.about.title
common.loading
common.error
```

PT espelhado 1:1.

### Átomos — critérios de aceite

| Atom | Variantes | A11y |
|------|-----------|------|
| Button | primary, secondary, ghost; sm, md | `accessibilityRole`, label |
| Text | h1, body, caption | — |
| Image | placeholder, error | `accessibilityLabel` via prop |

## Checklist de saída

- [ ] `npx expo start` abre sem erro
- [ ] Pastas `src/components/atoms` … `templates` existem
- [ ] `tsconfig` paths `@/*` → `src/*`
- [ ] EN + PT com chaves mínimas acima
- [ ] Nenhuma string hardcoded em `app/` (usar `t()`)
- [ ] `ScreenTemplate` usado em ≥ 2 rotas placeholder
- [ ] ADR se desviar do template create-expo-app

## Anti-padrões

- Monólito `app/index.tsx` com 500 linhas
- Cores hardcoded fora de `theme`
- Pular átomos e estilizar Pressable direto na page

## Próxima fase

[02-persistence.md](02-persistence.md)
