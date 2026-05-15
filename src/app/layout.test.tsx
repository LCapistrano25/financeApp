import React from 'react';
import { render } from '@testing-library/react';
import RootLayout from './layout';

// Mockamos o ThemeProvider sem usar 'any', definindo o tipo correto do children
jest.mock('@/presentation/components/theme-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="theme-provider">{children}</div>,
}));

// Guardamos o console.error original ANTES de modificar
const originalConsoleError = console.error;

describe('RootLayout', () => {
  beforeAll(() => {
    // Sequestramos o console.error
    jest.spyOn(console, 'error').mockImplementation((...args) => {
      const msg = args[0];
      // Se for o aviso chato do React no Jest, a gente ignora
      if (typeof msg === 'string' && msg.includes('cannot be a child of <div>')) {
        return;
      }
      // Se for outro erro de verdade, chamamos a função ORIGINAL
      originalConsoleError(...args);
    });
  });

  afterAll(() => {
    // Devolvemos o console ao estado normal após o teste
    jest.restoreAllMocks();
  });

  it('deve renderizar o layout principal da aplicação sem quebrar', () => {
    const { container } = render(
      <RootLayout>
        <div>App Content</div>
      </RootLayout>
    );
    expect(container).toBeTruthy();
  });
});