import { CategoryType } from "@/domain/enum/category-types";
import { Category } from "./category";

describe("Category Entity", () => {
  it("deve criar uma categoria valida", () => {
    const category = Category.create({
      name: "Alimentacao",
      icon: "utensils",
      color: "#f97316",
      user_id: "user-123",
      type: CategoryType.EXPENSE,
    });

    expect(category.name).toBe("Alimentacao");
    expect(category.type).toBe(CategoryType.EXPENSE);
    expect(category.userId).toBe("user-123");
  });

  it("deve exigir nome e usuario", () => {
    expect(() =>
      Category.create({
        name: "",
        icon: "utensils",
        color: "#f97316",
        user_id: "user-123",
        type: CategoryType.EXPENSE,
      })
    ).toThrow("Name is required.");

    expect(() =>
      Category.create({
        name: "Alimentacao",
        icon: "utensils",
        color: "#f97316",
        user_id: "",
        type: CategoryType.EXPENSE,
      })
    ).toThrow("User ID is required.");
  });
});
