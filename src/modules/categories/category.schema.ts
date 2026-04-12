import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/),
  description: z.string().optional(),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
