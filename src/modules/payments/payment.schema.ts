import { z } from 'zod';

export const processPaymentSchema = z.object({
  orderId: z.string().uuid(),
  paymentMethodId: z.string(),
});

export type ProcessPaymentDto = z.infer<typeof processPaymentSchema>;
