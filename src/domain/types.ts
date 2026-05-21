export type PackCooldownUnit = 'seconds' | 'minutes' | 'hours';

export type PackCooldown = {
  value: number;
  unit: PackCooldownUnit;
};

export type CatalogAlbumRef = {
  id: string;
  revision: number;
  manifestPath: string;
};

export type AppConfig = {
  packCooldown: PackCooldown;
  stickersPerPack: number;
  tradeRequiresConfirmation?: boolean;
  signature?: {
    authorName: string;
    taglineKey: string;
    links: { github?: string; linkedin?: string };
  };
};

export type Catalog = {
  version: string;
  baseUrl?: string;
  albums: CatalogAlbumRef[];
  appConfig: AppConfig;
};

export type ContentNames = {
  en?: string;
  pt?: string;
};

export type StickerDef = {
  id: string;
  number: number;
  nameKey?: string;
  names?: ContentNames;
  image?: string;
  rarity?: 'common' | 'uncommon' | 'rare' | 'legendary';
};

export type AlbumManifest = {
  id: string;
  revision: number;
  frameStylePath: string;
  totalStickers: number;
  nameKey?: string;
  names?: ContentNames;
  coverImage?: string;
  packWeight?: number;
  stickers: StickerDef[];
};

export type AlbumRow = {
  id: string;
  revision: number;
  total_stickers: number;
  name_key: string;
  cover_uri: string | null;
  pack_weight: number;
};

export type CollectionRow = {
  sticker_id: string;
  album_id: string;
  quantity: number;
  is_new: number;
  first_obtained_at: string | null;
  updated_at: string;
};

export type TradeSide = { stickerId: string; quantity: 1 };

/** @deprecated Use TradePayloadV1 — kept as alias */
export type TradePayload = TradePayloadV1;

export type TradePayloadV1 = {
  v: 1;
  offerId: string;
  fromDisplayName?: string;
  offered: TradeSide;
  wanted: TradeSide;
  expiresAt: string;
};

export type TradePayloadV2 = {
  v: 2;
  offerId: string;
  fromDisplayName?: string;
  offeredIds: string[];
  expiresAt: string;
};

export type TradePayloadAny = TradePayloadV1 | TradePayloadV2;

export type TradeAckV1 = { v: 1; offerId: string; acceptedAt: string };

export type TradeAckV2 = {
  v: 2;
  offerId: string;
  acceptedAt: string;
  acceptorIds: string[];
};

export type TradeAckAny = TradeAckV1 | TradeAckV2;

/** @deprecated Use TradeAckV1 */
export type TradeAck = TradeAckV1;

export type TradableStickerItem = {
  stickerId: string;
  albumId: string;
  name: string;
  imageUri?: string;
  frameCss?: string;
  quantity: number;
  rarity?: string;
};

export type TradeLogEntry = {
  id: string;
  payload_json: string;
  encoded_payload?: string;
  ack_encoded?: string;
  role?: 'initiator' | 'acceptor';
  status: 'draft' | 'sent' | 'completed' | 'cancelled';
  created_at: string;
};

export type SyncResult = {
  ok: boolean;
  source: 'bundled' | 'remote' | 'cache';
  catalogVersion: string;
  albumsUpdated: number;
  message?: string;
};
