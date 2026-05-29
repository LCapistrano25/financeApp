import { AccountProps } from "./account.props";

export class Account {
  private constructor(private readonly props: AccountProps) {
    this.validate();
  }

  public static create(props: AccountProps): Account {
    return new Account(props);
  }

  public static restore(props: AccountProps): Account {
    if (!props.id) {
      throw new Error("ID is required to restore an account.");
    }

    return new Account(props);
  }

  get id(): string | undefined { return this.props.id; }
  get name(): string { return this.props.name; }
  get icon(): string { return this.props.icon; }
  get color(): string { return this.props.color; }
  get userId(): string { return this.props.user_id; }
  get createdAt(): string | undefined { return this.props.created_at; }

  private validate(): void {
    if (!this.props.name?.trim()) {
      throw new Error("Account name is required.");
    }

    if (!this.props.user_id?.trim()) {
      throw new Error("User ID is required.");
    }
  }
}
