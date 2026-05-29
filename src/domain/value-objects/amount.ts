export class Amount {
  private constructor(private readonly rawValue: number) {
    this.validate();
  }

  public static create(value: number): Amount {
    return new Amount(value);
  }

  get value(): number {
    return this.rawValue;
  }

  private validate(): void {
    if (!Number.isFinite(this.rawValue)) {
      throw new Error("O valor deve ser um número finito.");
    }

    if (this.rawValue <= 0) {
      throw new Error("O valor deve ser maior que zero.");
    }
  }
}
