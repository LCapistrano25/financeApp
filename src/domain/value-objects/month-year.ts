export class MonthYear {
  private readonly _year: number;
  private readonly _month: number;

  private constructor(year: number, month: number) {
    this._year = year;
    this._month = month;
  }

  public static create(value: string): MonthYear {
    if (!/^\d{4}-\d{2}$/.test(value)) {
      throw new Error("Formato de data inválido. Use YYYY-MM.");
    }

    const [year, month] = value.split("-").map(Number);
    
    if (month < 1 || month > 12) {
      throw new Error("Mês inválido.");
    }

    return new MonthYear(year, month);
  }

  get startDate(): string {
    return new Date(Date.UTC(this._year, this._month - 1, 1, 0, 0, 0)).toISOString();
  }

  get endDate(): string {
    return new Date(Date.UTC(this._year, this._month, 0, 23, 59, 59, 999)).toISOString();
  }

  get value(): string {
    return `${this._year}-${String(this._month).padStart(2, "0")}`;
  }
}
