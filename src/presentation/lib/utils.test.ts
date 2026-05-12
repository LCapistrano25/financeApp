import { cn, formatCurrency } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
      expect(cn('class1', { class2: true, class3: false })).toBe('class1 class2');
      expect(cn('p-4', 'p-2')).toBe('p-2');
    });
  });

  describe('formatCurrency', () => {
    it('should format cents to BRL currency string correctly', () => {
      expect(formatCurrency('1000')).toBe('10,00');
      expect(formatCurrency('12345')).toBe('123,45');
      expect(formatCurrency('5')).toBe('0,05');
      expect(formatCurrency('0')).toBe('0,00');
    });

    it('should handle non-digit characters', () => {
      expect(formatCurrency('10,00')).toBe('10,00');
      expect(formatCurrency('R$ 1.234,56')).toBe('1.234,56');
    });

    it('should handle empty or invalid input', () => {
      expect(formatCurrency('')).toBe('0,00');
      expect(formatCurrency('abc')).toBe('0,00');
    });
  });
});
