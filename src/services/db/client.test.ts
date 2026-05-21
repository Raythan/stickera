import { LATEST_SCHEMA_VERSION, MIGRATIONS } from './migrations';

describe('db migrations', () => {
  it('exports ordered migrations ending at latest version', () => {
    expect(MIGRATIONS.length).toBeGreaterThan(0);
    const versions = MIGRATIONS.map((m) => m.version);
    expect(versions).toEqual([...versions].sort((a, b) => a - b));
    expect(new Set(versions).size).toBe(versions.length);
    expect(LATEST_SCHEMA_VERSION).toBe(versions[versions.length - 1]);
  });
});
