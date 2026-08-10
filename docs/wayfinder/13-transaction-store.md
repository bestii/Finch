# Transaction Store

## Question

Create the Transaction Zustand store:

- `src/core/stores/transaction-store.ts` — Factory function

State: transactions, status, error, isSaving, saveError
Actions: load(), loadByAccount(id), loadByCategory(id), create(input), update(id, input), delete(id)

The `create` action handles all three transaction types (income, expense, transfer). Uses the `CreateTransactionSchema` discriminated union.

Unit tests against a fake TransactionRepository.

## Dependencies

- Blocked by #12 (Transaction Drizzle schema + repo)
