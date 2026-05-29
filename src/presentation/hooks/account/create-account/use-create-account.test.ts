import { act, renderHook } from "@testing-library/react";
import { useCreateAccount } from "./use-create-account";
import { CreateAccountUseCase } from "@/application/usecases/account/create-account/usecase";
import { CreateAccountDto } from "@/application/usecases/account/create-account/dto";

jest.mock("@/application/usecases/account/create-account/usecase");

describe("useCreateAccount", () => {
  const mockInput: CreateAccountDto = {
    name: "Carteira",
    icon: "👛",
    color: "#ef4444",
  };

  it("deve criar uma conta e gerenciar os estados", async () => {
    const mockExecute = jest.fn().mockResolvedValue({ id: "1" });
    (CreateAccountUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const { result } = renderHook(() => useCreateAccount());

    let response;
    await act(async () => {
      response = await result.current.createAccount(mockInput);
    });

    expect(response).toEqual({ id: "1" });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("deve lidar com erro corretamente", async () => {
    const mockExecute = jest.fn().mockRejectedValue(new Error("Erro Fatal"));
    (CreateAccountUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const { result } = renderHook(() => useCreateAccount());

    await act(async () => {
      try {
        await result.current.createAccount(mockInput);
      } catch {}
    });

    expect(result.current.error).toBe("Erro Fatal");
    expect(result.current.isLoading).toBe(false);
  });
});

