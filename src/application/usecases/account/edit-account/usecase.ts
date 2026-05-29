import { IAuthService } from "@/application/ports/iauth.service";
import { Account } from "@/domain/entities/account/account";
import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { EditAccountDto } from "./dto";
import { IEditAccountUseCase } from "./iusecase";

export class EditAccountUseCase implements IEditAccountUseCase {
  constructor(
    private readonly repository: IAccountRepository,
    private readonly authService: IAuthService
  ) {}

  async editAccount(id: string, input: EditAccountDto): Promise<Account> {
    const user = await this.authService.getAuthenticatedUser();

    const account = await this.repository.getAccountById(id);
    if (!account) {
      throw new Error("Conta não encontrada.");
    }

    if (account.userId !== user.id) {
      throw new Error("Você não tem permissão para editar esta conta.");
    }

    account.update(input);

    return this.repository.updateAccount(id, account);
  }
}

