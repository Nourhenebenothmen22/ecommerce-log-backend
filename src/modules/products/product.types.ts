export interface Product {
    id: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    stockQuantity: number;
    sku: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
