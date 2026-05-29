import { transactionRepository } from '../../../infrastructure/supabase/transaction.repository';
import { authService } from '../../../infrastructure/services/supabase-auth.service';
import { TransactionType } from '@/domain/enum/transaction-type';

export async function listTransactionsHandler(monthYear: string) {
  // 1. Validação de Usuário
  const user = await authService.getAuthenticatedUser();

  // 2. Regra de Negócio: Transformação de Datas
  const [year, month] = monthYear.split("-");
  const startDate = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10) - 1, 1).toISOString();
  const endDate = new Date(Number.parseInt(year, 10), Number.parseInt(month, 10), 0, 23, 59, 59).toISOString();

  // 3. Busca de Dados (Usando o Repositório, sem saber que é Supabase)
  const transactions = await transactionRepository.getTransactionsByDateRange(
    user.id, 
    startDate, 
    endDate
  );

  // 4. Regra de Negócio: Cálculo de Totais
  const totals = transactions.reduce(
    (acc, curr) => {
      if (curr.isPaid) {
        if (curr.type === TransactionType.INCOME) acc.income += Number(curr.amount);
        if (curr.type === TransactionType.EXPENSE) acc.expense += Number(curr.amount);
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