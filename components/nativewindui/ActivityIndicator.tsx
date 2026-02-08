import { ActivityIndicator as RNActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/colors';

function ActivityIndicator(props: React.ComponentProps<typeof RNActivityIndicator>) {
  return <RNActivityIndicator color={COLORS.primary} {...props} />;
}

export { ActivityIndicator };
