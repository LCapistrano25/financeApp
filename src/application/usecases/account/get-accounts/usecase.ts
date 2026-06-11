import { IAuthService } from "@/application/ports/iauth.service";
import { Account } from "@/domain/entities/account/account";
import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { IGetAccountsUseCase } from "./iusecase";

export class GetAccountsUseCase implements IGetAccountsUseCase {
  constructor(
    private readonly repository: IAccountRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(): Promise<Account[]> {
    const user = await this.authService.getAuthenticatedUser();
    return this.repository.getAccountsByUserId(user.id);
  }
}

