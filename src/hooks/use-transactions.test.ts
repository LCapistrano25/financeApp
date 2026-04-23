import { renderHook, waitFor } from '@testing-library/react';
import { useTransactions } from './use-transactions';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
    },
    from: jest.fn(),
  },
}));

describe('useTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch transactions correctly', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });
    
    const mockSelect = jest.fn().mockReturnThis();
    const mockGte = jest.fn().mockReturnThis();
    const mockLte = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockResolvedValue({
      data: [
        { id: '1', amount: 100, type: 'INCOME', is_paid: true },
        { id: '2', amount: 50, type: 'EXPENSE', is_paid: true },
        { id: '3', amount: 200, type: 'INCOME', is_paid: false },
      ],
      error: null,
    });

    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: mockSelect,
      gte: mockGte,
      lte: mockLte,
      order: mockOrder,
    }));

    const { result } = renderHook(() => useTransactions('2023-10'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.transactions).toHaveLength(3);
    expect(result.current.totals.income).toBe(100);
    expect(result.current.totals.expense).toBe(50);
    expect(result.current.totals.balance).toBe(50);
  });

  it('should handle unauthenticated sessions', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
      error: null,
    });

    const mockSelect = jest.fn();
    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: mockSelect,
    }));

    const { result } = renderHook(() => useTransactions('2023-10'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockSelect).not.toHaveBeenCalled();
    expect(result.current.transactions).toHaveLength(0);
  });

  it('should handle errors thrown from supabase', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: { id: '123' } } },
      error: null,
    });

    const mockOrder = jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Failed to fetch'),
    });

    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      gte: jest.fn().mockReturnThis(),
      lte: jest.fn().mockReturnThis(),
      order: mockOrder,
    }));

    const { result } = renderHook(() => useTransactions('2023-10'));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBe('Failed to fetch');
    });
  });
});
