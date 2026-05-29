import { Category } from "@/domain/entities/category/category";
import { CategoryType } from "@/domain/enum/category-types";
import { IAuthService } from "@/application/ports/iauth.service";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { DeleteCategoryUseCase } from "./usecase";

describe("DeleteCategoryUseCase", () => {
  let useCase: DeleteCategoryUseCase;
  let mockRepository: jest.Mocked<ICategoryRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      getCategoryById: jest.fn(),
      deleteCategory: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepository>;

    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;

    useCase = new DeleteCategoryUseCase(mockRepository, mockAuthService);
  });

  it("deve lançar erro quando a categoria não existir", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    mockRepository.getCategoryById.mockResolvedValue(null);

    await expect(useCase.execute("cat-1")).rejects.toThrow("Categoria não encontrada.");
  });

  it("deve lançar erro quando a categoria não pertencer ao usuário", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    mockRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: "cat-1",
        user_id: "user-2",
        name: "Mercado",
        icon: "🛒",
        color: "#ef4444",
        type: CategoryType.EXPENSE,
        created_at: new Date().toISOString(),
      })
    );

    await expect(useCase.execute("cat-1")).rejects.toThrow(
      "Você não tem permissão para deletar esta categoria."
    );
  });

  it("deve deletar a categoria com sucesso", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    mockRepository.getCategoryById.mockResolvedValue(
      Category.restore({
        id: "cat-1",
        user_id: "user-1",
        name: "Mercado",
        icon: "🛒",
        color: "#ef4444",
        type: CategoryType.EXPENSE,
        created_at: new Date().toISOString(),
      })
    );

    await useCase.execute("cat-1");

    expect(mockRepository.deleteCategory).toHaveBeenCalledWith("cat-1");
  });
});

