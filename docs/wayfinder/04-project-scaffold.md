# Project Scaffold

## Specification

Scaffold the Expo managed project with the three-tier folder structure, reflecting all decisions from tickets #1–3.

```
src/
├── core/
│   ├── models/       # Domain types + Zod schemas ✅ (ticket #2)
│   ├── repositories/ # Interfaces (TransactionRepository, etc.)
│   ├── stores/       # Zustand stores (platform-agnostic, 8 stores)
│   ├── services/     # Business logic functions (balance, etc.)
│   ├── theme/        # Design tokens (colors, typography, spacing)
│   └── utils/        # UUID, formatting, validation helpers
├── mobile/
│   ├── data/         # expo-sqlite + Drizzle schema + repository implementations
│   ├── screens/      # React Native screens (23 screens)
│   ├── components/   # Shared mobile UI components
│   ├── navigation/   # React Navigation setup
│   └── theme/        # react-native-paper theme config
└── web/              # Placeholder for future web work
    └── README.md
```

## Decisions

| #   | Decision                                                                                           |
| --- | -------------------------------------------------------------------------------------------------- |
| 1   | Path aliases: `@core/*` → `src/core/*` via tsconfig paths + babel-plugin-module-resolver for Metro |
| 2   | Testing: Jest + React Native Testing Library (Expo default)                                        |
| 3   | Pre-commit hooks: Husky + lint-staged (Prettier, typecheck, tests)                                 |
| 4   | Updated from WatermelonDB → expo-sqlite + Drizzle ORM, I prefix → no prefix, 8 stores              |

## Scaffold steps

1. Initialize Expo project (`npx create-expo-app@latest`)
2. Install deps: zustand, zod, neverthrow, date-fns, uuid, expo-sqlite, drizzle-orm, drizzle-kit
3. Install dev deps: jest, @testing-library/react-native, eslint, prettier, typescript, husky, lint-staged
4. Set up TypeScript strict mode in tsconfig
5. Configure path aliases (`@core/*`)
6. Copy already-created `src/core/models/` files
7. Create directory structure with placeholder index.ts files
8. Set up pre-commit hooks (Husky + lint-staged)
9. Verify: `npx tsc --noEmit` passes
