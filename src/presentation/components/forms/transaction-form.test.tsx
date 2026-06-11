import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TransactionForm } from './transaction-form';
// IMPORTAMOS OS NOSSOS HOOKS PARA PODER FAZER O MOCK DELES
import { useCreateTransaction } from '@/presentation/hooks/transaction/create-transaction/use-create-transaction';
import { useEditTransaction } from '@/presentation/hooks/transaction/edit-transaction/use-edit-transaction';
import { useCategories } from '@/presentation/hooks/category/get-categories/use-get-categories';
import { useAccounts } from '@/presentation/hooks/account/get-accounts/use-get-accounts';

// 1. Mockamos os hooks em vez do Supabase
jest.mock('@/presentation/hooks/transaction/create-transaction/use-create-transaction', () => ({
  useCreateTransaction: jest.fn(),
}));

jest.mock('@/presentation/hooks/transaction/edit-transaction/use-edit-transaction', () => ({
  useEditTransaction: jest.fn(),
}));

jest.mock('@/presentation/hooks/category/get-categories/use-get-categories', () => ({
  useCategories: jest.fn(),
}));

jest.mock('@/presentation/hooks/account/get-accounts/use-get-accounts', () => ({
  useAccounts: jest.fn(),
}));

describe('TransactionForm', () => {
  const defaultProps = {
    type: 'INCOME' as const,
    onSuccess: jest.fn(),
  };

  // Preparamos as funções falsas (mocks) que vão imitar o retorno dos hooks
  const mockCreateTransaction = jest.fn();
  const mockEditTransaction = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    window.alert = jest.fn();
    console.error = jest.fn(); // Silencia os erros esperados no console durante os testes

    // Configuramos o retorno padrão dos hooks antes de cada teste
    (useCreateTransaction as jest.Mock).mockReturnValue({
      createTransaction: mockCreateTransaction,
      isLoading: false,
    });

    (useEditTransaction as jest.Mock).mockReturnValue({
      editTransaction: mockEditTransaction,
      isLoading: false,
    });

    (useCategories as jest.Mock).mockReturnValue({
      categories: [
        { id: 'cat-1', name: 'Salário', icon: '💰', color: '#10b981', type: 'INCOME' },
      ],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });

    (useAccounts as jest.Mock).mockReturnValue({
      accounts: [
        { id: 'acc-1', name: 'Carteira', icon: '👛', color: '#ef4444' },
      ],
      isLoading: false,
      error: null,
      refresh: jest.fn(),
    });
    
    // Sucesso padrão
    mockCreateTransaction.mockResolvedValue({});
    mockEditTransaction.mockResolvedValue({});
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
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: 'cat-1' } });
    fireEvent.change(screen.getByLabelText(/Conta/i), { target: { value: 'acc-1' } });

    const submitButton = screen.getByRole('button', { name: /Confirmar Receita/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Verificamos se o HOOK foi chamado (não mais o Supabase)
      expect(mockCreateTransaction).toHaveBeenCalled();
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should submit form correctly when editing', async () => {
    const initialData = {
      id: '1',
      amount: 500,
      description: 'Rent',
      date: '2023-01-01',
      isPaid: true,
      categoryId: 'cat-1',
      accountId: 'acc-1',
    };
    render(<TransactionForm {...defaultProps} initialData={initialData} />);

    expect(screen.getByDisplayValue('Rent')).toBeInTheDocument();

    const submitButton = screen.getByRole('button', { name: /Guardar Alterações/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      // Verificamos se o HOOK de edição foi chamado
      expect(mockEditTransaction).toHaveBeenCalledWith('1', expect.any(Object));
      expect(defaultProps.onSuccess).toHaveBeenCalled();
    });
  });

  it('should show alert when title or amount is missing (create)', () => {
    render(<TransactionForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: 'cat-1' } });
    fireEvent.change(screen.getByLabelText(/Conta/i), { target: { value: 'acc-1' } });
    
    // Tentamos enviar sem preencher nada
    const submitButton = screen.getByRole('button', { name: /Confirmar Receita/i });
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith("Preencha o valor e o título!");
    // O hook não deve ser chamado
    expect(mockCreateTransaction).not.toHaveBeenCalled();
  });

  it('should show alert when title or amount is missing (edit)', () => {
    const initialData = {
      id: '1',
      amount: 500,
      description: 'Rent',
      date: '2023-01-01',
      isPaid: true,
      categoryId: 'cat-1',
      accountId: 'acc-1',
    };
    render(<TransactionForm {...defaultProps} initialData={initialData} />);

    const titleInput = screen.getByLabelText(/Título/i);
    fireEvent.change(titleInput, { target: { value: '' } }); // Delete title

    const submitButton = screen.getByRole('button', { name: /Guardar Alterações/i });
    fireEvent.click(submitButton);

    expect(window.alert).toHaveBeenCalledWith("Preencha o valor e o título!");
  });

  it('should handle submission errors on create', async () => {
    // Forçamos o hook a retornar um erro
    mockCreateTransaction.mockRejectedValue(new Error('Erro no hook create'));

    render(<TransactionForm {...defaultProps} />);
    fireEvent.change(screen.getByLabelText(/Valor da Receita/i), { target: { value: '100' } });
    fireEvent.change(screen.getByLabelText(/Título/i), { target: { value: 'Error Test' } });
    fireEvent.change(screen.getByLabelText(/Categoria/i), { target: { value: 'cat-1' } });
    fireEvent.change(screen.getByLabelText(/Conta/i), { target: { value: 'acc-1' } });

    fireEvent.click(screen.getByRole('button', { name: /Confirmar Receita/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Erro no hook create"));
      expect(defaultProps.onSuccess).not.toHaveBeenCalled();
    });
  });

  it('should handle submission errors on edit', async () => {
    // Forçamos o hook a retornar um erro
    mockEditTransaction.mockRejectedValue(new Error('Erro no hook update'));

    const initialData = {
      id: '1',
      amount: 500,
      description: 'Rent',
      date: '2023-01-01',
      isPaid: true,
      categoryId: 'cat-1',
      accountId: 'acc-1',
    };
    render(<TransactionForm {...defaultProps} initialData={initialData} />);

    fireEvent.change(screen.getByLabelText(/Valor da Receita/i), { target: { value: '600' } });

    fireEvent.click(screen.getByRole('button', { name: /Guardar Alterações/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(expect.stringContaining("Erro no hook update"));
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

  it('should render correct text and styles for EXPENSE type', () => {
    render(<TransactionForm {...defaultProps} type="EXPENSE" />);

    expect(screen.getByLabelText(/Valor da Despesa/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Confirmar Despesa/i })).toHaveClass('bg-red-500');
  });
  
  it('should show loading spinner when submitting', () => {
     // Forçamos o hook a estar em estado de loading
    (useCreateTransaction as jest.Mock).mockReturnValue({
        createTransaction: mockCreateTransaction,
        isLoading: true, // Aqui simulamos a demora do backend
    });

    render(<TransactionForm {...defaultProps} />);
    
    // Pegamos todos os botões renderizados na tela
    const buttons = screen.getAllByRole('button');
    
    // Encontramos especificamente o botão de enviar o formulário (type="submit")
    const submitButton = buttons.find(b => b.getAttribute('type') === 'submit');

    // O botão deve estar desabilitado
    expect(submitButton).toBeDisabled();
    
    // E não deve ter o texto "Confirmar Receita", pois está renderizando o ícone de Loader
    expect(screen.queryByText(/Confirmar Receita/i)).not.toBeInTheDocument();
  });
});
