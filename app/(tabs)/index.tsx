/**
 * Index Redirect
 * Redirects to home tab as the default landing page
 */

import { Redirect } from 'expo-router';

export default function Index() {
  return <Redirect href="/(tabs)/home" />;
}
