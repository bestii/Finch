# Ivy Wallet Architecture & Design Patterns

> Extracted from the original codebase for the React Native rebuild.

## 1. Layered Architecture

Ivy Wallet follows **Google's recommended Android app architecture** with three layers:

```
┌─────────────────────────────────────────┐
│                UI LAYER                  │
│  Screens → ViewModels → ViewState       │
│  Compose UI (dumb, draws ViewState)     │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│            DOMAIN LAYER (optional)       │
│  UseCases (business logic)              │
│  Pure Kotlin, no Android deps           │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│             DATA LAYER                   │
│  Repositories → DataSources → DB/API    │
│  Room (SQLite), DataStore, Ktor         │
└─────────────────────────────────────────┘
```

### Data Mapping Pipeline

```
Raw Model (Entity/DTO) → Domain Model → ViewState Model
```

**Raw Models**: Room entities, API DTOs — simple data classes with primitives.
**Domain Models**: Validated, explicit types (`Account`, `Transaction`, `Category`) — impossible states eliminated at compile time.
**ViewState Models**: Flat data classes with primitives and `@Immutable` values ready for rendering.

## 2. Screen Architecture: MVI + Unidirectional Data Flow

Every screen follows the **MVI (Model-View-Intent)** pattern with UDF:

```
User Interaction → UI Event → ViewModel → New ViewState → UI Redraws
        ▲                                                       │
        └───────────────────────────────────────────────────────┘
```

### Components per Screen

| Component | Role |
|-----------|------|
| **ViewState** | `data class` or `sealed interface` containing ALL information to render the screen. Only primitives and immutable structures. |
| **UI Events** | User interactions captured as events (`OnSaveClick`, `OnTextChanged`, etc.) |
| **ViewModel** | Adapter between domain/data layer and UI. Receives events, produces ViewState. Uses Compose runtime for reactive state. |
| **Composable UI** | Dumb renderer. Draws ViewState. Captures and sends UI Events. No business logic. |

### ViewState Best Practices
- Use **sealed interfaces** for mutually exclusive states (Loading / Content / Error)
- Use **data classes** for content states
- Combine both using Algebraic Data Types (ADTs)
- Never allow impossible states (e.g., both loading AND error simultaneously)

Example pattern:
```kotlin
sealed interface ScreenUiState {
  data object Loading : ScreenUiState
  data class Content(val data: FormattedData) : ScreenUiState
  data class Error(val message: String) : ScreenUiState
}
```

## 3. Modularization Strategy

The app is split into modules by **feature/screen**:

```
:app                    — Main app module, nav graph, DI wiring
:feature:*              — One module per feature/screen (23 features)
:shared:base            — Core shared utilities
:shared:common-ui       — Shared UI components
:shared:data:core       — Repositories, DAOs, Room DB, entities, mappers
:shared:data:model      — Pure domain models (no Android deps)
:shared:domain          — UseCases, business logic
:shared:ui:core         — Compose UI primitives
:shared:ui:navigation   — Navigation graph, screen definitions
:widget:*               — Android widgets
```

### Feature Modules (23 total):

- `accounts`, `balance`, `budgets`, `categories`, `edit-transaction`, `exchange-rates`, `home`, `import-data`, `loans`, `main`, `onboarding`, `piechart`, `planned-payments`, `reports`, `search`, `settings`, `transactions`
- `attributions`, `contributors`, `disclaimer`, `features`, `releases`, `poll`

## 4. Dependency Injection

Uses **Hilt** (Dagger's Android DI). Every ViewModel, UseCase, and Repository is injected via `@Inject constructor`. Key modules:

- `:app/di/AppBindingsModule` — App-level bindings
- `:shared/data/core/di/RoomDbModule` — Database provider
- `:shared/data/core/di/DatastoreModule` — DataStore (key-value)
- `:shared/data/core/di/KtorClientModule` — HTTP client
- `:shared/data/core/di/RemoteDataSourceModule` — API bindings
- `:shared/domain/di/IvyCoreBindingsModule` — Domain bindings

## 5. Error Handling

- Uses **ArrowKt Either<Error, Success>** throughout
- Repositories return `Either<Error, DomainModel>`
- DataSources (network calls) wrap with try-catch, return `Either<ErrorDto, DataDto>`
- ViewStates model error states explicitly (no throwing to the UI)

## 6. Data Validation & Exact Types

The codebase emphasizes **validation by construction**:
- `PositiveInt`, `PositiveDouble`, `NonZeroDouble`, `NotBlankTrimmedString` — validated wrapper types
- Strongly-typed IDs: `AccountId`, `CategoryId`, `TransactionId`, `TagId` (all `@JvmInline value class UUID`)
- If a function accepts an `Order`, you know it's already valid — no re-validation needed
- Domain layer uses these exact types; DTOs/entities use primitives for simplicity

## 7. Data Flow Summary

```
User taps "Add Expense"
  → UI sends OnSaveClick event to ViewModel
  → ViewModel calls CreateTransactionUseCase
  → UseCase calls TransactionRepository
  → Repository validates, maps to Entity
  → Repository writes to Room DB
  → Repository maps Entity back to Domain model
  → UseCase returns Either<Error, Transaction>
  → ViewModel updates ViewState
  → UI recomposes with new state
```

## 8. React Native Mapping

| Ivy Concept | React Native Equivalent |
|-------------|------------------------|
| ViewModel + Compose State | Zustand / MobX / Redux store |
| ViewState (sealed interface) | Union types via TypeScript discriminated unions |
| UI Events | Action creators / store dispatches |
| UseCases | Service functions / hooks |
| Repository | API service + AsyncStorage/SQLite wrapper |
| Room DB | WatermelonDB / expo-sqlite / realm |
| Hilt DI | Context providers / simple service locator |
| Navigation (Stack) | React Navigation (native stack) |
| Composable UI | React components |
| Either<Error, T> | Result<T, E> / neverthrow / ts-results |
| Feature modules | Feature folders in src/ |
| MVI pattern | Relay / React Query + state management |
