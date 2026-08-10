# Implement Theme Tokens

## Question

Translate the design token research from `docs/research/theme-tokens.md` into code. Create:

- `src/core/theme/colors.ts` — All color hex values + semantic mapping (light/dark/AMOLED)
- `src/core/theme/typography.ts` — Font size, weight, family definitions (Raleway + Open Sans scale)
- `src/core/theme/spacing.ts` — 4-based spacing scale constants
- `src/core/theme/shapes.ts` — Border radius tokens (r1–r4, rFull, circle)
- `src/core/theme/index.ts` — Re-exports
- `src/mobile/theme/paperTheme.ts` — react-native-paper `MD3LightTheme` / `MD3DarkTheme` overrides using the core tokens

The research doc has all the values. This is pure translation — no decisions to make.

## Dependencies

None. Can be done immediately — the `src/core/theme/` and `src/mobile/theme/` directories already exist with placeholder `index.ts` files.
