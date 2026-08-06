# Repository Interface Pattern ✅

## Decision

| # | Decision | Choice |
|---|----------|--------|
| 1 | Layering | Stores call repos directly. No service layer. Services only for cross-cutting orchestration. |
| 2 | Naming | `TransactionRepository` (interface), `SqliteTransactionRepository` (impl). No `I` prefix. |
| 3 | Return types | Domain models (branded IDs, validated types). Mapping inside repo impl. |
| 4 | Error handling | `RepositoryError` discriminated union: `NotFound`, `ValidationFailed`, `ConstraintViolation`, `Unknown`. |
| 5 | DI | Store factory functions: `createTransactionStore(repo)`. Repo factory: `createSqliteTransactionRepo(db)`. |
| 6 | Database | expo-sqlite + Drizzle ORM (not WatermelonDB). No server, no sync — observables unused. |
| 7 | Reactivity | Async-only (Promise). No observables. Stores re-fetch after mutations. |
| 8 | Method granularity | CRUD + entity-specific queries (e.g., `findByAccountId`). No query builder DSL. |
| 9 | Organization | Per-entity interfaces: ~9 repos in `core/repositories/`. |
| 10 | Error shape | `{ kind, entity, id, message }` flat discriminated union. |
| 11 | Transactions | Repo owns write boundaries. Multi-table ops (transfers) use dedicated repo methods. |
| 12 | Schema location | `mobile/data/schema.ts`. Not in `core/`. |
| 13 | DB wiring | Repo factories accept Drizzle `db` directly. No singletons. |
| 14 | Interface location | `core/repositories/TransactionRepository.ts`. Separate from models. |
| 15 | Overall pattern | Store factories → Repo factories → DB wired at app root. Core has zero platform deps. |

## Concrete pattern

```ts
// core/models/transaction.ts — domain types + Zod schemas (ticket #2)
// core/repositories/TransactionRepository.ts — interface
// mobile/data/schema.ts — Drizzle table definitions
// mobile/data/repositories/sqlite-transaction-repository.ts — impl

interface TransactionRepository {
  findAll(): Promise<Result<Transaction[], RepositoryError>>;
  findById(id: TransactionId): Promise<Result<Transaction, RepositoryError>>;
  findByAccountId(accountId: AccountId): Promise<Result<Transaction[], RepositoryError>>;
  create(input: CreateTransactionInput): Promise<Result<Transaction, RepositoryError>>;
  update(id: TransactionId, input: UpdateTransactionInput): Promise<Result<Transaction, RepositoryError>>;
}

function createSqliteTransactionRepo(db: DrizzleDB): TransactionRepository { ... }

// core/stores/transaction-store.ts
function createTransactionStore(repo: TransactionRepository) {
  return create<TransactionStoreState>((set, get) => ({
    transactions: [],
    async load() {
      const result = await repo.findAll();
      if (result.isOk()) set({ transactions: result.value });
    },
  }));
}

// mobile/app.tsx — wiring
const db = drizzle(sqliteDb);
const txRepo = createSqliteTransactionRepo(db);
const useTransactionStore = createTransactionStore(txRepo);
```
