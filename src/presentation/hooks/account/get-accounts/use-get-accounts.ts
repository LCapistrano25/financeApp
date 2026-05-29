import { useCallback, useEffect, useMemo, useState } from "react";
import { Account } from "@/domain/entities/account/account";
import { GetAccountsUseCase } from "@/application/usecases/account/get-accounts/usecase";
import { accountRepository } from "@/infrastructure/repositories/supabase/account/account.repository";
import { authService } from "@/infrastructure/services/supabase-auth.service";

export function useAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const useCase = useMemo(() => new GetAccountsUseCase(accountRepository, authService), []);

  const fetchAccounts = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await useCase.execute();
      setAccounts(result);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar contas");
    } finally {
      setIsLoading(false);
    }
  }, [useCase]);

  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return {
    accounts,
    isLoading,
    error,
    refresh: fetchAccounts,
  };
}

