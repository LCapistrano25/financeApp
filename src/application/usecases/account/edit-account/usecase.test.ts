import { Account } from "@/domain/entities/account/account";
import { IAuthService } from "@/application/ports/iauth.service";
import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { EditAccountDto } from "./dto";
import { EditAccountUseCase } from "./usecase";

describe("EditAccountUseCase", () => {
  let useCase: EditAccountUseCase;
  let mockRepository: jest.Mocked<IAccountRepository>;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRepository = {
      getAccountById: jest.fn(),
      updateAccount: jest.fn(),
    } as unknown as jest.Mocked<IAccountRepository>;

    mockAuthService = {
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
    } as unknown as jest.Mocked<IAuthService>;

    useCase = new EditAccountUseCase(mockRepository, mockAuthService);
  });

  it("deve lançar erro quando a conta não existir", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    mockRepository.getAccountById.mockResolvedValue(null);

    const payload: EditAccountDto = {
      name: "Banco",
      icon: "🏦",
      color: "#3b82f6",
    };

    await expect(useCase.editAccount("acc-1", payload)).rejects.toThrow("Conta não encontrada.");
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

    const payload: EditAccountDto = {
      name: "Carteira",
      icon: "👛",
      color: "#ef4444",
    };

    await expect(useCase.editAccount("acc-1", payload)).rejects.toThrow(
      "Você não tem permissão para editar esta conta."
    );
  });

  it("deve atualizar a conta com sucesso", async () => {
    mockAuthService.getAuthenticatedUser.mockResolvedValue({ id: "user-1" });
    const existing = Account.restore({
      id: "acc-1",
      user_id: "user-1",
      name: "Carteira",
      icon: "👛",
      color: "#ef4444",
      created_at: new Date().toISOString(),
    });
    mockRepository.getAccountById.mockResolvedValue(existing);

    const payload: EditAccountDto = {
      name: "Carteira (novo)",
      icon: "👛",
      color: "#ef4444",
    };

    mockRepository.updateAccount.mockResolvedValue(existing);

    const result = await useCase.editAccount("acc-1", payload);

    expect(result).toBe(existing);
    expect(existing.name).toBe("Carteira (novo)");
    expect(mockRepository.updateAccount).toHaveBeenCalledWith("acc-1", existing);
  });
});

