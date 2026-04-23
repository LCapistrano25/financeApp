import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { TransactionCard } from './transaction-card';
import { ComponentProps } from 'react';

describe('TransactionCard', () => {
  let defaultProps: ComponentProps<typeof TransactionCard>;

  beforeEach(() => {
    defaultProps = {
      title: 'Supermarket',
      category: 'Food',
      amount: 150.50,
      type: 'expense' as const,
      onClick: jest.fn(),
    };
  });

  it('should render transaction details correctly', () => {
    render(<TransactionCard {...defaultProps} />);

    expect(screen.getByText('Supermarket')).toBeInTheDocument();
    expect(screen.getByText('Food')).toBeInTheDocument();
    expect(screen.getByText(/-R\$[\s\xA0]150,50/)).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    render(<TransactionCard {...defaultProps} />);
    
    const card = screen.getByRole('button');
    fireEvent.click(card);
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClick when Enter key is pressed', () => {
    render(<TransactionCard {...defaultProps} />);
    
    const card = screen.getByRole('button');
    fireEvent.keyDown(card, { key: 'Enter' });
    
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('should apply correct color for income type', () => {
    render(<TransactionCard {...defaultProps} type="income" />);
    
    const amountElement = screen.getByText(/\+R\$[\s\xA0]150,50/);
    expect(amountElement).toHaveClass('text-emerald-600');
  });

  it('should apply correct color for expense type', () => {
    render(<TransactionCard {...defaultProps} type="expense" />);
    
    const amountElement = screen.getByText(/-R\$[\s\xA0]150,50/);
    expect(amountElement).toHaveClass('text-red-500');
  });
});
