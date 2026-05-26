import { loginWithGoogleHandler } from './login-with-google.handler';
import { authRepository } from '../../../infrastructure/supabase/auth.repository';

jest.mock('../../../infrastructure/supabase/auth.repository', () => ({
  authRepository: {
    signInWithGoogle: jest.fn(),
  },
}));

describe('loginWithGoogleHandler', () => {
  it('deve chamar o repositório de autenticação com a URL de redirecionamento fornecida', async () => {
    const redirectTo = 'https://any-redirect-url.com/auth/callback';
    
    await loginWithGoogleHandler(redirectTo);
    
    expect(authRepository.signInWithGoogle).toHaveBeenCalledWith(redirectTo);
  });
});