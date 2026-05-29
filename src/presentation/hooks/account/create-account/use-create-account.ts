import { useState } from "react";
import { CreateAccountUseCase } from "@/application/usecases/account/create-account/usecase";
import { CreateAccountDto } from "@/application/usecases/account/create-account/dto";
import { accountRepository } from "@/infrastructure/repositories/supabase/account/account.repository";
import { authService } from "@/infrastructure/services/supabase-auth.service";

export function useCreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const useCase = new CreateAccountUseCase(accountRepository, authService);

  const createAccount = async (data: CreateAccountDto) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const created = await useCase.execute(data);
      setIsSuccess(true);
      return created;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao criar conta";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createAccount,
    isLoading,
    error,
    isSuccess,
  };
}

