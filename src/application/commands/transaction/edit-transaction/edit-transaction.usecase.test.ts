import { EditTransactionUseCase } from './edit-transaction.usecase';
import { supabase } from '@/infrastructure/supabase/supabase.client';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { Transaction } from '@/domain/entities/transaction/transaction';
import { TransactionType } from '@/domain/enum/transaction-type';
import { EditTransactionDto } from './edit-transaction.dto';

jest.mock('@/infrastructure/supabase/supabase.client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe('EditTransactionUseCase', () => {
  let useCase: EditTransactionUseCase;
  let mockRepository: jest.Mocked<ITransactionRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      updateTransaction: jest.fn(),
      getTransactionById: jest.fn(),
    } as any;
    useCase = new EditTransactionUseCase(mockRepository);
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });
    await expect(useCase.editTransaction('tx-1', { amount: 200 })).rejects.toThrow("Você precisa estar logado para editar uma transação.");
  });

  it('deve lançar erro se a transação não existir', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } }
    });
    mockRepository.getTransactionById.mockResolvedValue(null);

    await expect(useCase.editTransaction('tx-1', { amount: 200 })).rejects.toThrow("Transação não encontrada.");
  });

  it('deve lançar erro se o usuário não for o dono da transação', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } }
    });

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

    await expect(useCase.editTransaction('tx-1', { amount: 200 })).rejects.toThrow("Você não tem permissão para editar esta transação.");
  });

  it('deve atualizar a transação com sucesso', async () => {
    const userId = 'user-123';
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: userId } } }
    });

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

    const input: EditTransactionDto = { amount: 500, description: 'Nova descrição' };
    const result = await useCase.editTransaction('tx-1', input);

    expect(result.amount).toBe(500);
    expect(result.description).toBe('Nova descrição');
    expect(mockRepository.updateTransaction).toHaveBeenCalledWith('tx-1', expect.any(Transaction));
  });
});
