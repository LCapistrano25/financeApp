import { act, renderHook } from "@testing-library/react";
import { DeleteAccountUseCase } from "@/application/usecases/account/delete-account/usecase";
import { useDeleteAccount } from "./use-delete-account";

jest.mock("@/application/usecases/account/delete-account/usecase");

describe("useDeleteAccount", () => {
  it("deve deletar uma conta e gerenciar os estados", async () => {
    const mockExecute = jest.fn().mockResolvedValue(undefined);
    (DeleteAccountUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const confirmSpy = jest.spyOn(globalThis, "confirm").mockReturnValue(true);

    const { result } = renderHook(() => useDeleteAccount());

    let response;
    await act(async () => {
      response = await result.current.deleteAccount("1");
    });

    expect(response).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    confirmSpy.mockRestore();
  });

  it("deve retornar false quando o usuário cancelar", async () => {
    const mockExecute = jest.fn();
    (DeleteAccountUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const confirmSpy = jest.spyOn(globalThis, "confirm").mockReturnValue(false);

    const { result } = renderHook(() => useDeleteAccount());

    let response;
    await act(async () => {
      response = await result.current.deleteAccount("1");
    });

    expect(response).toBe(false);
    expect(mockExecute).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it("deve lidar com erro corretamente", async () => {
    const mockExecute = jest.fn().mockRejectedValue(new Error("Erro Fatal"));
    (DeleteAccountUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const confirmSpy = jest.spyOn(globalThis, "confirm").mockReturnValue(true);

    const { result } = renderHook(() => useDeleteAccount());

    await act(async () => {
      try {
        await result.current.deleteAccount("1");
      } catch {}
    });

    expect(result.current.error).toBe("Erro Fatal");
    expect(result.current.isLoading).toBe(false);

    confirmSpy.mockRestore();
  });
});

