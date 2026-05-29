import { Transaction } from "@/domain/entities/transaction/transaction";
import { TransactionType } from "@/domain/enum/transaction-type";
import { TransactionProps } from "@/domain/entities/transaction/transactions.props";

export class TransactionMapper {

    static toDomain(props: TransactionProps): Transaction {

        return Transaction.get(props);
    }

    static toPersistence(
        transaction: Transaction
    ): any {
        const persistence: any = {
            user_id: transaction.userId,
            amount: transaction.amount,
            currency: transaction.currency,
            type: transaction.type,
            date: transaction.date,
            is_paid: transaction.isPaid,
            description: transaction.description,
            observation: transaction.observation,
            category_id: transaction.categoryId,
            account_id: transaction.accountId,
            attachment_url: transaction.attachmentUrl,
            ignore_transaction: transaction.ignoreTransaction,
            is_fixed: transaction.isFixed,
            repeat: transaction.repeat,
            repeat_times: transaction.repeatTimes,
            repeat_frequency: transaction.repeatFrequency,
        };

        if (transaction.id) persistence.id = transaction.id;
        if (transaction.createdAt) persistence.created_at = transaction.createdAt;

        return persistence;
    }
}