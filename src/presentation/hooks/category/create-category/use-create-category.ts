import { useState } from "react";
import { CreateCategoryUseCase } from "@/application/usecases/category/create-category/usecase";
import { CreateCategoryDto } from "@/application/usecases/category/create-category/dto";
import { categoryRepository } from "@/infrastructure/repositories/supabase/category/category.repository";
import { authService } from "@/infrastructure/services/supabase-auth.service";

export function useCreateCategory() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const useCase = new CreateCategoryUseCase(categoryRepository, authService);

  const createCategory = async (data: CreateCategoryDto) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const created = await useCase.execute(data);
      setIsSuccess(true);
      return created;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar categoria";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCategory,
    isLoading,
    error,
    isSuccess,
  };
}

