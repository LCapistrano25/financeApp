import { LogoutUseCase } from './usecase';
import { IAuthService } from '@/application/services/iauth.service';

describe('LogoutUseCase', () => {
  let logoutUseCase: LogoutUseCase;
  let mockAuthService: jest.Mocked<IAuthService>;

  beforeEach(() => {
    mockAuthService = {
      signOut: jest.fn(),
      signInWithGoogle: jest.fn(),
      getAuthenticatedUser: jest.fn(),
      getCurrentUser: jest.fn(),
    } as any;
    logoutUseCase = new LogoutUseCase(mockAuthService);
  });

  it('deve chamar o serviço de autenticação para deslogar', async () => {
    await logoutUseCase.execute();
    
    expect(mockAuthService.signOut).toHaveBeenCalled();
  });
});
