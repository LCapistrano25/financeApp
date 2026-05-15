import { deleteTransactionHandler } from './delete-transaction.handler';
import { transactionRepository } from '../../../../infrastructure/supabase/transaction.repository';
import { supabase } from '../../../../infrastructure/supabase/supabase.client';

jest.mock('../../../../infrastructure/supabase/transaction.repository', () => ({
  transactionRepository: {
    deleteTransaction: jest.fn(),
  },
}));

jest.mock('../../../../infrastructure/supabase/supabase.client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe('deleteTransactionHandler', () => {
  it('deve lançar erro se o usuário não estiver logado', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });
    await expect(deleteTransactionHandler('tx-1')).rejects.toThrow("Você precisa estar logado para deletar uma transação.");
  });

  it('deve deletar a transação com sucesso', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: 'user-123' } } }
    });

    await deleteTransactionHandler('tx-1');
    expect(transactionRepository.deleteTransaction).toHaveBeenCalledWith('tx-1');
  });
});