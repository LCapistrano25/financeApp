import { renderHook, act } from '@testing-library/react';
import { useEditTransaction } from './use-edit-transaction';
import { EditTransactionUseCase } from '@/application/usecases/transaction/edit-transaction/usecase';

jest.mock('@/application/usecases/transaction/edit-transaction/usecase');

describe('useEditTransaction', () => {
  const mockInput = { amount: 200 } as any;

  it('deve editar uma transação e gerenciar os estados', async () => {
    const mockEdit = jest.fn().mockResolvedValue({ id: '1', amount: 200 });
    (EditTransactionUseCase as jest.Mock).mockImplementation(() => ({
      editTransaction: mockEdit,
    }));
    
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