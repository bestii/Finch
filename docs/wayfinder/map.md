# Wayfinder Map: Ivy Wallet Rebuild — Mobile-First with Web Path

## Destination

Rebuild Ivy Wallet as a React Native (Expo managed) mobile app with a three-tier architecture (`core/`, `mobile/`, `web/`) that shares models, validation, repositories, and Zustand stores in a platform-agnostic `core/` tier — so a web version can be built later by swapping only the data adapter and UI layer, with zero core rework.

## Notes

- **Domain**: Personal finance / manual expense tracker. Offline-first, no server.
- **Skills to consult**: `codebase-design`, `tdd`, `domain-modeling`
- **Repo**: Flat feature folder monorepo (no turborepo/nx). One package.
- **Stack**: Expo managed, TypeScript strict, Zustand, Zod, neverthrow, date-fns, uuid
- **Mobile**: react-native-paper (UI), expo-sqlite + Drizzle ORM (DB), React Navigation
- **Web**: Deferred. UI lib and DB adapter chosen later. react-native-web may serve simple screens.
- **Design source of truth**: Figma design system ([link](https://www.figma.com/file/kSwIa07jcHEHZXo6rzx7dn/Design-System))
- **Original codebase**: [Ivy Wallet](https://github.com/Ivy-Apps/ivy-wallet) (archived, GPL-3.0)

## Decisions so far

1. **Layering**: Collapse into repositories. Stores call repos directly — no separate service layer. Services exist only for cross-cutting orchestration (e.g., balance across accounts).
2. **Naming**: `TransactionRepository` (interface) with `SqliteTransactionRepository` as impl. No `I` prefix.
3. **Return types**: Repositories return domain models (branded IDs, validated types). Mapping from raw DB records happens inside the repository implementation.
4. **Error handling**: `RepositoryError` discriminated union with `kind` discriminator (`NotFound`, `ValidationFailed`, `ConstraintViolation`, `Unknown`).
5. **DI**: Store factory functions. Repos are injected at creation time (e.g., `createTransactionStore(repo)`). App root wires them at startup.
6. **Database**: expo-sqlite + Drizzle ORM instead of WatermelonDB. No server, no sync — reactive observe() is unused behind async-only repo interfaces. Drizzle gives standard SQL, better TS inference, lighter footprint, and easier web path.
7. **Reactivity**: Async-only repositories (Promise-based). No observables. Stores re-fetch after mutations. No need for live subscriptions since all mutations go through stores.
8. **Method granularity**: CRUD + entity-specific query methods per repository (not a query builder DSL). Methods like `findByAccountId` hide query implementation.
9. **Repository organization**: Per-entity interfaces (~9 repos: Transaction, Account, Category, Budget, Loan, LoanRecord, PlannedPaymentRule, ExchangeRate, Tag).
10. **Error shape**: Flat discriminated union `{ kind, entity, id, message }` with four variants: NotFound, ValidationFailed, ConstraintViolation, Unknown.
11. **Transactions**: Repository owns write boundaries. Multi-table operations (transfers) use dedicated methods that wrap their own SQLite transaction internally.
12. **Schema location**: Drizzle schemas live in `mobile/data/schema.ts`. Not in `core/`. The repository interface is the shared contract, not the schema.
13. **DB wiring**: Repo factories accept the Drizzle `db` instance directly (`createSqliteTransactionRepo(db)`). No singletons, no providers.
14. **Repository interface location**: `core/repositories/TransactionRepository.ts`. All interfaces together, separate from `core/models/`.
15. **Pattern**: Confirmed. Stores are factory functions, repos are factory functions, db is wired at app root. Core has zero platform deps.
16. **Store granularity**: Keep the 8 stores from the original Ivy (home, accounts, categories, transaction, settings, exchangeRates, budget, loan). HomeScreen composes multiple stores rather than owning all derived data.
17. **Async actions**: Shared helper to wrap `set status → call repo → unwrap Result → set content/error`. No per-action boilerplate, no middleware magic.
18. **State signaling**: Hybrid — discriminated union (`loading | content | error`) for the primary data fetch. Separate `isSaving` / `saveError` fields for mutations. No per-query status explosion.
19. **Store cross-references**: Never. Screens compose multiple stores independently. Stores never import or `getState()` other stores. Keeps them self-contained.
20. **Store file organization**: `core/stores/` flat directory. One file per store. Types co-located in the same file.
21. **Edit form state**: Local `useState`/`useReducer` hooks in the screen component. Not in Zustand. Only persistent data (lists, CRUD) goes in stores.
22. **Async helper**: None. The 4-line inline pattern (`set loading → call repo → unwrap Result → set content/error`) is clear enough. No shared utility needed.
23. **Store scope**: Global (module-level). Single-user, single-DB app. Factory functions still allow test isolation.
24. **Derived data**: Pure service functions in `core/services/`. e.g., `balanceService.calculateHomeData(transactions, accounts, plannedPayments, exchangeRates)`. Testable outside stores.
25. **Screen consumption**: Single selectors — `useStore(s => ({ data: s.data, status: s.status }))`. Picks only needed fields, one subscription.

## Frontier (open tickets)

| # | Ticket | Type | Blocked by | Status |
|---|--------|------|------------|--------|
| 1 | [Repository Interface Pattern](01-repository-interface-pattern.md) | grilling | — | resolved |
| 2 | [Core Model Types & Zod Schemas](02-core-model-types.md) | task | — | resolved |
| 3 | [Zustand Store Pattern](03-zustand-store-pattern.md) | grilling | — | resolved |
| 4 | [Project Scaffold](04-project-scaffold.md) | task | — | unclaimed |
| 5 | [Theme Token Extraction](05-theme-token-extraction.md) | research | — | unclaimed |

### Blocked

*None — all blockers resolved.*

## Not yet specified

- Web UI component library (Material UI vs alternatives vs custom)
- Web database adapter (IndexedDB/Dexie vs sql.js vs something else)
- Web navigation approach (react-router vs Expo Router web build vs React Navigation web)
- Whether react-native-web will serve as the bridge or web gets its own component tree
- CI/CD pipeline design for mobile (EAS) + web (Vercel/Netlify?)
- Cross-platform testing strategy (Jest + RNTL for mobile, Testing Library DOM for web)
- Data migration path for existing Ivy Wallet users (CSV import)

## Out of scope

- Cloud sync / backend server — Ivy Wallet is offline-first
- Salt Edge banking API integration
- Android home screen widgets
- The community web reference (ivy-wallet-web) — building from own design system
- Any server-side component or API
