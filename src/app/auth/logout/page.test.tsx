import { render } from '@testing-library/react';
import LogoutPage from './page';

jest.mock('@/presentation/hooks/use-auth', () => ({
  useAuth: () => ({ logout: jest.fn() }),
}));

describe('LogoutPage', () => {
  it('deve renderizar a página de logout sem quebrar', () => {
    const { container } = render(<LogoutPage />);
    expect(container).toBeTruthy();
  });
});
