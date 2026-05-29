import { Transaction } from '../../../../domain/entities/transaction/transaction';
import { CreateTransactionDto } from './create-transaction.dto';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { ICreateTransactionUseCase } from './icreate-transaction';
import { IAuthService } from '../../../services/iauth.service';

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  constructor(
    private repository: ITransactionRepository,
    private authService: IAuthService
  ) {}

  async execute(input: CreateTransactionDto): Promise<Transaction> {
    const user = await this.authService.getAuthenticatedUser();

    const transaction = Transaction.create({
      ...input,
      user_id: user.id,
    });

    const newTransaction = await this.repository.createTransaction(transaction);

    return newTransaction;
  }
}