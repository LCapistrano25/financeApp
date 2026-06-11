import { IAuthService } from "@/application/ports/iauth.service";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { Category } from "@/domain/entities/category/category";
import { IGetCategoriesUseCase } from "./iusecase";

export class GetCategoriesUseCase implements IGetCategoriesUseCase {
  constructor(
    private readonly repository: ICategoryRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(): Promise<Category[]> {
    const user = await this.authService.getAuthenticatedUser();
    return this.repository.getCategoriesByUserId(user.id);
  }
}

