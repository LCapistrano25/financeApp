import { loginWithGoogleHandler } from './login-with-google.handler';
import { authRepository } from '../../../infrastructure/supabase/auth.repository';

jest.mock('../../../infrastructure/supabase/auth.repository', () => ({
  authRepository: {
    signInWithGoogle: jest.fn(),
  },
}));

describe('loginWithGoogleHandler', () => {
  it('deve chamar o repositório de autenticação com a URL de redirecionamento', async () => {
    const redirectTo = 'http://localhost:3000/auth/callback';
    
    await loginWithGoogleHandler(redirectTo);
    
    expect(authRepository.signInWithGoogle).toHaveBeenCalledWith(redirectTo);
  });
});