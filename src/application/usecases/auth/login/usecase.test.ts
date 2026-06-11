import { LoginUseCase } from './usecase';
import { IAuthService } from '@/application/ports/iauth.service';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    mockAuthService = {
      signInWithGoogle: jest.fn(),
      signOut: jest.fn(),
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
    };
    loginUseCase = new LoginUseCase(mockAuthService);
  });

  it('deve chamar o serviço de autenticação com a URL de redirecionamento fornecida', async () => {
    const redirectTo = 'https://any-redirect-url.com/auth/callback';
    
    await loginUseCase.loginWithGoogle(redirectTo);
    
    expect(mockAuthService.signInWithGoogle).toHaveBeenCalledWith(redirectTo);
  });
});