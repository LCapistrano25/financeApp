import { GetTransactionsUseCase } from './usecase';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { IAuthService } from '@/infrastructure/services/iauth.service';
import { Transaction } from '@/domain/entities/transaction/transaction';
import { TransactionType } from '@/domain/enum/transaction-type';

describe('GetTransactionsUseCase', () => {
  let useCase: GetTransactionsUseCase;
  let mockRepository: jest.Mocked<ITransactionRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    mockRepository = {
      getTransactionsByDateRange: jest.fn(),
    } as any;
    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
    } as any;
    useCase = new GetTransactionsUseCase(mockRepository, mockAuthService);
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    mockAuthService.getAuthenticatedUser.mockRejectedValue(new Error("Usuário não autenticado"));
    await expect(useCase.execute('2026-05')).rejects.toThrow("Usuário não autenticado");
  });

  it('deve retornar transações e sumário corretamente', async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: 'user-123' } as any);

    const mockTransactions = [
      { amount: 1000, type: TransactionType.INCOME, isPaid: true },
      { amount: 500, type: TransactionType.INCOME, isPaid: false },
      { amount: 300, type: TransactionType.EXPENSE, isPaid: true },
    ] as Transaction[];

    mockRepository.getTransactionsByDateRange.mockResolvedValue(mockTransactions);

    const result = await useCase.execute('2026-05');

    expect(mockRepository.getTransactionsByDateRange).toHaveBeenCalledWith(
      'user-123',
      expect.stringContaining('2026-05-01'), 
      expect.stringContaining('2026-05-31')
    );

    expect(result.transactions).toHaveLength(3);
    expect(result.summary.income).toBe(1000);
    expect(result.summary.expense).toBe(300);
    expect(result.summary.balance).toBe(700);
  });
});