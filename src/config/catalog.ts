import catalogJson from '../../content/catalog.json';

export type CatalogAlbumRef = {
  id: string;
  revision: number;
  manifestPath: string;
};

export type Catalog = typeof catalogJson;

export const catalog: Catalog = catalogJson;
