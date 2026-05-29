import { Transaction } from "@/domain/entities/transaction/transaction";
import { TransactionType } from "@/domain/enum/transaction-type";

export class TransactionSummary {
  public readonly income: number;
  public readonly expense: number;
  public readonly balance: number;

  private constructor(income: number, expense: number) {
    this.income = income;
    this.expense = expense;
    this.balance = income - expense;
  }

  public static fromTransactions(transactions: Transaction[]): TransactionSummary {
    const totals = transactions.reduce(
      (acc, curr) => {
        if (curr.isPaid) {
          if (curr.type === TransactionType.INCOME) acc.income += Number(curr.amount);
          if (curr.type === TransactionType.EXPENSE) acc.expense += Number(curr.amount);
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );

    return new TransactionSummary(totals.income, totals.expense);
  }
}
