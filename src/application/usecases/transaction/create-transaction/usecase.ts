import { Transaction } from '@/domain/entities/transaction/transaction';
import { CreateTransactionDto } from './dto';
import { ITransactionRepository } from '@/domain/repositories/ITransactionRepository';
import { ICreateTransactionUseCase } from './iusecase';
import { IAuthService } from '@/application/ports/iauth.service';
import { ICategoryRepository } from '@/domain/repositories/ICategoryRepository';
import { IAccountRepository } from '@/domain/repositories/IAccountRepository';
import { TransactionType } from '@/domain/enum/transaction-type';

export class CreateTransactionUseCase implements ICreateTransactionUseCase {
  constructor(
    private readonly repository: ITransactionRepository,
    private readonly authService: IAuthService,
    private readonly categoryRepository: ICategoryRepository,
    private readonly accountRepository: IAccountRepository
  ) {}

  async execute(input: CreateTransactionDto): Promise<Transaction> {
    const user = await this.authService.getAuthenticatedUser();
    const transactionType = input.type as TransactionType;

    if (!input.category_id?.trim()) {
      throw new Error("Categoria é obrigatória.");
    }

    if (!input.account_id?.trim()) {
      throw new Error("Conta é obrigatória.");
    }

    const category = await this.categoryRepository.getCategoryById(input.category_id);
    if (!category) {
      throw new Error("Categoria não encontrada.");
    }
    if (category.userId !== user.id) {
      throw new Error("Você não tem permissão para usar esta categoria.");
    }
    if (category.type !== transactionType) {
      throw new Error("A categoria selecionada não é compatível com o tipo da transação.");
    }

    const account = await this.accountRepository.getAccountById(input.account_id);
    if (!account) {
      throw new Error("Conta não encontrada.");
    }
    if (account.userId !== user.id) {
      throw new Error("Você não tem permissão para usar esta conta.");
    }

    const transaction = Transaction.create({
      ...input,
      type: transactionType,
      user_id: user.id,
    });

    const newTransaction = await this.repository.createTransaction(transaction);

    return newTransaction;
  }
}
