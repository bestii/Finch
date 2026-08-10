# Category: Schema + Repo + Store + Screen

## Question

Repeat the Account pattern for Category — a simpler entity (6 fields, no relationships):

- `src/mobile/data/schema.ts` — Add `categories` table
- `src/core/repositories/CategoryRepository.ts` — Interface
- `src/mobile/data/repositories/sqlite-category-repository.ts` — Implementation
- `src/core/stores/category-store.ts` — Store factory
- `src/mobile/screens/CategoriesScreen.tsx` — List, create, reorder, compact mode
- Unit tests

## Dependencies

- Blocked by #9 (Navigation skeleton — Categories route must exist)
