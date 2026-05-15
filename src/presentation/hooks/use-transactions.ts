import { useState, useEffect, useCallback } from "react";
import { Transaction } from "@/domain/entities/transaction";
import { listTransactionsHandler } from "@/application/queries/list-transactions/list-transactions.handler";

export function useTransactions(monthYear: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totals, setTotals] = useState({ income: 0, expense: 0, balance: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      // O hook não sabe de Supabase, de datas complexas ou de matemática.
      // Ele só chama o Handler e guarda o resultado!
      const result = await listTransactionsHandler(monthYear);
      
      setTransactions(result.transactions);
      setTotals(result.totals);
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