#!/usr/bin/env python3
"""Baixa imagens por termo (DuckDuckGo Images) no diretorio atual a partir do arquivo imgdl_file_content.txt.

Uso:
  python imgdl_from_file.py "3|4|5"
  python imgdl_from_file.py "5"                     # 5 imagens para CADA termo do arquivo
  python imgdl_from_file.py "5" 1.5 10              # delay download 1.5s, busca 10s

O arquivo 'imgdl_file_content.txt' deve estar na mesma pasta deste script e conter um termo por linha.
Quantidades: um unico numero -> vale para todos; varios -> um por termo (; ou |).
Arquivos ja existentes (ex.: Abacate_03.jpg) sao pulados - pode rodar de novo apos rate limit.

Dependencia (recomendado):
  pip install -U ddgs requests

Legado (aviso de rename):
  pip install duckduckgo-search requests
"""
from __future__ import annotations

import re
import sys
import time
from pathlib import Path
from urllib.parse import urlparse

import requests

# Pausa entre downloads HTTP
DEFAULT_DOWNLOAD_DELAY_SEC = 1.25
# Pausa antes de cada busca na API (DDG limita rápido; listas grandes precisam mais)
DEFAULT_SEARCH_DELAY_SEC = 8.0
SEARCH_BUFFER_MULT = 3
MAX_RATE_LIMIT_RETRIES = 6
RATE_LIMIT_BASE_WAIT_SEC = 45

_SPLIT_RE = re.compile(r"[;|]+")
_IMAGE_SUFFIXES = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}


def _load_ddgs():
    """Prefer pacote novo `ddgs`; fallback para duckduckgo_search."""
    try:
        from ddgs import DDGS
        from ddgs.exceptions import RatelimitException

        return DDGS, RatelimitException, "ddgs"
    except ImportError:
        pass
    try:
        from duckduckgo_search import DDGS
        from duckduckgo_search.exceptions import RatelimitException

        return DDGS, RatelimitException, "duckduckgo_search"
    except ImportError as e:
        raise SystemExit(
            "Instale: pip install -U ddgs requests\n"
            "(ou: pip install duckduckgo-search requests)"
        ) from e


DDGS, RatelimitException, _DDGS_PKG = _load_ddgs()


def split_list(arg: str) -> list[str]:
    return [p.strip() for p in _SPLIT_RE.split(arg.strip()) if p.strip()]


def load_terms_from_file() -> list[str]:
    file_path = Path(__file__).parent / "imgdl_file_content.txt"
    if not file_path.exists():
        raise SystemExit(f"Erro: O arquivo '{file_path}' não foi encontrado.")
    
    with open(file_path, "r", encoding="utf-8") as f:
        terms = [line.strip() for line in f if line.strip()]
        
    if not terms:
        raise SystemExit(f"Erro: O arquivo '{file_path}' está vazio ou não contém termos.")
    return terms


def parse_counts(counts_arg: str, n_terms: int) -> list[int]:
    parts = split_list(counts_arg)
    if not parts:
        raise SystemExit('Informe quantidades, ex.: "5" (todos) ou "3|4|5" / "3;4;5".')
    if len(parts) == 1:
        n = int(parts[0])
        return [n] * n_terms
    nums = [int(p) for p in parts]
    while len(nums) < n_terms:
        nums.append(nums[-1])
    return nums[:n_terms]


def default_search_delay(n_terms: int, download_delay: float) -> float:
    if n_terms >= 40:
        return max(15.0, download_delay * 6)
    if n_terms >= 15:
        return max(12.0, download_delay * 5)
    if n_terms >= 5:
        return max(DEFAULT_SEARCH_DELAY_SEC, download_delay * 4)
    return max(6.0, download_delay * 3)


def safe_name(term: str) -> str:
    s = re.sub(r"[^\w\-]+", "_", term.strip(), flags=re.UNICODE)
    return s.strip("_") or "termo"


def guess_ext(url: str, content_type: str) -> str:
    ext = Path(urlparse(url).path).suffix.lower()
    if ext in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}:
        return ext
    ct = content_type.lower()
    if "jpeg" in ct or "jpg" in ct:
        return ".jpg"
    if "png" in ct:
        return ".png"
    if "webp" in ct:
        return ".webp"
    if "gif" in ct:
        return ".gif"
    return ".jpg"


def download_url(url: str, dest: Path, timeout: int = 30) -> bool:
    try:
        r = requests.get(
            url,
            timeout=timeout,
            headers={"User-Agent": "Mozilla/5.0 (compatible; imgdl/1.0)"},
        )
        r.raise_for_status()
        ext = guess_ext(url, r.headers.get("content-type", ""))
        if dest.suffix.lower() not in {".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp"}:
            dest = dest.with_suffix(ext)
        dest.write_bytes(r.content)
        return True
    except Exception as e:
        print(f"  falha download: {e}")
        return False


