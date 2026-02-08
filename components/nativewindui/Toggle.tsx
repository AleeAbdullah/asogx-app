import { Switch } from 'react-native';
import { useColorScheme } from '@/lib/useColorScheme';
import { COLORS } from '@/constants/colors';

function Toggle(props: React.ComponentProps<typeof Switch>) {
  const { colorScheme } = useColorScheme();

  return (
    <Switch
      trackColor={{
        true: COLORS.primary,
        false: colorScheme === 'dark' ? COLORS.grey : COLORS.grey,
      }}
      thumbColor={COLORS.white}
      {...props}
    />
  );
}

export { Toggle };
