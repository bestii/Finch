# Ivy Wallet — Design Token Research

Comprehensive extraction of the Ivy Wallet design system tokens from the original GitHub repository source code. This document serves as the canonical reference for rebuilding the theme in a React Native (Expo) + react-native-paper project.

---

## Sources

| Source | Type | Notes |
|--------|------|-------|
| **Figma Design System** (`kSwIa07jcHEHZXo6rzx7dn`) | Design file | Requires Figma login; page confirms existence but behind auth wall. Referenced in Ivy Wallet GitHub Issue #2735. |
| **GitHub: `Colors.kt`** | Source of truth | All raw color hex values defined in Kotlin. [View file](https://github.com/Ivy-Apps/ivy-wallet/blob/main/temp/old-design/src/main/java/com/ivy/design/l0_system/Colors.kt) |
| **GitHub: `IvyColors.kt`** | Semantic interface | Maps raw colors to semantic roles (primary, green, red, etc.) with light/dark themes. [View file](https://github.com/Ivy-Apps/ivy-wallet/blob/main/temp/old-design/src/main/java/com/ivy/design/l0_system/IvyColors.kt) |
| **GitHub: `IvyWalletDesign.kt`** | Concrete theme | Production theme implementation — maps color tokens per `Theme.LIGHT`, `Theme.DARK`, `Theme.AMOLED_DARK`. Defines typography sizes and shapes. [View file](https://github.com/Ivy-Apps/ivy-wallet/blob/main/temp/old-design/src/main/java/com/ivy/design/api/systems/IvyWalletDesign.kt) |
| **GitHub: `IvyTypography.kt`** | Typography interface | Semantic text style roles (h1, h2, b1, b2, c + numeric variants). [View file](https://github.com/Ivy-Apps/ivy-wallet/blob/main/temp/old-design/src/main/java/com/ivy/design/l0_system/IvyTypography.kt) |
| **GitHub: `IvyShapes.kt`** | Shape interface | Corner shape tokens (r1–r4, rFull, circle). [View file](https://github.com/Ivy-Apps/ivy-wallet/blob/main/temp/old-design/src/main/java/com/ivy/design/l0_system/IvyShapes.kt) |
| **GitHub: `IvyPadding.kt`** | Spacing model | Padding data class. [View file](https://github.com/Ivy-Apps/ivy-wallet/blob/main/temp/old-design/src/main/java/com/ivy/design/l1_buildingBlocks/data/IvyPadding.kt) |

> **Figma status**: The Figma design system file at `https://www.figma.com/file/kSwIa07jcHEHZXo6rzx7dn/Design-System` is behind authentication. The page loads but requires a Figma account. The GitHub source code is the **authoritative source of truth** for all design tokens since it's what actually ships in the app.

---

## Colors

### Base Palette (from `Colors.kt`)

#### Primary / Brand

| Token Name | Hex | Preview | Notes |
|------------|-----|---------|-------|
| `Ivy` / `Purple` | `#6B4DFF` | 🟣 | **Primary brand color** |
| `Purple1` | `#C34CFF` | | Lighter purple variant |
| `Purple2` | `#FF4CFF` | | Pink-purple |
| `Blue` | `#4CC3FF` | 🔵 | |
| `Blue2` | `#45E6E6` | | Cyan |
| `Blue3` | `#457BE6` | | |

#### Semantic Colors

| Token Name | Hex | Preview | Semantic Role |
|------------|-----|---------|---------------|
| `Green` | `#14CC9E` | 🟢 | Income / positive |
| `Green2` | `#45E67B` | | |
| `Green3` | `#96E645` | | |
| `Green4` | `#C7E62E` | | |
| `Yellow` | `#FFEE33` | 🟡 | Warning |
| `Orange` | `#F29F30` | 🟠 | |
| `Orange2` | `#E67B45` | | |
| `Orange3` | `#FFC34C` | | |
| `Red` | `#FF4060` | 🔴 | Expense / negative / error |
| `Red2` | `#E62E2E` | | |
| `Red3` | `#FF4CA6` | | Pink-red |

#### Light Variants (background tints)

Each base color has a matching `*Light` variant for use as backgrounds/badges:

| Token Name | Hex |
|------------|-----|
| `IvyLight` | `#D5CCFF` |
| `Purple1Light` | `#EECCFF` |
| `Purple2Light` | `#FFBFFF` |
| `BlueLight` | `#B3E6FF` |
| `Blue2Light` | `#B3FFFF` |
| `Blue3Light` | `#CCDDFF` |
| `GreenLight` | `#AAF2E0` |
| `Green2Light` | `#99FFBB` |
| `Green3Light` | `#CCFF99` |
| `Green4Light` | `#EEFF99` |
| `YellowLight` | `#FFF799` |
| `OrangeLight` | `#FFDEB3` |
| `Orange2Light` | `#FFCCB3` |
| `Orange3Light` | `#FFDC99` |
| `RedLight` | `#FFCCD5` |
| `Red2Light` | `#FFB3B3` |
| `Red3Light` | `#FFCCE6` |

#### Dark Variants (dark-mode accents)

| Token Name | Hex |
|------------|-----|
| `IvyDark` | `#352680` |
| `Purple1Dark` | `#622680` |
| `Purple2Dark` | `#802680` |
| `BlueDark` | `#266280` |
| `Blue2Dark` | `#227373` |
| `Blue3Dark` | `#223D73` |
| `GreenDark` | `#0A664F` |
| `Green2Dark` | `#22733D` |
| `Green3Dark` | `#66804D` |
| `Green4Dark` | `#637317` |
| `YellowDark` | `#807719` |
| `OrangeDark` | `#734B17` |
| `Orange2Dark` | `#66371F` |
| `Orange3Dark` | `#806226` |
| `RedDark` | `#801919` |
| `Red2Dark` | `#802030` |
| `Red3Dark` | `#802653` |

#### Neutral / Surface

| Token Name | Hex | Role |
|------------|-----|------|
| `White` | `#FAFAFA` | Light mode background |
| `Black` | `#111114` | Dark mode background, light mode text |
| `TrueBlack` | `#000000` | AMOLED dark mode background |
| `MediumBlack` | `#2B2C2D` | Dark mode surface |
| `Gray` | `#939199` | Dividers, secondary text |
| `MediumWhite` | `#EFEEF0` | Light mode surface |
| `Transparent` | `#00000000` | |

---

### Semantic Token Mapping (from `IvyColors` interface → `IvyWalletDesign.kt`)

This is the key mapping: how the `IvyColors` interface slots map to actual hex values per theme mode.

| Semantic Token | Light Mode | Dark Mode | AMOLED Dark |
|---------------|------------|-----------|-------------|
| `pure` | `#FAFAFA` (White) | `#111114` (Black) | `#000000` (TrueBlack) |
| `pureInverse` | `#111114` (Black) | `#FAFAFA` (White) | `#FAFAFA` (White) |
| `gray` | `#939199` (Gray) | `#939199` (Gray) | `#939199` (Gray) |
| `medium` | `#EFEEF0` (MediumWhite) | `#2B2C2D` (MediumBlack) | `#2B2C2D` (MediumBlack) |
| `mediumInverse` | `#2B2C2D` (MediumBlack) | `#EFEEF0` (MediumWhite) | `#EFEEF0` (MediumWhite) |
| **`primary`** | `#6B4DFF` (Purple) | `#6B4DFF` (Purple) | `#6B4DFF` (Purple) |
| `primary1` | `#352680` (IvyDark) | `#D5CCFF` (IvyLight) | `#D5CCFF` (IvyLight) |
| **`green`** | `#14CC9E` (Green) | `#14CC9E` (Green) | `#14CC9E` (Green) |
| `green1` | `#AAF2E0` (GreenLight) | `#0A664F` (GreenDark) | `#0A664F` (GreenDark) |
| **`orange`** | `#F29F30` (Orange) | `#F29F30` (Orange) | `#F29F30` (Orange) |
| `orange1` | `#FFDEB3` (OrangeLight) | `#734B17` (OrangeDark) | `#734B17` (OrangeDark) |
| **`red`** | `#FF4060` (Red) | `#FF4060` (Red) | `#FF4060` (Red) |
| `red1` | `#FFCCD5` (RedLight) | `#801919` (RedDark) | `#801919` (RedDark) |
| `red1Inverse` | `#801919` (RedDark) | `#FFCCD5` (RedLight) | `#FFCCD5` (RedLight) |

#### Gradients

| Token Name | Start | End |
|------------|-------|-----|
| `GradientGreen` | `#14CC9E` | `#49F2C8` |

---

## Typography

### Scale (from `IvyWalletDesign.kt`)

The typography system uses two font families with a 5-step semantic scale. Font sizes are in `sp` (scale-independent pixels), which map 1:1 to `pt`/logical pixels in React Native.

| Token | Font Size | Font Family | Weight | Usage |
|-------|-----------|-------------|--------|-------|
| `h1` / `nH1` | **40sp** | Raleway / Open Sans | Black (900) / Bold (700) | Screen titles, large hero numbers |
| `h2` / `nH2` | **32sp** | Raleway / Open Sans | ExtraBold (800) / Bold (700) | Section headers |
| `b1` / `nB1` | **20sp** | Raleway / Open Sans | Bold (700) / Bold (700) | Body large, list items |
| `b2` / `nB2` | **16sp** | Raleway / Open Sans | Medium (500) / Normal (400) | Body text, labels |
| `c` / `nC` | **12sp** | Raleway / Open Sans | ExtraBold (800) / Bold (700) | Caption, overline, small labels |

### Font Families

| Family | Usage | Notes |
|--------|-------|-------|
| **Raleway** | Headings, display text (`h1`, `h2`, `b1`, `b2`, `c`) | Geometric sans-serif, distinctive for heading. Weights: Light, Regular, Medium, SemiBold, Bold, ExtraBold, Black |
| **Open Sans** | Numeric/body text (`nH1`, `nH2`, `nB1`, `nB2`, `nC`) | Humanist sans-serif, optimized for readability of numbers. Weights: Normal, Medium, SemiBold, Bold, ExtraBold |

> **Baseline shifts**: The Kotlin design applies platform-specific baseline shifts: `RALEWAY_BASELINE_SHIFT = 0.2f` and `OPEN_SANS_BASELINE_SHIFT = 0.075f`. In React Native, equivalent adjustments can be made via `lineHeight` or `includeFontPadding: false` on Android.

### Typography Mapping to react-native-paper

react-native-paper's `MD3` types map roughly as:

| Ivy Token | react-native-paper MD3 equivalent | Custom Font Config |
|-----------|----------------------------------|-------------------|
| `h1` | `displayLarge` or `headlineLarge` | 40, Raleway Black |
| `h2` | `headlineMedium` | 32, Raleway ExtraBold |
| `b1` | `titleLarge` | 20, Raleway Bold |
| `b2` | `bodyLarge` | 16, Raleway Medium |
| `c` | `labelSmall` | 12, Raleway ExtraBold |
| `nH1` – `nC` | Same MD3 slots | Open Sans equivalents |

---

## Spacing

### Spacing Scale (inferred from divider defaults and common Compose patterns in the codebase)

The original codebase does not define an explicit named spacing scale. However, from the `Dividers.kt` defaults and common Compose layout patterns, the following scale emerges:

| Token | Value (dp) | Usage |
|-------|-----------|-------|
| `xs` | **4dp** | Tight internal padding |
| `sm` | **8dp** | Icon-to-label gap |
| `md` | **12dp** | Internal component padding |
| `default` | **16dp** | Default divider padding, container padding |
| `lg` | **20dp** | Medium section spacing |
| `xl` | **24dp** | Section spacing |
| `2xl` | **32dp** | Large section spacing |

> **Note**: The original design uses `IvyPadding` (a nullable 4-direction padding model) rather than a tokenized spacing scale. The values above are observed from component defaults. In practice, 16dp is the most commonly used spacing value for dividers and container insets.

For the Finch rebuild, we should adopt a **4-based spacing scale**: `4, 8, 12, 16, 20, 24, 32, 48, 64`.

---

## Border Radii / Shape Tokens

### From `IvyShapes.kt` and `IvyWalletDesign.kt`

| Token | Value | Usage |
|-------|-------|-------|
| `r1` | **32dp** | Largest rounded corners — modals, bottom sheets |
| `r1Top` | 32dp top-only | Top-rounded containers |
| `r1Bot` | 32dp bottom-only | Bottom-rounded containers |
| `r2` | **24dp** | Cards, larger containers |
| `r2Top` | 24dp top-only | |
| `r2Bot` | 24dp bottom-only | |
| `r3` | **20dp** | Medium cards, inputs |
| `r3Top` | 20dp top-only | |
| `r3Bot` | 20dp bottom-only | |
| `r4` | **16dp** | Buttons, small cards, chips |
| `r4Top` | 16dp top-only | |
| `r4Bot` | 16dp bottom-only | |
| `rFull` | **50%** | Fully rounded pills, dividers |
| `circle` | **CircleShape** | Avatar, FAB |

### Border Width

From `Shapes.kt` and `Background.kt`:

| Token | Value |
|-------|-------|
| Default outline | **1dp** |
| Preview outline example | **2dp** |

---

## Elevation / Shadows

The original design system (old, pre-Material3) does not define explicit elevation tokens. It relies on Jetpack Compose's default Material shadow/elevation system. For the rebuild with react-native-paper, use Material Design 3 elevation levels:

| Level | dp | Usage (inferred) |
|-------|----|------------------|
| 0 | 0 | Flat surfaces |
| 1 | 1 | Cards, inputs |
| 2 | 3 | FAB, bottom sheets |
| 3 | 6 | Dialogs, modals |
| 4 | 8 | Navigation bar |
| 5 | 12 | Highest priority overlays |

---

## Light/Dark Mode Differences

The design system supports **three themes**:

| Theme | Enum Value | Description |
|-------|-----------|-------------|
| `LIGHT` | `Theme.LIGHT` | Standard light mode |
| `DARK` | `Theme.DARK` | Standard dark mode |
| `AMOLED_DARK` | `Theme.AMOLED_DARK` | True black (`#000000`) background for OLED power saving |
| `AUTO` | `Theme.AUTO` | Follows system setting; delegates to LIGHT or DARK |

Key differences per mode:

1. **Background/Text inversion**:
   - Light: `pure=#FAFAFA`, `pureInverse=#111114`
   - Dark: `pure=#111114`, `pureInverse=#FAFAFA`
   - AMOLED: `pure=#000000`, `pureInverse=#FAFAFA`

2. **Surface inversion**:
   - Light: `medium=#EFEEF0`, `mediumInverse=#2B2C2D`
   - Dark/AMOLED: `medium=#2B2C2D`, `mediumInverse=#EFEEF0`

3. **Accent pair swapping**:
   - `primary1` flips between `IvyDark` (light mode) and `IvyLight` (dark mode)
   - `green1`, `orange1`, `red1` all swap between their Light and Dark variants
   - `red1Inverse` is the inverse of `red1` for contrast

4. **`primary` (brand purple) is constant** across all modes at `#6B4DFF`

5. **`gray` is constant** across all modes at `#939199`

6. **Status bar**: Light mode → light status bar icons. Dark mode → dark status bar icons.

---

## Mapping to react-native-paper Theme Structure

### Color Scheme

```typescript
// The Ivy theme maps to react-native-paper's theme.colors as:
const IvyLightColors = {
  primary: '#6B4DFF',           // Purple
  primaryContainer: '#D5CCFF',  // IvyLight
  onPrimary: '#FAFAFA',         // White (auto-contrast)
  onPrimaryContainer: '#111114', // Black
  
  secondary: '#14CC9E',         // Green (use as secondary for financial app)
  secondaryContainer: '#AAF2E0', // GreenLight
  
  tertiary: '#F29F30',          // Orange
  tertiaryContainer: '#FFDEB3', // OrangeLight
  
  error: '#FF4060',             // Red
  errorContainer: '#FFCCD5',    // RedLight
  onError: '#FAFAFA',
  
  background: '#FAFAFA',        // White
  onBackground: '#111114',      // Black
  surface: '#EFEEF0',           // MediumWhite
  onSurface: '#111114',
  surfaceVariant: '#EFEEF0',
  onSurfaceVariant: '#939199',  // Gray
  outline: '#939199',
  outlineVariant: '#939199',
  inverseSurface: '#2B2C2D',
  inverseOnSurface: '#EFEEF0',
  inversePrimary: '#D5CCFF',
  
  // Custom tokens (not in standard MD3, store in theme.custom)
  // gradientGreen: ['#14CC9E', '#49F2C8']
};
```

### Typography (Custom Fonts)

```typescript
// react-native-paper MD3 font config
const ivyFonts = {
  displayLarge: { fontFamily: 'Raleway', fontWeight: '900', fontSize: 40 },
  headlineLarge: { fontFamily: 'Raleway', fontWeight: '800', fontSize: 32 },
  titleLarge: { fontFamily: 'Raleway', fontWeight: '700', fontSize: 20 },
  bodyLarge: { fontFamily: 'Raleway', fontWeight: '500', fontSize: 16 },
  labelSmall: { fontFamily: 'Raleway', fontWeight: '800', fontSize: 12 },
  // Use 'OpenSans' variants for numeric text where needed
};
```

### Shape (Roundness)

react-native-paper uses a single `roundness` value. For more granular control, use component-level overrides:

```typescript
const ivyRoundness = {
  // Global default: 16 (r4 = most common button size)
  roundness: 16,  // r4
  // Per-component overrides needed for:
  // r1 = 32, r2 = 24, r3 = 20, r4 = 16, rFull = 50% of height
};
```

### Spacing

react-native-paper doesn't have built-in spacing tokens. These should be defined as a shared constant:

```typescript
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  default: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
  xxxxl: 64,
} as const;
```

---

## Summary: Finch Design Token File Structure

The tokens should be organized in `src/core/theme/` as follows:

```
src/core/theme/
├── colors.ts        # All color hex values + semantic mapping
├── typography.ts    # Font size, weight, family definitions
├── spacing.ts       # Spacing scale constants
├── shapes.ts        # Border radius and shape tokens
├── index.ts         # Re-exports + combined theme object
└── paperTheme.ts    # react-native-paper MD3LightTheme / MD3DarkTheme overrides
```

The tokens should be **framework-agnostic** (plain JS/TS objects) so both mobile (react-native-paper) and web (TBD) can import them. The `paperTheme.ts` file is the only react-native-paper-specific adapter.

---

## What Was Not Recovered

- **Figma design file contents**: Behind authentication. Could not extract Figma variable collections or auto-layout values.
- **Explicit spacing scale**: The original design system uses inline dp values rather than named spacing tokens. The scale above is inferred.
- **Elevation tokens**: No explicit elevation/shadow tokens in the old design system.
- **`:ivy-design` Material3 module**: The newer `:ivy-design` module referenced in deprecation comments does not exist at the expected path (`ivy-design/`) in the repo; it may have been removed or never completed before archival. The `temp/old-design` module is the complete and authoritative source.

---

*Research completed June 2026. Ivy Wallet GitHub repo was archived April 11, 2026.*
