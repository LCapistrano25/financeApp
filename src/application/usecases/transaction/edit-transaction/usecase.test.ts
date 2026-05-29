import { EditTransactionUseCase } from './usecase';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { Transaction } from '@/domain/entities/transaction/transaction';
import { TransactionType } from '@/domain/enum/transaction-type';
import { EditTransactionDto } from './dto';
import { IAuthService } from '@/application/ports/iauth.service';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { Category } from '@/domain/entities/category/category';
import { CategoryType } from '@/domain/enum/category-types';

describe('EditTransactionUseCase', () => {
  let useCase: EditTransactionUseCase;    
  let mockRepository: jest.Mocked<ITransactionRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      updateTransaction: jest.fn(),
      getTransactionById: jest.fn(),
    } as unknown as jest.Mocked<ITransactionRepository>;
    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;
    mockCategoryRepository = {
      getCategoryById: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepository>;
    useCase = new EditTransactionUseCase(mockRepository, mockAuthService, mockCategoryRepository);
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
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: 'user-123' });
    mockRepository.getTransactionById.mockResolvedValue(null);

    await expect(useCase.editTransaction('tx-1', {
      amount: 200,
      currency: 'BRL',
      type: TransactionType.EXPENSE,
      date: '2023-10-10'
    })).rejects.toThrow("Transação não encontrada.");
  });

  it('deve lançar erro se o usuário não for o dono da transação', async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: 'user-123' });

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
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: userId });

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

  it('deve validar categoria quando category_id for informado', async () => {
    const userId = 'user-123';
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: userId });

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

    mockCategoryRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: 'cat-1',
        user_id: userId,
        name: 'Mercado',
        icon: '🛒',
        color: '#ef4444',
        type: CategoryType.EXPENSE,
        created_at: new Date().toISOString(),
      })
    );

    const input: EditTransactionDto = {
      amount: 500,
      currency: 'BRL',
      type: TransactionType.EXPENSE,
      date: '2023-10-10',
      category_id: 'cat-1',
    };

    await useCase.editTransaction('tx-1', input);
    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledWith('cat-1');
  });

  it('deve lançar erro quando a categoria não for compatível com o tipo da transação', async () => {
    const userId = 'user-123';
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: userId });

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

    mockCategoryRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: 'cat-1',
        user_id: userId,
        name: 'Salário',
        icon: '💰',
        color: '#10b981',
        type: CategoryType.INCOME,
        created_at: new Date().toISOString(),
      })
    );

    const input: EditTransactionDto = {
      amount: 500,
      currency: 'BRL',
      type: TransactionType.EXPENSE,
      date: '2023-10-10',
      category_id: 'cat-1',
    };

    await expect(useCase.editTransaction('tx-1', input)).rejects.toThrow(
      "A categoria selecionada não é compatível com o tipo da transação."
    );
    expect(mockRepository.updateTransaction).not.toHaveBeenCalled();
  });
});
