import { z } from "zod";
import {
  TransactionIdSchema,
  AccountIdSchema,
  CategoryIdSchema,
  TagIdSchema,
  BudgetIdSchema,
  LoanIdSchema,
  LoanRecordIdSchema,
  PlannedPaymentRuleIdSchema,
  ExchangeRateIdSchema,
  PositiveDoubleSchema,
  NotBlankTrimmedStringSchema,
  AssetCodeSchema,
  HexColorSchema,
  IconAssetSchema,
} from "./branded";

// ── Value types ────────────────────────────────────────────────────

export const PositiveValueSchema = z.object({
  amount: PositiveDoubleSchema,
  asset: AssetCodeSchema,
});

export const ValueSchema = z.object({
  amount: z.number().refine((n) => n !== 0, "Must be non-zero"),
  asset: AssetCodeSchema,
});

// ── Transaction Metadata ───────────────────────────────────────────

const TransactionMetadataSchema = z.object({
  recurringRuleId: z.string().uuid().nullable(),
  paidForDateTime: z.string().nullable(),
  loanId: z.string().uuid().nullable(),
  loanRecordId: z.string().uuid().nullable(),
});

// ── Transaction base fields ────────────────────────────────────────

const BaseTransactionSchema = z.object({
  id: TransactionIdSchema,
  title: z.string().trim().nullable(),
  description: z.string().trim().nullable(),
  categoryId: CategoryIdSchema.nullable(),
  time: z.string(), // ISO 8601
  settled: z.boolean(),
  tags: z.array(TagIdSchema),
});

export const IncomeSchema = BaseTransactionSchema.extend({
  type: z.literal("income"),
  value: PositiveValueSchema,
  accountId: AccountIdSchema,
  metadata: TransactionMetadataSchema,
});

export const ExpenseSchema = BaseTransactionSchema.extend({
  type: z.literal("expense"),
  value: PositiveValueSchema,
  accountId: AccountIdSchema,
  metadata: TransactionMetadataSchema,
});

export const TransferSchema = BaseTransactionSchema.extend({
  type: z.literal("transfer"),
  fromAccountId: AccountIdSchema,
  fromValue: PositiveValueSchema,
  toAccountId: AccountIdSchema,
  toValue: PositiveValueSchema,
  metadata: TransactionMetadataSchema,
});

export const TransactionSchema = z.discriminatedUnion("type", [
  IncomeSchema,
  ExpenseSchema,
  TransferSchema,
]);

// ── Create input schemas ───────────────────────────────────────────

export const CreateTransactionMetadataSchema = z.object({
  recurringRuleId: z.string().uuid().nullable().default(null),
  paidForDateTime: z.string().nullable().default(null),
  loanId: z.string().uuid().nullable().default(null),
  loanRecordId: z.string().uuid().nullable().default(null),
});

const BaseCreateTransactionSchema = z.object({
  title: NotBlankTrimmedStringSchema.nullable().default(null),
  description: z.string().trim().nullable().default(null),
  categoryId: CategoryIdSchema.nullable().default(null),
  time: z.string().default(() => new Date().toISOString()),
  settled: z.boolean().default(false),
  tags: z.array(TagIdSchema).default([]),
  metadata: CreateTransactionMetadataSchema.default({}),
});

export const CreateIncomeSchema = BaseCreateTransactionSchema.extend({
  type: z.literal("income"),
  value: PositiveValueSchema,
  accountId: AccountIdSchema,
});

export const CreateExpenseSchema = BaseCreateTransactionSchema.extend({
  type: z.literal("expense"),
  value: PositiveValueSchema,
  accountId: AccountIdSchema,
});

export const CreateTransferSchema = BaseCreateTransactionSchema.extend({
  type: z.literal("transfer"),
  fromAccountId: AccountIdSchema,
  fromValue: PositiveValueSchema,
  toAccountId: AccountIdSchema,
  toValue: PositiveValueSchema,
});

export const CreateTransactionSchema = z.discriminatedUnion("type", [
  CreateIncomeSchema,
  CreateExpenseSchema,
  CreateTransferSchema,
]);

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;

// ── Account ────────────────────────────────────────────────────────

export const AccountSchema = z.object({
  id: AccountIdSchema,
  name: NotBlankTrimmedStringSchema,
  asset: AssetCodeSchema,
  color: HexColorSchema,
  icon: IconAssetSchema.nullable(),
  includeInBalance: z.boolean(),
  orderNum: z.number(),
});

export const CreateAccountSchema = z.object({
  name: NotBlankTrimmedStringSchema,
  asset: AssetCodeSchema.default("USD"),
  color: HexColorSchema.default("#3F51B5"),
  icon: IconAssetSchema.nullable().default(null),
  includeInBalance: z.boolean().default(true),
  orderNum: z.number().default(0),
});

// ── Category ───────────────────────────────────────────────────────

export const CategorySchema = z.object({
  id: CategoryIdSchema,
  name: NotBlankTrimmedStringSchema,
  color: HexColorSchema,
  icon: IconAssetSchema.nullable(),
  orderNum: z.number(),
});

export const CreateCategorySchema = z.object({
  name: NotBlankTrimmedStringSchema,
  color: HexColorSchema.default("#3F51B5"),
  icon: IconAssetSchema.nullable().default(null),
  orderNum: z.number().default(0),
});

