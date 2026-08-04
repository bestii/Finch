# React Native Migration Guide

> A practical guide for rebuilding Ivy Wallet from Kotlin/Jetpack Compose to React Native.

## 1. Technology Mapping

| Ivy (Current) | React Native (New) | Notes |
|---------------|-------------------|-------|
| **Language** | Kotlin | TypeScript (strict) | Use branded types + `zod` for validation |
| **UI Framework** | Jetpack Compose | React + React Native | Components mirror Composables |
| **Navigation** | Custom Stack | React Navigation v7 | Native stack navigator |
| **State (ViewModel)** | Compose runtime state | Zustand | Simplest API, great perf |
| **DI** | Hilt (Dagger) | None needed / Context | Service locators are simpler |
| **Local DB** | Room (SQLite) | WatermelonDB | Lazy, fast, reactive — closest to Room |
| **K/V Storage** | DataStore | AsyncStorage | For settings/prefs |
| **HTTP Client** | Ktor | axios / ky | Simple HTTP client |
| **Serialization** | Kotlinx Serialization | JSON + zod | Runtime validation is essential |
| **Error Handling** | ArrowKt Either | neverthrow / ts-results | Explicit error handling |
| **Functional FP** | ArrowKt | fp-ts / effect-ts | Optional, keep it simple |
| **Testing** | JUnit + Kotest | Jest + RNTL | React Native Testing Library |
| **CI/CD** | GitHub Actions + Fastlane | GitHub Actions + EAS | Expo Application Services |
| **Linting** | Detekt + Ktlint | ESLint + Prettier | Standard setup |
| **Analytics/Crash** | Firebase Crashlytics | Sentry / Firebase | Crash reporting |
| **Charts** | Custom Compose Canvas | react-native-svg + victory-native | Or expo-gl for custom |

## 2. Architecture Adaptation: MVI → React

### Original Pattern (Kotlin/Compose)

```
User Action → UI Event → ViewModel → ViewState → UI Redraw
```

### React Native Equivalent

```
User Action → action dispatch → Zustand Store → derived state → UI re-render
```

### State Management with Zustand

The cleanest mapping. Each screen's ViewState becomes a Zustand store slice:

```typescript
// stores/homeStore.ts — equivalent to HomeViewModel + HomeState
import { create } from 'zustand';

interface HomeState {
  // ViewState fields (from HomeState.kt)
  theme: 'light' | 'dark' | 'auto';
  name: string;
  period: TimePeriod;
  balance: number;
  buffer: number;
  bufferDiff: number;
  stats: IncomeExpensePair;
  history: TransactionHistoryItem[];
  upcoming: DueSection;
  overdue: DueSection;
  customerJourneyCards: CustomerJourneyCard[];
  hideBalance: boolean;
  hideIncome: boolean;
  expanded: boolean;
  
  // Event handlers (from HomeEvent.kt)
  setPeriod: (period: TimePeriod) => void;
  setBuffer: (buffer: number) => void;
  setCurrency: (currency: string) => void;
  switchTheme: () => void;
  toggleBalance: () => void;
  toggleIncome: () => void;
  loadTransactions: () => Promise<void>;
  payPlanned: (transactionId: string) => Promise<void>;
  skipPlanned: (transactionId: string) => void;
  selectNextMonth: () => void;
  selectPreviousMonth: () => void;
}

export const useHomeStore = create<HomeState>((set, get) => ({
  // initial state
  theme: 'auto',
  name: '',
  period: getCurrentPeriod(),
  balance: 0,
  // ... etc
  
  // event handlers call services, then set state
  async setPeriod(period) {
    set({ period });
    await get().loadTransactions();
  },
  
  async loadTransactions() {
    const { period } = get();
    const data = await transactionService.getForPeriod(period);
    set({ history: data.history, stats: data.stats, balance: data.balance });
  },
  
  async payPlanned(id) {
    await plannedPaymentService.pay(id);
    await get().loadTransactions();
  },
  // ...
}));
```

### ViewState as Discriminated Unions

Kotlin sealed interfaces map directly to TypeScript discriminated unions:

```typescript
// Kotlin:
// sealed interface ScreenUiState {
//   data object Loading : ScreenUiState 
//   data class Content(val text: String) : ScreenUiState
//   data class Error(val msg: String) : ScreenUiState
// }

// TypeScript:
type ScreenUiState = 
  | { status: 'loading' }
  | { status: 'content'; text: string }
  | { status: 'error'; message: string };
```

## 3. Screen Component Pattern

Each screen follows this structure:

