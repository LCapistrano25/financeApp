import { CategoryType } from "@/domain/enum/category-types";

export interface CategoryProps {
  id?: string;
  name: string;
  icon: string;
  color: string;
  user_id: string;
  type: CategoryType;
  created_at?: string;
}