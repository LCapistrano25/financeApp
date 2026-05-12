import { renderHook, act } from '@testing-library/react';
import { useDeleteTransaction } from './use-delete-transaction';
import { deleteTransactionHandler } from '@/application/commands/transaction/delete-transaction/delete-transaction.handler';

jest.mock('@/application/commands/transaction/delete-transaction/delete-transaction.handler');

describe('useDeleteTransaction', () => {
  beforeEach(() => {
    // Finge que o usuário sempre clica em "OK" no window.confirm
    window.confirm = jest.fn().mockReturnValue(true);
  });

  it('deve deletar uma transação com sucesso', async () => {
    (deleteTransactionHandler as jest.Mock).mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useDeleteTransaction());

    let success;
    await act(async () => {
      success = await result.current.deleteTransaction('tx-1');
    });

    expect(success).toBe(true);
    expect(deleteTransactionHandler).toHaveBeenCalledWith('tx-1');
  });

  it('não deve fazer nada se o usuário cancelar o confirm', async () => {
    window.confirm = jest.fn().mockReturnValue(false);
    
    const { result } = renderHook(() => useDeleteTransaction());

    await act(async () => {
      await result.current.deleteTransaction('tx-1');
    });

    expect(deleteTransactionHandler).not.toHaveBeenCalled();
  });
});