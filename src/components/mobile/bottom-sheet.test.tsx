import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BottomSheet } from './bottom-sheet';

describe('BottomSheet', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    title: 'Opções',
  };

  it('should render children when provided', () => {
    render(
      <BottomSheet {...defaultProps}>
        <div data-testid="custom-child">Child Content</div>
      </BottomSheet>
    );

    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
  });

  it('should render default action buttons when children are missing', () => {
    render(<BottomSheet {...defaultProps} />);

    expect(screen.getByText('Editar Transação')).toBeInTheDocument();
    expect(screen.getByText('Excluir')).toBeInTheDocument();
  });

  it('should call onClose when clicking the close button and the overlay', () => {
    render(<BottomSheet {...defaultProps} />);
    
    const closeButtons = screen.getAllByRole('button', { name: /Fechar/i });
    fireEvent.click(closeButtons[0]);
    fireEvent.click(closeButtons[1]);
    
    expect(defaultProps.onClose).toHaveBeenCalledTimes(2);
  });
  
  it('should manage body overflow', () => {
    const { rerender } = render(<BottomSheet {...defaultProps} isOpen={true} />);
    expect(document.body.style.overflow).toBe('hidden');

    rerender(<BottomSheet {...defaultProps} isOpen={false} />);
    expect(document.body.style.overflow).toBe('auto');
  });
});
