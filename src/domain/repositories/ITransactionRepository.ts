import { Transaction } from '@/domain/entities/transaction/transaction';

export interface ITransactionRepository {
  getTransactionById(id: string): Promise<Transaction | null>;
  getTransactionsByDateRange(userId: string, startDate: string, endDate: string): Promise<Transaction[]>;
  hasTransactionsWithCategoryId(categoryId: string): Promise<boolean>;
  hasTransactionsWithAccountId(accountId: string): Promise<boolean>;
  createTransaction(transaction: Transaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Transaction): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
}
