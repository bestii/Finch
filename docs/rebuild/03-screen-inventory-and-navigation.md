# Ivy Wallet Screen Inventory & Navigation

> Extracted from the original codebase for the React Native rebuild.

## 1. Navigation Architecture

The app uses a custom **Stack-based navigation** with a simple `Navigation` singleton class:

- Screens are defined as **data classes/objects** implementing the `Screen` interface
- A central `IvyNavGraph` composable maps screens to their implementations
- Navigation is imperative: `navigation().navigateTo(screen)` / `navigation().back()`

### React Native Equivalent
Use **React Navigation** with a native stack navigator:
- `<NavigationContainer>` + `<Stack.Navigator>`
- Screen params replace constructor parameters

## 2. Screen List (23 screens)

### App Entry

#### MainScreen
- **Route**: `Main`
- **Purpose**: Root container with bottom tab bar
- **Structure**: 2-tab layout (Home + Accounts) + FAB for adding transactions
- **Bottom Bar Actions**: Add Income, Add Expense, Add Transfer, Add Planned Payment, Add Account
- **Notes**: Persistent bottom bar with `+` button that expands into options

### Onboarding Flow

#### OnboardingScreen
- **Route**: `Onboarding`
- **Purpose**: First-run setup wizard
- **Steps**:
  1. Splash/Login screen
  2. Set currency
  3. Choose tracking type (income/expense/both)
  4. Create initial accounts
  5. Create initial categories
- **Notes**: Conditionally shown on first app launch. Has skip/back navigation.

### Core Screens

#### HomeScreen (HomeTab)
- **Route**: `Home`
- **Purpose**: Main dashboard / transaction feed
- **Key UI Elements**:
  - **HomeHeader**: Greeting ("Good morning, [Name]"), period selector (month/year), balance display with hide/show toggle
  - **CashFlowInfo**: Balance, monthly income, monthly expense summary
  - **Upcoming section**: Planned payments due soon (expandable)
  - **Overdue section**: Missed planned payments (expandable)
  - **Transaction history**: Scrollable list grouped by date, with swipe-to-navigate
  - **Customer journey cards**: Contextual tips
  - **More Menu**: Theme switch, buffer setting, currency change, navigation shortcuts
- **ViewState fields**: `theme`, `name`, `period`, `baseData`, `history`, `stats`, `balance`, `buffer`, `upcoming`, `overdue`, `customerJourneyCards`, `hideBalance`, `hideIncome`, `expanded`

#### AccountsScreen
- **Route**: `Accounts`
- **Purpose**: List all financial accounts with balances
- **Key Features**: Account cards with icon/color, balance per account, reorderable, compact mode toggle, hide total balance option
- **Note**: Second tab in the main bottom bar

### Transaction Screens

#### EditTransactionScreen
- **Route**: `EditTransaction`
- **Params**: `initialTransactionId`, `type` (income/expense/transfer), optional `accountId`, `categoryId`
- **Purpose**: Create/edit a transaction
- **Key Fields**: Account selector, category selector, amount input (custom keypad), title, description, date/time picker, recurring rule toggle
- **Modes**: Create (null id) or Edit (existing id). Different layouts for Income vs Expense vs Transfer.

#### TransactionsScreen
- **Route**: `Transactions`
- **Params**: `accountId`, `categoryId`, `unspecifiedCategory`, `transactionType`, `accountIdFilterList`
- **Purpose**: Filtered list of transactions
- **Features**: Filter by account, category, type. Transaction cards with category color, amount, and date.
- **Note**: Navigated from account detail, category detail, search, or pie chart drill-down.

#### SearchScreen
- **Route**: `Search`
- **Purpose**: Full-text search across transactions
- **Features**: Search bar, real-time results, tap to edit transaction

### Planning & Recurring

#### PlannedPaymentsScreen
- **Route**: `PlannedPayments`
- **Purpose**: List all planned/recurring payment rules
- **Features**: Rule cards with interval info, upcoming calculation, tap to edit, swipe to delete

