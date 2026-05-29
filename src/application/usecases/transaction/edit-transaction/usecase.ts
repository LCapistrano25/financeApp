import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { EditTransactionDto } from "./dto";
import { Transaction } from "@/domain/entities/transaction/transaction";
import { IEditTransactionUseCase } from "./iusecase";
import { IAuthService } from "@/application/ports/iauth.service";

export class EditTransactionUseCase implements IEditTransactionUseCase {
  constructor(
    private readonly repository: ITransactionRepository,
    private readonly authService: IAuthService
  ) {}
  
  async editTransaction(id: string, input: EditTransactionDto): Promise<Transaction> {
      const user = await this.authService.getAuthenticatedUser();
    
      // 2. Busca a transação original
      const transaction = await this.repository.getTransactionById(id);
      if (!transaction) {
        throw new Error("Transação não encontrada.");
      }
    
      // 3. Verifica se a transação pertence ao usuário
      if (transaction.userId !== user.id) {
        throw new Error("Você não tem permissão para editar esta transação.");
      }
    
      // 4. Aplica as atualizações na Entidade (Regra de Negócio)
      transaction.update(input);
    
      // 5. Salva a Entidade atualizada
      const updatedTransaction = await this.repository.updateTransaction(id, transaction);
    
      return updatedTransaction;
  }
}
