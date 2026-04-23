import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TransactionForm } from './transaction-form';
import { supabase } from '@/lib/supabase';

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: { user: { id: 'user-123' } } },
        error: null,
      }),
    },
    from: jest.fn(() => ({
      insert: jest.fn().mockResolvedValue({ error: null }),
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

describe('TransactionForm', () => {
  const defaultProps = {
    type: 'INCOME' as const,
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all form fields correctly', () => {
    render(<TransactionForm {...defaultProps} />);

    expect(screen.getByLabelText(/Valor da Receita/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Título/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data/i)).toBeInTheDocument();
    expect(screen.getByText(/Status/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmar Receita/i })).toBeInTheDocument();
  });

  it('should allow changing field values', () => {
    render(<TransactionForm {...defaultProps} />);

    const amountInput = screen.getByLabelText(/Valor da Receita/i);
    const titleInput = screen.getByLabelText(/Título/i);

    fireEvent.change(amountInput, { target: { value: '50.00' } });
    fireEvent.change(titleInput, { target: { value: 'Bonus' } });

    expect(amountInput).toHaveValue(50.00);
    expect(titleInput).toHaveValue('Bonus');
  });

  it('should submit form correctly when creating', async () => {
    render(<TransactionForm {...defaultProps} />);

    fireEvent.change(screen.getByLabelText(/Valor da Receita/i), { target: { value: '1000' } });
    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Salary' } });

    const submitButton = screen.getByRole('button', { name: /Confirmar Receita/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('transactions');
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should toggle status', () => {
    render(<TransactionForm {...defaultProps} />);
    
    const statusButton = screen.getByText('Pago').closest('button');
    expect(statusButton).toBeInTheDocument();
    
    fireEvent.click(statusButton!);
    expect(screen.getByText('Pendente')).toBeInTheDocument();
    
    fireEvent.click(statusButton!);
    expect(screen.getByText('Pago')).toBeInTheDocument();
  });
});
