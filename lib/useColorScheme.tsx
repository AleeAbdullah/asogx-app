import { useColorScheme as useNativewindColorScheme } from 'nativewind';

/**
 * Color Scheme Hook
 * Use this to toggle theme and check current color scheme
 * Colors are automatically applied via CSS variables - no need to manually select colors
 */
function useColorScheme() {
  const { colorScheme, setColorScheme } = useNativewindColorScheme();

  function toggleColorScheme() {
    return setColorScheme(colorScheme === 'light' ? 'dark' : 'light');
  }

  return {
    colorScheme: colorScheme ?? 'light',
    isDarkColorScheme: colorScheme === 'dark',
    setColorScheme,
    toggleColorScheme,
  };
}

export { useColorScheme };
