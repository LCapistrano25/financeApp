import { Category } from "@/domain/entities/category/category";
import { CategoryType } from "@/domain/enum/category-types";
import { IAuthService } from "@/application/ports/iauth.service";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { CreateCategoryDto } from "./dto";
import { CreateCategoryUseCase } from "./usecase";

describe("CreateCategoryUseCase", () => {
  let useCase: CreateCategoryUseCase;
  let mockRepository: jest.Mocked<ICategoryRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      createCategory: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepository>;

    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;

    useCase = new CreateCategoryUseCase(mockRepository, mockAuthService);
  });

  it("deve lançar erro se o usuário não estiver logado", async () => {
    mockAuthService.getAuthenticatedUser.mockRejectedValue(
      new Error("Você precisa estar logado para criar uma categoria.")
    );

    const payload: CreateCategoryDto = {
      name: "Mercado",
      icon: "🛒",
      color: "#ef4444",
      type: CategoryType.EXPENSE,
    };

    await expect(useCase.execute(payload)).rejects.toThrow(
      "Você precisa estar logado para criar uma categoria."
    );
  });

  it("deve criar uma categoria com sucesso quando o usuário estiver logado", async () => {
    const mockUser = { id: "user-123" };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser);

    const payload: CreateCategoryDto = {
      name: "Salário",
      icon: "💰",
      color: "#10b981",
      type: CategoryType.INCOME,
    };

    const mockCategory = Category.create({ ...payload, user_id: mockUser.id });
    mockRepository.createCategory.mockResolvedValue(mockCategory);

    const result = await useCase.execute(payload);

    expect(result).toBe(mockCategory);
    expect(mockRepository.createCategory).toHaveBeenCalledWith(expect.any(Category));
    const callArg = mockRepository.createCategory.mock.calls[0][0];
    expect(callArg.userId).toBe(mockUser.id);
    expect(callArg.name).toBe("Salário");
  });
});

