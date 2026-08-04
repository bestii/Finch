# Wayfinder Map: Ivy Wallet Rebuild — Mobile-First with Web Path

## Destination

Rebuild Ivy Wallet as a React Native (Expo managed) mobile app with a three-tier architecture (`core/`, `mobile/`, `web/`) that shares models, validation, repositories, and Zustand stores in a platform-agnostic `core/` tier — so a web version can be built later by swapping only the data adapter and UI layer, with zero core rework.

## Notes

- **Domain**: Personal finance / manual expense tracker. Offline-first, no server.
- **Skills to consult**: `codebase-design`, `tdd`, `domain-modeling`
- **Repo**: Flat feature folder monorepo (no turborepo/nx). One package.
- **Stack**: Expo managed, TypeScript strict, Zustand, Zod, neverthrow, date-fns, uuid
- **Mobile**: react-native-paper (UI), WatermelonDB (DB), React Navigation
- **Web**: Deferred. UI lib and DB adapter chosen later. react-native-web may serve simple screens.
- **Design source of truth**: Figma design system ([link](https://www.figma.com/file/kSwIa07jcHEHZXo6rzx7dn/Design-System))
- **Original codebase**: [Ivy Wallet](https://github.com/Ivy-Apps/ivy-wallet) (archived, GPL-3.0)

## Decisions so far

_None yet — map just charted._

## Frontier (open tickets)

| # | Ticket | Type | Blocked by | Status |
|---|--------|------|------------|--------|
| 1 | [Repository Interface Pattern](01-repository-interface-pattern.md) | grilling | — | unclaimed |
| 2 | [Core Model Types & Zod Schemas](02-core-model-types.md) | task | — | unclaimed |
| 5 | [Theme Token Extraction](05-theme-token-extraction.md) | research | — | unclaimed |

### Blocked

| # | Ticket | Type | Blocked by |
|---|--------|------|------------|
| 3 | [Zustand Store Pattern](03-zustand-store-pattern.md) | grilling | #1 |
| 4 | [Project Scaffold](04-project-scaffold.md) | task | #1, #2 |

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
