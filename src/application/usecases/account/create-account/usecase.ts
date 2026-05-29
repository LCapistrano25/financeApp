import { IAuthService } from "@/application/ports/iauth.service";
import { Account } from "@/domain/entities/account/account";
import { IAccountRepository } from "@/domain/repositories/IAccountRepository";
import { CreateAccountDto } from "./dto";
import { ICreateAccountUseCase } from "./iusecase";

export class CreateAccountUseCase implements ICreateAccountUseCase {
  constructor(
    private readonly repository: IAccountRepository,
    private readonly authService: IAuthService
  ) {}

  async execute(input: CreateAccountDto): Promise<Account> {
    const user = await this.authService.getAuthenticatedUser();

    const account = Account.create({
      ...input,
      user_id: user.id,
    });

    return this.repository.createAccount(account);
  }
}

