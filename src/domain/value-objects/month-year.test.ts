import { MonthYear } from './month-year';

describe('MonthYear Value Object', () => {
  it('deve criar uma instância válida', () => {
    const monthYear = MonthYear.create('2023-10');
    expect(monthYear.value).toBe('2023-10');
  });

  it('deve calcular a data de início corretamente', () => {
    const monthYear = MonthYear.create('2023-10');
    // 2023-10-01T... (dependendo do timezone, mas o ISO deve bater)
    expect(monthYear.startDate).toContain('2023-10-01');
  });

  it('deve calcular a data de fim corretamente', () => {
    const monthYear = MonthYear.create('2023-10');
    // Outubro tem 31 dias
    expect(monthYear.endDate).toContain('2023-10-31');
  });

  it('deve lançar erro para formato inválido', () => {
    expect(() => MonthYear.create('2023/10')).toThrow('Formato de data inválido');
    expect(() => MonthYear.create('23-10')).toThrow('Formato de data inválido');
  });

  it('deve lançar erro para mês inválido', () => {
    expect(() => MonthYear.create('2023-13')).toThrow('Mês inválido');
    expect(() => MonthYear.create('2023-00')).toThrow('Mês inválido');
  });
});
