import { supabase } from './supabase.client';
import { ITransactionRepository } from '../../domain/repositories/ITransactionRepository';
import { Transaction } from '../../domain/entities/transaction/transaction';
import { TransactionMapper } from '../mappers/transaction.mapper';

export class TransactionRepository implements ITransactionRepository {
  async getTransactionById(id: string): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:categories(name)')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(error.message);
    }

    return TransactionMapper.toDomain(data);
  }

  async getTransactionsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*, category:categories(name)')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate)
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);

    return data.map(TransactionMapper.toDomain);
  }

  async createTransaction(
    transaction: Transaction
  ): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .insert(TransactionMapper.toPersistence(transaction))
      .select()
      .single();

    if (error) throw new Error(error.message);

    return TransactionMapper.toDomain(data);
  }

  async updateTransaction(
    id: string,
    transaction: Transaction
  ): Promise<Transaction> {
    const { data, error } = await supabase
      .from('transactions')
      .update(TransactionMapper.toPersistence(transaction))
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return TransactionMapper.toDomain(data);
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