# Project Scaffold

## Question

Scaffold the Expo managed project with the three-tier folder structure:

```
src/
├── core/
│   ├── models/       # Domain types + Zod schemas
│   ├── repositories/ # Interfaces only (ITransactionRepository, etc.)
│   ├── stores/       # Zustand stores (platform-agnostic)
│   ├── services/     # Business logic functions
│   ├── theme/        # Design tokens (colors, typography, spacing)
│   └── utils/        # UUID, formatting, validation helpers
├── mobile/
│   ├── data/         # WatermelonDB schema + repository implementations
│   ├── screens/      # React Native screens (23 screens)
│   ├── components/   # Shared mobile UI components
│   ├── navigation/   # React Navigation setup
│   └── theme/        # react-native-paper theme config
└── web/              # Placeholder for future web work
    └── README.md
```

Initializes the Expo project, installs core dependencies from the docs, and sets up TypeScript strict mode.