def pause(seconds: float, label: str | None = None) -> None:
    if seconds <= 0:
        return
    if label:
        print(f"  … {label} ({seconds:.1f}s)")
    time.sleep(seconds)


def count_existing(out_dir: Path, prefix: str) -> int:
    head = f"{prefix}_"
    return sum(
        1
        for p in out_dir.iterdir()
        if p.is_file()
        and p.stem.startswith(head)
        and p.suffix.lower() in _IMAGE_SUFFIXES
    )


def search_images_api(term: str, max_results: int, search_delay: float) -> list[dict]:
    """Busca com retries e backoff em rate limit."""
    want = max(max_results * SEARCH_BUFFER_MULT, max_results + 5)
    last_err: Exception | None = None

    for attempt in range(1, MAX_RATE_LIMIT_RETRIES + 1):
        pause(search_delay, "antes da busca")
        try:
            ddgs = DDGS()
            try:
                results = list(
                    ddgs.images(
                        query=term,
                        region="br-pt",
                        safesearch="moderate",
                        max_results=want,
                    )
                )
            except TypeError:
                results = list(ddgs.images(term, region="br-pt", max_results=want))
            if hasattr(ddgs, "close"):
                ddgs.close()
            return results
        except RatelimitException as e:
            last_err = e
            wait = min(300, RATE_LIMIT_BASE_WAIT_SEC * (2 ** (attempt - 1)))
            print(
                f"  ⚠ rate limit DuckDuckGo — aguardando {wait}s "
                f"(tentativa {attempt}/{MAX_RATE_LIMIT_RETRIES})"
            )
            time.sleep(wait)
        except Exception as e:
            last_err = e
            wait = min(120, 20 * attempt)
            print(f"  ⚠ erro na busca ({e}) — retry em {wait}s ({attempt}/{MAX_RATE_LIMIT_RETRIES})")
            time.sleep(wait)

    print(f"  ✗ busca esgotada: {last_err}")
    return []


def fetch_images(
    term: str,
    limit: int,
    out_dir: Path,
    download_delay: float,
    search_delay: float,
) -> int:
    prefix = safe_name(term)
    existing = count_existing(out_dir, prefix)
    if existing >= limit:
        print(f"  já existem {existing}/{limit} — pulando")
        return existing

    need = limit - existing
    results = search_images_api(term, need, search_delay)
    if not results:
        return existing

    saved = existing
    for item in results:
        if saved >= limit:
            break
        url = item.get("image") or item.get("thumbnail") or item.get("url")
        if not url:
            continue
        ext = Path(urlparse(url).path).suffix or ".jpg"
        dest = out_dir / f"{prefix}_{saved + 1:02d}{ext}"
        if dest.exists():
            saved += 1
            continue
        print(f"  [{saved + 1}/{limit}] {url[:70]}…")
        if download_url(url, dest):
            saved += 1
            if saved < limit:
                pause(download_delay, "próximo download")
    return saved


def main() -> None:
    if len(sys.argv) < 2:
        print(__doc__)
        raise SystemExit(2)

    terms = load_terms_from_file()
    counts = parse_counts(sys.argv[1], len(terms))

    download_delay = DEFAULT_DOWNLOAD_DELAY_SEC
    if len(sys.argv) > 2:
        try:
            download_delay = max(0.0, float(sys.argv[2]))
        except ValueError:
            raise SystemExit(f"Delay download inválido: {sys.argv[2]!r}") from None

    search_delay = default_search_delay(len(terms), download_delay)
    if len(sys.argv) > 3:
        try:
            search_delay = max(0.0, float(sys.argv[3]))
        except ValueError:
            raise SystemExit(f"Delay busca inválido: {sys.argv[3]!r}") from None

    out_dir = Path.cwd()
    est_min = len(terms) * search_delay / 60
    print(f"Pacote: {_DDGS_PKG}")
    print(f"Destino: {out_dir}")
    print(f"Termos: {len(terms)} | delay download: {download_delay}s | delay busca: {search_delay}s")
    print(f"Estimativa só de buscas: ~{est_min:.0f} min (sem contar retries)\n")

    for i, (term, n) in enumerate(zip(terms, counts)):
        if i > 0:
            pause(search_delay, "próximo termo")
        print(f"=== {term} ({n} imagens) ===")
        got = fetch_images(term, n, out_dir, download_delay, search_delay)
        print(f"  -> {got}/{n} no disco\n")


if __name__ == "__main__":
    main()
