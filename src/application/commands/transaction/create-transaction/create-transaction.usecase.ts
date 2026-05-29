import { transactionRepository } from '../../../../infrastructure/supabase/transaction.repository';
import { supabase } from '../../../../infrastructure/supabase/supabase.client';
import { Transaction } from '../../../../domain/entities/transaction/transaction';
import { CreateTransactionDto } from './create-transaction.dto';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { ICreateTransactionUseCase } from './icreate-transaction';

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  private repository: ITransactionRepository;
  
  constructor(repository: ITransactionRepository) {
      this.repository = repository;
  }

  async execute(input: CreateTransactionDto): Promise<Transaction> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error("Você precisa estar logado para criar uma transação.");
    }

    const transaction = Transaction.create({
      ...input,
      user_id: session.user.id,
    });

    const newTransaction = await this.repository.createTransaction(transaction);

    return newTransaction;
  }
}