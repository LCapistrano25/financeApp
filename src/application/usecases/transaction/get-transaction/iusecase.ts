import { Transaction } from "@/domain/entities/transaction/transaction";
import { TransactionSummary } from "@/domain/value-objects/transaction-summary";

export interface GetTransactionsResponse {
  transactions: Transaction[];
  summary: TransactionSummary;
}

interface IGetTransactionsUseCase {
  execute(monthYear: string): Promise<GetTransactionsResponse>;
}

export default IGetTransactionsUseCase;