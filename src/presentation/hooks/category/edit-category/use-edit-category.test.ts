import { act, renderHook } from "@testing-library/react";
import { EditCategoryDto } from "@/application/usecases/category/edit-category/dto";
import { EditCategoryUseCase } from "@/application/usecases/category/edit-category/usecase";
import { CategoryType } from "@/domain/enum/category-types";
import { useEditCategory } from "./use-edit-category";

jest.mock("@/application/usecases/category/edit-category/usecase");

describe("useEditCategory", () => {
  const mockInput: EditCategoryDto = {
    name: "Mercado",
    icon: "🛒",
    color: "#ef4444",
    type: CategoryType.EXPENSE,
  };

  it("deve editar uma categoria e gerenciar os estados", async () => {
    const mockEditCategory = jest.fn().mockResolvedValue({ id: "1" });
    (EditCategoryUseCase as jest.Mock).mockImplementation(() => ({
      editCategory: mockEditCategory,
    }));

    const { result } = renderHook(() => useEditCategory());

    let response;
    await act(async () => {
      response = await result.current.editCategory("1", mockInput);
    });

    expect(response).toEqual({ id: "1" });
    expect(result.current.isSuccess).toBe(true);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("deve lidar com erro corretamente", async () => {
    const mockEditCategory = jest.fn().mockRejectedValue(new Error("Erro Fatal"));
    (EditCategoryUseCase as jest.Mock).mockImplementation(() => ({
      editCategory: mockEditCategory,
    }));

    const { result } = renderHook(() => useEditCategory());

    await act(async () => {
      try {
        await result.current.editCategory("1", mockInput);
      } catch {}
    });

    expect(result.current.error).toBe("Erro Fatal");
    expect(result.current.isLoading).toBe(false);
  });
});
