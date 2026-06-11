import { renderHook, act } from '@testing-library/react';
import { useEditTransaction } from './use-edit-transaction';
import { EditTransactionUseCase } from '@/application/usecases/transaction/edit-transaction/usecase';

import { EditTransactionDto } from '@/application/usecases/transaction/edit-transaction/dto';

jest.mock('@/application/usecases/transaction/edit-transaction/usecase');

describe('useEditTransaction', () => {
  const mockInput: EditTransactionDto = {
    amount: 200,
    currency: 'BRL',
    type: 'EXPENSE',
    date: '2023-10-10',
    category_id: 'cat-1',
    account_id: 'acc-1',
  };

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
