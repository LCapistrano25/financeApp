import { renderHook, act } from '@testing-library/react';
import { useEditTransaction } from './use-edit-transaction';
import { editTransactionHandler } from '@/application/commands/transaction/edit-transaction/edit-transaction.handler';

jest.mock('@/application/commands/transaction/edit-transaction/edit-transaction.handler');

describe('useEditTransaction', () => {
  it('deve editar uma transação e gerenciar os estados', async () => {
    (editTransactionHandler as jest.Mock).mockResolvedValue({ id: '1', amount: 200 });
    
    const { result } = renderHook(() => useEditTransaction());

    let response;
    await act(async () => {
      response = await result.current.editTransaction('1', { amount: 200 } as any);
    });

    expect(response).toEqual({ id: '1', amount: 200 });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeNull();
  });
});