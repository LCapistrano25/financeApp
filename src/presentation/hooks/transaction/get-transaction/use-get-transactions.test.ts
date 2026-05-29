import { renderHook, waitFor } from '@testing-library/react';
import { useTransactions } from './use-get-transactions';
import { supabase } from '@/infrastructure/repositories/supabase/supabase.client';
import { authService } from '@/infrastructure/services/supabase-auth.service';

jest.mock('@/infrastructure/repositories/supabase/supabase.client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

jest.mock('@/infrastructure/services/supabase-auth.service', () => ({
  authService: {
    getAuthenticatedUser: jest.fn(),
  },
}));

describe('useTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch transactions correctly', async () => {
    (authService.getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: '123' });

    const mockSelect = jest.fn().mockReturnThis();
    const mockEq = jest.fn().mockReturnThis();
    const mockGte = jest.fn().mockReturnThis();
    const mockLte = jest.fn().mockReturnThis();
    const mockOrder = jest.fn().mockResolvedValue({
      data: [
        { id: '1', amount: 100, type: 'INCOME', is_paid: true, currency: 'BRL', date: '2023-10-01' },
        { id: '2', amount: 50, type: 'EXPENSE', is_paid: true, currency: 'BRL', date: '2023-10-02' },
        { id: '3', amount: 200, type: 'INCOME', is_paid: false, currency: 'BRL', date: '2023-10-03' },
      ],
      error: null,
    });

    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: mockSelect,
      eq: mockEq, // Add this line
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
    (authService.getAuthenticatedUser as jest.Mock).mockRejectedValue(new Error('Unauthenticated'));

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
    (authService.getAuthenticatedUser as jest.Mock).mockResolvedValue({ id: '123' });

    const mockOrder = jest.fn().mockResolvedValue({
      data: null,
      error: new Error('Failed to fetch'),
    });

    (supabase.from as jest.Mock).mockImplementation(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(), // Add this line
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
