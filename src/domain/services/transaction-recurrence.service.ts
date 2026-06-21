import { Transaction } from "@/domain/entities/transaction/transaction";
import { RepeatFrequency } from "@/domain/enum/repeat-frequency";

export class TransactionRecurrenceService {
  public static generateRecurrences(baseTransaction: Transaction): Transaction[] {
    if (!baseTransaction.repeat || !baseTransaction.repeatFrequency || !baseTransaction.repeatTimes) {
      return [];
    }

    const recurrences: Transaction[] = [];
    let currentDate = new Date(baseTransaction.date);

    for (let i = 1; i <= baseTransaction.repeatTimes; i++) {
      const nextDate = new Date(currentDate);

      switch (baseTransaction.repeatFrequency) {
        case RepeatFrequency.MONTHS:
          nextDate.setMonth(nextDate.getMonth() + 1);
          break;
        case RepeatFrequency.WEEKS:
          nextDate.setDate(nextDate.getDate() + 7);
          break;
        case RepeatFrequency.DAYS:
          nextDate.setDate(nextDate.getDate() + 1);
          break;
      }

      currentDate = nextDate;

      const newTransaction = Transaction.create({
        user_id: baseTransaction.userId,
        amount: baseTransaction.amount,
        currency: baseTransaction.currency,
        type: baseTransaction.type,
        date: nextDate.toISOString(),
        is_paid: false, 
        description: baseTransaction.description 
            ? `${baseTransaction.description} (${i + 1}/${baseTransaction.repeatTimes + 1})` 
            : undefined,
        observation: baseTransaction.observation,
        category_id: baseTransaction.categoryId,
        account_id: baseTransaction.accountId,
        attachment_url: baseTransaction.attachmentUrl,
        ignore_transaction: baseTransaction.ignoreTransaction,
        is_fixed: baseTransaction.isFixed,
        
        repeat: false,
        repeat_times: undefined,
        repeat_frequency: undefined,
      });

      recurrences.push(newTransaction);
    }

    return recurrences;
  }
}