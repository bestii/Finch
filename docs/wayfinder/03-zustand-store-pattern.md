# Zustand Store Pattern ✅

## Decision

| # | Decision | Choice |
|---|----------|--------|
| 1 | Store granularity | 8 stores from original Ivy: home, accounts, categories, transaction, settings, exchangeRates, budget, loan |
| 2 | Injection | Factory functions accepting repos (from ticket #1 decision #5). `createTransactionStore(txRepo)` |
| 3 | Async actions | Inline 4-line pattern per action. No shared helper. `set({ status: 'loading' }) → await repo → unwrap Result → set content/error` |
| 4 | State signaling | Hybrid: discriminated union (`loading \| content \| error`) for primary fetch. Separate `isSaving` / `saveError` for mutations |
| 5 | Cross-references | Never. Stores are independent. Screens compose multiple stores |
| 6 | File layout | `core/stores/` flat directory. One file per store. Types co-located |
| 7 | Edit form state | Local `useState`/`useReducer` hooks in screen. Not in Zustand |
| 8 | Scope | Global (module-level). Factory functions still allow test isolation |
| 9 | Derived data | Pure service functions in `core/services/`. e.g., `balanceService.calculateHomeData(...)` |
| 10 | Screen consumption | Single selectors — `useStore(s => ({ data: s.data, status: s.status }))` |

## Concrete patterns

**Store structure (list view):**

```ts
// core/stores/transaction-store.ts
import { create } from "zustand";
import type { TransactionRepository } from "../repositories/TransactionRepository";
import type { Transaction, RepositoryError } from "../models";

type AsyncStatus = "loading" | "content" | "error";

interface TransactionStoreState {
  transactions: Transaction[];
  status: AsyncStatus;
  error: RepositoryError | null;
  isSaving: boolean;
  saveError: RepositoryError | null;

  load: () => Promise<void>;
  create: (input: CreateTransactionInput) => Promise<Transaction | null>;
  update: (id: TransactionId, input: UpdateTransactionInput) => Promise<Transaction | null>;
  delete: (id: TransactionId) => Promise<boolean>;
}

export function createTransactionStore(repo: TransactionRepository) {
  return create<TransactionStoreState>((set) => ({
    transactions: [],
    status: "loading",
    error: null,
    isSaving: false,
    saveError: null,

    load: async () => {
      set({ status: "loading" });
      const result = await repo.findAll();
      if (result.isOk()) {
        set({ status: "content", transactions: result.value, error: null });
      } else {
        set({ status: "error", error: result.error });
      }
    },

    create: async (input) => {
      set({ isSaving: true, saveError: null });
      const result = await repo.create(input);
      if (result.isOk()) {
        set((s) => ({
          transactions: [result.value, ...s.transactions],
          isSaving: false,
        }));
        return result.value;
      }
      set({ isSaving: false, saveError: result.error });
      return null;
    },

    update: async (id, input) => {
      set({ isSaving: true, saveError: null });
      const result = await repo.update(id, input);
      if (result.isOk()) {
        set((s) => ({
          transactions: s.transactions.map((t) => (t.id === id ? result.value : t)),
          isSaving: false,
        }));
        return result.value;
      }
      set({ isSaving: false, saveError: result.error });
      return null;
    },

    delete: async (id) => {
      set({ status: "loading" });
      const result = await repo.delete(id);
      if (result.isOk()) {
        set((s) => ({
          transactions: s.transactions.filter((t) => t.id !== id),
          status: "content",
        }));
        return true;
      }
      set({ status: "error", error: result.error });
      return false;
    },
  }));
}
```

**Derived data service:**

```ts
// core/services/balance-service.ts
import { err, ok, type Result } from "neverthrow";
import type { Transaction, Account, PlannedPaymentRule, ExchangeRate } from "../models";
import type { RepositoryError } from "../repositories/types";

interface HomeData {
  balance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  upcoming: PlannedPayment[];
  overdue: PlannedPayment[];
}

export function calculateHomeData(
  transactions: Transaction[],
  accounts: Account[],
  plannedPayments: PlannedPaymentRule[],
  exchangeRates: ExchangeRate[]
): Result<HomeData, RepositoryError> {
  // Pure computation — no side effects, no DB calls
  // ...
}
```

**Screen consumption:**

```ts
// mobile/screens/TransactionsScreen.tsx
function TransactionsScreen() {
  const { transactions, status, load } = useTransactionStore((s) => ({
    transactions: s.transactions,
    status: s.status,
    load: s.load,
  }));

  useEffect(() => { load(); }, []);

  if (status === "loading") return <Loading />;
  if (status === "error") return <Error />;
  return <TransactionList data={transactions} />;
}
```
