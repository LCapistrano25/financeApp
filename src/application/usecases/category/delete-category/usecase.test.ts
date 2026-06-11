import { Category } from "@/domain/entities/category/category";
import { CategoryType } from "@/domain/enum/category-types";
import { IAuthService } from "@/application/ports/iauth.service";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { DeleteCategoryUseCase } from "./usecase";

describe("DeleteCategoryUseCase", () => {
  let useCase: DeleteCategoryUseCase;
  let mockRepository: jest.Mocked<ICategoryRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;
  let mockTransactionRepository: jest.Mocked<ITransactionRepository>;

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

    mockTransactionRepository = {
      hasTransactionsWithCategoryId: jest.fn(),
    } as unknown as jest.Mocked<ITransactionRepository>;

    useCase = new DeleteCategoryUseCase(mockRepository, mockAuthService, mockTransactionRepository);
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
    mockTransactionRepository.hasTransactionsWithCategoryId.mockResolvedValue(false);

    await useCase.execute("cat-1");

    expect(mockRepository.deleteCategory).toHaveBeenCalledWith("cat-1");
  });

  it("não deve deletar a categoria quando houver transações vinculadas", async () => {
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
    mockTransactionRepository.hasTransactionsWithCategoryId.mockResolvedValue(true);

    await expect(useCase.execute("cat-1")).rejects.toThrow(
      "Não é possível deletar esta categoria porque existem transações vinculadas a ela."
    );
    expect(mockRepository.deleteCategory).not.toHaveBeenCalled();
  });
});
