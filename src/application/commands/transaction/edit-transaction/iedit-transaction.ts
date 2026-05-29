import { Transaction } from "@/domain/entities/transaction/transaction";
import { EditTransactionDto } from "./edit-transaction.dto";

export interface IEditTransactionUseCase {
  editTransaction(id: string, input: EditTransactionDto): Promise<Transaction>;
}