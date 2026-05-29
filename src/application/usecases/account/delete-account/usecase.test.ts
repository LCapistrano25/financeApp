import { Account } from "@/domain/entities/account/account";
import { IAuthService } from "@/application/ports/iauth.service";
import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { DeleteAccountUseCase } from "./usecase";

describe("DeleteAccountUseCase", () => {
  let useCase: DeleteAccountUseCase;
  let mockRepository: jest.Mocked<IAccountRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      getAccountById: jest.fn(),
      deleteAccount: jest.fn(),
    } as unknown as jest.Mocked<IAccountRepository>;

    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;

    useCase = new DeleteAccountUseCase(mockRepository, mockAuthService);
  });

  it("deve lançar erro quando a conta não existir", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    mockRepository.getAccountById.mockResolvedValue(null);

    await expect(useCase.execute("acc-1")).rejects.toThrow("Conta não encontrada.");
  });

  it("deve lançar erro quando a conta não pertencer ao usuário", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    mockRepository.getAccountById.mockResolvedValue(
      Account.restore({
        id: "acc-1",
        user_id: "user-2",
        name: "Carteira",
        icon: "👛",
        color: "#ef4444",
        created_at: new Date().toISOString(),
      })
    );

    await expect(useCase.execute("acc-1")).rejects.toThrow(
      "Você não tem permissão para deletar esta conta."
    );
  });

  it("deve deletar a conta com sucesso", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    mockRepository.getAccountById.mockResolvedValue(
      Account.restore({
        id: "acc-1",
        user_id: "user-1",
        name: "Carteira",
        icon: "👛",
        color: "#ef4444",
        created_at: new Date().toISOString(),
      })
    );

    await useCase.execute("acc-1");

    expect(mockRepository.deleteAccount).toHaveBeenCalledWith("acc-1");
  });
});

