# Web

The web tier is deferred. When built, it will:

- Implement the same `core/repositories/` interfaces with a web-appropriate DB adapter (IndexedDB/Dexie, sql.js, or OPFS)
- Use a web UI component library (Material UI, custom, or TBD)
- Share all `core/` models, stores, services, and theme tokens with zero rework

See `docs/wayfinder/map.md` for the full architecture.
