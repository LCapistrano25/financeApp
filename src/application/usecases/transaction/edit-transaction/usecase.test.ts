import { EditTransactionUseCase } from './usecase';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { Transaction } from '@/domain/entities/transaction/transaction';
import { TransactionType } from '@/domain/enum/transaction-type';
import { EditTransactionDto } from './dto';
import { IAuthService } from '@/infrastructure/services/iauth.service';

describe('EditTransactionUseCase', () => {
  let useCase: EditTransactionUseCase;    
  let mockRepository: jest.Mocked<ITransactionRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      updateTransaction: jest.fn(),
      getTransactionById: jest.fn(),
    } as any;
    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
    } as any;
    useCase = new EditTransactionUseCase(mockRepository, mockAuthService);
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    mockAuthService.getAuthenticatedUser.mockRejectedValue(new Error("Você precisa estar logado para editar uma transação."));
    await expect(useCase.editTransaction('tx-1', {
      amount: 200,
      currency: 'BRL',
      type: TransactionType.EXPENSE,
      date: '2023-10-10'
    })).rejects.toThrow("Você precisa estar logado para editar uma transação.");
  });

  it('deve lançar erro se a transação não existir', async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: 'user-123' } as any);
    mockRepository.getTransactionById.mockResolvedValue(null);

    await expect(useCase.editTransaction('tx-1', {
      amount: 200,
      currency: 'BRL',
      type: TransactionType.EXPENSE,
      date: '2023-10-10'
    })).rejects.toThrow("Transação não encontrada.");
  });

  it('deve lançar erro se o usuário não for o dono da transação', async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: 'user-123' } as any);

    const mockTransaction = Transaction.restore({
      id: 'tx-1',
      user_id: 'other-user',
      amount: 100,
      currency: 'BRL',
      type: TransactionType.EXPENSE,
      date: '2023-10-10',
      is_paid: true
    });
    mockRepository.getTransactionById.mockResolvedValue(mockTransaction);

    await expect(useCase.editTransaction('tx-1', {
      amount: 200,
      currency: 'BRL',
      type: TransactionType.EXPENSE,
      date: '2023-10-10'
    })).rejects.toThrow("Você não tem permissão para editar esta transação.");
  });

  it('deve atualizar a transação com sucesso', async () => {
    const userId = 'user-123';
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: userId } as any);

    const mockTransaction = Transaction.restore({
      id: 'tx-1',
      user_id: userId,
      amount: 100,
      currency: 'BRL',
      type: TransactionType.EXPENSE,
      date: '2023-10-10',
      is_paid: true
    });
    mockRepository.getTransactionById.mockResolvedValue(mockTransaction);
    mockRepository.updateTransaction.mockImplementation((id, entity) => Promise.resolve(entity));

    const input: EditTransactionDto = { amount: 500, currency: 'BRL', type: TransactionType.EXPENSE, date: '2023-10-10' };
    const result = await useCase.editTransaction('tx-1', input);

    expect(result.amount).toBe(500);
    expect(result.currency).toBe('BRL');
    expect(result.type).toBe(TransactionType.EXPENSE);
    expect(result.date).toBe('2023-10-10');
    expect(mockRepository.updateTransaction).toHaveBeenCalledWith('tx-1', expect.any(Transaction));
  });
});
