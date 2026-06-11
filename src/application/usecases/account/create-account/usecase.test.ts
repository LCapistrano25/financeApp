import { Account } from "@/domain/entities/account/account";
import { IAuthService } from "@/application/ports/iauth.service";
import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { CreateAccountDto } from "./dto";
import { CreateAccountUseCase } from "./usecase";

describe("CreateAccountUseCase", () => {
  let useCase: CreateAccountUseCase;
  let mockRepository: jest.Mocked<IAccountRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      createAccount: jest.fn(),
    } as unknown as jest.Mocked<IAccountRepository>;

    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;

    useCase = new CreateAccountUseCase(mockRepository, mockAuthService);
  });

  it("deve lançar erro se o usuário não estiver logado", async () => {
    mockAuthService.getAuthenticatedUser.mockRejectedValue(
      new Error("Você precisa estar logado para criar uma conta.")
    );

    const payload: CreateAccountDto = {
      name: "Carteira",
      icon: "👛",
      color: "#ef4444",
    };

    await expect(useCase.execute(payload)).rejects.toThrow(
      "Você precisa estar logado para criar uma conta."
    );
  });

  it("deve criar uma conta com sucesso quando o usuário estiver logado", async () => {
    const mockUser = { id: "user-123" };
    mockAuthService.getAuthenticatedUser.mockResolvedValue(mockUser);

    const payload: CreateAccountDto = {
      name: "Nubank",
      icon: "💳",
      color: "#8b5cf6",
    };

    const mockAccount = Account.create({ ...payload, user_id: mockUser.id });
    mockRepository.createAccount.mockResolvedValue(mockAccount);

    const result = await useCase.execute(payload);

    expect(result).toBe(mockAccount);
    expect(mockRepository.createAccount).toHaveBeenCalledWith(expect.any(Account));
    const callArg = mockRepository.createAccount.mock.calls[0][0];
    expect(callArg.userId).toBe(mockUser.id);
    expect(callArg.name).toBe("Nubank");
  });
});

