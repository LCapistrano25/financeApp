import { supabase } from '../supabase.client';
import { TransactionRepository } from './transaction.repository';
import { Transaction } from '@/domain/entities/transaction/transaction';

// Criamos um mock universal para simular a sintaxe encadeada do Supabase
jest.mock('../supabase.client', () => {
    const mockQuery = {
        select: jest.fn().mockReturnThis(),
        insert: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        delete: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        gte: jest.fn().mockReturnThis(),
        lte: jest.fn().mockReturnThis(),
        single: jest.fn(),
    };
    return {
        supabase: {
            from: jest.fn(() => mockQuery),
        },
    };
});

describe('TransactionRepository', () => {
    let repository: TransactionRepository;
    let mockSupabaseQuery: Record<string, jest.Mock>;

    beforeEach(() => {
        repository = new TransactionRepository();

        mockSupabaseQuery = supabase.from('transactions') as unknown as Record<string, jest.Mock>;

        jest.clearAllMocks();
    });

    it('deve deletar uma transação com sucesso', async () => {
        // Simulamos que a exclusão ocorreu sem erros
        mockSupabaseQuery.eq.mockResolvedValueOnce({ error: null });

        await repository.deleteTransaction('tx-123');

        expect(supabase.from).toHaveBeenCalledWith('transactions');
        expect(mockSupabaseQuery.delete).toHaveBeenCalled();
        expect(mockSupabaseQuery.eq).toHaveBeenCalledWith('id', 'tx-123');
    });

    it('deve lançar erro se falhar ao deletar uma transação', async () => {
        mockSupabaseQuery.eq.mockResolvedValueOnce({ error: { message: 'Database Error' } });

        await expect(repository.deleteTransaction('tx-123')).rejects.toThrow('Database Error');
    });

    it('deve atualizar uma transação com sucesso', async () => {
        const mockData = { id: 'tx-123', user_id: 'user-1', amount: 50, currency: 'BRL', type: 'EXPENSE', date: '2023-10-10', is_paid: true };
        mockSupabaseQuery.single.mockResolvedValueOnce({ data: mockData, error: null });

        // Simulamos uma entidade real
        const mockEntity = {
            id: 'tx-123',
            amount: 50,
            currency: 'BRL',
            type: 'EXPENSE',
            date: '2023-10-10',
            isPaid: true,
            userId: 'user-1'
        } as unknown as Transaction;

        const result = await repository.updateTransaction('tx-123', mockEntity);

        expect(result.id).toEqual(mockData.id);
        expect(result.amount).toEqual(mockData.amount);
        expect(mockSupabaseQuery.update).toHaveBeenCalled();
    });

    it('deve lançar erro se falhar ao atualizar uma transação', async () => {
        mockSupabaseQuery.single.mockResolvedValueOnce({ data: null, error: { message: 'Update Error' } });

        const mockEntity = {
            amount: 50,
            currency: 'BRL',
            type: 'EXPENSE',
            date: '2023-10-10',
            isPaid: true,
            userId: 'user-1'
        } as unknown as Transaction;

        await expect(repository.updateTransaction('tx-123', mockEntity)).rejects.toThrow('Update Error');
    });
});
