import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { supabase } from "@/infrastructure/supabase/supabase.client";
import { EditTransactionDto } from "./edit-transaction.dto";
import { Transaction } from "@/domain/entities/transaction/transaction";
import { IEditTransactionUseCase } from "./iedit-transaction";

export class EditTransactionUseCase implements IEditTransactionUseCase {
  private repository: ITransactionRepository;
   
  constructor(repository: ITransactionRepository) {
       this.repository = repository;
  }
  
  async editTransaction(id: string, input: EditTransactionDto): Promise<Transaction> {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("Você precisa estar logado para editar uma transação.");
      }
    
      // 2. Busca a transação original
      const transaction = await this.repository.getTransactionById(id);
      if (!transaction) {
        throw new Error("Transação não encontrada.");
      }
    
      // 3. Verifica se a transação pertence ao usuário
      if (transaction.userId !== session.user.id) {
        throw new Error("Você não tem permissão para editar esta transação.");
      }
    
      // 4. Aplica as atualizações na Entidade (Regra de Negócio)
      transaction.update(input);
    
      // 5. Salva a Entidade atualizada
      const updatedTransaction = await this.repository.updateTransaction(id, transaction);
    
      return updatedTransaction;
  }
}
