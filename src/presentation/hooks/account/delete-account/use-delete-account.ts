import { useState } from "react";
import { DeleteAccountUseCase } from "@/application/usecases/account/delete-account/usecase";
import { accountRepository } from "@/infrastructure/repositories/supabase/account/account.repository";
import { authService } from "@/infrastructure/services/supabase-auth.service";
import { transactionRepository } from "@/infrastructure/repositories/supabase/transaction/transaction.repository";

export function useDeleteAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const useCase = new DeleteAccountUseCase(accountRepository, authService, transactionRepository);

  const deleteAccount = async (id: string) => {
    const confirmDelete = globalThis.confirm("Tem certeza que deseja apagar esta conta?");
    if (!confirmDelete) return false;

    setIsLoading(true);
    setError(null);

    try {
      await useCase.execute(id);
      return true;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao deletar conta";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteAccount,
    isLoading,
    error,
  };
}
