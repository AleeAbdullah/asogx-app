import RNSlider from '@react-native-community/slider';
import { Platform } from 'react-native';
import { COLORS } from '@/constants/colors';

function Slider({
  thumbTintColor,
  minimumTrackTintColor,
  maximumTrackTintColor,
  ...props
}: React.ComponentProps<typeof RNSlider>) {
  return (
    <RNSlider
      thumbTintColor={(thumbTintColor ?? Platform.OS === 'ios') ? COLORS.white : COLORS.primary}
      minimumTrackTintColor={minimumTrackTintColor ?? COLORS.primary}
      maximumTrackTintColor={
        (maximumTrackTintColor ?? Platform.OS === 'android') ? COLORS.primary : undefined
      }
      minimumValue={0}
      maximumValue={1}
      {...props}
    />
  );
}
export { Slider };
