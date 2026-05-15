import { useState } from 'react';
import { createTransactionHandler, CreateTransactionInput } from '@/application/commands/transaction/create-transaction/create-transaction.handler';

export function useCreateTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const createTransaction = async (data: CreateTransactionInput) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // O Hook não sabe nada sobre Supabase, apenas chama o Handler!
      const newTransaction = await createTransactionHandler(data);
      
      setIsSuccess(true);
      return newTransaction; // Retornamos caso o componente queira fazer algo com a transação criada
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar transação';
      setError(errorMessage);
      throw err; // Repassa o erro para o componente lidar (ex: mostrar um Toast)
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createTransaction,
    isLoading,
    error,
    isSuccess,
  };
}