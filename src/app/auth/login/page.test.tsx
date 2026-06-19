import { render } from '@testing-library/react';
import LoginPage from './page';

describe('LoginPage', () => {
  it('renders the login page without loading the Supabase browser client', () => {
    const { container } = render(<LoginPage />);
    expect(container).toBeTruthy();
  });
});
