# Ivy Wallet Data Models & Database Schema

> Extracted from the original codebase for the React Native rebuild.

## 1. Core Domain Models

### Transaction

The central model. A sealed interface with three concrete types:

```typescript
type TransactionId = string; // UUID

interface BaseTransaction {
  id: TransactionId;
  title: string | null;         // NotBlankTrimmedString
  description: string | null;   // NotBlankTrimmedString
  categoryId: string | null;    // CategoryId UUID
  time: string;                 // ISO 8601 Instant (UTC)
  settled: boolean;
  tags: string[];               // TagId UUIDs
}

interface Income extends BaseTransaction {
  type: 'income';
  value: PositiveValue;
  accountId: string;            // AccountId UUID
}

interface Expense extends BaseTransaction {
  type: 'expense';
  value: PositiveValue;
  accountId: string;            // AccountId UUID
}

interface Transfer extends BaseTransaction {
  type: 'transfer';
  fromAccountId: string;        // AccountId UUID
  fromValue: PositiveValue;
  toAccountId: string;          // AccountId UUID
  toValue: PositiveValue;
}

type Transaction = Income | Expense | Transfer;
```

### TransactionMetadata (embedded in Transaction)

```typescript
interface TransactionMetadata {
  recurringRuleId: string | null;   // UUID
  paidForDateTime: string | null;   // ISO 8601
  loanId: string | null;            // UUID
  loanRecordId: string | null;      // UUID
}
```

### Account

```typescript
interface Account {
  id: string;                   // UUID
  name: string;                 // NotBlankTrimmedString
  asset: string;                // AssetCode (e.g., "USD", "EUR", "BTC")
  color: string;                // Hex color int (e.g., "#FF5722")
  icon: string | null;          // IconAsset identifier
  includeInBalance: boolean;    // Exclude from total if false
  orderNum: number;             // Drag-to-reorder position
}
```

### Category

```typescript
interface Category {
  id: string;                   // UUID
  name: string;                 // NotBlankTrimmedString
  color: string;                // Hex color
  icon: string | null;          // IconAsset identifier
  orderNum: number;             // Drag-to-reorder position
}
```

### Tag

```typescript
interface Tag {
  id: string;                   // UUID
  name: string;                 // NotBlankTrimmedString
  description: string | null;
  color: string;                // Hex color
  icon: string | null;          // IconAsset identifier
  orderNum: number;
  creationTimestamp: string;    // ISO 8601 Instant
}

interface TagAssociation {
  tagId: string;                // UUID
  associatedId: string;         // AssociationId (transaction ID or other)
}
```

### Budget

```typescript
interface Budget {
  id: string;                   // UUID
  name: string;
  amount: number;               // Budget limit
  categoryIds: string[];        // Serialized UUIDs (comma-separated in DB)
  accountIds: string[];         // Serialized UUIDs (comma-separated in DB)
  orderNum: number;
}
```

### Loan

```typescript
type LoanType = 'borrow' | 'lend';

interface Loan {
  id: string;                   // UUID
  name: string;
  amount: number;               // Principal amount
  type: LoanType;
  color: string;                // Hex color
  icon: string | null;
  orderNum: number;
  accountId: string | null;     // Associated account UUID
  note: string | null;
  dateTime: string | null;      // ISO 8601 LocalDateTime
}
```

### LoanRecord

```typescript
type LoanRecordType = 'increase' | 'decrease' | 'interest';

interface LoanRecord {
  id: string;                   // UUID
  loanId: string;               // UUID
  amount: number;
  note: string | null;
  dateTime: string;             // ISO 8601 Instant
  interest: boolean;            // Is this an interest payment?
  accountId: string | null;     // UUID
  convertedAmount: number | null;
  loanRecordType: LoanRecordType;
}
```

### Planned Payment Rule

```typescript
type IntervalType = 'day' | 'week' | 'month' | 'year';
type TransactionType = 'income' | 'expense';

interface PlannedPaymentRule {
  id: string;                   // UUID
  startDate: string | null;     // ISO 8601 Instant
  intervalN: number | null;     // e.g., 1 = every 1 <intervalType>
  intervalType: IntervalType | null;
  oneTime: boolean;             // true if single occurrence
  type: TransactionType;
  accountId: string;            // UUID
  amount: number;
  categoryId: string | null;    // UUID
  title: string | null;
  description: string | null;
}
```

### ExchangeRate

```typescript
interface ExchangeRate {
  baseCurrency: string;         // AssetCode
  currency: string;             // AssetCode
  rate: number;                 // PositiveDouble
  manualOverride: boolean;
}
```

### Value Types

```typescript
interface PositiveValue {
  amount: number;               // PositiveDouble (> 0)
  asset: string;                // AssetCode
}

interface Value {
  amount: number;               // NonZeroDouble (!= 0)
  asset: string;                // AssetCode
}
```

## 2. Primitive / Exact Types

