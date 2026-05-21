# Padrões de código

> **SDD:** spec de implementação. Aplica-se após scaffold Expo (Phase 1+). Processo: [SDD-DEVELOPMENT.md](SDD-DEVELOPMENT.md).

Aplicam-se após scaffold Expo. Rules espelham isto em `.cursor/rules/`.

## TypeScript

- `strict: true` em `tsconfig.json`
- Preferir `type` para props de componentes; `interface` para contratos de serviços/repos
- Proibido `any`; usar `unknown` + narrow
- Enums: preferir union string `type Rarity = 'common' | 'rare' | 'legendary'`

## Imports

```typescript
// Ordem: externo → alias @/ → relativo
import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/atoms/Button';
import { drawStickers } from '@/domain/pack/drawStickers';

import type { StickerCardProps } from './StickerCard.types';
```

- Alias `@/` → `src/` (configurar em `tsconfig` + babel)
- **Nunca** importar `app/` desde `src/`
- **Nunca** importar organism em atom

## Nomenclatura

| Artefato | Padrão | Exemplo |
|----------|--------|---------|
| Componente | PascalCase | `StickerCard` |
| Hook | camelCase `use` | `usePackTimer` |
| Arquivo componente | = nome pasta | `StickerCard/StickerCard.tsx` |
| Feature pasta | kebab ou camel singular | `features/packs/` |
| Domain função | verbo | `drawStickers`, `applyTrade` |
| Service | substantivo + Service/Repository | `PackTimerService` |
| Constantes | UPPER_SNAKE | `MAX_STICKERS_PER_PACK` |
| i18n key | dot.notation | `screens.pack.openButton` |
| Rota Expo | kebab em path | `app/trade/accept.tsx` |

## React / RN

- Componentes funcionais apenas
- Um componente exportado por arquivo principal
- Estilos: `StyleSheet.create` colado no arquivo do componente ou `*.styles.ts` no mesmo folder
- Listas longas: `FlashList` quando > 20 itens (adrão futuro; documentar em ADR)

## Estado

| Dado | Onde |
|------|------|
| Coleção, cooldown, settings | localStorage via repositories |
| Modal aberto, fila reveal | Zustand `uiStore` |
| Derivable (pode abrir pack?) | selector no hook, não duplicar em Zustand |

## Erros

- Domain: retornar `Result<T, E>` ou throw tipado — **consistente por módulo**
- UI: mensagem via i18n `errors.*`
- Services: log em dev (`__DEV__`), nunca logar payload de trade em produção

## Comentários

- Só lógica não óbvia (RNG, trade assimetria)
- Sem comentários que repetem o código

## Git

- Conventional Commits: `feat(pack):`, `fix(trade):`, `docs:`, `chore:`
- Um assunto por commit
- Não commitar `.env`, `dist/`, credenciais

## PR (quando usar)

Título = commit principal. Corpo:

```markdown
## Summary
- ...

## Validação
- [ ] npm run validate

## MVP phase
Phase N
```
