import { renderHook, act } from '@testing-library/react';
import { useDeleteTransaction } from './use-delete-transaction';
import { deleteTransactionHandler } from '@/application/commands/transaction/delete-transaction/delete-transaction.handler';

jest.mock('@/application/commands/transaction/delete-transaction/delete-transaction.handler');

describe('useDeleteTransaction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Previne que qualquer confirm residual bloqueie o teste
    jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('deve deletar uma transação e gerenciar o loading', async () => {
    (deleteTransactionHandler as jest.Mock).mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useDeleteTransaction());

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.deleteTransaction('tx-1');
    });

    expect(deleteTransactionHandler).toHaveBeenCalledWith('tx-1');
    expect(result.current.isLoading).toBe(false);
  });

  it('deve gerenciar estado de erro em caso de falha', async () => {
    (deleteTransactionHandler as jest.Mock).mockRejectedValue(new Error('Erro ao deletar'));
    
    const { result } = renderHook(() => useDeleteTransaction());

    await act(async () => {
      try {
        await result.current.deleteTransaction('tx-1');
      } catch {
        // Ignoramos o throw no teste para checar o state
      }
    });

    expect(result.current.error).toBe('Erro ao deletar');
    expect(result.current.isLoading).toBe(false);
  });
});