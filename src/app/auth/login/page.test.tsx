import { render } from '@testing-library/react';
import LoginPage from './page';

// Mockamos os hooks de navegação e autenticação para a página não tentar redirecionar de verdade
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

jest.mock('@/presentation/hooks/auth/use-auth', () => ({
  useAuth: () => ({ loginWithGoogle: jest.fn(), isLoading: false }),
}));

describe('LoginPage', () => {
  it('deve renderizar a página de login sem quebrar', () => {
    const { container } = render(<LoginPage />);
    expect(container).toBeTruthy();
  });
});