```typescript
// screens/HomeScreen/HomeScreen.tsx
import { useHomeStore } from '../../stores/homeStore';

export function HomeScreen() {
  const store = useHomeStore();
  
  // Derive state from store
  // (Zustand handles re-rendering when relevant fields change)
  
  return (
    <View style={styles.container}>
      <HomeHeader
        expanded={store.expanded}
        name={store.name}
        period={store.period}
        balance={store.balance}
        hideBalance={store.hideBalance}
        onPeriodPress={() => /* open period picker modal */}
        onBalancePress={store.toggleBalance}
        onNextMonth={store.selectNextMonth}
        onPrevMonth={store.selectPreviousMonth}
      />
      <CashFlowInfo
        balance={store.balance}
        income={store.stats.income}
        expenses={store.stats.expense}
        hideBalance={store.hideBalance}
        hideIncome={store.hideIncome}
        onOpenMoreMenu={() => /* toggle more menu */}
        onToggleBalance={store.toggleBalance}
        onToggleIncome={store.toggleIncome}
      />
      <TransactionList
        upcoming={store.upcoming}
        overdue={store.overdue}
        history={store.history}
        onPayPlanned={store.payPlanned}
        onSkipPlanned={store.skipPlanned}
      />
      {/* Modals rendered conditionally */}
      {moreMenuVisible && (
        <MoreMenu
          theme={store.theme}
          balance={store.balance}
          currency={store.currency}
          buffer={store.buffer}
          onSwitchTheme={store.switchTheme}
          onSetBuffer={store.setBuffer}
          onSetCurrency={store.setCurrency}
          onClose={() => setMoreMenuVisible(false)}
        />
      )}
    </View>
  );
}
```

## 4. Service Layer (UseCases)

Ivy's UseCases become plain async service functions:

```typescript
// services/transactionService.ts
import { database } from '../database';
import { Transaction, CreateTransactionInput } from '../models/Transaction';
import { validateTransaction } from '../models/validation';
import { Result, ok, err } from 'neverthrow';

export const transactionService = {
  async create(input: CreateTransactionInput): Promise<Result<Transaction, ValidationError>> {
    const validated = validateTransaction(input);
    if (validated.isErr()) return err(validated.error);
    
    const transaction = await database.write(async (writer) => {
      return await writer.get('transactions').create((record) => {
        record.id = generateUUID();
        record.type = input.type;
        record.amount = input.amount;
        record.accountId = input.accountId;
        record.categoryId = input.categoryId;
        record.title = input.title?.trim() || null;
        record.dateTime = input.dateTime.toISOString();
        // ...
      });
    });
    
    return ok(mapToDomain(transaction));
  },
  
  async getForPeriod(accountId: string | null, period: TimePeriod): Promise<Transaction[]> {
    const records = await database.get('transactions').query(
      Q.where('account_id', accountId),
      Q.where('date_time', Q.gte(period.start.toISOString())),
      Q.where('date_time', Q.lte(period.end.toISOString())),
      Q.sortBy('date_time', Q.desc),
    ).fetch();
    
    return records.map(mapToDomain);
  },
  
  // ...
};
```

## 5. Database: WatermelonDB Setup

WatermelonDB is the closest React Native equivalent to Room:

```typescript
// database/schema.ts
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
  version: 1,
  tables: [
    tableSchema({
      name: 'accounts',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'currency', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'order_num', type: 'number' },
        { name: 'include_in_balance', type: 'boolean' },
      ]
    }),
    tableSchema({
      name: 'transactions',
      columns: [
        { name: 'type', type: 'string' },         // 'income' | 'expense' | 'transfer'
        { name: 'account_id', type: 'string' },
        { name: 'amount', type: 'number' },
        { name: 'to_account_id', type: 'string', isOptional: true },
        { name: 'to_amount', type: 'number', isOptional: true },
        { name: 'category_id', type: 'string', isOptional: true },
        { name: 'title', type: 'string', isOptional: true },
        { name: 'description', type: 'string', isOptional: true },
        { name: 'date_time', type: 'number' },     // Unix timestamp ms
        { name: 'settled', type: 'boolean' },
        { name: 'recurring_rule_id', type: 'string', isOptional: true },
        { name: 'loan_id', type: 'string', isOptional: true },
        { name: 'loan_record_id', type: 'string', isOptional: true },
        { name: 'paid_for_date_time', type: 'number', isOptional: true },
      ]
    }),
    tableSchema({
      name: 'categories',
      columns: [
        { name: 'name', type: 'string' },
        { name: 'color', type: 'string' },
        { name: 'icon', type: 'string', isOptional: true },
        { name: 'order_num', type: 'number' },
      ]
    }),
    // ... budgets, loans, loan_records, planned_payment_rules, exchange_rates,
    //     tags, tag_associations, settings
  ]
});
```

