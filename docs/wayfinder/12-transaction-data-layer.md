# Transaction: Drizzle Schema + Repository

## Question

Build the data layer for Transaction — the central model (discriminated union: Income | Expense | Transfer):

- `src/mobile/data/schema.ts` — Add `transactions` table
- `src/core/repositories/TransactionRepository.ts` — Interface
- `src/mobile/data/repositories/sqlite-transaction-repository.ts` — Implementation
- Unit tests

Transaction has the most complex schema (16 columns) and the most complex create logic (Transfer writes to two account references). The repo must own the multi-table write transaction internally (decision #11).

## Dependencies

- Blocked by #7 (Account data layer — AccountId FK reference)
- Blocked by #11 (Category data layer — CategoryId FK reference)
