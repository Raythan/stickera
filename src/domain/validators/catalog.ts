import { z } from 'zod';

const durationSchema = z.object({
  value: z.number().positive(),
  unit: z.enum(['seconds', 'minutes', 'hours']),
});

const albumRefSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/),
  revision: z.number().int().min(1),
  manifestPath: z.string().startsWith('/'),
});

const appConfigSchema = z.object({
  packCooldown: durationSchema,
  stickersPerPack: z.number().int().min(1).max(50),
  tradeRequiresConfirmation: z.boolean().optional(),
  signature: z
    .object({
      authorName: z.string(),
      taglineKey: z.string(),
      links: z.object({
        github: z.string().url().optional(),
        linkedin: z.string().url().optional(),
      }),
    })
    .optional(),
});

export const catalogSchema = z.object({
  version: z.string().min(1),
  baseUrl: z.string().optional(),
  albums: z.array(albumRefSchema),
  appConfig: appConfigSchema,
});

export type CatalogInput = z.input<typeof catalogSchema>;

export function parseCatalog(data: unknown) {
  return catalogSchema.parse(data);
}

export function safeParseCatalog(data: unknown) {
  return catalogSchema.safeParse(data);
}
