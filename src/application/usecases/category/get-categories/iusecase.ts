import { Category } from "@/domain/entities/category/category";

export interface IGetCategoriesUseCase {
  execute(): Promise<Category[]>;
}

