import { act, renderHook } from "@testing-library/react";
import { CreateCategoryDto } from "@/application/usecases/category/create-category/dto";
import { CreateCategoryUseCase } from "@/application/usecases/category/create-category/usecase";
import { CategoryType } from "@/domain/enum/category-types";
import { useCreateCategory } from "./use-create-category";

jest.mock("@/application/usecases/category/create-category/usecase");

describe("useCreateCategory", () => {
  const mockInput: CreateCategoryDto = {
    name: "Mercado",
    icon: "🛒",
    color: "#ef4444",
    type: CategoryType.EXPENSE,
  };

  it("deve criar uma categoria e gerenciar os estados", async () => {
    const mockExecute = jest.fn().mockResolvedValue({ id: "1" });
    (CreateCategoryUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const { result } = renderHook(() => useCreateCategory());

    let response;
    await act(async () => {
      response = await result.current.createCategory(mockInput);
    });

    expect(response).toEqual({ id: "1" });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("deve lidar com erro corretamente", async () => {
    const mockExecute = jest.fn().mockRejectedValue(new Error("Erro Fatal"));
    (CreateCategoryUseCase as jest.Mock).mockImplementation(() => ({
      execute: mockExecute,
    }));

    const { result } = renderHook(() => useCreateCategory());

    await act(async () => {
      try {
        await result.current.createCategory(mockInput);
      } catch {}
    });

    expect(result.current.error).toBe("Erro Fatal");
    expect(result.current.isLoading).toBe(false);
  });
});
