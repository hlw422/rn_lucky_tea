import * as Location from 'expo-location';
import * as Linking from 'expo-linking';
import { Platform, ActionSheetIOS, Alert } from 'react-native';

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
  const label = encodeURIComponent(name);
  const lat = latitude;
  const lng = longitude;
  
  if (Platform.OS === 'web') {
    // Web - Google Maps
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    window.open(url, '_blank');
    return;
  }

  // 定义导航应用选项
  const navOptions: { name: string; url: string; scheme?: string }[] = [];

  // Apple Maps (iOS)
  if (Platform.OS === 'ios') {
    navOptions.push({
      name: 'Apple Maps',
      url: `http://maps.apple.com/?ll=${lat},${lng}&q=${label}`,
    });
  }

  // Google Maps
  if (Platform.OS === 'ios') {
    navOptions.push({
      name: 'Google Maps',
      url: `comgooglemaps://?q=${lat},${lng}&query=${label}`,
      scheme: 'comgooglemaps://',
    });
  } else if (Platform.OS === 'android') {
    navOptions.push({
      name: 'Google Maps',
      url: `google.navigation:q=${lat},${lng}(${label})`,
      scheme: 'google.navigation:',
    });
  }

  // 高德地图
  if (Platform.OS === 'ios') {
    navOptions.push({
      name: '高德地图',
      url: `iosamap://path?sourceApplication=rn_lucky_tea&dname=${label}&dlat=${lat}&dlon=${lng}&dev=0`,
      scheme: 'iosamap://',
    });
  } else if (Platform.OS === 'android') {
    navOptions.push({
      name: '高德地图',
      url: `amapuri://route/plan/?dlat=${lat}&dlon=${lng}&dname=${label}&dev=0&t=0`,
      scheme: 'amapuri://',
    });
  }

  // 百度地图
  if (Platform.OS === 'ios') {
    navOptions.push({
      name: '百度地图',
      url: `baidumap://map/direction?destination=${lat},${lng}&title=${label}&mode=driving`,
      scheme: 'baidumap://',
    });
  } else if (Platform.OS === 'android') {
    navOptions.push({
      name: '百度地图',
      url: `bdapp://map/direction?destination=${lat},${lng}&title=${label}&mode=driving`,
      scheme: 'bdapp://',
    });
  }

  // iOS 使用 ActionSheetIOS 显示所有选项
  if (Platform.OS === 'ios') {
    const optionNames = navOptions.map((opt) => opt.name);
    optionNames.push('取消');

    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: optionNames,
        cancelButtonIndex: optionNames.length - 1,
        title: '选择导航应用',
      },
      async (buttonIndex) => {
        if (buttonIndex < navOptions.length) {
          try {
            await Linking.openURL(navOptions[buttonIndex].url);
          } catch (error) {
            console.error('打开导航失败:', error);
            Alert.alert('提示', '该导航应用未安装或无法打开');
          }
        }
      }
    );
  } else {
    // Android 使用 Alert
    Alert.alert(
      '选择导航应用',
      '请选择要使用的导航应用',
      navOptions.map((opt) => ({
        text: opt.name,
        onPress: async () => {
          try {
            await Linking.openURL(opt.url);
          } catch (error) {
            console.error('打开导航失败:', error);
            Alert.alert('提示', '该导航应用未安装或无法打开');
          }
        },
      })).concat([{ text: '取消', style: 'cancel' }]),
      { cancelable: true }
    );
  }
}
