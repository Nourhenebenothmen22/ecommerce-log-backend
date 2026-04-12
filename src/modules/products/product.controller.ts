import type { Request, Response } from 'express';
import { ProductService } from './product.service.js';
import { mapProductToResponse } from './product.mapper.js';
import { successResponse } from '../../shared/types/api-response.js';
import type { PaginationQuery } from '../../shared/types/pagination.js';

export class ProductController {
  private productService = new ProductService();

  listProducts = async (req: Request, res: Response) => {
    const pagination = req.query as unknown as PaginationQuery;
    const { items, total } = await this.productService.listProducts(pagination);
    
    res.json(successResponse(items.map(mapProductToResponse), {
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      }
    }));
  };

  createProduct = async (req: Request, res: Response) => {
    const data = req.body;
    const product = await this.productService.createProduct(data);
    
    res.status(201).json(successResponse(mapProductToResponse(product)));
  };
}
