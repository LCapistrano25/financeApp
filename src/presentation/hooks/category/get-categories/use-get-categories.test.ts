import { renderHook, waitFor } from "@testing-library/react";
import { useCategories } from "./use-get-categories";
import { GetCategoriesUseCase } from "@/application/usecases/category/get-categories/usecase";

jest.mock("@/application/usecases/category/get-categories/usecase");

describe("useCategories", () => {
  it("deve carregar categorias e atualizar estados", async () => {
    const mockExecute = jest.fn().mockResolvedValue([{ id: "1" }]);
    (GetCategoriesUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.categories).toEqual([{ id: "1" }]);
  });

  it("deve lidar com erro corretamente", async () => {
    const mockExecute = jest.fn().mockRejectedValue(new Error("Erro Fatal"));
    (GetCategoriesUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const { result } = renderHook(() => useCategories());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe("Erro Fatal");
  });
});
