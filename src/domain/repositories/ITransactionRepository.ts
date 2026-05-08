import { Transaction } from '../entities/transaction';

export interface ITransactionRepository {
  getTransactionsByDateRange(userId: string, startDate: string, endDate: string): Promise<Transaction[]>;
  
  // Já vamos deixar o contrato de criação pronto para o próximo passo!
  createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
}