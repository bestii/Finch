import { z } from "zod";

// ── Numeric brands ────────────────────────────────────────────────

export type PositiveDouble = number & { readonly __brand: "PositiveDouble" };
export type NonZeroDouble = number & { readonly __brand: "NonZeroDouble" };
export type NonNegativeDouble = number & { readonly __brand: "NonNegativeDouble" };
export type PositiveInt = number & { readonly __brand: "PositiveInt" };
export type NonNegativeInt = number & { readonly __brand: "NonNegativeInt" };

export const PositiveDoubleSchema = z.number().positive().brand("PositiveDouble");
export const NonZeroDoubleSchema = z
  .number()
  .refine((n) => n !== 0, "Must be non-zero")
  .brand("NonZeroDouble");
export const NonNegativeDoubleSchema = z
  .number()
  .nonnegative()
  .brand("NonNegativeDouble");
export const PositiveIntSchema = z.number().int().positive().brand("PositiveInt");
export const NonNegativeIntSchema = z
  .number()
  .int()
  .nonnegative()
  .brand("NonNegativeInt");

// ── String brands ──────────────────────────────────────────────────

export type NotBlankTrimmedString = string & {
  readonly __brand: "NotBlankTrimmedString";
};
export type AssetCode = string & { readonly __brand: "AssetCode" };
export type HexColor = string & { readonly __brand: "HexColor" };
export type IconAsset = string & { readonly __brand: "IconAsset" };

export const NotBlankTrimmedStringSchema = z
  .string()
  .trim()
  .min(1, "Cannot be blank")
  .brand("NotBlankTrimmedString");

export const AssetCodeSchema = z
  .string()
  .trim()
  .min(1)
  .toUpperCase()
  .brand("AssetCode");

export const HexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a hex color like #FF5722")
  .brand("HexColor");

export const IconAssetSchema = z.string().brand("IconAsset");

// ── ID brands ──────────────────────────────────────────────────────

export type TransactionId = string & { readonly __brand: "TransactionId" };
export type AccountId = string & { readonly __brand: "AccountId" };
export type CategoryId = string & { readonly __brand: "CategoryId" };
export type TagId = string & { readonly __brand: "TagId" };
export type BudgetId = string & { readonly __brand: "BudgetId" };
export type LoanId = string & { readonly __brand: "LoanId" };
export type LoanRecordId = string & { readonly __brand: "LoanRecordId" };
export type PlannedPaymentRuleId = string & {
  readonly __brand: "PlannedPaymentRuleId";
};
export type ExchangeRateId = string & { readonly __brand: "ExchangeRateId" };

export const TransactionIdSchema = z.string().uuid().brand("TransactionId");
export const AccountIdSchema = z.string().uuid().brand("AccountId");
export const CategoryIdSchema = z.string().uuid().brand("CategoryId");
export const TagIdSchema = z.string().uuid().brand("TagId");
export const BudgetIdSchema = z.string().uuid().brand("BudgetId");
export const LoanIdSchema = z.string().uuid().brand("LoanId");
export const LoanRecordIdSchema = z.string().uuid().brand("LoanRecordId");
export const PlannedPaymentRuleIdSchema = z
  .string()
  .uuid()
  .brand("PlannedPaymentRuleId");
export const ExchangeRateIdSchema = z.string().uuid().brand("ExchangeRateId");
