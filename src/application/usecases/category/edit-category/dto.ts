import { CategoryType } from "@/domain/enum/category-types";

export interface EditCategoryDto {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
}

