/** Parse catalog.version (YYYY.MM.DD.N) into comparable tuple. */
function parseVersion(version: string): [number, number, number, number] | null {
  const parts = version.trim().split('.');
  if (parts.length !== 4) return null;
  const nums = parts.map((p) => parseInt(p, 10));
  if (nums.some((n) => !Number.isFinite(n))) return null;
  return nums as [number, number, number, number];
}

/** -1 if a < b, 0 if equal, 1 if a > b, null if unparseable. */
export function compareCatalogVersion(a: string, b: string): number | null {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  if (!pa || !pb) return null;
  for (let i = 0; i < 4; i++) {
    if (pa[i] < pb[i]) return -1;
    if (pa[i] > pb[i]) return 1;
  }
  return 0;
}

export function isRemoteCatalogNewer(remote: string, local: string | null): boolean {
  if (!local) return true;
  const cmp = compareCatalogVersion(remote, local);
  if (cmp === null) return remote !== local;
  return cmp > 0;
}

export function catalogVersionsMatch(a: string | undefined, b: string | null): boolean {
  if (!a || !b) return false;
  const cmp = compareCatalogVersion(a, b);
  if (cmp === null) return a === b;
  return cmp === 0;
}
