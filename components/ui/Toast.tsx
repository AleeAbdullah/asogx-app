/**
 * Toast Notification System
 * Animated toast with icon, slides down from top
 * Usage: const toast = useToast(); toast.success('Done!');
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

// --- Types ---

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastMessage {
  id: number;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

// --- Config ---

const TOAST_CONFIG: Record<ToastType, { icon: string; bg: string; iconColor: string; border: string }> = {
  success: {
    icon: 'checkmark-circle',
    bg: '#F0FDF4',
    iconColor: '#16A34A',
    border: '#BBF7D0',
  },
  error: {
    icon: 'close-circle',
    bg: '#FEF2F2',
    iconColor: '#DC2626',
    border: '#FECACA',
  },
  info: {
    icon: 'information-circle',
    bg: '#EFF6FF',
    iconColor: '#2563EB',
    border: '#BFDBFE',
  },
  warning: {
    icon: 'warning',
    bg: '#FFFBEB',
    iconColor: '#D97706',
    border: '#FDE68A',
  },
};

const DEFAULT_DURATION = 3000;

// --- Context ---

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast(): ToastContextType {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

// --- Provider ---

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((type: ToastType, title: string, message?: string, duration?: number) => {
    // Clear any existing timer
    if (timerRef.current) clearTimeout(timerRef.current);

    const id = ++idRef.current;
    setToast({ id, type, title, message, duration: duration || DEFAULT_DURATION });

    // Haptic feedback
    if (Platform.OS === 'ios') {
      if (type === 'error' || type === 'warning') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }
  }, []);

  const dismiss = useCallback(() => {
    setToast(null);
  }, []);

  const api = useCallback(
    (): ToastContextType => ({
      success: (title, message) => show('success', title, message),
      error: (title, message) => show('error', title, message),
      info: (title, message) => show('info', title, message),
      warning: (title, message) => show('warning', title, message),
    }),
    [show]
  );

  return (
    <ToastContext.Provider value={api()}>
      {children}
      {toast && (
        <ToastView
          key={toast.id}
          toast={toast}
          onDismiss={dismiss}
          timerRef={timerRef}
        />
      )}
    </ToastContext.Provider>
  );
}

// --- Toast View ---

function ToastView({
  toast,
  onDismiss,
  timerRef,
}: {
  toast: ToastMessage;
  onDismiss: () => void;
  timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>;
}) {
  const insets = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const config = TOAST_CONFIG[toast.type];

  useEffect(() => {
    // Slide in
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 18,
        stiffness: 200,
        mass: 0.8,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto dismiss
    timerRef.current = setTimeout(() => {
      slideOut();
    }, toast.duration || DEFAULT_DURATION);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const slideOut = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => onDismiss());
  };

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top: insets.top + 8,
        left: 16,
        right: 16,
        zIndex: 9999,
        transform: [{ translateY }],
        opacity,
      }}>
      <TouchableOpacity
        onPress={slideOut}
        activeOpacity={0.9}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: config.bg,
          borderWidth: 1,
          borderColor: config.border,
          borderRadius: 14,
          paddingHorizontal: 16,
          paddingVertical: 14,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          elevation: 8,
        }}>
        {/* Icon */}
        <Ionicons name={config.icon as any} size={24} color={config.iconColor} />

        {/* Text */}
        <View style={{ flex: 1, marginLeft: 12, marginRight: 8 }}>
          <Text
            style={{ fontSize: 15, fontWeight: '600', color: '#1F2937' }}
            numberOfLines={1}>
            {toast.title}
          </Text>
          {toast.message && (
            <Text
              style={{ fontSize: 13, color: '#6B7280', marginTop: 2 }}
              numberOfLines={2}>
              {toast.message}
            </Text>
          )}
        </View>

        {/* Dismiss X */}
        <Ionicons name="close" size={18} color="#9CA3AF" />
      </TouchableOpacity>
    </Animated.View>
  );
}
