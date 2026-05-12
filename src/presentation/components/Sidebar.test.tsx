import { render } from '@testing-library/react';
import { Sidebar} from './Sidebar';

// Mockamos os hooks do Next.js para não quebrar a renderização
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/dashboard'),
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
}));

// Mockamos o next/link para renderizar apenas os filhos
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

describe('Sidebar', () => {
  it('deve renderizar a Sidebar sem quebrar', () => {
    // Renderizar o componente faz o Jest ler todas as +60 linhas de JSX dele!
    const { container } = render(<Sidebar />);
    expect(container).toBeTruthy();
  });
});