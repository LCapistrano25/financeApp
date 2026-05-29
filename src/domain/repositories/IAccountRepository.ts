import { Account } from "../entities/account/account";

export interface IAccountRepository {
  getAccountById(id: string): Promise<Account | null>;
  getAccountsByUserId(userId: string): Promise<Account[]>;
  createAccount(account: Account): Promise<Account>;
  updateAccount(id: string, account: Account): Promise<Account>;
  deleteAccount(id: string): Promise<void>;
}
