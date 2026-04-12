import { ProductRepository } from './product.repository.js';
import type { CreateProductDto } from './product.schema.js';
import type { PaginationQuery } from '../../shared/types/pagination.js';
import { createModuleLogger } from '../../core/logger/logger.js';

const productLogger = createModuleLogger('product_service');

export class ProductService {
  private repository = new ProductRepository();

  async listProducts(pagination: PaginationQuery) {
    return this.repository.findAll(pagination);
  }

  async createProduct(dto: CreateProductDto) {
    const product = await this.repository.create(dto);
    productLogger.info({ productId: product.id, sku: product.sku }, 'Product created successfully');
    return product;
  }
}
