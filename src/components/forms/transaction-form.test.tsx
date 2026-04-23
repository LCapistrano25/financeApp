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
    window.alert = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
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
    const dateInput = screen.getByLabelText(/Data/i);

    fireEvent.change(amountInput, { target: { value: '50.00' } });
    fireEvent.change(titleInput, { target: { value: 'Bonus' } });
    fireEvent.change(dateInput, { target: { value: '2023-12-31' } });

    expect(amountInput).toHaveValue(50.00);
    expect(titleInput).toHaveValue('Bonus');
    expect(dateInput).toHaveValue('2023-12-31');
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

  it('should submit form correctly when editing', async () => {
    const initialData = {
      id: '1',
      amount: 500,
      description: 'Rent',
      date: '2023-01-01',
      is_paid: true,
    };
    render(<TransactionForm {...defaultProps} initialData={initialData} />);

    expect(screen.getByDisplayValue('Rent')).toBeInTheDocument();
    
    const submitButton = screen.getByRole('button', { name: /Guardar Alterações/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('transactions');
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should show alert when title or amount is missing (create)', () => {
    // We add noValidate to bypass browser validation in test
    render(<TransactionForm {...defaultProps} />);
    const amountInput = screen.getByLabelText(/Valor da Receita/i);
    fireEvent.change(amountInput, { target: { value: '' } }); // Ensure it's empty
    
    const submitButton = screen.getByRole('button', { name: /Confirmar/i });
    fireEvent.click(submitButton);
    
    expect(window.alert).toHaveBeenCalledWith("Preencha o valor e o título!");
  });

  it('should show alert when title or amount is missing (edit)', () => {
    const initialData = {
      id: '1',
      amount: 500,
      description: 'Rent',
      date: '2023-01-01',
      is_paid: true,
    };
    render(<TransactionForm {...defaultProps} initialData={initialData} />);
    
    const titleInput = screen.getByLabelText(/Título/i);
    fireEvent.change(titleInput, { target: { value: '' } }); // Delete title
    
    const submitButton = screen.getByRole('button', { name: /Guardar Alterações/i });
    fireEvent.click(submitButton);
    
    expect(window.alert).toHaveBeenCalledWith("Preencha o valor e o título!");
  });

  it('should handle submission errors on create', async () => {
    window.alert = jest.fn();
    (supabase.from as jest.Mock).mockImplementationOnce(() => ({
      insert: jest.fn().mockResolvedValue({ error: new Error('Database Error Create') }),
    }));

    render(<TransactionForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Valor da Receita/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Error Test' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirmar/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Database Error Create"));
    });
  });

  it('should handle submission errors on edit', async () => {
    window.alert = jest.fn();
    (supabase.from as jest.Mock).mockImplementationOnce(() => ({
      update: jest.fn().mockReturnThis(),
      eq: jest.fn().mockResolvedValue({ error: new Error('Database Error Update') }),
    }));

    const initialData = {
      id: '1',
      amount: 500,
      description: 'Rent',
      date: '2023-01-01',
      is_paid: true,
    };
    render(<TransactionForm {...defaultProps} initialData={initialData} />);
    
    // Simulate any change
    fireEvent.change(screen.getByLabelText(/Valor da Receita/i), { target: { value: '600' } });

    fireEvent.click(screen.getByRole('button', { name: /Guardar Alterações/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Database Error Update"));
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

  it('should handle missing session error', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: null },
      error: null,
    });

    render(<TransactionForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Valor da Receita/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'No Session Test' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirmar Receita/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao salvar transação: Usuário não logado");
    });
  });

  it('should handle non-Error objects thrown during submission', async () => {
    (supabase.from as jest.Mock).mockImplementationOnce(() => ({
      insert: jest.fn().mockRejectedValueOnce('String Error'),
    }));

    render(<TransactionForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Valor da Receita/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'String Error Test' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirmar/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Erro ao salvar transação: Erro desconhecido");
    });
  });

  it('should render correct text and styles for EXPENSE type', () => {
    render(<TransactionForm {...defaultProps} type="EXPENSE" />);
    
    expect(screen.getByLabelText(/Valor da Despesa/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmar Despesa/i })).toHaveClass('bg-red-500');
  });
});
