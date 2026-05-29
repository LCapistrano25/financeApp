import { Account } from "@/domain/entities/account/account";
import { supabase } from "@/infrastructure/repositories/supabase/supabase.client";
import { AccountRepository } from "@/infrastructure/repositories/supabase/account/account.repository";

jest.mock("@/infrastructure/repositories/supabase/supabase.client", () => {
  const mockQuery = {
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn(),
    single: jest.fn(),
  };

  return {
    supabase: {
      from: jest.fn(() => mockQuery),
    },
  };
});

describe("AccountRepository", () => {
  let repository: AccountRepository;
  let mockSupabaseQuery: Record<string, jest.Mock>;

  const accountData = {
    id: "acc-123",
    user_id: "user-123",
    name: "Carteira",
    icon: "wallet",
    color: "#22c55e",
    created_at: "2026-05-29T00:00:00.000Z",
  };

  beforeEach(() => {
    repository = new AccountRepository();
    mockSupabaseQuery = supabase.from("accounts") as unknown as Record<string, jest.Mock>;
    jest.clearAllMocks();
  });

  it("deve buscar uma conta por ID", async () => {
    mockSupabaseQuery.single.mockResolvedValueOnce({ data: accountData, error: null });

    const result = await repository.getAccountById("acc-123");

    expect(supabase.from).toHaveBeenCalledWith("accounts");
    expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("id", "acc-123");
    expect(result?.id).toBe("acc-123");
    expect(result?.name).toBe("Carteira");
  });

  it("deve retornar null quando a conta nao existir", async () => {
    mockSupabaseQuery.single.mockResolvedValueOnce({
      data: null,
      error: { code: "PGRST116", message: "Not found" },
    });

    await expect(repository.getAccountById("missing")).resolves.toBeNull();
  });

  it("deve listar contas por usuario", async () => {
    mockSupabaseQuery.order.mockResolvedValueOnce({ data: [accountData], error: null });

    const result = await repository.getAccountsByUserId("user-123");

    expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("user_id", "user-123");
    expect(mockSupabaseQuery.order).toHaveBeenCalledWith("name", { ascending: true });
    expect(result).toHaveLength(1);
    expect(result[0].userId).toBe("user-123");
  });

  it("deve criar uma conta", async () => {
    mockSupabaseQuery.single.mockResolvedValueOnce({ data: accountData, error: null });
    const account = Account.create({
      user_id: "user-123",
      name: "Carteira",
      icon: "wallet",
      color: "#22c55e",
    });

    const result = await repository.createAccount(account);

    expect(mockSupabaseQuery.insert).toHaveBeenCalledWith({
      user_id: "user-123",
      name: "Carteira",
      icon: "wallet",
      color: "#22c55e",
    });
    expect(result.id).toBe("acc-123");
  });

  it("deve atualizar uma conta", async () => {
    mockSupabaseQuery.single.mockResolvedValueOnce({ data: accountData, error: null });
    const account = Account.restore(accountData);

    const result = await repository.updateAccount("acc-123", account);

    expect(mockSupabaseQuery.update).toHaveBeenCalledWith({
      id: "acc-123",
      user_id: "user-123",
      name: "Carteira",
      icon: "wallet",
      color: "#22c55e",
      created_at: "2026-05-29T00:00:00.000Z",
    });
    expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("id", "acc-123");
    expect(result.id).toBe("acc-123");
  });

  it("deve deletar uma conta", async () => {
    mockSupabaseQuery.eq.mockResolvedValueOnce({ error: null });

    await repository.deleteAccount("acc-123");

    expect(mockSupabaseQuery.delete).toHaveBeenCalled();
    expect(mockSupabaseQuery.eq).toHaveBeenCalledWith("id", "acc-123");
  });

  it("deve propagar erros do Supabase", async () => {
    mockSupabaseQuery.single.mockResolvedValueOnce({
      data: null,
      error: { message: "Database Error" },
    });

    await expect(repository.getAccountById("acc-123")).rejects.toThrow("Database Error");
  });
});
