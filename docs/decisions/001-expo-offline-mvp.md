# ADR-001: Expo offline-first sem backend

- **Status:** accepted
- **Data:** 2026-05-21

## Contexto

MVP gratuito, instalável, assets estáticos, troca local — sem custo de servidor.

## Decisão

React Native via **Expo + Expo Router**, persistência **SQLite**, conteúdo **JSON estático** em Netlify/GitHub Pages, troca **P2P** via QR/share.

## Alternativas consideradas

1. **Flutter** — bom offline; time JS alinhado a Expo + SDD em docs.
2. **Firebase** — sync fácil; viola “sem backend” e custo.
3. **PWA only** — não atende “instalável” nativo com mesma UX de álbum.

## Consequências

- Positivas: deploy de figurinhas sem loja; OTA JS possível.
- Negativas: troca sem servidor exige confirmação em dois dispositivos; anti-cheat inexistente.

## Referências

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [TRADING-P2P.md](../TRADING-P2P.md)
