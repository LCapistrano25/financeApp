import { Account } from "@/domain/entities/account/account";
import { CreateAccountDto } from "./dto";

export interface ICreateAccountUseCase {
  execute(input: CreateAccountDto): Promise<Account>;
}

