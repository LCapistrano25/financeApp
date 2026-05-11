import { useState } from 'react';
import { deleteTransactionHandler } from '@/application/commands/transaction/delete-transaction/delete-transaction.handler';

export function useDeleteTransaction() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTransaction = async (id: string) => {
    // Alerta de segurança nativo do navegador (opcional, você pode usar um Modal na UI se preferir)
    const confirmDelete = globalThis.confirm("Tem certeza que deseja apagar esta transação?");
    if (!confirmDelete) return false;

    setIsLoading(true);
    setError(null);

    try {
      await deleteTransactionHandler(id);
      return true; // Retornamos true para a UI saber que deu certo e atualizar a lista
      
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar transação';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    deleteTransaction,
    isLoading,
    error,
  };
}