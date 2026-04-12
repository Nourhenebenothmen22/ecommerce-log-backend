import { z } from 'zod';

export const createProductSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2),
  description: z.string(),
  price: z.number().positive(),
  sku: z.string().min(3),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
