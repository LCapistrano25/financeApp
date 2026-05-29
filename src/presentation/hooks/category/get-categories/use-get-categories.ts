import { useCallback, useEffect, useMemo, useState } from "react";
import { Category } from "@/domain/entities/category/category";
import { GetCategoriesUseCase } from "@/application/usecases/category/get-categories/usecase";
import { categoryRepository } from "@/infrastructure/repositories/supabase/category/category.repository";
import { authService } from "@/infrastructure/services/supabase-auth.service";

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const useCase = useMemo(() => new GetCategoriesUseCase(categoryRepository, authService), []);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await useCase.execute();
      setCategories(result);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar categorias");
    } finally {
      setIsLoading(false);
    }
  }, [useCase]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    isLoading,
    error,
    refresh: fetchCategories,
  };
}

