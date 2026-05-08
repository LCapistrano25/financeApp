import { transactionRepository } from '../../../../infrastructure/supabase/transaction.repository';
import { supabase } from '../../../../infrastructure/supabase/supabase.client';
import { Transaction } from '../../../../domain/entities/transaction';

export type CreateTransactionInput = Omit<Transaction, 'id' | 'user_id' | 'created_at'>;

export async function createTransactionHandler(input: CreateTransactionInput): Promise<Transaction> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Você precisa estar logado para criar uma transação.");
  }

  // PREPARAÇÃO DOS DADOS (O FIX ESTÁ AQUI)
  const payloadToInsert = {
    ...input,
    user_id: session.user.id,
  };

  // Removemos a coluna que não existe no banco
  // O TypeScript vai reclamar um pouco porque title é obrigatório no Omit, 
  // então usamos um as any temporário ou apenas deletamos a chave
  if ('title' in payloadToInsert) {
     delete (payloadToInsert as any).title; 
  }

  const newTransaction = await transactionRepository.createTransaction(payloadToInsert);

  return newTransaction;
}