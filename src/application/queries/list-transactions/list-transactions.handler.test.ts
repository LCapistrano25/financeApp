import { listTransactionsHandler } from './list-transactions.handler';
import { transactionRepository } from '../../../infrastructure/supabase/transaction.repository';
import { authService } from '../../../infrastructure/services/supabase-auth.service';

jest.mock('../../../infrastructure/supabase/transaction.repository', () => ({
  transactionRepository: {
    getTransactionsByDateRange: jest.fn(),
  },
}));

jest.mock('../../../infrastructure/services/supabase-auth.service', () => ({
  authService: {
    getAuthenticatedUser: jest.fn(),
  },
}));

describe('listTransactionsHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    (authService.getAuthenticatedUser as jest.Mock).mockRejectedValue(new Error("Usuário não autenticado"));
    await expect(listTransactionsHandler('2026-05')).rejects.toThrow("Usuário não autenticado");
  });

  it('deve retornar transações e calcular totais corretamente', async () => {
    (authService.getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: 'user-123' });

    const mockTransactions = [
      { type: 'INCOME', amount: 1000, isPaid: true },
      { type: 'INCOME', amount: 500, isPaid: false },
      { type: 'EXPENSE', amount: 300, isPaid: true },
    ];

    (transactionRepository.getTransactionsByDateRange as jest.Mock).mockResolvedValue(mockTransactions);

    const result = await listTransactionsHandler('2026-05');

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