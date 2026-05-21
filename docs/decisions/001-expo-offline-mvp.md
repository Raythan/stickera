# ADR-001: PWA offline-first sem backend

- **Status:** accepted (updated 2026-05-21)
- **Data:** 2026-05-21

## Contexto

MVP gratuito, instalável via "Add to Home Screen", assets estáticos, troca local — sem custo de servidor.

## Decisão

PWA estática via **Expo (web export) + Expo Router**, persistência **localStorage**, conteúdo **JSON estático** em GitHub Pages, troca **P2P** via QR/share.

## Alternativas consideradas

1. **Flutter** — bom offline; time JS alinhado a Expo + SDD em docs.
2. **Firebase** — sync fácil; viola "sem backend" e custo.
3. **App nativo (EAS/Store)** — complexidade desnecessária; PWA atende o portfolio MVP.
4. **expo-sqlite** — módulo nativo não disponível em export estático web; localStorage é suficiente para o volume de dados do MVP.

## Consequências

- Positivas: deploy de figurinhas sem loja; zero infra; funciona em qualquer navegador mobile moderno.
- Negativas: troca sem servidor exige confirmação em dois dispositivos; limite de ~5 MB no localStorage (suficiente para MVP); sem anti-cheat.

## Referências

- [ARCHITECTURE.md](../ARCHITECTURE.md)
- [TRADING-P2P.md](../TRADING-P2P.md)
