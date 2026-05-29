import { useState } from 'react';
import { CreateTransactionDto } from '@/application/usecases/transaction/create-transaction/create-transaction.dto';
import { transactionRepository } from '@/infrastructure/supabase/transaction.repository';
import { authService } from '@/infrastructure/services/supabase-auth.service';
import { CreateTransactionUseCase } from '@/application/usecases/transaction/create-transaction/create-transaction.usecase';

export function useCreateTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const createTransaction = async (data: CreateTransactionDto) => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      // O Hook não sabe nada sobre Supabase, apenas chama o Handler!
      const newTransaction = await new CreateTransactionUseCase(transactionRepository, authService).execute(data);
      
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