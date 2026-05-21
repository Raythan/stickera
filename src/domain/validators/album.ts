import { z } from 'zod';

const namesSchema = z
  .object({
    en: z.string().min(1),
    pt: z.string().min(1),
  })
  .partial()
  .refine((n) => Boolean(n.en || n.pt), { message: 'names requires at least en or pt' });

const stickerSchema = z
  .object({
    id: z.string().min(3),
    number: z.number().int().min(1),
    nameKey: z.string().startsWith('albums.').optional(),
    names: namesSchema.optional(),
    image: z
      .string()
      .regex(/^stickers\/.+\.(png|jpg|jpeg|gif)$/i)
      .optional(),
    rarity: z.enum(['common', 'uncommon', 'rare', 'legendary']).optional(),
  })
  .refine((s) => Boolean(s.nameKey || s.names), {
    message: 'sticker requires nameKey or names',
  });

export const albumSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
    revision: z.number().int().min(1),
    frameStylePath: z.string().regex(/^[^/\\]+\.css$/),
    totalStickers: z.number().int().min(1),
    nameKey: z.string().startsWith('albums.').optional(),
    names: namesSchema.optional(),
    coverImage: z.string().optional(),
    packWeight: z.number().positive().optional(),
    stickers: z.array(stickerSchema),
  })
  .refine((a) => Boolean(a.nameKey || a.names), {
    message: 'album requires nameKey or names',
  });

export function parseAlbum(data: unknown) {
  return albumSchema.parse(data);
}

export function safeParseAlbum(data: unknown) {
  return albumSchema.safeParse(data);
}
