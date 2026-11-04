import { palette } from "./colors";
export const lightColors = {
  background: palette.lightBackground,
  surface: palette.white,
  text: palette.lightText,
  muted: palette.lightMuted,
  border: palette.lightBorder,
};

export const darkColors = {
  background: palette.darkBackground,
  surface: palette.lightText,
  text: palette.darkText,
  muted: palette.darkMuted,
  border: palette.darkBorder,
};

export type ThemeColors = typeof lightColors;

export const spacing = {
  small: 8,
  medium: 16,
  large: 24,
};
