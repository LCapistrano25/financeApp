import { render } from '@testing-library/react';
import { AccountForm } from './account-form'; 

describe('AccountForm', () => {
  it('deve renderizar o formulário de conta sem quebrar', () => {
    const { container } = render(<AccountForm />);
    expect(container).toBeTruthy();
  });
});