import { TransactionSummary } from './transaction-summary';
import { Transaction } from '../entities/transaction/transaction';
import { TransactionType } from '../enum/transaction-type';

describe('TransactionSummary Value Object', () => {
  it('deve calcular totais e balanço corretamente', () => {
    const transactions = [
      { amount: 1000, type: TransactionType.INCOME, isPaid: true },
      { amount: 500, type: TransactionType.INCOME, isPaid: false }, // não pago, ignora
      { amount: 300, type: TransactionType.EXPENSE, isPaid: true },
      { amount: 200, type: TransactionType.EXPENSE, isPaid: false }, // não pago, ignora
    ] as Transaction[];

    const summary = TransactionSummary.fromTransactions(transactions);

    expect(summary.income).toBe(1000);
    expect(summary.expense).toBe(300);
    expect(summary.balance).toBe(700);
  });

  it('deve retornar zero se não houver transações', () => {
    const summary = TransactionSummary.fromTransactions([]);
    expect(summary.income).toBe(0);
    expect(summary.expense).toBe(0);
    expect(summary.balance).toBe(0);
  });
});
