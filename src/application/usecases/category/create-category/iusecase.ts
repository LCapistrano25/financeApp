import { Category } from "@/domain/entities/category/category";
import { CreateCategoryDto } from "./dto";

export interface ICreateCategoryUseCase {
  execute(input: CreateCategoryDto): Promise<Category>;
}

