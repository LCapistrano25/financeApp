import { Account } from "@/domain/entities/account/account";
import { IAuthService } from "@/application/ports/iauth.service";
import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { GetAccountsUseCase } from "./usecase";

describe("GetAccountsUseCase", () => {
  let useCase: GetAccountsUseCase;
  let mockRepository: jest.Mocked<IAccountRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      getAccountsByUserId: jest.fn(),
    } as unknown as jest.Mocked<IAccountRepository>;

    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;

    useCase = new GetAccountsUseCase(mockRepository, mockAuthService);
  });

  it("deve retornar as contas do usuário autenticado", async () => {
    const mockUser = { id: "user-1" };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser);

    const accounts = [
      Account.restore({
        id: "acc-1",
        user_id: mockUser.id,
        name: "Carteira",
        icon: "👛",
        color: "#ef4444",
        created_at: new Date().toISOString(),
      }),
    ];

    mockRepository.getAccountsByUserId.mockResolvedValue(accounts);

    const result = await useCase.execute();

    expect(result).toEqual(accounts);
    expect(mockRepository.getAccountsByUserId).toHaveBeenCalledWith(mockUser.id);
  });
});

