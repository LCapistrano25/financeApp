import { DeleteTransactionUseCase } from './delete-transaction.usecase';
import { supabase } from '@/infrastructure/supabase/supabase.client';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { Transaction } from '@/domain/entities/transaction/transaction';
import { TransactionType } from '@/domain/enum/transaction-type';

jest.mock('@/infrastructure/supabase/supabase.client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe('DeleteTransactionUseCase', () => {
  let useCase: DeleteTransactionUseCase;
  let mockRepository: jest.Mocked<ITransactionRepository>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      deleteTransaction: jest.fn(),
      getTransactionById: jest.fn(),
    } as any;
    useCase = new DeleteTransactionUseCase(mockRepository);
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });
    await expect(useCase.execute('tx-1')).rejects.toThrow("Você precisa estar logado para deletar uma transação.");
  });

  it('deve lançar erro se a transação não existir', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } }
    });
    mockRepository.getTransactionById.mockResolvedValue(null);

    await expect(useCase.execute('tx-1')).rejects.toThrow("Transação não encontrada.");
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

    await expect(useCase.execute('tx-1')).rejects.toThrow("Você não tem permissão para deletar esta transação.");
  });

  it('deve deletar a transação com sucesso', async () => {
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
    mockRepository.deleteTransaction.mockResolvedValue(undefined);

    await useCase.execute('tx-1');
    expect(mockRepository.deleteTransaction).toHaveBeenCalledWith('tx-1');
  });
});
