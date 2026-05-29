import { Category } from "@/domain/entities/category/category";
import { CategoryType } from "@/domain/enum/category-types";
import { IAuthService } from "@/application/ports/iauth.service";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { EditCategoryDto } from "./dto";
import { EditCategoryUseCase } from "./usecase";

describe("EditCategoryUseCase", () => {
  let useCase: EditCategoryUseCase;
  let mockRepository: jest.Mocked<ICategoryRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      getCategoryById: jest.fn(),
      updateCategory: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepository>;

    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;

    useCase = new EditCategoryUseCase(mockRepository, mockAuthService);
  });

  it("deve lançar erro quando a categoria não existir", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    mockRepository.getCategoryById.mockResolvedValue(null);

    const payload: EditCategoryDto = {
      name: "Transporte",
      icon: "🚌",
      color: "#3b82f6",
      type: CategoryType.EXPENSE,
    };

    await expect(useCase.editCategory("cat-1", payload)).rejects.toThrow("Categoria não encontrada.");
  });

  it("deve lançar erro quando a categoria não pertencer ao usuário", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    mockRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: "cat-1",
        user_id: "user-2",
        name: "Transporte",
        icon: "🚌",
        color: "#3b82f6",
        type: CategoryType.EXPENSE,
        created_at: new Date().toISOString(),
      })
    );

    const payload: EditCategoryDto = {
      name: "Transporte",
      icon: "🚌",
      color: "#3b82f6",
      type: CategoryType.EXPENSE,
    };

    await expect(useCase.editCategory("cat-1", payload)).rejects.toThrow(
      "Você não tem permissão para editar esta categoria."
    );
  });

  it("deve atualizar a categoria com sucesso", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    const existing = Category.restore({
      id: "cat-1",
      user_id: "user-1",
      name: "Transporte",
      icon: "🚌",
      color: "#3b82f6",
      type: CategoryType.EXPENSE,
      created_at: new Date().toISOString(),
    });
    mockRepository.getCategoryById.mockResolvedValue(existing);

    const payload: EditCategoryDto = {
      name: "Transporte (novo)",
      icon: "🚌",
      color: "#3b82f6",
      type: CategoryType.EXPENSE,
    };

    mockRepository.updateCategory.mockResolvedValue(existing);

    const result = await useCase.editCategory("cat-1", payload);

    expect(result).toBe(existing);
    expect(existing.name).toBe("Transporte (novo)");
    expect(mockRepository.updateCategory).toHaveBeenCalledWith("cat-1", existing);
  });
});

