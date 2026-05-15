import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SummaryCard } from './summary-card';

describe('SummaryCard', () => {
  it('should render title and formatted amount correctly', () => {
    render(<SummaryCard title="Receitas" amount={1500.5} type="income" />);
    
    expect(screen.getByText('Receitas')).toBeInTheDocument();
    
    expect(screen.getByText('1.500,50')).toBeInTheDocument();
  });

  it('should apply correct color class for expense', () => {
    render(<SummaryCard title="Despesas" amount={200} type="expense" />);
    const valueDiv = screen.getByText('200,00').closest('div');
    expect(valueDiv).toHaveClass('text-red-600');
  });

  it('should apply correct color class by default', () => {
    render(<SummaryCard title="Saldo" amount={100} />);
    const valueDiv = screen.getByText('100,00').closest('div');
    expect(valueDiv).toHaveClass('text-slate-900');
  });
});
