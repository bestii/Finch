# Zustand Store Pattern

## Question

How do we structure Zustand stores in `core/` so they are platform-agnostic — consuming repository interfaces, not WatermelonDB directly?

Key questions:
- Store-per-screen (matching the docs' 8 stores) vs domain-grouped?
- How are repository implementations injected into stores? (constructor injection, context, or import-time)
- Pattern for async actions (load, create, update) using neverthrow
- How do stores signal loading/error/content states consistently?
