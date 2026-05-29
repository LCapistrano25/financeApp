import { Account } from "@/domain/entities/account/account";

export interface IGetAccountsUseCase {
  execute(): Promise<Account[]>;
}

