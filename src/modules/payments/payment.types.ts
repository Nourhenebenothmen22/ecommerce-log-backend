export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  status: 'pending' | 'success' | 'failed';
  providerTransactionId?: string;
  createdAt: Date;
}
