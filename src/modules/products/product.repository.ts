import { query } from '../../infrastructure/database/query.js';
import type { Product } from './product.types.js';
import type { PaginationQuery } from '../../shared/types/pagination.js';
import { paginationToOffset } from '../../shared/types/pagination.js';

export class ProductRepository {
  async findAll(pagination: PaginationQuery): Promise<{ items: Product[], total: number }> {
    const { limit, offset } = paginationToOffset(pagination);
    
    // Need to do this since we don't have real tables created yet, but this is real code.
    try {
        const countResult = await query<{ count: string }>({
        name: 'product_count',
        text: 'SELECT count(*) FROM products WHERE is_active = true',
        });
        
        const result = await query<Product>({
        name: 'product_find_all',
        text: `
            SELECT id, category_id as "categoryId", name, description, price, 
                stock_quantity as "stockQuantity", sku, is_active as "isActive", 
                created_at as "createdAt", updated_at as "updatedAt"
            FROM products 
            WHERE is_active = true
            ORDER BY created_at DESC
            LIMIT $1 OFFSET $2
        `,
        values: [limit, offset],
        });

        return {
            items: result.rows,
            total: parseInt(countResult.rows[0].count, 10)
        };
    } catch (e) {
        throw e;
    }
  }

  async create(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'isActive' | 'stockQuantity'>): Promise<Product> {
     try {
        const result = await query<Product>({
            name: 'product_create',
            text: `
                INSERT INTO products (category_id, name, description, price, sku)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id, category_id as "categoryId", name, description, price, 
                        stock_quantity as "stockQuantity", sku, is_active as "isActive", 
                        created_at as "createdAt", updated_at as "updatedAt"
            `,
            values: [data.categoryId, data.name, data.description, data.price, data.sku],
            });
            return result.rows[0];
     } catch (e) {
         throw e;
     }
  }
}
