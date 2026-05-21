import { z } from 'zod';

const stickerSchema = z.object({
  id: z.string().min(3),
  number: z.number().int().min(1),
  nameKey: z.string().startsWith('albums.'),
  image: z
    .string()
    .regex(/^stickers\/.+\.(png|jpg|jpeg|gif)$/i)
    .optional(),
  rarity: z.enum(['common', 'uncommon', 'rare', 'legendary']).optional(),
});

export const albumSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  revision: z.number().int().min(1),
  frameStylePath: z.string().regex(/^[^/\\]+\.css$/),
  totalStickers: z.number().int().min(1),
  nameKey: z.string().startsWith('albums.'),
  coverImage: z.string().optional(),
  packWeight: z.number().positive().optional(),
  stickers: z.array(stickerSchema),
});

export function parseAlbum(data: unknown) {
  return albumSchema.parse(data);
}

export function safeParseAlbum(data: unknown) {
  return albumSchema.safeParse(data);
}
