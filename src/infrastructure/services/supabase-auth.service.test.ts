import { authService } from './supabase-auth.service';
import { supabase } from '../supabase/supabase.client';

jest.mock('../supabase/supabase.client', () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));

describe('SupabaseAuthService', () => {
  afterEach(() => {
    jest.clearAllMocks();
    authService.clearCache();
  });

  describe('signInWithGoogle', () => {
    it('deve realizar login com google com sucesso', async () => {
      (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({ error: null });
      
      const mockRedirect = 'https://any-url.com/callback';
      await authService.signInWithGoogle(mockRedirect);
      
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: { redirectTo: mockRedirect },
      });
    });

    it('deve lançar erro se o login com google falhar no Supabase', async () => {
      (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({ 
        error: { message: 'Erro de Autenticação' } 
      });
      
      await expect(authService.signInWithGoogle('url')).rejects.toThrow('Erro de Autenticação');
    });
  });

  describe('signOut', () => {
    it('deve realizar logout com sucesso', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });
      
      await authService.signOut();
      
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('deve lançar erro se o logout falhar no Supabase', async () => {
      (supabase.auth.signOut as jest.Mock).mockResolvedValue({ 
        error: { message: 'Erro ao deslogar' } 
      });
      
      await expect(authService.signOut()).rejects.toThrow('Erro ao deslogar');
    });
  });

  describe('getCurrentUser', () => {
    it('deve retornar o usuário se a sessão existir', async () => {
      const mockUser = { id: 'user-123' };
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      });

      const user = await authService.getCurrentUser();
      expect(user).toEqual(mockUser);
    });

    it('deve retornar null se não houver sessão', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      const user = await authService.getCurrentUser();
      expect(user).toBeNull();
    });

    it('deve usar o cache se o usuário já foi buscado', async () => {
      const mockUser = { id: 'user-123' };
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      });

      await authService.getCurrentUser();
      const user = await authService.getCurrentUser();
      
      expect(user).toEqual(mockUser);
      expect(supabase.auth.getSession).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAuthenticatedUser', () => {
    it('deve retornar o usuário se estiver logado', async () => {
      const mockUser = { id: 'user-123' };
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: { user: mockUser } },
        error: null,
      });

      const user = await authService.getAuthenticatedUser();
      expect(user).toEqual(mockUser);
    });

    it('deve lançar erro se não estiver logado', async () => {
      (supabase.auth.getSession as jest.Mock).mockResolvedValue({
        data: { session: null },
        error: null,
      });

      await expect(authService.getAuthenticatedUser()).rejects.toThrow("Você precisa estar logado para realizar esta operação.");
    });
  });
});
