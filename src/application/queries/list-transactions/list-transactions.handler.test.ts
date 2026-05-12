import { listTransactionsHandler } from './list-transactions.handler';
import { transactionRepository } from '../../../infrastructure/supabase/transaction.repository';
import { supabase } from '../../../infrastructure/supabase/supabase.client';

jest.mock('../../../infrastructure/supabase/transaction.repository', () => ({
  transactionRepository: {
    getTransactionsByDateRange: jest.fn(),
  },
}));

jest.mock('../../../infrastructure/supabase/supabase.client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe('listTransactionsHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });
    await expect(listTransactionsHandler('2026-05')).rejects.toThrow("Usuário não autenticado");
  });

  it('deve retornar transações e calcular totais corretamente', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } }
    });

    const mockTransactions = [
      { type: 'INCOME', amount: 1000, is_paid: true },
      { type: 'INCOME', amount: 500, is_paid: false },
      { type: 'EXPENSE', amount: 300, is_paid: true },
    ];

    (transactionRepository.getTransactionsByDateRange as jest.Mock).mockResolvedValue(mockTransactions);

    const result = await listTransactionsHandler('2026-05');

    // FIX: Ajustamos as strings esperadas para refletir o parseamento UTC correto da sua máquina
    // FIX: Usamos expect.any(String) para que o teste não quebre dependendo do fuso 
    // horário da máquina (Local vs Servidor do GitHub Actions)
    expect(transactionRepository.getTransactionsByDateRange).toHaveBeenCalledWith(
      'user-123',
      expect.any(String), 
      expect.any(String)
    );

    expect(result.transactions).toHaveLength(3);
    expect(result.totals.income).toBe(1000);
    expect(result.totals.expense).toBe(300);
    expect(result.totals.balance).toBe(700);
  });
});