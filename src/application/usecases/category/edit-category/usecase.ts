import { IAuthService } from "@/application/ports/iauth.service";
import { Category } from "@/domain/entities/category/category";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { EditCategoryDto } from "./dto";
import { IEditCategoryUseCase } from "./iusecase";

export class EditCategoryUseCase implements IEditCategoryUseCase {
  constructor(
    private readonly repository: ICategoryRepository,
    private readonly authService: IAuthService
  ) {}

  async editCategory(id: string, input: EditCategoryDto): Promise<Category> {
    const user = await this.authService.getAuthenticatedUser();

    const category = await this.repository.getCategoryById(id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }

    if (category.userId !== user.id) {
      throw new Error("Você não tem permissão para editar esta categoria.");
    }

    category.update(input);

    return this.repository.updateCategory(id, category);
  }
}

