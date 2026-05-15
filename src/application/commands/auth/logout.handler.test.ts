import { logoutHandler } from './logout.handler';
import { authRepository } from '../../../infrastructure/supabase/auth.repository';

jest.mock('../../../infrastructure/supabase/auth.repository', () => ({
  authRepository: {
    signOut: jest.fn(),
  },
}));

describe('logoutHandler', () => {
  it('deve chamar o repositório de autenticação para deslogar', async () => {
    await logoutHandler();
    
    expect(authRepository.signOut).toHaveBeenCalled();
  });
});