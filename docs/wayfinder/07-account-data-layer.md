# Account: Drizzle Schema + Repository + Tests

## Question

Build the first full data layer vertical slice for the Account entity:

- `src/mobile/data/schema.ts` — Drizzle `accounts` table definition
- `src/core/repositories/AccountRepository.ts` — Repository interface per decision #8
- `src/mobile/data/repositories/sqlite-account-repository.ts` — Implementation using Drizzle
- Unit tests for the repository against an in-memory SQLite DB

The Account model is defined in `src/core/models/account.ts` (7 fields: id, name, asset, color, icon, includeInBalance, orderNum). The repo should have:

- `findAll(): Promise<Result<Account[], RepositoryError>>`
- `findById(id: AccountId): Promise<Result<Account, RepositoryError>>`
- `create(input: CreateAccountInput): Promise<Result<Account, RepositoryError>>`
- `update(id: AccountId, input: Partial<CreateAccountInput>): Promise<Result<Account, RepositoryError>>`
- `delete(id: AccountId): Promise<Result<void, RepositoryError>>`

## Dependencies

None — Account model types and CreateAccountSchema already exist in `src/core/models/`.
