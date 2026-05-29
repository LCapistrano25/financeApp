import { Category } from "../entities/category/category";

export interface ICategoryRepository {
  getCategoryById(id: string): Promise<Category | null>;
  getCategoriesByUserId(userId: string): Promise<Category[]>;
  createCategory(category: Category): Promise<Category>;
  updateCategory(id: string, category: Category): Promise<Category>;
  deleteCategory(id: string): Promise<void>;
}
