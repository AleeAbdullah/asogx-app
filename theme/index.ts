import { Theme, DefaultTheme, DarkTheme } from '@react-navigation/native';

import { COLORS } from './colors';

const NAV_THEME: { light: Theme; dark: Theme } = {
  light: {
    dark: false,
    colors: {
      background: COLORS.background,
      border: COLORS.grey5,
      card: COLORS.card,
      notification: COLORS.destructive,
      primary: COLORS.primary,
      text: COLORS.black,
    },
    fonts: DefaultTheme.fonts,
  },
  dark: {
    dark: true,
    colors: {
      background: COLORS.background,
      border: COLORS.grey5,
      card: COLORS.grey6,
      notification: COLORS.destructive,
      primary: COLORS.primary,
      text: COLORS.white,
    },
    fonts: DarkTheme.fonts,
  },
};

export { NAV_THEME };
