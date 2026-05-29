import { renderHook, act } from '@testing-library/react';
import { useDeleteTransaction } from './use-delete-transaction';
import { DeleteTransactionUseCase } from '@/application/usecases/transaction/delete-transaction/delete-transaction.usecase';

jest.mock('@/application/commands/transaction/delete-transaction/delete-transaction.usecase');

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
    const mockExecute = jest.fn().mockResolvedValue(undefined);
    (DeleteTransactionUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));
    
    const { result } = renderHook(() => useDeleteTransaction());

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.deleteTransaction('tx-1');
    });

    expect(mockExecute).toHaveBeenCalledWith('tx-1');
    expect(result.current.isLoading).toBe(false);
  });

  it('deve gerenciar estado de erro em caso de falha', async () => {
    const mockExecute = jest.fn().mockRejectedValue(new Error('Erro ao deletar'));
    (DeleteTransactionUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));
    
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