// ── Tag ────────────────────────────────────────────────────────────

export const TagSchema = z.object({
  id: TagIdSchema,
  name: NotBlankTrimmedStringSchema,
  description: z.string().trim().nullable(),
  color: HexColorSchema,
  icon: IconAssetSchema.nullable(),
  orderNum: z.number(),
  creationTimestamp: z.string(),
});

export const CreateTagSchema = z.object({
  name: NotBlankTrimmedStringSchema,
  description: z.string().trim().nullable().default(null),
  color: HexColorSchema.default("#3F51B5"),
  icon: IconAssetSchema.nullable().default(null),
  orderNum: z.number().default(0),
});

export const TagAssociationSchema = z.object({
  tagId: TagIdSchema,
  associatedId: z.string().uuid(),
});

// ── Budget ─────────────────────────────────────────────────────────

export const BudgetSchema = z.object({
  id: BudgetIdSchema,
  name: z.string(),
  amount: PositiveDoubleSchema,
  categoryIds: z.array(CategoryIdSchema),
  accountIds: z.array(AccountIdSchema),
  orderNum: z.number(),
});

export const CreateBudgetSchema = z.object({
  name: z.string().min(1),
  amount: PositiveDoubleSchema,
  categoryIds: z.array(CategoryIdSchema).default([]),
  accountIds: z.array(AccountIdSchema).default([]),
  orderNum: z.number().default(0),
});

// ── Loan ───────────────────────────────────────────────────────────

const loanTypeSchema = z.enum(["borrow", "lend"]);

export const LoanSchema = z.object({
  id: LoanIdSchema,
  name: z.string(),
  amount: PositiveDoubleSchema,
  type: loanTypeSchema,
  color: HexColorSchema,
  icon: IconAssetSchema.nullable(),
  orderNum: z.number(),
  accountId: AccountIdSchema.nullable(),
  note: z.string().nullable(),
  dateTime: z.string().nullable(),
});

export const CreateLoanSchema = z.object({
  name: z.string().min(1),
  amount: PositiveDoubleSchema,
  type: loanTypeSchema,
  color: HexColorSchema.default("#3F51B5"),
  icon: IconAssetSchema.nullable().default(null),
  orderNum: z.number().default(0),
  accountId: AccountIdSchema.nullable().default(null),
  note: z.string().nullable().default(null),
  dateTime: z.string().nullable().default(null),
});

// ── Loan Record ────────────────────────────────────────────────────

const loanRecordTypeSchema = z.enum(["increase", "decrease", "interest"]);

export const LoanRecordSchema = z.object({
  id: LoanRecordIdSchema,
  loanId: LoanIdSchema,
  amount: PositiveDoubleSchema,
  note: z.string().nullable(),
  dateTime: z.string(),
  interest: z.boolean(),
  accountId: AccountIdSchema.nullable(),
  convertedAmount: z.number().nullable(),
  loanRecordType: loanRecordTypeSchema,
});

export const CreateLoanRecordSchema = z.object({
  loanId: LoanIdSchema,
  amount: PositiveDoubleSchema,
  note: z.string().nullable().default(null),
  dateTime: z.string().default(() => new Date().toISOString()),
  interest: z.boolean().default(false),
  accountId: AccountIdSchema.nullable().default(null),
  convertedAmount: z.number().nullable().default(null),
  loanRecordType: loanRecordTypeSchema,
});

// ── Planned Payment Rule ───────────────────────────────────────────

const intervalTypeSchema = z.enum(["day", "week", "month", "year"]);
const plannedTransactionTypeSchema = z.enum(["income", "expense"]);

export const PlannedPaymentRuleSchema = z.object({
  id: PlannedPaymentRuleIdSchema,
  startDate: z.string().nullable(),
  intervalN: z.number().int().nullable(),
  intervalType: intervalTypeSchema.nullable(),
  oneTime: z.boolean(),
  type: plannedTransactionTypeSchema,
  accountId: AccountIdSchema,
  amount: PositiveDoubleSchema,
  categoryId: CategoryIdSchema.nullable(),
  title: z.string().trim().nullable(),
  description: z.string().nullable(),
});

export const CreatePlannedPaymentRuleSchema = z.object({
  startDate: z.string().nullable().default(null),
  intervalN: z.number().int().nullable().default(null),
  intervalType: intervalTypeSchema.nullable().default(null),
  oneTime: z.boolean().default(false),
  type: plannedTransactionTypeSchema,
  accountId: AccountIdSchema,
  amount: PositiveDoubleSchema,
  categoryId: CategoryIdSchema.nullable().default(null),
  title: z.string().trim().nullable().default(null),
  description: z.string().nullable().default(null),
});

// ── Exchange Rate ──────────────────────────────────────────────────

export const ExchangeRateSchema = z.object({
  id: ExchangeRateIdSchema,
  baseCurrency: AssetCodeSchema,
  currency: AssetCodeSchema,
  rate: PositiveDoubleSchema,
  manualOverride: z.boolean(),
});

export const CreateExchangeRateSchema = z.object({
  baseCurrency: AssetCodeSchema,
  currency: AssetCodeSchema,
  rate: PositiveDoubleSchema,
  manualOverride: z.boolean().default(false),
});
