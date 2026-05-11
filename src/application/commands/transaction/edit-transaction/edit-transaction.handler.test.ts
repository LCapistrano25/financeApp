import { editTransactionHandler } from './edit-transaction.handler';
import { transactionRepository } from '@/infrastructure/supabase/transaction.repository';
import { supabase } from '@/infrastructure/supabase/supabase.client';

jest.mock('@/infrastructure/supabase/transaction.repository', () => ({
  transactionRepository: {
    updateTransaction: jest.fn(),
  },
}));

jest.mock('@/infrastructure/supabase/supabase.client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
  },
}));

describe('editTransactionHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });

    await expect(editTransactionHandler('tx-1', { amount: 200 })).rejects.toThrow("Você precisa estar logado para editar uma transação.");
  });

});