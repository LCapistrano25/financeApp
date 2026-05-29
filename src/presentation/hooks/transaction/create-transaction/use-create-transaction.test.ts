import { renderHook, act } from '@testing-library/react';
import { useCreateTransaction } from './use-create-transaction';
import { CreateTransactionUseCase } from '@/application/usecases/transaction/create-transaction/usecase';

import { CreateTransactionDto } from '@/application/usecases/transaction/create-transaction/dto';

jest.mock('@/application/usecases/transaction/create-transaction/usecase');

describe('useCreateTransaction', () => {
  const mockInput = { amount: 100 } as unknown as CreateTransactionDto;

  it('deve criar uma transação e gerenciar os estados de loading e sucesso', async () => {
    const mockExecute = jest.fn().mockResolvedValue({ id: '1' });
    (CreateTransactionUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));
    
    const { result } = renderHook(() => useCreateTransaction());

    expect(result.current.isLoading).toBe(false);

    let response;
    await act(async () => {
      response = await result.current.createTransaction(mockInput);
    });

    expect(response).toEqual({ id: '1' });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('deve lidar com erros corretamente', async () => {
    const mockExecute = jest.fn().mockRejectedValue(new Error('Erro Fatal'));
    (CreateTransactionUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));
    
    const { result } = renderHook(() => useCreateTransaction());

    await act(async () => {
      try {
        await result.current.createTransaction(mockInput);
      } catch {
        // Ignora o throw para testar o state
      }
    });

    expect(result.current.error).toBe('Erro Fatal');
    expect(result.current.isLoading).toBe(false);
  });
});