/**
 * Home Stack Layout
 * Nested navigator for the Home tab
 */

import { Stack } from 'expo-router';

export default function HomeLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
