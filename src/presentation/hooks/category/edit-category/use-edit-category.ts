import { useState } from "react";
import { EditCategoryUseCase } from "@/application/usecases/category/edit-category/usecase";
import { EditCategoryDto } from "@/application/usecases/category/edit-category/dto";
import { categoryRepository } from "@/infrastructure/repositories/supabase/category/category.repository";
import { authService } from "@/infrastructure/services/supabase-auth.service";

export function useEditCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const useCase = new EditCategoryUseCase(categoryRepository, authService);

  const editCategory = async (id: string, data: EditCategoryDto) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const updated = await useCase.editCategory(id, data);
      setIsSuccess(true);
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar categoria";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editCategory,
    isLoading,
    error,
    isSuccess,
  };
}

