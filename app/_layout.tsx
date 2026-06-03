import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuthStore } from '../stores/auth-store';
import { useCartStore } from '../stores/cart-store';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { checkLoginStatus } = useAuthStore();
  const { loadCart } = useCartStore();

  useEffect(() => {
    // 初始化应用
    checkLoginStatus();
    loadCart();
  }, []);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        
        {/* 登录相关页面 */}
        <Stack.Screen name="login/index" options={{ headerShown: false }} />
        <Stack.Screen name="login/mail" options={{ headerShown: false }} />
        
        {/* 订单相关页面 */}
        <Stack.Screen name="order/confirm" options={{ headerShown: false }} />
        <Stack.Screen name="order/detail" options={{ headerShown: false }} />
        <Stack.Screen name="order/evaluate" options={{ headerShown: false }} />
        <Stack.Screen name="order/remark" options={{ headerShown: false }} />
        
        {/* 门店相关页面 */}
        <Stack.Screen name="store/index" options={{ headerShown: false }} />
        <Stack.Screen name="store/detail" options={{ headerShown: false }} />
        
        {/* 其他页面 */}
        <Stack.Screen name="coupon" options={{ headerShown: false }} />
        <Stack.Screen name="dining-code" options={{ headerShown: false }} />
        <Stack.Screen name="agreement" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
