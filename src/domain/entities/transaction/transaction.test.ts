import { RepeatFrequency } from "@/domain/enum/repeat-frequency";
import { TransactionType } from "@/domain/enum/transaction-type";
import { Transaction } from "./transaction";

const validTransactionProps = {
  user_id: "user-123",
  amount: 100,
  currency: "BRL",
  type: TransactionType.EXPENSE,
  date: "2026-05-29",
};

describe("Transaction Entity", () => {
  it("deve criar uma transacao em estado valido com defaults", () => {
    const transaction = Transaction.create(validTransactionProps);

    expect(transaction.userId).toBe("user-123");
    expect(transaction.amount).toBe(100);
    expect(transaction.isPaid).toBe(false);
    expect(transaction.repeat).toBe(false);
  });

  it("deve proteger valor, usuario, moeda e data", () => {
    expect(() => Transaction.create({ ...validTransactionProps, amount: 0 })).toThrow(
      "maior que zero"
    );

    expect(() => Transaction.create({ ...validTransactionProps, user_id: "" })).toThrow(
      "obrigat"
    );

    expect(() => Transaction.create({ ...validTransactionProps, currency: "" })).toThrow(
      "Moeda"
    );

    expect(() => Transaction.create({ ...validTransactionProps, date: "invalid-date" })).toThrow(
      "data"
    );
  });

  it("deve exigir frequencia e quantidade para transacao recorrente", () => {
    expect(() => Transaction.create({ ...validTransactionProps, repeat: true })).toThrow(
      "repeti"
    );

    expect(() =>
      Transaction.create({
        ...validTransactionProps,
        repeat: true,
        repeat_frequency: RepeatFrequency.MONTHS,
      })
    ).toThrow("maior que zero");
  });

  it("deve permitir marcar como paga e nao paga", () => {
    const transaction = Transaction.create(validTransactionProps);

    transaction.markAsPaid();
    expect(transaction.isPaid).toBe(true);

    transaction.markAsUnpaid();
    expect(transaction.isPaid).toBe(false);
  });
});
