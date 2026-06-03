import * as Location from 'expo-location';
import { Platform } from 'react-native';

export interface UserLocation {
  latitude: number;
  longitude: number;
}

// 获取用户当前位置
export async function getCurrentLocation(): Promise<UserLocation | null> {
  try {
    // Web 端使用 Geolocation API
    if (Platform.OS === 'web') {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
          reject(new Error('浏览器不支持定位'));
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          (error) => {
            console.error('Web 定位失败:', error);
            reject(error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
      });
    }
    
    // 原生端使用 expo-location
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('定位权限被拒绝');
    }
    
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('获取位置失败:', error);
    return null;
  }
}

// 格式化距离
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}

// 打开外部导航
export async function openNavigation(
  latitude: number,
  longitude: number,
  name: string
): Promise<void> {
  const { Linking } = require('expo-linking');
  
  const label = encodeURIComponent(name);
  const lat = latitude;
  const lng = longitude;
  
  if (Platform.OS === 'ios') {
    // Apple Maps
    const url = `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`;
    await Linking.openURL(url);
  } else if (Platform.OS === 'android') {
    // Google Maps
    const url = `geo:${lat},${lng}?q=${lat},${lng}(${label})`;
    await Linking.openURL(url);
  } else {
    // Web - Google Maps
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
  }
}
