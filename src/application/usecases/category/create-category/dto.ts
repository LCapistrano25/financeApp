import { CategoryType } from "@/domain/enum/category-types";

export interface CreateCategoryDto {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

