import { render } from '@testing-library/react';
// Importe usando o nome correto exportado no seu arquivo
import { CategoryForm } from './category-form'; 

describe('CategoryForm', () => {
  it('deve renderizar o formulário de categoria sem quebrar', () => {
    const { container } = render(<CategoryForm />);
    expect(container).toBeTruthy();
  });
});