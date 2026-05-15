import { authRepository } from './auth.repository';
import { supabase } from './supabase.client';

jest.mock('./supabase.client', () => ({
  supabase: {
    auth: {
      signInWithOAuth: jest.fn(),
      signOut: jest.fn(),
    },
  },
}));

describe('AuthRepository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve realizar login com google com sucesso', async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({ error: null });
    
    await authRepository.signInWithGoogle('http://localhost/callback');
    
    expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: { redirectTo: 'http://localhost/callback' },
    });
  });

  it('deve lançar erro se o login com google falhar no Supabase', async () => {
    (supabase.auth.signInWithOAuth as jest.Mock).mockResolvedValue({ 
      error: { message: 'Erro de Autenticação' } 
    });
    
    await expect(authRepository.signInWithGoogle('url')).rejects.toThrow('Erro de Autenticação');
  });

  it('deve realizar logout com sucesso', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ error: null });
    
    await authRepository.signOut();
    
    expect(supabase.auth.signOut).toHaveBeenCalled();
  });

  it('deve lançar erro se o logout falhar no Supabase', async () => {
    (supabase.auth.signOut as jest.Mock).mockResolvedValue({ 
      error: { message: 'Erro ao deslogar' } 
    });
    
    await expect(authRepository.signOut()).rejects.toThrow('Erro ao deslogar');
  });
});