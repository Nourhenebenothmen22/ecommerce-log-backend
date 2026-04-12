import type { Request, Response } from 'express';
import { CategoryService } from './category.service.js';
import { successResponse } from '../../shared/types/api-response.js';

export class CategoryController {
  private categoryService = new CategoryService();

  listCategories = async (_req: Request, res: Response) => {
    const categories = await this.categoryService.listCategories();
    res.json(successResponse(categories));
  };

  createCategory = async (req: Request, res: Response) => {
    const category = await this.categoryService.createCategory(req.body);
    res.status(201).json(successResponse(category));
  };
}
