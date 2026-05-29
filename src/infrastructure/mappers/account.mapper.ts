import { Account } from "@/domain/entities/account/account";
import { AccountProps } from "@/domain/entities/account/account.props";

export class AccountMapper {
  static toDomain(props: AccountProps): Account {
    return Account.restore(props);
  }

  static toPersistence(account: Account): Record<string, unknown> {
    const persistence: Record<string, unknown> = {
      user_id: account.userId,
      name: account.name,
      icon: account.icon,
      color: account.color,
    };

    if (account.id) persistence.id = account.id;
    if (account.createdAt) persistence.created_at = account.createdAt;

    return persistence;
  }
}
