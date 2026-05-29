import { supabase } from '@/infrastructure/supabase/supabase.client';
import { transactionRepository } from '@/infrastructure/supabase/transaction.repository';
import { TransactionType } from '@/domain/enum/transaction-type';
import { Transaction } from '@/domain/entities/transaction/transaction';
import { CreateTransactionDto } from './create-transaction.dto';
import { CreateTransactionUseCase } from './create-transaction.usecase';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';

// 1. Fazemos o mock das dependências externas (banco de dados)
jest.mock('@/infrastructure/supabase/transaction.repository', () => ({
  transactionRepository: {
    createTransaction: jest.fn(),
  },
}));

jest.mock('@/infrastructure/supabase/supabase.client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe('CreateTransactionUseCase', () => {
  let useCase: CreateTransactionUseCase;
  let mockRepository: jest.Mocked<ITransactionRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      createTransaction: jest.fn(),
      getTransactionById: jest.fn(),
      getTransactionsByDateRange: jest.fn(),
      updateTransaction: jest.fn(),
      deleteTransaction: jest.fn(),
    } as any;
    useCase = new CreateTransactionUseCase(mockRepository);
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    // Simula usuário deslogado
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });

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
    const mockSession = { user: { id: 'user-123' } };
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: mockSession } });

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