#### EditPlannedScreen
- **Route**: `EditPlanned`
- **Params**: `plannedPaymentRuleId`, `type`, `amount`, `accountId`, `categoryId`, `title`, `description`
- **Purpose**: Create/edit a planned payment rule
- **Fields**: Amount, account, category, title, description, interval type (day/week/month/year), interval count, one-time toggle

### Organization

#### CategoriesScreen
- **Route**: `Categories`
- **Purpose**: Manage expense/income categories
- **Features**: Category cards with icon/color, reorderable, compact mode toggle, search bar (toggleable)

### Analytics

#### PieChartStatisticScreen
- **Route**: `PieChart`
- **Params**: `type` (income/expense), `filterExcluded`, `accountList`, `transactions`
- **Purpose**: Visual spending/income breakdown
- **Features**: Pie chart by category, tap segment for detailed transaction list, transfer treatment toggle

#### ReportScreen
- **Route**: `Report`
- **Purpose**: Detailed financial report/analytics
- **Note**: Period-based reports with summaries

#### BudgetScreen
- **Route**: `Budget`
- **Purpose**: Manage budgets
- **Features**: Budget list, create/edit budget with category/account filtering, budget progress visualization

### Financial Tools

#### BalanceScreen
- **Route**: `Balance`
- **Purpose**: Net worth overview across accounts
- **Features**: Combined balance with exchange rate conversion, per-account breakdown

#### ExchangeRatesScreen
- **Route**: `ExchangeRates`
- **Purpose**: View/edit currency exchange rates
- **Features**: Rate list, manual override, fetch from API (internal exchange rate provider)

#### LoansScreen
- **Route**: `Loans`
- **Purpose**: Track borrowed/lent money
- **Features**: Loan list (borrow/lend), balance per loan, tap for details

#### LoanDetailsScreen
- **Route**: `LoanDetails`
- **Params**: `loanId`
- **Purpose**: Detail view for a single loan
- **Features**: Loan amount, records (payments/interest), add record, calculate remaining

### Import/Export

#### ImportScreen / CSVScreen
- **Route**: `Import` / `CSV`
- **Params**: `launchedFromOnboarding`
- **Purpose**: Import transactions from CSV, export to CSV/ZIP
- **Features**: File picker, CSV parsing, preview, confirm import

### Meta Screens

#### SettingsScreen
- **Route**: `Settings`
- **Purpose**: App configuration
- **Settings**: Theme (light/dark/auto), start day of month, currency, buffer, export/import data, backup, about

#### FeaturesScreen
- **Route**: `Features`
- **Purpose**: Feature flag toggles
- **Toggles**: Sort categories ascending, compact accounts, compact categories, title suggestions, category search bar, hide total balance, decimal numbers, standard keypad, account colors in transactions

#### AttributionsScreen
- **Route**: `Attributions`
- **Purpose**: Open source library attributions

#### ContributorsScreen
- **Route**: `Contributors`
- **Purpose**: GitHub contributors wall

#### ReleasesScreen
- **Route**: `Releases`
- **Purpose**: App changelog / release notes

#### DisclaimerScreen
- **Route**: `Disclaimer`
- **Purpose**: Legal disclaimer

#### PollScreen
- **Route**: `Poll`
- **Purpose**: In-app user polling

## 3. Navigation Flow Diagram

```
App Launch
  ├── First launch? → OnboardingScreen
  │     └── Complete → MainScreen
  └── Returning user → MainScreen

MainScreen (Bottom Tabs)
  ├── Tab 1: HomeTab
  │     ├── Tap transaction → EditTransactionScreen
  │     ├── Tap planned payment → EditTransactionScreen
  │     ├── Tap "See all" → TransactionsScreen / PlannedPaymentsScreen
  │     ├── More Menu → Settings, Categories, Budgets, Reports, etc.
  │     └── Swipe left/right → Switch to Accounts tab
  ├── Tab 2: AccountsTab
  │     ├── Tap account → TransactionsScreen (filtered)
  │     └── Tap balance → BalanceScreen
  └── FAB (+)
        ├── Add Income → EditTransactionScreen(INCOME)
        ├── Add Expense → EditTransactionScreen(EXPENSE)
        ├── Add Transfer → EditTransactionScreen(TRANSFER)
        ├── Add Planned → EditPlannedScreen
        └── Add Account → Account modal

Side Navigation (from More Menu or Settings)
  Settings → Features, Attributions, Contributors, Releases, Disclaimer
  Analysis → PieChartStatisticScreen, ReportScreen
  Tools → ExchangeRatesScreen, LoansScreen → LoanDetailsScreen
  Data → ImportScreen, CSV export
```

