import { transactionRepository } from '../../../../infrastructure/supabase/transaction.repository';
import { supabase } from '../../../../infrastructure/supabase/supabase.client';

export async function deleteTransactionHandler(id: string): Promise<void> {
  // 1. Validação de Segurança
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Você precisa estar logado para deletar uma transação.");
  }

  // 2. Execução
  await transactionRepository.deleteTransaction(id);
}