import type { Product } from './product.types.js';

export function mapProductToResponse(product: Product) {
  return {
    ...product,
    price: Number(product.price), // ensure numeric
  };
}
