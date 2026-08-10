# Account Store

## Question

Create the Account Zustand store per decision patterns #16-25:

- `src/core/stores/account-store.ts` — Factory function `createAccountStore(repo: AccountRepository)`

State shape:

- `accounts: Account[]`
- `status: 'loading' | 'content' | 'error'`
- `error: RepositoryError | null`
- `isSaving: boolean`
- `saveError: RepositoryError | null`

Actions: `load()`, `create(input)`, `update(id, input)`, `delete(id)`

Unit tests against a fake AccountRepository.

## Dependencies

- Blocked by #7 (Account Drizzle schema + repo)
