import { Account } from "./account";

describe("Account Entity", () => {
  it("deve criar uma conta valida", () => {
    const account = Account.create({
      name: "Carteira",
      icon: "wallet",
      color: "#22c55e",
      user_id: "user-123",
    });

    expect(account.name).toBe("Carteira");
    expect(account.userId).toBe("user-123");
  });

  it("deve exigir nome e usuario", () => {
    expect(() =>
      Account.create({
        name: "",
        icon: "wallet",
        color: "#22c55e",
        user_id: "user-123",
      })
    ).toThrow("Account name is required.");

    expect(() =>
      Account.create({
        name: "Carteira",
        icon: "wallet",
        color: "#22c55e",
        user_id: "",
      })
    ).toThrow("User ID is required.");
  });

  it("deve exigir ID ao restaurar uma conta persistida", () => {
    expect(() =>
      Account.restore({
        name: "Carteira",
        icon: "wallet",
        color: "#22c55e",
        user_id: "user-123",
      })
    ).toThrow("ID is required to restore an account.");
  });
});
