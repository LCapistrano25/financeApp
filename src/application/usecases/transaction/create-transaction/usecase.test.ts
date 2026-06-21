import { TransactionType } from '@/domain/enum/transaction-type';
import { Transaction } from '@/domain/entities/transaction/transaction';
import { CreateTransactionDto } from './dto';
import { CreateTransactionUseCase } from './usecase';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { IAuthService } from '@/application/ports/iauth.service';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { Category } from '@/domain/entities/category/category';
import { CategoryType } from '@/domain/enum/category-types';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { Account } from '@/domain/entities/account/account';
import { RepeatFrequency } from '@/domain/enum/repeat-frequency';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let mockRepository: jest.Mocked<ITransactionRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let mockCategoryRepository: jest.Mocked<ICategoryRepository>;
  let mockAccountRepository: jest.Mocked<IAccountRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      createTransaction: jest.fn(),
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
    mockAccountRepository = {
      getAccountById: jest.fn(),
    } as unknown as jest.Mocked<IAccountRepository>;
    useCase = new CreateTransactionUseCase(mockRepository, mockAuthService, mockCategoryRepository, mockAccountRepository);
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    mockAuthService.getAuthenticatedUser.mockRejectedValue(new Error("Você precisa estar logado para criar uma transação."));

    const payload: CreateTransactionDto = {
      amount: 100,
      currency: 'BRL',
      type: 'INCOME',
      date: '2023-10-10',
      is_paid: true,
      category_id: 'cat-1',
      account_id: 'acc-1',
    };

    await expect(
      useCase.execute(payload)
    ).rejects.toThrow(
      "Você precisa estar logado para criar uma transação."
    );
  });

  it('deve criar uma transação com sucesso quando o usuário estiver logado', async () => {
    const mockUser = { id: 'user-123' };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser);

    const payload: CreateTransactionDto = {
      amount: 150,
      currency: 'BRL',
      type: 'EXPENSE',
      date: '2023-10-11',
      is_paid: false,
      description: 'Teste de criação',
      category_id: 'cat-1',
      account_id: 'acc-1',
    };

    mockCategoryRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: 'cat-1',
        user_id: mockUser.id,
        name: 'Mercado',
        icon: '🛒',
        color: '#ef4444',
        type: CategoryType.EXPENSE,
        created_at: new Date().toISOString(),
      })
    );

    mockAccountRepository.getAccountById.mockResolvedValue(
      Account.restore({
        id: 'acc-1',
        user_id: mockUser.id,
        name: 'Carteira',
        icon: '👛',
        color: '#ef4444',
        created_at: new Date().toISOString(),
      })
    );

    const mockTransaction = Transaction.create({ ...payload, type: TransactionType.EXPENSE, user_id: 'user-123' });
    mockRepository.createTransaction.mockResolvedValue(mockTransaction);

    const result = await useCase.execute(payload);

    expect(result).toBe(mockTransaction);
    expect(mockRepository.createTransaction).toHaveBeenCalledWith(
      expect.any(Transaction)
    );
    
    const callArg = mockRepository.createTransaction.mock.calls[0][0];
    expect(callArg.userId).toBe('user-123');
    expect(callArg.amount).toBe(150);
  });

  it('deve validar categoria quando category_id for informado', async () => {
    const mockUser = { id: 'user-123' };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser);

    const payload: CreateTransactionDto = {
      amount: 10,
      currency: 'BRL',
      type: 'EXPENSE',
      date: '2023-10-11',
      is_paid: true,
      category_id: 'cat-1',
      account_id: 'acc-1',
    };

    mockCategoryRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: 'cat-1',
        user_id: mockUser.id,
        name: 'Mercado',
        icon: '🛒',
        color: '#ef4444',
        type: CategoryType.EXPENSE,
        created_at: new Date().toISOString(),
      })
    );

    mockAccountRepository.getAccountById.mockResolvedValue(
      Account.restore({
        id: 'acc-1',
        user_id: mockUser.id,
        name: 'Carteira',
        icon: '👛',
        color: '#ef4444',
        created_at: new Date().toISOString(),
      })
    );

    const mockTransaction = Transaction.create({ ...payload, type: TransactionType.EXPENSE, user_id: mockUser.id });
    mockRepository.createTransaction.mockResolvedValue(mockTransaction);

    await useCase.execute(payload);
    expect(mockCategoryRepository.getCategoryById).toHaveBeenCalledWith('cat-1');
    expect(mockRepository.createTransaction).toHaveBeenCalled();
  });

  it('deve validar conta quando account_id for informado', async () => {
    const mockUser = { id: 'user-123' };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser);

    const payload: CreateTransactionDto = {
      amount: 10,
      currency: 'BRL',
      type: 'EXPENSE',
      date: '2023-10-11',
      is_paid: true,
      category_id: 'cat-1',
      account_id: 'acc-1',
    };

    mockCategoryRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: 'cat-1',
        user_id: mockUser.id,
        name: 'Mercado',
        icon: '🛒',
        color: '#ef4444',
        type: CategoryType.EXPENSE,
        created_at: new Date().toISOString(),
      })
    );

    mockAccountRepository.getAccountById.mockResolvedValue(
      Account.restore({
        id: 'acc-1',
        user_id: mockUser.id,
        name: 'Carteira',
        icon: '👛',
        color: '#ef4444',
        created_at: new Date().toISOString(),
      })
    );

    const mockTransaction = Transaction.create({ ...payload, type: TransactionType.EXPENSE, user_id: mockUser.id });
    mockRepository.createTransaction.mockResolvedValue(mockTransaction);

    await useCase.execute(payload);
    expect(mockAccountRepository.getAccountById).toHaveBeenCalledWith('acc-1');
    expect(mockRepository.createTransaction).toHaveBeenCalled();
  });

  it('deve lançar erro quando a conta não existir', async () => {
    const mockUser = { id: 'user-123' };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser);

    const payload: CreateTransactionDto = {
      amount: 10,
      currency: 'BRL',
      type: 'EXPENSE',
      date: '2023-10-11',
      is_paid: true,
      category_id: 'cat-1',
      account_id: 'acc-1',
    };

    mockCategoryRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: 'cat-1',
        user_id: mockUser.id,
        name: 'Mercado',
        icon: '🛒',
        color: '#ef4444',
        type: CategoryType.EXPENSE,
        created_at: new Date().toISOString(),
      })
    );

    mockAccountRepository.getAccountById.mockResolvedValue(null);

    await expect(useCase.execute(payload)).rejects.toThrow("Conta não encontrada.");
    expect(mockRepository.createTransaction).not.toHaveBeenCalled();
  });

  it('deve lançar erro quando a categoria não for compatível com o tipo da transação', async () => {
    const mockUser = { id: 'user-123' };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser);

    const payload: CreateTransactionDto = {
      amount: 10,
      currency: 'BRL',
      type: 'EXPENSE',
      date: '2023-10-11',
      is_paid: true,
      category_id: 'cat-1',
      account_id: 'acc-1',
    };

    mockCategoryRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: 'cat-1',
        user_id: mockUser.id,
        name: 'Salário',
        icon: '💰',
        color: '#10b981',
        type: CategoryType.INCOME,
        created_at: new Date().toISOString(),
      })
    );

    mockAccountRepository.getAccountById.mockResolvedValue(
      Account.restore({
        id: 'acc-1',
        user_id: mockUser.id,
        name: 'Carteira',
        icon: '👛',
        color: '#ef4444',
        created_at: new Date().toISOString(),
      })
    );

    await expect(useCase.execute(payload)).rejects.toThrow(
      "A categoria selecionada não é compatível com o tipo da transação."
    );
    expect(mockRepository.createTransaction).not.toHaveBeenCalled();
  });

  it('deve gerar e salvar transações recorrentes quando repeat for true', async () => {
    const mockUser = { id: 'user-123' };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser);

    const payload: CreateTransactionDto = {
      amount: 150,
      currency: 'BRL',
      type: 'EXPENSE',
      date: '2023-10-11',
      is_paid: true,
      description: 'Assinatura',
      category_id: 'cat-1',
      account_id: 'acc-1',
      repeat: true,
      repeat_frequency: RepeatFrequency.MONTHS,
      repeat_times: 2,
    };

    mockCategoryRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: 'cat-1',
        user_id: mockUser.id,
        name: 'Lazer',
        icon: '🍿',
        color: '#ef4444',
        type: CategoryType.EXPENSE,
        created_at: new Date().toISOString(),
      })
    );

    mockAccountRepository.getAccountById.mockResolvedValue(
      Account.restore({
        id: 'acc-1',
        user_id: mockUser.id,
        name: 'Carteira',
        icon: '👛',
        color: '#ef4444',
        created_at: new Date().toISOString(),
      })
    );

    const mockTransaction = Transaction.create({ ...payload, type: TransactionType.EXPENSE, user_id: 'user-123' });
    mockRepository.createTransaction.mockResolvedValue(mockTransaction);

    await useCase.execute(payload);

    // 1 transação original + 2 repetições = 3 chamadas totais ao repositório
    expect(mockRepository.createTransaction).toHaveBeenCalledTimes(3);
    
    // Verifica se a primeira chamada foi a transação original (neste caso, repeat e isPaid devem ser verdadeiros)
    expect(mockRepository.createTransaction.mock.calls[0][0].repeat).toBe(true);
    expect(mockRepository.createTransaction.mock.calls[0][0].isPaid).toBe(true);

    // Verifica se a segunda chamada foi uma filha gerada pelo Domain Service
    expect(mockRepository.createTransaction.mock.calls[1][0].repeat).toBe(false); // Herdeira não repete
    expect(mockRepository.createTransaction.mock.calls[1][0].isPaid).toBe(false); // Herdeira nasce não paga
  });
});