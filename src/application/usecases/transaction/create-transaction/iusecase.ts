import { Transaction } from "@/domain/entities/transaction/transaction";
import { CreateTransactionDto } from "./dto";

export interface ICreateTransactionUseCase {
  execute(input: CreateTransactionDto): Promise<Transaction>;
}
