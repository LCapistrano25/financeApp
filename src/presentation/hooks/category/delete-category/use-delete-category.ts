import { useState } from "react";
import { DeleteCategoryUseCase } from "@/application/usecases/category/delete-category/usecase";
import { categoryRepository } from "@/infrastructure/repositories/supabase/category/category.repository";
import { authService } from "@/infrastructure/services/supabase-auth.service";

export function useDeleteCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useCase = new DeleteCategoryUseCase(categoryRepository, authService);

  const deleteCategory = async (id: string) => {
    const confirmDelete = globalThis.confirm("Tem certeza que deseja apagar esta categoria?");
    if (!confirmDelete) return false;

    setIsLoading(true);
    setError(null);

    try {
      await useCase.execute(id);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao deletar categoria";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteCategory,
    isLoading,
    error,
  };
}

