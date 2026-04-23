import { render, screen } from '@testing-library/react';
import { ThemeProvider } from './theme-provider';

describe('ThemeProvider', () => {
  it('should render children correctly', () => {
    render(
      <ThemeProvider>
        <div data-testid="child">Child Content</div>
      </ThemeProvider>
    );
    expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
  });
});
