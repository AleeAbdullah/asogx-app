/**
 * Color System
 * These colors automatically adapt to light/dark mode via CSS variables in global.css
 * Never calculate colors based on theme in component files - use these directly
 * NativeWind's dark: classes will automatically apply the correct theme
 */

// These match the CSS variables defined in global.css
// They automatically switch between light/dark based on the color scheme
export const COLORS = {
  // Base colors
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',

  // Grays (iOS system colors, adjust if needed)
  grey6: 'rgb(242, 242, 247)',
  grey5: 'rgb(230, 230, 235)',
  grey4: 'rgb(210, 210, 215)',
  grey3: 'rgb(199, 199, 204)',
  grey2: 'rgb(175, 176, 180)',
  grey: 'rgb(142, 142, 147)',

  // Theme colors - these reference CSS variables that auto-switch on theme change
  background: 'hsl(var(--background))',
  foreground: 'hsl(var(--foreground))',

  card: 'hsl(var(--card))',
  cardForeground: 'hsl(var(--card-foreground))',

  popover: 'hsl(var(--popover))',
  popoverForeground: 'hsl(var(--popover-foreground))',

  primary: 'hsl(var(--primary))',
  primaryForeground: 'hsl(var(--primary-foreground))',

  secondary: 'hsl(var(--secondary))',
  secondaryForeground: 'hsl(var(--secondary-foreground))',

  muted: 'hsl(var(--muted))',
  mutedForeground: 'hsl(var(--muted-foreground))',

  accent: 'hsl(var(--accent))',
  accentForeground: 'hsl(var(--accent-foreground))',

  destructive: 'hsl(var(--destructive))',
  destructiveForeground: 'hsl(var(--destructive-foreground))',

  border: 'hsl(var(--border))',
  input: 'hsl(var(--input))',
  ring: 'hsl(var(--ring))',

  // Additional theme-aware colors
  success: 'hsl(var(--success))',
  successForeground: 'hsl(var(--success-foreground))',

  sale: 'hsl(var(--sale))',
  saleForeground: 'hsl(var(--sale-foreground))',

  // Navigation colors
  headerBg: 'hsl(var(--header-bg))',
  nav: 'hsl(var(--nav-bg))',
  navForeground: 'hsl(var(--nav-foreground))',
  topbarBg: 'hsl(var(--topbar-bg))',
  topbarForeground: 'hsl(var(--topbar-foreground))',

  // Additional colors
  orange: 'hsl(var(--orange))',
  orangeForeground: 'hsl(var(--orange-foreground))',

  teal: 'hsl(var(--teal))',
  tealForeground: 'hsl(var(--teal-foreground))',
} as const;
