import { Amount } from "./amount";

describe("Amount Value Object", () => {
  it("deve criar um valor monetario valido", () => {
    const amount = Amount.create(150);

    expect(amount.value).toBe(150);
  });

  it("deve rejeitar valor menor ou igual a zero", () => {
    expect(() => Amount.create(0)).toThrow("maior que zero");
    expect(() => Amount.create(-10)).toThrow("maior que zero");
  });

  it("deve rejeitar valores nao finitos", () => {
    expect(() => Amount.create(Number.NaN)).toThrow("finito");
    expect(() => Amount.create(Number.POSITIVE_INFINITY)).toThrow("finito");
  });
});
