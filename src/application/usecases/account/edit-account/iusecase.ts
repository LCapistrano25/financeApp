import { Account } from "@/domain/entities/account/account";
import { EditAccountDto } from "./dto";

export interface IEditAccountUseCase {
  editAccount(id: string, input: EditAccountDto): Promise<Account>;
}

