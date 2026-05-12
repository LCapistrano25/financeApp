import { renderHook, act } from '@testing-library/react';
import { useEditTransaction } from './use-edit-transaction';
// Importamos o tipo correto do input para o mock
import { editTransactionHandler, EditTransactionInput } from '@/application/commands/transaction/edit-transaction/edit-transaction.handler';

jest.mock('@/application/commands/transaction/edit-transaction/edit-transaction.handler');

describe('useEditTransaction', () => {
  // Substituímos o "as any" por "as unknown as Type"
  const mockInput = { amount: 200 } as unknown as EditTransactionInput;

  it('deve editar uma transação e gerenciar os estados', async () => {
    (editTransactionHandler as jest.Mock).mockResolvedValue({ id: '1', amount: 200 });
    
    const { result } = renderHook(() => useEditTransaction());

    let response;
    await act(async () => {
      response = await result.current.editTransaction('1', mockInput);
    });

    expect(response).toEqual({ id: '1', amount: 200 });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.error).toBeNull();
  });
});