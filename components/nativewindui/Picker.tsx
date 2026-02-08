import { Picker as RNPicker } from '@react-native-picker/picker';
import { View } from 'react-native';

import { cn } from '@/lib/cn';
import { useColorScheme } from '@/lib/useColorScheme';
import { COLORS } from '@/constants/colors';

export function Picker<T>({
  mode = 'dropdown',
  style,
  dropdownIconColor,
  dropdownIconRippleColor,
  className,
  ...props
}: React.ComponentProps<typeof RNPicker<T>>) {
  const { colorScheme } = useColorScheme();
  const backgroundColor = colorScheme === 'dark' ? COLORS.dark.background : COLORS.light.background;
  const foregroundColor = colorScheme === 'dark' ? COLORS.dark.foreground : COLORS.light.foreground;

  return (
    <View
      className={cn(
        'ios:shadow-sm ios:shadow-black/5 rounded-md border border-background bg-background',
        className
      )}>
      <RNPicker
        mode={mode}
        style={
          style ?? {
            backgroundColor,
            borderRadius: 8,
          }
        }
        dropdownIconColor={dropdownIconColor ?? foregroundColor}
        dropdownIconRippleColor={dropdownIconRippleColor ?? foregroundColor}
        {...props}
      />
    </View>
  );
}
export const PickerItem = RNPicker.Item;
