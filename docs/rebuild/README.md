# Ivy Wallet Rebuild Documentation

> **Purpose**: Complete reference for rebuilding Ivy Wallet as a React Native app.
> **Source**: Extracted from [Ivy Wallet](https://github.com/Ivy-Apps/ivy-wallet) (archived Android Kotlin/Compose codebase).
> **License**: GPL-3.0

---

## About Ivy Wallet

Ivy Wallet is a **free, open-source money management app** — a manual expense tracker designed to replace spreadsheets for personal finance. It's known for its clean UI, simplicity, and customization. Originally built with 100% Kotlin and Jetpack Compose for Android.

The original app was archived in November 2024. This documentation captures the full architecture, data models, screen inventory, and design patterns to enable a complete rebuild in React Native.

## Documentation Index

| # | Document | Description |
|---|----------|-------------|
| 1 | **[Architecture & Patterns](01-architecture-and-patterns.md)** | Layered architecture (Data → Domain → UI), MVI pattern, modularization strategy, DI approach, error handling, data flow |
| 2 | **[Data Models & Schema](02-data-models-and-schema.md)** | Full TypeScript type definitions for all 12 domain models, primitive/exact types, complete SQLite schema (12 tables), entity relationships |
| 3 | **[Screen Inventory & Navigation](03-screen-inventory-and-navigation.md)** | All 23 screens with purpose/params/features, navigation flow diagram, recommended React Native project structure, state store mapping |
| 4 | **[React Native Migration Guide](04-react-native-migration-guide.md)** | Technology mapping table, Zustand store patterns, component patterns, WatermelonDB setup, validation with branded types + zod, recommended libraries, 7-phase rebuild plan |

## Quick Start (New Repo)

```bash
# 1. Create the React Native project
npx create-expo-app ivy-wallet-rn --template blank-typescript
cd ivy-wallet-rn

# 2. Install core dependencies
npx expo install react-native-paper react-native-safe-area-context
npm install zustand uuid zod date-fns neverthrow
npm install @nozbe/watermelondb @nozbe/with-observables

# 3. Set up navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# 4. Copy the model types from docs/02-data-models-and-schema.md
# 5. Set up WatermelonDB schema from docs/02-data-models-and-schema.md
# 6. Follow the build phases in docs/04-react-native-migration-guide.md
```

## Key Design Decisions to Carry Forward

1. **Unidirectional data flow** (MVC/MVI pattern) — state flows down, events flow up
2. **Validation by construction** — use branded types + zod to eliminate impossible states
3. **Feature-based modularization** — one directory per screen/feature
4. **Dumb UI components** — components receive data, fire events; no business logic inside
5. **Material3 design** — use react-native-paper as the UI library foundation
6. **Offline-first** — all data stored locally in SQLite; no server dependency
7. **No account required** — the original is fully offline; keep it that way

## External Resources

- **Figma Design System**: https://www.figma.com/file/kSwIa07jcHEHZXo6rzx7dn/Design-System
- **Original Repository**: https://github.com/Ivy-Apps/ivy-wallet
- **Community web version**: https://github.com/pratikkabade/ivy-wallet-web (React/Vite reference)
- **Original learning resources**: `docs/resources/` (books, articles, videos)

## Original Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Language | Kotlin (100%) |
| UI | Jetpack Compose + Material3 |
| Architecture | MVI + UDF + Clean Architecture |
| DI | Hilt (Dagger) |
| DB | Room (SQLite v130) |
| K/V | DataStore |
| HTTP | Ktor Client |
| Serialization | Kotlinx Serialization |
| FP | ArrowKt (Either types) |
| Testing | JUnit + Kotest + Paparazzi (screenshots) |
| Build | Gradle KTS + Convention Plugins + Version Catalogs |
| CI/CD | GitHub Actions + Fastlane |
| Linting | Detekt + Ktlint + Slack's compose-lints |