| Kotlin Type | TypeScript Equivalent | Validation |
|-------------|-----------------------|------------|
| `PositiveInt` | `number` (branded) | `> 0` |
| `PositiveDouble` | `number` (branded) | `> 0` |
| `NonZeroDouble` | `number` (branded) | `!= 0` |
| `NonNegativeDouble` | `number` (branded) | `>= 0` |
| `NonNegativeInt` | `number` (branded) | `>= 0` |
| `NonNegativeLong` | `number` (branded) | `>= 0` |
| `NotBlankTrimmedString` | `string` (branded) | Non-empty, trimmed |
| `AssetCode` | `string` (branded) | Currency code like "USD" |
| `ColorInt` | `string` (hex) | Hex color `#RRGGBB` |
| `IconAsset` | `string` | Icon identifier |

> Use branded types or `zod` schemas in TypeScript to enforce these invariants at runtime.

## 3. Database Schema (Room DB → SQLite)

12 tables in a single SQLite database (`ivywallet.db`):

### accounts
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| name | TEXT NOT NULL | |
| currency | TEXT | AssetCode |
| color | INTEGER NOT NULL | |
| icon | TEXT | |
| orderNum | REAL | Default 0.0 |
| includeInBalance | INTEGER | Boolean, default 1 |
| isSynced | INTEGER | Deprecated |
| isDeleted | INTEGER | Deprecated |

### transactions
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| accountId | TEXT NOT NULL | FK accounts.id |
| type | TEXT NOT NULL | 'income' / 'expense' / 'transfer' |
| amount | REAL NOT NULL | |
| toAccountId | TEXT | FK accounts.id (transfers) |
| toAmount | REAL | (transfers) |
| title | TEXT | |
| description | TEXT | |
| dateTime | TEXT | ISO Instant |
| categoryId | TEXT | FK categories.id |
| dueDate | TEXT | ISO Instant |
| recurringRuleId | TEXT | FK planned_payment_rules.id |
| paidForDateTime | TEXT | ISO Instant |
| attachmentUrl | TEXT | |
| loanId | TEXT | FK loans.id |
| loanRecordId | TEXT | FK loan_records.id |

### categories
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| name | TEXT NOT NULL | |
| color | INTEGER NOT NULL | |
| icon | TEXT | |
| orderNum | REAL | Default 0.0 |

### budgets
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| name | TEXT NOT NULL | |
| amount | REAL NOT NULL | |
| categoryIdsSerialized | TEXT | Comma-separated UUIDs |
| accountIdsSerialized | TEXT | Comma-separated UUIDs |
| orderId | REAL NOT NULL | |

### planned_payment_rules
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| startDate | TEXT | ISO Instant |
| intervalN | INTEGER | |
| intervalType | TEXT | 'day'/'week'/'month'/'year' |
| oneTime | INTEGER | Boolean |
| type | TEXT NOT NULL | 'income'/'expense' |
| accountId | TEXT NOT NULL | |
| amount | REAL | |
| categoryId | TEXT | |
| title | TEXT | |
| description | TEXT | |

### loans
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| name | TEXT NOT NULL | |
| amount | REAL NOT NULL | |
| type | TEXT NOT NULL | 'borrow'/'lend' |
| color | INTEGER | |
| icon | TEXT | |
| orderNum | REAL | |
| accountId | TEXT | |
| note | TEXT | |
| dateTime | TEXT | ISO LocalDateTime |

### loan_records
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| loanId | TEXT NOT NULL | FK loans.id |
| amount | REAL NOT NULL | |
| note | TEXT | |
| dateTime | TEXT NOT NULL | ISO Instant |
| interest | INTEGER | Boolean |
| accountId | TEXT | |
| convertedAmount | REAL | |
| loanRecordType | TEXT | 'increase'/'decrease'/'interest' |

### exchange_rates
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| baseCurrency | TEXT NOT NULL | |
| currency | TEXT NOT NULL | |
| rate | REAL NOT NULL | |

### settings
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| key | TEXT | |
| value | TEXT | |

### tags
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| name | TEXT NOT NULL | |
| description | TEXT | |
| color | INTEGER NOT NULL | |
| icon | TEXT | |
| orderNum | REAL | |
| creationTimestamp | TEXT | |

### tag_associations
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| tagId | TEXT NOT NULL | FK tags.id |
| associatedId | TEXT NOT NULL | Polymorphic FK |

### users
| Column | Type | Notes |
|--------|------|-------|
| id | TEXT PK | UUID |
| name | TEXT | |

## 4. Entity Relationships

```
Account 1──────N Transaction (via accountId)
Account 1──────N Transfer (via fromAccountId / toAccountId)
Category 1─────N Transaction (via categoryId)
Category 1─────N Budget (via categoryIds)
Transaction 1──N TagAssociation (polymorphic)
Tag 1──────────N TagAssociation
Loan 1─────────N LoanRecord
Loan 1─────────N Transaction (via loanId)
PlannedPaymentRule ──> Transaction (via recurringRuleId)
```

## 5. React Native Storage Recommendations

| Ivy Storage | React Native Option |
|-------------|---------------------|
| Room DB (SQLite) | **WatermelonDB** (recommended — lazy, fast, reactive) or `expo-sqlite` |
| DataStore (K/V) | `@react-native-async-storage/async-storage` or `expo-secure-store` for sensitive |
| Ktor HTTP | `fetch` / `axios` / `ky` |
| Kotlinx Serialization | Native `JSON.parse/stringify` or `zod` + runtime validation |
