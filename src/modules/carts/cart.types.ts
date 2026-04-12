export interface Cart {
  id: string;
  userId: string;
  status: 'active' | 'checked_out' | 'abandoned';
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  priceAtAddition: number; // Snapshot of price when added
  createdAt: Date;
}
