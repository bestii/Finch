import {
  type PlannedPaymentRuleId,
  type AccountId,
  type CategoryId,
} from "./branded";

export type IntervalType = "day" | "week" | "month" | "year";
export type TransactionType = "income" | "expense";

export interface PlannedPaymentRule {
  id: PlannedPaymentRuleId;
  startDate: string | null; // ISO 8601 Instant
  intervalN: number | null; // e.g., 1 = every 1 <intervalType>
  intervalType: IntervalType | null;
  oneTime: boolean;
  type: TransactionType;
  accountId: AccountId;
  amount: number;
  categoryId: CategoryId | null;
  title: string | null;
  description: string | null;
}
