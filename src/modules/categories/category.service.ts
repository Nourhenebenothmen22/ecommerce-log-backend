import { CategoryRepository } from './category.repository.js';
import type { CreateCategoryDto } from './category.schema.js';
import { createModuleLogger } from '../../core/logger/logger.js';

const categoryLogger = createModuleLogger('category_service');

export class CategoryService {
  private repository = new CategoryRepository();

  async listCategories() {
    return this.repository.findAll();
  }

  async createCategory(dto: CreateCategoryDto) {
    const category = await this.repository.create({
      name: dto.name,
      slug: dto.slug,
      description: dto.description || null,
    });
    categoryLogger.info({ categoryId: category.id, slug: category.slug }, 'Category created');
    return category;
  }
}
