import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { EditTransactionDto } from "./dto";
import { Transaction } from "@/domain/entities/transaction/transaction";
import { IEditTransactionUseCase } from "./iusecase";
import { IAuthService } from "@/application/ports/iauth.service";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { TransactionType } from "@/domain/enum/transaction-type";

export class EditTransactionUseCase implements IEditTransactionUseCase {
  constructor(
    private readonly repository: ITransactionRepository,
    private readonly authService: IAuthService,
    private readonly categoryRepository: ICategoryRepository,
    private readonly accountRepository: IAccountRepository
  ) {}
  
  async editTransaction(id: string, input: EditTransactionDto): Promise<Transaction> {
      const user = await this.authService.getAuthenticatedUser();
      const transactionType = input.type as TransactionType;
    
      // 2. Busca a transação original
      const transaction = await this.repository.getTransactionById(id);
      if (!transaction) {
        throw new Error("Transação não encontrada.");
      }
    
      // 3. Verifica se a transação pertence ao usuário
      if (transaction.userId !== user.id) {
        throw new Error("Você não tem permissão para editar esta transação.");
      }

      if (!input.category_id?.trim()) {
        throw new Error("Categoria é obrigatória.");
      }

      if (!input.account_id?.trim()) {
        throw new Error("Conta é obrigatória.");
      }

      const category = await this.categoryRepository.getCategoryById(input.category_id);
      if (!category) {
        throw new Error("Categoria não encontrada.");
      }
      if (category.userId !== user.id) {
        throw new Error("Você não tem permissão para usar esta categoria.");
      }
      if (category.type !== transactionType) {
        throw new Error("A categoria selecionada não é compatível com o tipo da transação.");
      }

      const account = await this.accountRepository.getAccountById(input.account_id);
      if (!account) {
        throw new Error("Conta não encontrada.");
      }
      if (account.userId !== user.id) {
        throw new Error("Você não tem permissão para usar esta conta.");
      }
    
      // 4. Aplica as atualizações na Entidade (Regra de Negócio)
      transaction.update({
        ...input,
        type: transactionType,
      });
    
      // 5. Salva a Entidade atualizada
      const updatedTransaction = await this.repository.updateTransaction(id, transaction);
    
      return updatedTransaction;
  }
}
