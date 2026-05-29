import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { IDeleteTransactionUseCase } from './iusecase';
import { IAuthService } from '../../../../infrastructure/services/iauth.service';


export class DeleteTransactionUseCase implements IDeleteTransactionUseCase {
  constructor(
    private repository: ITransactionRepository,
    private authService: IAuthService
  ) {}
  
  async execute(id: string): Promise<void> {
    const user = await this.authService.getAuthenticatedUser();

    const transaction = await this.repository.getTransactionById(id);
    if (!transaction) {
      throw new Error("Transação não encontrada.");
    }

    if (transaction.userId !== user.id) {
      throw new Error("Você não tem permissão para deletar esta transação.");
    }

    await this.repository.deleteTransaction(id);
  }
}
