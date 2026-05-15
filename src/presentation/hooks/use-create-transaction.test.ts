import { renderHook, act } from '@testing-library/react';
import { useCreateTransaction } from './use-create-transaction';
// Importamos o tipo correto do input para o mock
import { createTransactionHandler, CreateTransactionInput } from '@/application/commands/transaction/create-transaction/create-transaction.handler';

jest.mock('@/application/commands/transaction/create-transaction/create-transaction.handler');

describe('useCreateTransaction', () => {
  // Substituímos o "as any" por "as unknown as Type"
  const mockInput = { amount: 100 } as unknown as CreateTransactionInput;

  it('deve criar uma transação e gerenciar os estados de loading e sucesso', async () => {
    (createTransactionHandler as jest.Mock).mockResolvedValue({ id: '1' });
    
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
    (createTransactionHandler as jest.Mock).mockRejectedValue(new Error('Erro Fatal'));
    
    const { result } = renderHook(() => useCreateTransaction());

    await act(async () => {
      try {
        await result.current.createTransaction(mockInput);
      } catch {
        // Removido o "(e)" daqui, pois não estávamos usando a variável!
        // Ignora o throw para testar o state
      }
    });

    expect(result.current.error).toBe('Erro Fatal');
    expect(result.current.isLoading).toBe(false);
  });
});