import { RepeatFrequency } from "@/domain/enum/repeat-frequency";
import { TransactionType } from "@/domain/enum/transaction-type";
import { Amount } from "@/domain/value-objects/amount";
import { TransactionProps } from "@/domain/entities/transaction/transactions.props";

export class Transaction {
  private constructor(private readonly props: TransactionProps) {
    this.validate();
  }

  public static create(props: TransactionProps): Transaction {
    return new Transaction({
      ...props,
      is_paid: props.is_paid ?? false,
      ignore_transaction: props.ignore_transaction ?? false,
      is_fixed: props.is_fixed ?? false,
      repeat: props.repeat ?? false,
    });
  }

  public static restore(props: TransactionProps): Transaction {
    if (!props.id) {
      throw new Error("ID is required to restore a transaction.");
    }
    return new Transaction(props);
  }
  
  public update(props: Partial<TransactionProps>): void {
    Object.assign(this.props, props);
    this.validate();
  }
  
  get id(): string | undefined { return this.props.id; }
  get userId(): string { return this.props.user_id; }
  get amount(): number { return Amount.create(this.props.amount).value; }
  get currency(): string { return this.props.currency; }
  get type(): TransactionType { return this.props.type; }
  get date(): string { return this.props.date; }
  get isPaid(): boolean { return this.props.is_paid ?? false; }
  get description(): string | undefined { return this.props.description; }
  get observation(): string | undefined { return this.props.observation; }
  get categoryId(): string | undefined { return this.props.category_id; }
  get accountId(): string | undefined { return this.props.account_id; }
  get attachmentUrl(): string | undefined { return this.props.attachment_url; }
  get isFixed(): boolean | undefined { return this.props.is_fixed; }
  get ignoreTransaction(): boolean | undefined { return this.props.ignore_transaction; }
  get repeat(): boolean | undefined { return this.props.repeat; }
  get repeatTimes(): number | undefined { return this.props.repeat_times; }
  get repeatFrequency(): RepeatFrequency | undefined { return this.props.repeat_frequency; }
  get createdAt(): string | undefined { return this.props.created_at; }
  get categoryName(): string | undefined {
    const category = (this.props as unknown as { category?: { name?: string } | null }).category;
    return category?.name;
  }
  get accountName(): string | undefined {
    const account = (this.props as unknown as { account?: { name?: string } | null }).account;
    return account?.name;
  }

  public markAsPaid(): void {
    this.props.is_paid = true;
  }

  public markAsUnpaid(): void {
    this.props.is_paid = false;
  }

  public isExpense(): boolean {
    return this.props.type === TransactionType.EXPENSE;
  }

  public isIncome(): boolean {
    return this.props.type === TransactionType.INCOME;
  }

  private validate(): void {
    Amount.create(this.props.amount);

    if (!this.props.user_id?.trim()) {
    throw new Error("ID do usuário é obrigatório.");
  }

  if (!this.props.currency?.trim()) {
    throw new Error("Moeda é obrigatória.");
  }

  const transactionDate = new Date(this.props.date);
  if (!this.props.date || Number.isNaN(transactionDate.getTime())) {
    throw new Error("A data da transação deve ser válida.");
  }

  if (!Object.values(TransactionType).includes(this.props.type)) {
    throw new Error("O tipo de transação deve ser válido.");
  }

  if (this.props.repeat) {
    if (!this.props.repeat_frequency) {
      throw new Error("Frequência de repetição é obrigatória quando a repetição está ativada.");
    }

    if (!this.props.repeat_times || this.props.repeat_times <= 0) {
      throw new Error("O número de repetições deve ser maior que zero quando a repetição está ativada.");
    }
  }
  }
}
