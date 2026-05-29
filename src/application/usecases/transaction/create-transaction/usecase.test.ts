import { TransactionType } from '@/domain/enum/transaction-type';
import { Transaction } from '@/domain/entities/transaction/transaction';
import { CreateTransactionDto } from './dto';
import { CreateTransactionUseCase } from './usecase';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { IAuthService } from '../../../services/iauth.service';

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let mockRepository: jest.Mocked<ITransactionRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      createTransaction: jest.fn(),
    } as any;
    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
    };
    useCase = new CreateTransactionUseCase(mockRepository, mockAuthService);
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    // Simula usuário deslogado
    mockAuthService.getAuthenticatedUser.mockRejectedValue(new Error("Você precisa estar logado para criar uma transação."));

    const payload: CreateTransactionDto = {
      amount: 100,
      currency: 'BRL',
      type: TransactionType.INCOME,
      date: '2023-10-10',
      is_paid: true,
    };

    await expect(
      useCase.execute(payload)
    ).rejects.toThrow(
      "Você precisa estar logado para criar uma transação."
    );
  });

  it('deve criar uma transação com sucesso quando o usuário estiver logado', async () => {
    // Simula usuário logado
    const mockUser = { id: 'user-123' };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser as any);

    const payload: CreateTransactionDto = {
      amount: 150,
      currency: 'BRL',
      type: TransactionType.EXPENSE,
      date: '2023-10-11',
      is_paid: false,
      description: 'Teste de criação'
    };

    // Criamos uma instância fake da entidade para o retorno do mock
    const mockTransaction = Transaction.create({ ...payload, user_id: 'user-123' });
    mockRepository.createTransaction.mockResolvedValue(mockTransaction);

    const result = await useCase.execute(payload);

    expect(result).toBe(mockTransaction);
    expect(mockRepository.createTransaction).toHaveBeenCalledWith(
      expect.any(Transaction)
    );
    
    // Verifica se a entidade passada para o repositório tem os dados corretos
    const callArg = mockRepository.createTransaction.mock.calls[0][0];
    expect(callArg.userId).toBe('user-123');
    expect(callArg.amount).toBe(150);
  });
});