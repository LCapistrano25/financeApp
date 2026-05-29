import { Transaction } from '@/domain/entities/transaction/transaction';
import { CreateTransactionDto } from './dto';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { ICreateTransactionUseCase } from './iusecase';
import { IAuthService } from '@/application/ports/iauth.service';

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  constructor(
    private readonly repository: ITransactionRepository,
    private readonly authService: IAuthService
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
