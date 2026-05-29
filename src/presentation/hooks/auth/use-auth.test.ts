import { renderHook, waitFor, act } from '@testing-library/react';
import { useAuth } from './use-auth';
import { supabase } from '@/infrastructure/repositories/supabase/supabase.client';
import { useRouter } from 'next/navigation';

jest.mock('@/infrastructure/repositories/supabase/supabase.client', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-1' } } },  // Add the session structure
      }),
      signOut: jest.fn().mockResolvedValue({}),  // Ensure signOut returns proper structure
      signInWithOAuth: jest.fn().mockResolvedValue({}),
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

  it('should call loginWithGoogle correctly', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.loginWithGoogle();
    });

    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: expect.objectContaining({
        redirectTo: expect.stringContaining('/auth/callback'),
      }),
    });
  });
});
