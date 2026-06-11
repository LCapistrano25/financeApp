import { Category } from "@/domain/entities/category/category";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { CategoryMapper } from "@/infrastructure/mappers/category.mapper";
import { supabase } from "@/infrastructure/repositories/supabase/supabase.client";

export class CategoryRepository implements ICategoryRepository {
  async getCategoryById(id: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw new Error(error.message);
    }

    return CategoryMapper.toDomain(data);
  }

  async getCategoriesByUserId(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });

    if (error) throw new Error(error.message);

    return data.map(CategoryMapper.toDomain);
  }

  async createCategory(category: Category): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .insert(CategoryMapper.toPersistence(category))
      .select()
      .single();

    if (error) throw new Error(error.message);

    return CategoryMapper.toDomain(data);
  }

  async updateCategory(id: string, category: Category): Promise<Category> {
    const { data, error } = await supabase
      .from("categories")
      .update(CategoryMapper.toPersistence(category))
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return CategoryMapper.toDomain(data);
  }

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from("categories")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  }
}

export const categoryRepository = new CategoryRepository();
