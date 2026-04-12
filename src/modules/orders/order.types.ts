export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'refunded' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}
