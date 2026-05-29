import { Category } from "@/domain/entities/category/category";
import { EditCategoryDto } from "./dto";

export interface IEditCategoryUseCase {
  editCategory(id: string, input: EditCategoryDto): Promise<Category>;
}

