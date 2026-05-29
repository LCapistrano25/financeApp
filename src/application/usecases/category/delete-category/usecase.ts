import { IAuthService } from "@/application/ports/iauth.service";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { IDeleteCategoryUseCase } from "./iusecase";

export class DeleteCategoryUseCase implements IDeleteCategoryUseCase {
  constructor(
    private readonly repository: ICategoryRepository,
    private readonly authService: IAuthService,
    private readonly transactionRepository: ITransactionRepository
  ) {}

  async execute(id: string): Promise<void> {
    const user = await this.authService.getAuthenticatedUser();

    const category = await this.repository.getCategoryById(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    if (category.userId !== user.id) {
      throw new Error("Você não tem permissão para deletar esta categoria.");
    }

    const hasTransactions = await this.transactionRepository.hasTransactionsWithCategoryId(id);
    if (hasTransactions) {
      throw new Error("Não é possível deletar esta categoria porque existem transações vinculadas a ela.");
    }

    await this.repository.deleteCategory(id);
  }
}
