import { Platform } from 'react-native';

// Web 端使用 localStorage，原生端使用 AsyncStorage
export const storage = {
  async getItem(key: string): Promise<string | null> {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return AsyncStorage.getItem(key);
  },
  async setItem(key: string, value: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return AsyncStorage.setItem(key, value);
  },
  async removeItem(key: string): Promise<void> {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    return AsyncStorage.removeItem(key);
  },
};