> **Alternative**: If using Expo, `expo-sqlite` with Drizzle ORM is simpler but lacks reactivity. WatermelonDB is preferred for feature parity with Room's reactive queries.

## 6. Validation with Branded Types + Zod

```typescript
// utils/validation.ts
import { z } from 'zod';
import { Brand } from 'ts-brand';

// Branded types eliminate impossible states at the type level
export type PositiveDouble = Brand<number, 'PositiveDouble'>;
export type NonZeroDouble = Brand<number, 'NonZeroDouble'>;
export type NotBlankTrimmedString = Brand<string, 'NotBlankTrimmedString'>;
export type AccountId = Brand<string, 'AccountId'>;
export type CategoryId = Brand<string, 'CategoryId'>;

// Zod schemas for runtime validation
export const PositiveDoubleSchema = z.number().positive().brand('PositiveDouble');
export const NotBlankTrimmedSchema = z.string().trim().min(1).brand('NotBlankTrimmedString');
export const AccountIdSchema = z.string().uuid().brand('AccountId');

export const CreateTransactionSchema = z.object({
  type: z.enum(['income', 'expense', 'transfer']),
  accountId: AccountIdSchema,
  amount: PositiveDoubleSchema,
  categoryId: CategoryIdSchema.optional(),
  title: NotBlankTrimmedSchema.optional(),
  description: z.string().optional(),
  dateTime: z.coerce.date(),
});
```

## 7. Key UI Components to Build (Material3)

Ivy Wallet uses Material3. Use `react-native-paper` or build custom:

| Ivy Compose Component | React Native Equivalent | Priority |
|------------------------|------------------------|----------|
| Theme (light/dark/auto) | `useColorScheme` + theme context | P0 |
| BottomNavigation bar (3 tabs) | React Navigation Bottom Tabs | P0 |
| FAB (Floating Action Button) | `react-native-paper` FAB | P0 |
| Custom numeric keypad | Custom View with TouchableOpacity grid | P0 |
| Transaction card | Custom card component | P0 |
| Category/Account picker modal | BottomSheet + FlatList | P0 |
| Period selector (month/year) | Custom picker | P0 |
| Pie chart | `react-native-svg` + custom / `victory-native` | P1 |
| LazyColumn (infinite scroll) | `FlatList` with `onEndReached` | P0 |
| Swipe gestures | `react-native-gesture-handler` | P1 |
| Buffer/Balance modal | BottomSheet with slider | P1 |
| Currency picker | Searchable modal list | P1 |
| More menu (dropdown) | Custom dropdown overlay | P1 |
| Customer journey cards | Card carousel | P2 |
| Progress slider (onboarding) | Custom step indicator | P1 |
| Search bar with autocomplete | TextInput + filtered FlatList | P1 |
| CSV file picker | `expo-document-picker` | P2 |
| Color picker | Grid of predefined colors | P1 |
| Icon picker | Grid of icon options | P1 |
| Drag-to-reorder | `react-native-draggable-flatlist` | P1 |

## 8. Recommended Libraries

```json
{
  "dependencies": {
    // Core
    "react": "^19.x",
    "react-native": "^0.76.x",
    "typescript": "^5.x",
    
    // Navigation
    "@react-navigation/native": "^7.x",
    "@react-navigation/native-stack": "^7.x",
    "@react-navigation/bottom-tabs": "^7.x",
    
    // State Management
    "zustand": "^5.x",
    
    // Database
    "@nozbe/watermelondb": "^0.27.x",
    
    // UI
    "react-native-paper": "^5.x",
    "react-native-vector-icons": "^10.x",
    "react-native-svg": "^15.x",
    
    // Gestures & Animation
    "react-native-gesture-handler": "^2.x",
    "react-native-reanimated": "^3.x",
    
    // Charts
    "victory-native": "^41.x",
    
    // Utilities
    "zod": "^3.x",
    "neverthrow": "^7.x",
    "date-fns": "^4.x",
    "uuid": "^10.x",
    
    // Storage
    "@react-native-async-storage/async-storage": "^2.x",
    
    // File System
    "react-native-fs": "^3.x"
  },
  "devDependencies": {
    "jest": "^29.x",
    "@testing-library/react-native": "^12.x",
    "eslint": "^9.x",
    "prettier": "^3.x"
  }
}
```

## 9. Rebuild Phases (Recommended Order)

