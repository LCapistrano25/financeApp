import { useState } from 'react';
import { EditTransactionUseCase } from '@/application/commands/transaction/edit-transaction/edit-transaction.usecase';
import { transactionRepository } from '@/infrastructure/supabase/transaction.repository';
import { authService } from '@/infrastructure/services/supabase-auth.service';
import { EditTransactionDto } from '@/application/commands/transaction/edit-transaction/edit-transaction.dto';

export function useEditTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const editTransactionUseCase = new EditTransactionUseCase(transactionRepository, authService);
  
  const editTransaction = async (id: string, data: EditTransactionDto) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const updatedTransaction = await editTransactionUseCase.editTransaction(id, data);
      
      setIsSuccess(true);
      return updatedTransaction;
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar transação';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    editTransaction,
    isLoading,
    error,
    isSuccess,
  };
}