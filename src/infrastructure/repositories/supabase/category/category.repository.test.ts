import { CategoryType } from "@/domain/enum/category-types";
import { Category } from "@/domain/entities/category/category";
import { supabase } from "@/infrastructure/repositories/supabase/supabase.client";
import { CategoryRepository } from "@/infrastructure/repositories/supabase/category/category.repository";

jest.mock("@/infrastructure/repositories/supabase/supabase.client");

describe("CategoryRepository", () => {
  let repository: CategoryRepository;
  let mockSupabaseQuery: Record<string, jest.Mock>;

  const categoryData = {
    id: "cat-123",
    user_id: "user-123",
    name: "Alimentacao",
    icon: "utensils",
    color: "#f97316",
    type: CategoryType.EXPENSE,
    created_at: "2026-05-29T00:00:00.000Z",
  };

  beforeEach(() => {
    repository = new CategoryRepository();
    mockSupabaseQuery = supabase.from("categories") as unknown as Record<string, jest.Mock>;
    jest.clearAllMocks();
  });

  it("deve buscar uma categoria por ID", async () => {
    mockSupabaseQuery.single.mockResolvedValueOnce({ data: categoryData, error: null });

    const result = await repository.getCategoryById("cat-123");

    expect(supabase.from).toHaveBeenCalledWith("categories");
    expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("id", "cat-123");
    expect(result?.id).toBe("cat-123");
    expect(result?.name).toBe("Alimentacao");
  });

  it("deve retornar null quando a categoria nao existir", async () => {
    mockSupabaseQuery.single.mockResolvedValueOnce({
      data: null,
      error: { code: "PGRST116", message: "Not found" },
    });

    await expect(repository.getCategoryById("missing")).resolves.toBeNull();
  });

  it("deve listar categorias por usuario", async () => {
    mockSupabaseQuery.order.mockResolvedValueOnce({ data: [categoryData], error: null });

    const result = await repository.getCategoriesByUserId("user-123");

    expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("user_id", "user-123");
    expect(mockSupabaseQuery.order).toHaveBeenCalledWith("name", { ascending: true });
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe(CategoryType.EXPENSE);
  });

  it("deve criar uma categoria", async () => {
    mockSupabaseQuery.single.mockResolvedValueOnce({ data: categoryData, error: null });
    const category = Category.create({
      user_id: "user-123",
      name: "Alimentacao",
      icon: "utensils",
      color: "#f97316",
      type: CategoryType.EXPENSE,
    });

    const result = await repository.createCategory(category);

    expect(mockSupabaseQuery.insert).toHaveBeenCalledWith({
      user_id: "user-123",
      name: "Alimentacao",
      icon: "utensils",
      color: "#f97316",
      type: CategoryType.EXPENSE,
    });
    expect(result.id).toBe("cat-123");
  });

  it("deve atualizar uma categoria", async () => {
    mockSupabaseQuery.single.mockResolvedValueOnce({ data: categoryData, error: null });
    const category = Category.restore(categoryData);

    const result = await repository.updateCategory("cat-123", category);

    expect(mockSupabaseQuery.update).toHaveBeenCalledWith({
      id: "cat-123",
      user_id: "user-123",
      name: "Alimentacao",
      icon: "utensils",
      color: "#f97316",
      type: CategoryType.EXPENSE,
      created_at: "2026-05-29T00:00:00.000Z",
    });
    expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("id", "cat-123");
    expect(result.id).toBe("cat-123");
  });

  it("deve deletar uma categoria", async () => {
    mockSupabaseQuery.eq.mockResolvedValueOnce({ error: null });

    await repository.deleteCategory("cat-123");

    expect(mockSupabaseQuery.delete).toHaveBeenCalled();
    expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("id", "cat-123");
  });

  it("deve propagar erros do Supabase", async () => {
    mockSupabaseQuery.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Database Error" },
    });

    await expect(repository.getCategoryById("cat-123")).rejects.toThrow("Database Error");
  });
});
