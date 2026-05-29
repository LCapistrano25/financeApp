import { IAuthService } from "@/application/ports/iauth.service";
import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { IDeleteAccountUseCase } from "./iusecase";

export class DeleteAccountUseCase implements IDeleteAccountUseCase {
  constructor(
    private readonly repository: IAccountRepository,
    private readonly authService: IAuthService,
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.authService.getAuthenticatedUser();

    const account = await this.repository.getAccountById(id);
    if (!account) {
      throw new Error("Conta não encontrada.");
    }

    if (account.userId !== user.id) {
      throw new Error("Você não tem permissão para deletar esta conta.");
    }

    const hasTransactions = await this.transactionRepository.hasTransactionsWithAccountId(id);
    if (hasTransactions) {
      throw new Error("Não é possível deletar esta conta porque existem transações vinculadas a ela.");
    }

    await this.repository.deleteAccount(id);
  }
}
