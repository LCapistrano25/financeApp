import { Transaction } from "@/domain/entities/transaction/transaction";
import { TransactionType } from "@/domain/enum/transaction-type";
import { RepeatFrequency } from "@/domain/enum/repeat-frequency";
import { TransactionRecurrenceService } from "./transaction-recurrence.service";

describe("TransactionRecurrenceService", () => {
  it("deve retornar um array vazio se a transação não for recorrente", () => {
    const transaction = Transaction.create({
      user_id: "user-123",
      amount: 100,
      currency: "BRL",
      type: TransactionType.EXPENSE,
      date: new Date("2026-06-21T10:00:00Z").toISOString(),
      repeat: false,
    });

    const recurrences = TransactionRecurrenceService.generateRecurrences(transaction);
    expect(recurrences).toHaveLength(0);
  });

  it("deve gerar transações futuras mensalmente com is_paid false e repeat false", () => {
    const baseTransaction = Transaction.create({
      user_id: "user-123",
      amount: 50,
      currency: "BRL",
      type: TransactionType.EXPENSE,
      date: new Date("2026-06-21T10:00:00Z").toISOString(),
      description: "Assinatura",
      is_paid: true, // Base já está paga
      repeat: true,
      repeat_times: 2,
      repeat_frequency: RepeatFrequency.MONTHS,
    });

    const recurrences = TransactionRecurrenceService.generateRecurrences(baseTransaction);

    expect(recurrences).toHaveLength(2);

    // Valida a primeira recorrência (Mês 07)
    expect(recurrences[0].isPaid).toBe(false);
    expect(recurrences[0].repeat).toBe(false);
    expect(recurrences[0].description).toBe("Assinatura (2/3)");
    expect(new Date(recurrences[0].date).getMonth()).toBe(6); // Julho (0-indexed)

    // Valida a segunda recorrência (Mês 08)
    expect(recurrences[1].isPaid).toBe(false);
    expect(recurrences[1].description).toBe("Assinatura (3/3)");
    expect(new Date(recurrences[1].date).getMonth()).toBe(7); // Agosto
  });
});