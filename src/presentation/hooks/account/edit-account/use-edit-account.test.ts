import { act, renderHook } from "@testing-library/react";
import { useEditAccount } from "./use-edit-account";
import { EditAccountUseCase } from "@/application/usecases/account/edit-account/usecase";
import { EditAccountDto } from "@/application/usecases/account/edit-account/dto";

jest.mock("@/application/usecases/account/edit-account/usecase");

describe("useEditAccount", () => {
  const mockInput: EditAccountDto = {
    name: "Carteira",
    icon: "👛",
    color: "#ef4444",
  };

  it("deve editar uma conta e gerenciar os estados", async () => {
    const mockEditAccount = jest.fn().mockResolvedValue({ id: "1" });
    (EditAccountUseCase as jest.Mock).mockImplementation(() => ({
      editAccount: mockEditAccount,
    }));

    const { result } = renderHook(() => useEditAccount());

    let response;
    await act(async () => {
      response = await result.current.editAccount("1", mockInput);
    });

    expect(response).toEqual({ id: "1" });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("deve lidar com erro corretamente", async () => {
    const mockEditAccount = jest.fn().mockRejectedValue(new Error("Erro Fatal"));
    (EditAccountUseCase as jest.Mock).mockImplementation(() => ({
      editAccount: mockEditAccount,
    }));

    const { result } = renderHook(() => useEditAccount());

    await act(async () => {
      try {
        await result.current.editAccount("1", mockInput);
      } catch {}
    });

    expect(result.current.error).toBe("Erro Fatal");
    expect(result.current.isLoading).toBe(false);
  });
});

