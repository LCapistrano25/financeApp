import { transactionRepository } from '../../../../infrastructure/supabase/transaction.repository';
import { supabase } from '../../../../infrastructure/supabase/supabase.client';
import { Transaction } from '../../../../domain/entities/transaction';

export type EditTransactionInput = Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>;

export async function editTransactionHandler(id: string, input: EditTransactionInput): Promise<Transaction> {
  // 1. Validação de Usuário
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error("Você precisa estar logado para editar uma transação.");
  }

  // 2. PREPARAÇÃO DOS DADOS (O FIX ESTÁ AQUI)
  // Fazemos uma cópia do input para não modificar o objeto original
  const payloadToUpdate = { ...input };

  // Se o título vier no payload, nós o excluímos, pois o banco 
  // do Supabase não possui essa coluna. Nós já garantimos no
  // formulário que o texto do title foi copiado para description.
  if ('title' in payloadToUpdate) {
    delete payloadToUpdate.title;
  }

  // 3. Execução
  const updatedTransaction = await transactionRepository.updateTransaction(id, payloadToUpdate);

  return updatedTransaction;
}