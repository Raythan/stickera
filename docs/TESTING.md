# Testes

> **SDD:** testes provam conformidade com specs. Validação domain: [SPEC-VALIDATION.md](SPEC-VALIDATION.md) §5. Handoff: [SESSION-PROTOCOL.md](SESSION-PROTOCOL.md).

Política mínima para MVP — testes provam conformidade com specs.

## Pirâmide

| Camada | O quê | Ferramenta | Obrigatório MVP |
|--------|-------|------------|-----------------|
| Domain | RNG, trade, cooldown, validators | Jest | **Sim** |
| Services | Repos localStorage (integração leve) | Jest + mock storage | Opcional fase 2 |
| Components | Atoms estáveis | RTL opcional | Não no MVP inicial |
| E2E | Fluxos completos | Manual checklist | Sim (humano) |

## O que testar (domain)

- `drawStickers` — sem IDs repetidos; erro se `count > pool.length`
- `nextAvailableAt` — hours/minutes/seconds
- `buildPool` — só álbuns habilitados; pesos
- `validateTradePayload` / `applyTrade` — quantidades, expiração
- Zod schemas vs fixtures em `content/` e `docs/schemas/`

## O que não testar no MVP

- Snapshot de toda árvore UI
- Fetch real ao Netlify em CI (usar fixtures locais)

## Comandos

```bash
npm test              # Jest unit
npm run test:watch    # desenvolvimento
```

Incluídos em `npm run validate` quando app existir.

## Fixtures

```
src/domain/__fixtures__/
  catalog.min.json
  collection.sample.json
  trade-payload.valid.json
```

## Cobertura

Sem meta rígida no MVP. Exigir testes **ao alterar** módulos domain listados acima.

## SDD / agente

Antes de marcar feature domain como feita:

- Testes passam para comportamento descrito em DATA-MODEL / TRADING-P2P / PRODUCT
- Reportar no handoff (SESSION-PROTOCOL) com referência à spec §
