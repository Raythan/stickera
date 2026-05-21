# Álbum exemplo — Copa do Mundo 2026

Estrutura padrão Stickera:

| Arquivo | Descrição |
|---------|-----------|
| `frame.css` | Moldura do álbum (`.sticker-frame` + `.sticker-art`) |
| `album.json` | Manifest: figurinhas, `nameKey`, caminhos das imagens |
| `stickers/` | Artes: `01-neymar.jpeg`, etc. |

Para adicionar figurinhas: coloque a imagem em `stickers/`, registre em `album.json`, adicione chaves em `src/i18n/locales/en.json` e `pt.json`, e aumente `revision` + `catalog.version`.
