# Settings Store

## Question

Create the Settings store using AsyncStorage (no SQLite — settings are key-value):

- `src/core/stores/settings-store.ts` — Factory function

Settings: theme (light/dark/auto), currency (AssetCode), startDayOfMonth, feature toggles, hideBalance, compactMode.

Uses `@react-native-async-storage/async-storage` directly since settings don't need the repository pattern — they're simple key-value, not relational.

## Dependencies

- None (AsyncStorage is available via Expo)
