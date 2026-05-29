import { transactionRepository } from '@/infrastructure/supabase/transaction.repository';
import { supabase } from '@/infrastructure/supabase/supabase.client';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { IDeleteTransactionUseCase } from './idelete-transaction.usecase';


export class DeleteTransactionUseCase implements IDeleteTransactionUseCase {
  private repository: ITransactionRepository;
   
  constructor(repository: ITransactionRepository) {
       this.repository = repository;
  }
  
  async execute(id: string): Promise<void> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Você precisa estar logado para deletar uma transação.");
    }

    const transaction = await this.repository.getTransactionById(id);
    if (!transaction) {
      throw new Error("Transação não encontrada.");
    }

    if (transaction.userId !== session.user.id) {
      throw new Error("Você não tem permissão para deletar esta transação.");
    }

    await this.repository.deleteTransaction(id);
  }
}