### Phase 1: Foundation (Weeks 1-2)
1. Initialize React Native project (Expo or bare RN)
2. Set up TypeScript, ESLint, Prettier
3. Create theme system (colors, typography, dark mode)
4. Set up React Navigation (empty screens)
5. Define all TypeScript types/models (from doc 02)
6. Set up WatermelonDB with full schema
7. Create utility functions (UUID, formatting, validation)

### Phase 2: Core Data Flow (Weeks 3-4)
8. Implement service layer (CRUD for accounts, categories, transactions)
9. Set up Zustand stores for each domain
10. Build navigation that works (empty screens navigable)
11. Wire up database to stores

### Phase 3: Core Screens (Weeks 5-8)
12. **OnboardingScreen** — First thing a user sees
13. **MainScreen** — Bottom tabs, FAB
14. **HomeScreen** — Dashboard with transaction feed
15. **EditTransactionScreen** — Most complex form (income/expense/transfer)
16. **AccountsScreen** — Account list
17. **CategoriesScreen** — Category management
18. **TransactionsScreen** — Filtered transaction list

### Phase 4: Planning & Analysis (Weeks 9-11)
19. **PlannedPaymentsScreen** + **EditPlannedScreen**
20. **PieChartScreen** — Spending breakdown
21. **ReportScreen** — Financial reports
22. **BudgetScreen** — Budget management

### Phase 5: Financial Tools (Weeks 12-13)
23. **BalanceScreen** — Net worth overview
24. **LoansScreen** + **LoanDetailsScreen** — Loan tracking
25. **ExchangeRatesScreen** — Currency exchange rates

### Phase 6: Polish & Data (Weeks 14-15)
26. **SearchScreen** — Full-text search
27. **ImportScreen** — CSV import/export
28. **SettingsScreen** — All settings
29. **FeaturesScreen** — Feature toggles
30. Meta screens (Attributions, Contributors, Releases, Disclaimer)

### Phase 7: Testing & Release (Weeks 16-17)
31. Unit tests for services and stores
32. Integration tests for critical flows
33. UI tests with RNTL
34. Performance optimization (memo, FlatList tuning)
35. iOS adaptation (the original is Android-only; React Native gives iOS for free)

## 10. Design System Notes

The Ivy design system was created in Figma:
- **Figma link**: https://www.figma.com/file/kSwIa07jcHEHZXo6rzx7dn/Design-System
- Use this as the source of truth for colors, spacing, typography, and component specs
- Extract design tokens (colors, spacing, font sizes, border radii) into a shared theme file
- The original app supports **Material3 theming** with dynamic color on Android 12+

## 11. Data Migration Path

If you want to allow existing Ivy Wallet users to transfer data:

1. **Export from Ivy**: The app already supports **CSV export** and **ZIP backup** (full DB dump)
2. **Import to new app**: Build a CSV importer that maps old columns to the new schema
3. **Direct DB migration** (advanced): WatermelonDB can't directly import Room DB files. CSV is the practical bridge.

## 12. Things to Simplify

The original codebase had some complexity you can avoid in the rebuild:

- **No cloud sync**: The old app had a Salt Edge integration and sync that was never fully released. Skip all sync-related code.
- **No legacy code**: The old app had `temp/legacy-code` and `temp/old-design` modules. You're starting fresh.
- **No Salt Edge integration**: Banking API integration was added but never launched.
- **No Android widgets**: These were Android-specific widget modules. React Native can't do home screen widgets (or needs native modules).
- **Simpler DI**: Hilt is overkill for React Native. Zustand stores + simple service imports suffice.
- **Tags**: The old codebase flagged tags as a complexity concern ("get rid of Tags from the core model because of perf and complexity"). Consider omitting tags initially.

## 13. Key Differences to Watch For

| Area | Android/Kotlin | React Native | Impact |
|------|---------------|--------------|--------|
| Threading | Coroutines (suspend) | JS is single-threaded | Use async/await, no Dispatchers.IO needed |
| DB queries | Room DAOs return Flow | WatermelonDB observe() | Similar reactive pattern |
| List performance | LazyColumn (virtualized) | FlatList (virtualized) | Similar, tune windowSize |
| Date handling | java.time.Instant | Date / date-fns | Always store as ISO 8601 or Unix ms |
| UUID | java.util.UUID | uuid package | Same format |
| State observation | collectAsState() | Zustand subscriptions | useEffect or useStore selector |
| Navigation args | Data classes | Route params (serializable) | Keep params flat |
| Deep linking | Android intent filters | React Navigation linking config | Similar config |
| Back button | Android back press | React Navigation's hardware back | Same behavior |
