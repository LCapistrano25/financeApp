import { renderHook, waitFor } from "@testing-library/react";
import { useAccounts } from "./use-get-accounts";
import { GetAccountsUseCase } from "@/application/usecases/account/get-accounts/usecase";

jest.mock("@/application/usecases/account/get-accounts/usecase");

describe("useAccounts", () => {
  it("deve carregar contas e atualizar estados", async () => {
    const mockExecute = jest.fn().mockResolvedValue([{ id: "1" }]);
    (GetAccountsUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBeNull();
    expect(result.current.accounts).toEqual([{ id: "1" }]);
  });

  it("deve lidar com erro corretamente", async () => {
    const mockExecute = jest.fn().mockRejectedValue(new Error("Erro Fatal"));
    (GetAccountsUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const { result } = renderHook(() => useAccounts());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Erro Fatal");
  });
});

