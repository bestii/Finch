import {
  type TransactionId,
  type AccountId,
  type CategoryId,
  type TagId,
  type PositiveDouble,
} from "./branded";

interface BaseTransaction {
  id: TransactionId;
  title: string | null;
  description: string | null;
  categoryId: CategoryId | null;
  time: string; // ISO 8601 Instant (UTC)
  settled: boolean;
  tags: TagId[];
}

interface TransactionMetadata {
  recurringRuleId: string | null;
  paidForDateTime: string | null; // ISO 8601
  loanId: string | null;
  loanRecordId: string | null;
}

export interface Income extends BaseTransaction {
  type: "income";
  value: PositiveValue;
  accountId: AccountId;
  metadata: TransactionMetadata;
}

export interface Expense extends BaseTransaction {
  type: "expense";
  value: PositiveValue;
  accountId: AccountId;
  metadata: TransactionMetadata;
}

export interface Transfer extends BaseTransaction {
  type: "transfer";
  fromAccountId: AccountId;
  fromValue: PositiveValue;
  toAccountId: AccountId;
  toValue: PositiveValue;
  metadata: TransactionMetadata;
}

export type Transaction = Income | Expense | Transfer;

// ── Value types ────────────────────────────────────────────────────

export interface PositiveValue {
  amount: PositiveDouble;
  asset: string; // AssetCode
}

export interface Value {
  amount: number; // NonZeroDouble
  asset: string; // AssetCode
}
