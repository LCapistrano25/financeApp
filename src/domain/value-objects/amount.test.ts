import { Amount } from "./amount";

describe("Amount Value Object", () => {
  it("deve criar um valor monetario valido", () => {
    const amount = Amount.create(150);

    expect(amount.value).toBe(150);
  });

  it("deve rejeitar valor menor ou igual a zero", () => {
    expect(() => Amount.create(0)).toThrow("Amount must be greater than zero.");
    expect(() => Amount.create(-10)).toThrow("Amount must be greater than zero.");
  });

  it("deve rejeitar valores nao finitos", () => {
    expect(() => Amount.create(Number.NaN)).toThrow("Amount must be a finite number.");
    expect(() => Amount.create(Number.POSITIVE_INFINITY)).toThrow("Amount must be a finite number.");
  });
});
