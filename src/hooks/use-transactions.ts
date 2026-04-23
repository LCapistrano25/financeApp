import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types";

export function useTransactions(monthYear: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Usamos useCallback para que a função possa ser chamada de fora
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [year, month] = monthYear.split("-");
      const startDate = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10) - 1, 1).toISOString();
      const endDate = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10), 0, 23, 59, 59).toISOString();

      const { data, error: supabaseError } = await supabase
        .from("transactions")
        .select(`*, category:categories(name)`)
        .gte("date", startDate)
        .lte("date", endDate)
        .order("date", { ascending: false });

      if (supabaseError) throw supabaseError;
      setTransactions(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setIsLoading(false);
    }
  }, [monthYear]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const totals = transactions.reduce(
    (acc, curr) => {
      if (curr.is_paid) {
        if (curr.type === "INCOME") acc.income += Number(curr.amount);
        if (curr.type === "EXPENSE") acc.expense += Number(curr.amount);
      }
      return acc;
    },
    { income: 0, expense: 0 }
  );

  return { 
    transactions, 
    totals: { ...totals, balance: totals.income - totals.expense }, 
    isLoading, 
    error,
    refresh: fetchTransactions // <-- AGORA EXPORTAMOS O REFRESH
  };
}
