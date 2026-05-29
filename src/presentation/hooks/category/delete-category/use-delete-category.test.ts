import { act, renderHook } from "@testing-library/react";
import { DeleteCategoryUseCase } from "@/application/usecases/category/delete-category/usecase";
import { useDeleteCategory } from "./use-delete-category";

jest.mock("@/application/usecases/category/delete-category/usecase");

describe("useDeleteCategory", () => {
  it("deve deletar uma categoria e gerenciar os estados", async () => {
    const mockExecute = jest.fn().mockResolvedValue(undefined);
    (DeleteCategoryUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const confirmSpy = jest.spyOn(globalThis, "confirm").mockReturnValue(true);

    const { result } = renderHook(() => useDeleteCategory());

    let response;
    await act(async () => {
      response = await result.current.deleteCategory("1");
    });

    expect(response).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    confirmSpy.mockRestore();
  });

  it("deve retornar false quando o usuário cancelar", async () => {
    const mockExecute = jest.fn();
    (DeleteCategoryUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const confirmSpy = jest.spyOn(globalThis, "confirm").mockReturnValue(false);

    const { result } = renderHook(() => useDeleteCategory());

    let response;
    await act(async () => {
      response = await result.current.deleteCategory("1");
    });

    expect(response).toBe(false);
    expect(mockExecute).not.toHaveBeenCalled();

    confirmSpy.mockRestore();
  });

  it("deve lidar com erro corretamente", async () => {
    const mockExecute = jest.fn().mockRejectedValue(new Error("Erro Fatal"));
    (DeleteCategoryUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const confirmSpy = jest.spyOn(globalThis, "confirm").mockReturnValue(true);

    const { result } = renderHook(() => useDeleteCategory());

    await act(async () => {
      try {
        await result.current.deleteCategory("1");
      } catch {}
    });

    expect(result.current.error).toBe("Erro Fatal");
    expect(result.current.isLoading).toBe(false);

    confirmSpy.mockRestore();
  });
});

