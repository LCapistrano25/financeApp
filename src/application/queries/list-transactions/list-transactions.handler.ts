import { transactionRepository } from '../../../infrastructure/supabase/transaction.repository';
import { supabase } from '../../../infrastructure/supabase/supabase.client'; 

export async function listTransactionsHandler(monthYear: string) {
  // 1. Validação de Usuário
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error("Usuário não autenticado");

  // 2. Regra de Negócio: Transformação de Datas
  const [year, month] = monthYear.split("-");
  const startDate = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10) - 1, 1).toISOString();
  const endDate = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10), 0, 23, 59, 59).toISOString();

  // 3. Busca de Dados (Usando o Repositório, sem saber que é Supabase)
  const transactions = await transactionRepository.getTransactionsByDateRange(
    session.user.id, 
    startDate, 
    endDate
  );

  // 4. Regra de Negócio: Cálculo de Totais
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
    totals: { ...totals, balance: totals.income - totals.expense } 
  };
}