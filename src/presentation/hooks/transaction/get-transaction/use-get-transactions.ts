import { useState, useEffect, useCallback, useMemo } from "react";
import { Transaction } from "@/domain/entities/transaction/transaction";
import { GetTransactionsUseCase } from "@/application/usecases/transaction/get-transaction/usecase";
import { authService } from "@/infrastructure/services/supabase-auth.service";
import { transactionRepository } from "@/infrastructure/repositories/supabase/transaction/transaction.repository";

export function useTransactions(monthYear: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const useCase = useMemo(() => new GetTransactionsUseCase(transactionRepository, authService), []);
  
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await useCase.execute(monthYear);
      
      setTransactions(result.transactions);
      setTotals(result.summary);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar transações");
    } finally {
      setIsLoading(false);
    }
  }, [monthYear, useCase]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return { 
    transactions, 
    totals, 
    isLoading, 
    error,
    refresh: fetchTransactions 
  };
}