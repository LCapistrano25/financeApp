import { RepeatFrequency } from "../../enum/repeat-frequency";
import { TransactionType } from "../../enum/transaction-type";
import { TransactionProps } from "./transactions.props";

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

  public static get(props: TransactionProps): Transaction {
    if (!props.id) {
      throw new Error("ID is required to get a transaction.");
    }
    return new Transaction(props);
  }

  
  public update(props: Partial<TransactionProps>): void {
    Object.assign(this.props, props);
    this.validate();
  }
  
  get id(): string | undefined { return this.props.id; }
  get userId(): string { return this.props.user_id; }
  get amount(): number { return this.props.amount; }
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
    if (this.props.amount <= 0) {
      throw new Error("Transaction amount must be greater than zero.");
    }

    if (!this.props.currency) {
      throw new Error("Currency is required.");
    }

    if (this.props.repeat && !this.props.repeat_frequency) {
      throw new Error("Repeat frequency is required when repeat is enabled.");
    }
  }
}
