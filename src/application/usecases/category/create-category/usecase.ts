import { Category } from "@/domain/entities/category/category";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { IAuthService } from "@/application/ports/iauth.service";
import { CreateCategoryDto } from "./dto";
import { ICreateCategoryUseCase } from "./iusecase";

export class CreateCategoryUseCase implements ICreateCategoryUseCase {
  constructor(
    private readonly repository: ICategoryRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(input: CreateCategoryDto): Promise<Category> {
    const user = await this.authService.getAuthenticatedUser();

    const category = Category.create({
      ...input,
      user_id: user.id,
    });

    return this.repository.createCategory(category);
  }
}

