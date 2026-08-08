import {
  type LoanId,
  type LoanRecordId,
  type AccountId,
  type HexColor,
  type IconAsset,
} from "./branded";

export type LoanType = "borrow" | "lend";

export interface Loan {
  id: LoanId;
  name: string;
  amount: number; // Principal amount
  type: LoanType;
  color: HexColor;
  icon: IconAsset | null;
  orderNum: number;
  accountId: AccountId | null;
  note: string | null;
  dateTime: string | null; // ISO 8601 LocalDateTime
}

export type LoanRecordType = "increase" | "decrease" | "interest";

export interface LoanRecord {
  id: LoanRecordId;
  loanId: LoanId;
  amount: number;
  note: string | null;
  dateTime: string; // ISO 8601 Instant
  interest: boolean;
  accountId: AccountId | null;
  convertedAmount: number | null;
  loanRecordType: LoanRecordType;
}
