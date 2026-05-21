jest.mock('expo-file-system', () => ({
  bundleDirectory: 'file:///app.bundle/',
  documentDirectory: 'file:///documents/',
}));

import { bundledContentCandidateUris, BUNDLED_CONTENT_PREFIXES } from './paths';

describe('bundledContentCandidateUris', () => {
  it('tries content/ before assets/content/', () => {
    const uris = bundledContentCandidateUris('catalog.json');
    expect(uris.length).toBe(BUNDLED_CONTENT_PREFIXES.length);
    expect(uris[0]).toContain('/content/catalog.json');
    expect(uris[1]).toContain('/assets/content/catalog.json');
  });
});
