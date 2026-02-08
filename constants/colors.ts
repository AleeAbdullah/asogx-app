/**
 * Color Values for Components that Require Actual Color Strings
 *
 * Use these ONLY where Tailwind className doesn't work:
 * - Icon color props (Ionicons, MaterialIcons, etc.)
 * - React Native Switch trackColor
 * - React Native Slider colors
 * - Navigation header colors
 *
 * For everything else, USE TAILWIND CLASSES in className!
 * Examples: bg-primary, text-foreground, border-border, etc.
 */

// These values match the CSS variables in global.css
export const COLORS = {
  // Primary color (same in light and dark mode)
  primary: 'hsl(220, 90%, 56%)',

  // Home page design colors
  navy: 'hsl(220, 54%, 30%)',
  grayText: 'hsl(220, 20%, 52%)',
  yellow: 'hsl(45, 98%, 48%)',
  redAccent: 'hsl(0, 100%, 63%)',
  lightBg: 'hsl(215, 67%, 97%)',

  // Light mode colors
  light: {
    foreground: 'hsl(222, 47%, 11%)',
    background: 'hsl(0, 0%, 100%)',
    card: 'hsl(0, 0%, 100%)',
    navy: 'hsl(220, 54%, 30%)',
    grayText: 'hsl(220, 20%, 52%)',
  },

  // Dark mode colors
  dark: {
    foreground: 'hsl(0, 0%, 95%)',
    background: 'hsl(222, 47%, 11%)',
    card: 'hsl(222, 47%, 11%)',
    navy: 'hsl(220, 54%, 35%)',
    grayText: 'hsl(220, 20%, 60%)',
  },

  // Grey (for icons that need a muted color)
  grey: 'rgb(210, 210, 215)',

  // Static colors
  white: '#FFFFFF',
  black: '#000000',
} as const;
