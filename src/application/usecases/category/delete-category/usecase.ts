import { IAuthService } from "@/application/ports/iauth.service";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { IDeleteCategoryUseCase } from "./iusecase";

export class DeleteCategoryUseCase implements IDeleteCategoryUseCase {
  constructor(
    private readonly repository: ICategoryRepository,
    private readonly authService: IAuthService
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

    await this.repository.deleteCategory(id);
  }
}

