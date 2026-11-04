# Animations Example

A minimal React Native app with Expo and TypeScript for interview practice.

## Run

```sh
npm install
npm start
```

Use the Expo terminal menu to open an Android emulator or iOS simulator (requires Xcode on macOS). You can also scan the QR code with a compatible Expo Go app.

All application code lives in `app/`. Surprise card flips to reveal a sample headphones product. Mystery box remains a placeholder.

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

The showcase owns playback progress and the Play/Reset buttons. Each feature receives that progress and maps it to its own animated styles. Feature-specific interactions and gestures stay inside the feature. Start in its demo component; extract a local hook (such as `useCardReveal.ts`) and smaller components only when they improve readability. Feature-specific assets can go in `assets/surprise-card/` or `assets/mystery-box/` when needed.

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

## Performance

Animations use React Native's native driver for rotation, scale, and opacity. JavaScript starts the animation; the UI thread performs the per-frame updates. Theme state changes still happen in React between the fade-out and fade-in.

The top-left UI FPS badge uses Reanimated's UI frame callback. It averages frame intervals over half a second and sends only the resulting number to React. It pauses when the app is backgrounded. This measures UI callback cadence, not JavaScript FPS or GPU presentation time, and does not guarantee that every frame is rendered smoothly.

Check performance on a physical iPhone in a release build. Aim for about 60 FPS on a 60 Hz display; higher-refresh devices may report higher values. Development mode and the monitor itself can affect measurements. After installing Reanimated, restart Metro with `npx expo start --clear`; rebuild a custom development client to include the new native modules.

## Format code

```sh
npm run format
npm run format:check
```

Play runs the selected animation. Reset stops it and returns it to its initial state without playing.

Worklets compilation is configured explicitly in `babel.config.js`. After changing Babel configuration, stop Metro and restart with `npx expo start --clear`, then fully reload the app.
