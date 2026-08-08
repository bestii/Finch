import { type BudgetId, type CategoryId, type AccountId } from "./branded";

export interface Budget {
  id: BudgetId;
  name: string;
  amount: number; // Budget limit
  categoryIds: CategoryId[];
  accountIds: AccountId[];
  orderNum: number;
}
