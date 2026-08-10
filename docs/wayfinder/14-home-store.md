# Home Store + HomeDataService

## Question

Create the Home store and its derived data service:

- `src/core/services/home-data-service.ts` — Pure function `calculateHomeData(transactions, accounts, plannedPayments, exchangeRates)` returning balance, monthlyIncome, monthlyExpense, upcoming, overdue
- `src/core/stores/home-store.ts` — Factory function accepting repos for transactions, accounts, plannedPayments, exchangeRates

The home store is unique: it doesn't own its own repo but composes data from 4 other repos, calling the service to derive the dashboard state.

## Dependencies

- Blocked by #8 (Account store — account data)
- Blocked by #13 (Transaction store — transaction data)
- Blocked by future: PlannedPayment repo + store, ExchangeRate repo + store (can start with empty arrays)
