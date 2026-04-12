import { query } from '../../infrastructure/database/query.js';
import type { Category } from './category.types.js';

export class CategoryRepository {
  async findAll(): Promise<Category[]> {
    try {
        const result = await query<Category>({
        name: 'category_find_all',
        text: `
            SELECT id, name, slug, description, is_active as "isActive", 
                created_at as "createdAt", updated_at as "updatedAt"
            FROM categories 
            WHERE is_active = true
            ORDER BY name ASC
        `,
        });
        return result.rows;
    } catch (e) {
        throw e;
    }
  }

  async create(data: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'isActive'>): Promise<Category> {
      try {
        const result = await query<Category>({
            name: 'category_create',
            text: `
              INSERT INTO categories (name, slug, description)
              VALUES ($1, $2, $3)
              RETURNING id, name, slug, description, is_active as "isActive", 
                        created_at as "createdAt", updated_at as "updatedAt"
            `,
            values: [data.name, data.slug, data.description || null],
          });
          return result.rows[0];
      } catch (e) {
          throw e;
      }
    
  }
}