## 4. React Native Project Structure Recommendation

```
src/
├── app/                    # App entry, providers, navigation container
│   ├── App.tsx
│   └── Navigation.tsx      # React Navigation setup
├── screens/                # One directory per screen
│   ├── MainScreen/
│   │   ├── MainScreen.tsx
│   │   ├── MainBottomBar.tsx
│   │   └── components/
│   ├── HomeScreen/
│   │   ├── HomeScreen.tsx
│   │   ├── HomeHeader.tsx
│   │   ├── CashFlowInfo.tsx
│   │   ├── TransactionList.tsx
│   │   └── MoreMenu.tsx
│   ├── OnboardingScreen/
│   │   ├── OnboardingScreen.tsx
│   │   └── steps/
│   ├── EditTransactionScreen/
│   ├── TransactionsScreen/
│   ├── CategoriesScreen/
│   ├── AccountsScreen/
│   ├── PlannedPaymentsScreen/
│   ├── EditPlannedScreen/
│   ├── PieChartScreen/
│   ├── ReportScreen/
│   ├── BudgetScreen/
│   ├── BalanceScreen/
│   ├── ExchangeRatesScreen/
│   ├── LoansScreen/
│   ├── LoanDetailsScreen/
│   ├── SearchScreen/
│   ├── ImportScreen/
│   ├── SettingsScreen/
│   └── ...
├── components/             # Shared UI components
│   ├── TransactionCard.tsx
│   ├── CategoryPicker.tsx
│   ├── AccountPicker.tsx
│   ├── AmountInput.tsx
│   ├── CustomKeypad.tsx
│   ├── IconPicker.tsx
│   ├── ColorPicker.tsx
│   ├── PeriodSelector.tsx
│   ├── PieChart.tsx
│   └── ...
├── models/                 # TypeScript types/interfaces
│   ├── Transaction.ts
│   ├── Account.ts
│   ├── Category.ts
│   ├── Budget.ts
│   ├── Loan.ts
│   ├── Tag.ts
│   └── ...
├── services/               # Business logic, use cases
│   ├── balanceService.ts
│   ├── transactionService.ts
│   ├── budgetService.ts
│   ├── exchangeRateService.ts
│   └── csvService.ts
├── database/               # SQLite / WatermelonDB
│   ├── schema.ts
│   ├── models/
│   └── migrations/
├── stores/                 # State management
│   ├── homeStore.ts
│   ├── transactionStore.ts
│   └── settingsStore.ts
├── hooks/                  # Custom hooks
├── utils/                  # Utilities
│   ├── validation.ts       # Branded types / zod schemas
│   ├── formatting.ts       # Currency, date formatting
│   └── identifiers.ts      # UUID generation
└── theme/                  # Material3 theme
    ├── colors.ts
    ├── typography.ts
    └── ThemeProvider.tsx
```

## 5. Key State Stores

| Store | State Shape | Used By |
|-------|-------------|---------|
| `homeStore` | `HomeState` (period, balance, stats, history, buffer, upcoming, overdue) | HomeScreen |
| `accountsStore` | `Account[]`, selected filters | AccountsScreen, HomeScreen |
| `categoriesStore` | `Category[]`, reorder state | CategoriesScreen, EditTransaction |
| `transactionStore` | Current editing transaction, recent transactions | EditTransaction, Transactions |
| `settingsStore` | Theme, currency, features toggles, startDayOfMonth | Settings, all screens |
| `exchangeRatesStore` | `ExchangeRate[]` | BalanceScreen, ExchangeRatesScreen |
| `budgetStore` | `Budget[]`, progress calculations | BudgetScreen |
| `loanStore` | `Loan[]`, `LoanRecord[]` | LoansScreen, LoanDetails |
| `navigationStore` | Current screen, params | Navigation container |
