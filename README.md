# Animations Example

A minimal React Native app with Expo and TypeScript for interview practice.

## Run

```sh
npm install
npm start
```

Use the Expo terminal menu to open an Android emulator or iOS simulator (requires Xcode on macOS). You can also scan the QR code with a compatible Expo Go app.

All application code lives in `app/`. The two demos are placeholders, ready for animation implementation.

## Architecture

```text
app/
  index.ts                 # Expo entry point
  App.tsx                  # Theme state and app composition
  screens/
    ShowcaseScreen.tsx     # Displays the demo collection
  features/
    demos.ts               # Demo metadata and component registry
    surprise-card/
      SurpriseCardDemo.tsx
    mystery-box/
      MysteryBoxDemo.tsx
  components/              # Shared presentation components
    DemoPlaceholder.tsx
  animations/              # Shared motion helpers when needed
  theme/
    tokens.ts              # Shared colors and spacing
assets/                    # Images and other static media
```

The dependency direction is `App → screens → features → shared components/theme`.
Features should not import other features or screens. The showcase imports features through `features/demos.ts`.

Each feature owns its interaction state, animated values, sequence timing, and gestures. Start in its demo component; extract a local hook (such as `useCardReveal.ts`) and smaller components only when they improve readability. Feature-specific assets can go in `assets/surprise-card/` or `assets/mystery-box/` when needed.

When implementing a reveal, use explicit phases such as `idle → opening → revealed`, ignore repeat taps while opening, and support replay/reset. Stop active animations on unmount and provide a reduced-motion path. Keep frame-by-frame animation values out of React state; use React state for interaction phases and labels.

To add a demo, create a folder in `app/features/`, export its demo component, and add it to `app/features/demos.ts`. Promote code into `components/` or `animations/` when it is actually shared. This single-screen scaffold needs no router, global state store, or animation dependency yet.

## Check types

```sh
npm run typecheck
```

## Light and dark mode

`App.tsx` reads the phone's theme with `useColorScheme`. Until the user taps the top button, the app follows system theme changes. The button sets a light or dark preference in `useState`, and the matching color object is passed to the screen and demos through props. The preference resets when the app restarts.

`app/theme/tokens.ts` contains both color palettes. Layout stays in `StyleSheet`; theme colors are applied in the component. The status bar also switches so its icons remain readable.

Expo's `userInterfaceStyle` is set to `automatic`. `expo-system-ui` enables system appearance support in Android builds.

## Format code

```sh
npm run format
npm run format:check
```
