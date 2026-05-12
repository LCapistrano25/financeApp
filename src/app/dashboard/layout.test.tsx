import { render } from '@testing-library/react';
import DashboardLayout from './layout';

// Mockamos as dependências da Sidebar para ela renderizar silenciosamente
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/dashboard'),
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

jest.mock('@/presentation/hooks/use-auth', () => ({
  useAuth: () => ({ user: { id: '123' }, isLoading: false }),
}));

describe('DashboardLayout', () => {
  it('deve renderizar o layout do dashboard sem quebrar', () => {
    const { container } = render(
      <DashboardLayout>
        <div>Conteúdo Filho</div>
      </DashboardLayout>
    );
    expect(container).toBeTruthy();
  });
});