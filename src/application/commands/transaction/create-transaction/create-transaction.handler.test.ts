import { createTransactionHandler } from './create-transaction.handler';
import { supabase } from '@/infrastructure/supabase/supabase.client';

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

describe('createTransactionHandler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve lançar erro se o usuário não estiver logado', async () => {
    // Simula usuário deslogado
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({ data: { session: null } });

    const payload = {
      amount: 100,
      currency: 'BRL',
      type: 'INCOME',
      date: '2023-10-10',
      is_paid: true,
    } satisfies Omit<
      Parameters<typeof createTransactionHandler>[0],
      'user_id'
    >;

    await expect(
      createTransactionHandler(payload)
    ).rejects.toThrow(
      "Você precisa estar logado para criar uma transação."
    );
  });
});