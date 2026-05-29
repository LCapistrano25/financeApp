import { Transaction } from "@/domain/entities/transaction/transaction";
import { CreateTransactionDto } from "./create-transaction.dto";

export interface ICreateTransactionUseCase {
  execute(input: CreateTransactionDto): Promise<Transaction>;
}
