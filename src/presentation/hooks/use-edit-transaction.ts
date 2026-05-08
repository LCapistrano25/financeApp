import { useState } from 'react';
import { editTransactionHandler, EditTransactionInput } from '@/application/commands/transaction/edit-transaction/edit-transaction.handler';

export function useEditTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const editTransaction = async (id: string, data: EditTransactionInput) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const updatedTransaction = await editTransactionHandler(id, data);
      
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