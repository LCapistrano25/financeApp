import { act, renderHook, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/infrastructure/repositories/supabase/supabase.client';
import { useAuth } from './use-auth';

jest.mock('@/infrastructure/repositories/supabase/supabase.client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-1' } } },
      }),
      signOut: jest.fn().mockResolvedValue({}),
      onAuthStateChange: jest.fn((callback) => {
        callback(null, { user: { id: 'user-1' } });
        return { data: { subscription: { unsubscribe: jest.fn() } } };
      }),
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
    (supabase.auth.onAuthStateChange as jest.Mock).mockImplementation((callback) => {
      callback(null, { user: mockUser });
      return { data: { subscription: { unsubscribe: jest.fn() } } };
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
    await waitFor(() => {
      expect(result.current.logout).toBeDefined();
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(supabase.auth.signOut).toHaveBeenCalled();
    expect(mockPush).toHaveBeenCalledWith('/auth/login');
  });

  it('should start Google login through the server route', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.loginWithGoogle();
    });

    expect(mockPush).toHaveBeenCalledWith('/auth/google');
  });
});
