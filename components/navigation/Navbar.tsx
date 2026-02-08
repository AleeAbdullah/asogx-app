/**
 * Navigation Bar Component
 * Main app navigation bar with home button
 * NOTE: This component is deprecated. Use TopBar instead.
 */

import React from 'react';
import { View, Text, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Link, useRouter, usePathname } from 'expo-router';
import { APP_CONFIG } from '@/constants/config';
import { Ionicons } from '@expo/vector-icons';

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const isHome = pathname === '/' || pathname === '/index';

  return (
    <View
      style={[styles.container, Platform.OS === 'ios' ? styles.shadowIOS : styles.shadowAndroid]}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.titleContainer}
          onPress={() => router.push('/')}
          activeOpacity={0.7}>
          <Text style={styles.title}>{APP_CONFIG.NAME}</Text>
        </TouchableOpacity>

        <View style={styles.rightSection}>
          <Link href="/" asChild>
            <TouchableOpacity
              style={[
                styles.homeButton,
                { backgroundColor: isHome ? 'rgba(255, 255, 255, 0.2)' : 'transparent' },
              ]}
              activeOpacity={0.7}>
              <Ionicons name={isHome ? 'home' : 'home-outline'} size={24} color="#FFFFFF" />
              <Text style={[styles.homeText, { fontWeight: isHome ? '700' : '500' }]}>Home</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => console.log('Search pressed')}>
            <Ionicons name="search-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.iconButton}
            activeOpacity={0.7}
            onPress={() => console.log('Cart pressed')}>
            <Ionicons name="cart-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#193364',
  },
  shadowIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shadowAndroid: {
    elevation: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: 56,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  homeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  homeText: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  iconButton: {
    padding: 4,
  },
});
