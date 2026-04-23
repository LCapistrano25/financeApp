import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from './use-auth';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('useAuth', () => {
  const mockPush = jest.fn();
  const mockRefresh = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
      refresh: mockRefresh,
    });
  });

  it('should fetch user session on mount', async () => {
    const mockUser = { id: 'user-1' };
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: { user: mockUser } },
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });

  it('should perform logout correctly', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValue({
      data: { session: null },
    });

    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      await result.current.logout();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
    expect(mockRefresh).toHaveBeenCalled();
  });
});
