import { useState } from "react";
import { EditAccountUseCase } from "@/application/usecases/account/edit-account/usecase";
import { EditAccountDto } from "@/application/usecases/account/edit-account/dto";
import { accountRepository } from "@/infrastructure/repositories/supabase/account/account.repository";
import { authService } from "@/infrastructure/services/supabase-auth.service";

export function useEditAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const useCase = new EditAccountUseCase(accountRepository, authService);

  const editAccount = async (id: string, data: EditAccountDto) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const updated = await useCase.editAccount(id, data);
      setIsSuccess(true);
      return updated;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar conta";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editAccount,
    isLoading,
    error,
    isSuccess,
  };
}

