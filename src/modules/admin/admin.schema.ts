import { z } from 'zod';

export const updatePriceSchema = z.object({
  price: z.number().positive(),
});

export const adjustStockSchema = z.object({
  change: z.number().int(),
  reason: z.string().min(3),
});

export const orderStatusSchema = z.object({
  status: z.enum(['pending', 'paid', 'shipped', 'delivered', 'refunded', 'cancelled']),
});

export type UpdatePriceDto = z.infer<typeof updatePriceSchema>;
export type AdjustStockDto = z.infer<typeof adjustStockSchema>;
export type OrderStatusDto = z.infer<typeof orderStatusSchema>;
