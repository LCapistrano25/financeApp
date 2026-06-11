import { Category } from "@/domain/entities/category/category";
import { CategoryType } from "@/domain/enum/category-types";
import { IAuthService } from "@/application/ports/iauth.service";
import { ICategoryRepository } from "@/domain/repositories/ICategoryRepository";
import { GetCategoriesUseCase } from "./usecase";

describe("GetCategoriesUseCase", () => {
  let useCase: GetCategoriesUseCase;
  let mockRepository: jest.Mocked<ICategoryRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      getCategoriesByUserId: jest.fn(),
    } as unknown as jest.Mocked<ICategoryRepository>;

    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;

    useCase = new GetCategoriesUseCase(mockRepository, mockAuthService);
  });

  it("deve retornar as categorias do usuário autenticado", async () => {
    const mockUser = { id: "user-1" };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser);

    const categories = [
      Category.restore({
        id: "cat-1",
        user_id: mockUser.id,
        name: "Mercado",
        icon: "🛒",
        color: "#ef4444",
        type: CategoryType.EXPENSE,
        created_at: new Date().toISOString(),
      }),
    ];

    mockRepository.getCategoriesByUserId.mockResolvedValue(categories);

    const result = await useCase.execute();

    expect(result).toEqual(categories);
    expect(mockRepository.getCategoriesByUserId).toHaveBeenCalledWith(mockUser.id);
  });
});

