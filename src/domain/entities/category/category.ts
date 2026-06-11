import { CategoryProps } from "./category.props";
import { CategoryType } from "@/domain/enum/category-types";

export class Category{
  
  private constructor(private readonly props: CategoryProps) {
      this.validate();
  }

  public static create(props: CategoryProps): Category {
    return new Category(props);
  }

  public static restore(props: CategoryProps): Category {
    if (!props.id) {
      throw new Error("ID is required to restore a category.");
    }
    return new Category(props);
  }

  public update(props: Partial<CategoryProps>): void {
    Object.assign(this.props, props);
    this.validate();
  }

  get id(): string | undefined { return this.props.id; }
  get userId(): string { return this.props.user_id; }
  get name(): string { return this.props.name; }
  get icon(): string { return this.props.icon; }
  get color(): string { return this.props.color; }
  get type(): CategoryType { return this.props.type; }
  get createdAt(): string | undefined { return this.props.created_at; }

  public validate(): void {
    if (!this.props.name) {
      throw new Error("Name is required.");
    }

    if (!this.props.user_id) {
      throw new Error("User ID is required.");
    }

    if (!Object.values(CategoryType).includes(this.props.type)) {
      throw new Error("Category type must be valid.");
    }

  }
}
