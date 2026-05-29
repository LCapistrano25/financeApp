import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/domain/entities/transaction/transaction";
import { GetTransactionsUseCase } from "@/application/usecases/transaction/get-transaction/usecase";
import { transactionRepository } from "@/infrastructure/supabase/transaction.repository";
import { authService } from "@/infrastructure/services/supabase-auth.service";

export function useTransactions(monthYear: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const useCase = new GetTransactionsUseCase(transactionRepository, authService);
  
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      // O hook não sabe de Supabase, de datas complexas ou de matemática.
      // Ele só chama o UseCase e guarda o resultado!
      const result = await useCase.execute(monthYear);
      
      setTransactions(result.transactions);
      setTotals(result.summary);
      setError(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao carregar transações");
    } finally {
      setIsLoading(false);
    }
  }, [monthYear]);

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