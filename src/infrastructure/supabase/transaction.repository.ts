import { supabase } from './supabase.client';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { Transaction } from '../../domain/entities/transaction';

export class TransactionRepository implements ITransactionRepository {
  async getTransactionsByDateRange(userId: string, startDate: string, endDate: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:categories(name)')
      .eq('user_id', userId) // <-- Garantia de segurança: só puxa do usuário logado
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);
    
    return data as unknown as Transaction[];
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(transaction)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as unknown as Transaction;
  }

  async updateTransaction(id: string, transaction: Partial<Omit<Transaction, 'id' | 'user_id' | 'created_at'>>): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(transaction) 
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data as unknown as Transaction;
  }

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw new Error(error.message);
  }
}

export const transactionRepository = new TransactionRepository();