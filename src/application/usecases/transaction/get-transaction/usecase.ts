import IGetTransactionsUseCase, { GetTransactionsResponse } from "./iusecase";
import { ITransactionRepository } from "@/domain/repositories/ITransactionRepository";
import { IAuthService } from "@/infrastructure/services/iauth.service";
import { MonthYear } from "@/domain/value-objects/month-year";
import { TransactionSummary } from "@/domain/value-objects/transaction-summary";

export class GetTransactionsUseCase implements IGetTransactionsUseCase {
    constructor(
        private readonly repository: ITransactionRepository, 
        private readonly authService: IAuthService
    ) {}

    async execute(monthYearValue: string): Promise<GetTransactionsResponse> {
        const user = await this.authService.getAuthenticatedUser();
        
        const monthYear = MonthYear.create(monthYearValue);

        const transactions = await this.repository.getTransactionsByDateRange(
            user.id, 
            monthYear.startDate, 
            monthYear.endDate
        );

        const summary = TransactionSummary.fromTransactions(transactions);

        return { 
            transactions, 
            summary
        };
    }
}
