import { Transaction } from "@/domain/entities/transaction/transaction";

interface IGetTransactionsUseCase {
  execute(monthYear: string): Promise<Transaction[]>;
}

export default IGetTransactionsUseCase;